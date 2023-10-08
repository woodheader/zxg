<template>
	<view class="housekeep">
		<!-- <view class="housekeep_tabs">
			管家服务
		</view> -->
		<!-- tab栏 -->
		<u-tabs :list="tabsNum" :is-scroll="false" :current="curTab" active-color="#218cfe" :duration="0.2" @change="onChangeTab" />
		<view class="tabs_content" v-if="reload">
			<view class="standards" v-if="!curTab">
				<template>
					<view v-html="details.content"></view>
				</template>
				<view class="bth">
					<wy-button @click.native="connect()" style="margin-top: 60rpx;">联系管家</wy-button>
					<!-- <h5 class="button" @click="connect()">联系管家</h5> -->
				</view>
			</view>
			<view class="score_to" v-else>
				<view class="current">
					<p>您当前的房屋管家是：<span>{{ houseKeepList.gj_info.gj_name }}</span></p>
					<p>服务电话：<span>{{ houseKeepList.gj_info.gj_mobile[0] }}</span></p>
					<p>评分人数：<span>{{ houseKeepList.gj_info.score_people }}</span></p>
					<p>人均评分：<span>{{ houseKeepList.gj_info.score_avg }}</span></p>
				</view>
				<view class="illustrate">
					<p style="font-size: 28rpx;color: #999;">评分说明: 满分10分，服务态度和服务能力各5分<span></span></p>
				</view>
				<view class="score">

					<view class="" v-if="!houseKeepList.score_info.serve_ability > 0 && !houseKeepList.score_info.serve_attitude > 0">
						<p>服务态度<i></i><u-rate v-model="value" :count="5" size="40" gutter="20" :min-count="1"/></p>
						<p>服务能力<i></i><u-rate v-model="ability" :count="5" size="40" gutter="20" :min-count="1"/></p>
						<view class="submit">
							<!-- <h5 @click="submit()" >点击提交</h5> -->
							<wy-button @click="submit()">点击提交</wy-button>
						</view>
					</view>
					<view class="submitScr" v-else>
						<h2 style="font-weight: bold; font-size: 30rpx;">您的评分已提交</h2>
						<p>服务态度<i></i><u-rate :count="5" :disabled="true" :value="houseKeepList.score_info.serve_ability" size="40" gutter="20" :min-count="1"/> </p>
						<p>服务能力<i></i><u-rate :count="5" :disabled="true" :value="houseKeepList.score_info.serve_attitude" size="40" gutter="20" :min-count="1"/></p>
						<p class="prompt" style="color: crimson; font-size: 28rpx; line-height: 32rpx; margin-top: 20rpx">提示: 每年可对管家做一次评分!</p>
					</view>
				</view>
				<view class="history">
					<h2 style="font-weight: bold; font-size: 30rpx;">历史评分</h2>
					<scroll-view class="content-scroll" :scroll-x="true">
					<view class="listBox" v-if="houseKeepList.score_history.length">
							<view class="historyStore" v-for="item in houseKeepList.score_history">
								<p>{{ item.score_dt }}年</p>
								<p>管家姓名：<span>{{ item.gj_name }}</span></p>
								<p>人均得分：<span>{{ item.score_avg }}</span></p>
							</view>
					</view>
					</scroll-view>
				</view>
			</view>
		</view>
		<u-popup ref="popTimer" v-model="active" mode="center" :z-index="18899" :closeable="true" :border-radius="30">
			<p class="dialog_text">评分成功，感谢支持</p>
			<view class="dialog_footer">
				<p class="dialog_bth" @click="onReload()">确定</p>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import * as AddressApi from '@/api/score.js'
	import { info } from '@/api/user.js'
	export default {
		data() {
			return {
				value: 1,
				ability: 1,
				houseKeepList:[],
				phone: '',
				active: false,
				isStore: true,
				details: '',
				tabsNum: [
					{name: '服务标准', value: 'standard'},
					{name: '服务评分', value: 'score'}
				],
				curTab: 0,
				reload: true
			};
		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onLoad() {
		  // 获取页面数据
		  this.getPageData()
		},
		methods: {
			// 主动刷新页面
			async onReload() {
				this.reload = false
				this.active = false
				await this.getPageData()
				this.$nextTick(() => {
					this.reload = true
				})
			},
			// tab切换
			onChangeTab(index) {
				this.curTab = index
			},
			// 获取页面数据
			getPageData() {
			  const app = this
			  app.isLoading = true
			  Promise.all([ app.getList(), app.getPhone()])
			    .then(() => {
			    })
			    .finally(() => app.isLoading = false)
			},
			// 获取管家详情
			async getList() {
			  const app = this
			  const { data } = await AddressApi.detail('GJFWBZ10001')
			  this.details = data.detail
			  return new Promise((resolve, reject) => {
			    AddressApi.GjInfo()
			      .then(result => {
			        app.houseKeepList = result.data

					console.log(this.houseKeepList)
			        resolve(result)
			      })
			      .catch(reject)
			  })
			},
			// 获取管家电话
			getPhone() {
				const app = this
				return new Promise((resolve, reject) => {
				  info()
				    .then(result => {
				      app.phone = result.data
				      resolve(result)
				    })
				    .catch(reject)
				})
			},
			// 拨打管家电话
			async connect() {
				console.log(this.roleName)
				const { stewardPhone } = this.phone.userInfo
				await uni.makePhoneCall({
					phoneNumber: stewardPhone
				})
				this.onReload()
			},
			// 提交评分
			submit() {
				return new Promise((resolve, reject) => {
				  AddressApi.scoreTo({
					  serve_attitude: this.value,
					  serve_ability: this.ability,
				  })
				    .then(result => {
				      this.active = true
				      resolve(result)
				    })
				    .catch(reject)
				})
			},
      /**
       * 分享当前页面
       */
      onShareAppMessage() {
        const app = this
        return {
          title: '管家服务',
          path: `pages/tools/houseKeep/index`
        }
      },

      /**
       * 分享到朋友圈
       * 本接口为 Beta 版本，暂只在 Android 平台支持，详见分享到朋友圈 (Beta)
       * https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share-timeline.html
       */
      onShareTimeline() {
        const app = this
        return {
          title: '管家服务',
          path: `pages/tools/houseKeep/index`
        }
      }
		}
	}
</script>
<style>
	page {
		background-color: #f4f4f4;
	}
</style>
<style lang="scss">
.housekeep {
	&_tabs {
		width:  100%;
		padding: 60rpx;
		text-align: center;
		background-color: #01b9e5;
		color: #fff;
		font-size: 48rpx;
		font-weight: bold;
		white-space: 20rpx;
	}
	.tabs_content {

		.standards {
			box-shadow: 0 1rpx 5rpx 0px rgba(0, 0, 0, 0.05);
			padding: 20rpx;
			background-color: #fff;
			width: 93vw;
			border-radius: 20rpx;
			margin: 20rpx auto;
			position: relative;
			height: calc(100vh - 320rpx);
			h4 {
				font-size: 30rpx;
			}
			p {
				line-height: 36rpx;
				margin-top: 30rpx;
				font-size: 30rpx;
			}
			.bth {
				width: 100%;
				display: flex;
				justify-content: center;
			}
			h5 {
				display: inline-block;
				border: 2rpx solid rgba(33, 140, 254, 0.5);
				padding: 20rpx 70rpx;
				// position: absolute;
				// margin-top: 60rpx;
				// bottom: 60rpx;
				// left: 50%;
				// transform: translateX(-50%);
				font-size: 30rpx;;
				border-radius: 12rpx;
				margin-top: 40rpx;
			}
		}
		.score_to {
			padding: 20rpx;
			> view {
				padding: 20rpx;
				// border-bottom: 2rpx solid rgba(0, 0, 0, 0.05);
				box-shadow: 0 1rpx 5rpx 0px rgba(0, 0, 0, 0.05);
				padding: 20rpx;
				background-color: #fff;
				margin-bottom: 20rpx;
				border-radius: 20rpx;
				font-size: 36rpx;
				&.score {
					i {
						margin-left: 20rpx;
					}
				}
				// > p {
				// 	color: #999;
				// 	> span {
				// 		color: #333;
				// 	}
				// }
			}
			.submit {
				// height:200rpx;
				// position: relative;
				display: flex;
				justify-content: center;
				align-items: center;
				margin-top: 30rpx;
				h5 {
					display: inline-block;
					border: 2rpx solid rgba(33, 140, 254, 0.5);
					padding: 20rpx 70rpx;
					// position: absolute;
					// // bottom: 60rpx;
					// left: 50%;
					// top: 50%;
					// transform: translate(-50%, -50%);
					border-radius: 12rpx;
				}
				.submitScr {
					border: 1rpx solid (rgba(0, 0, 0, 0.05));
					box-shadow: 1rpx 1rpx 5rpx 1px rgba(0, 0, 0, 0.05);
					background-color: #fff;
					padding: 20rpx;
					flex: 1;
					font-size: 30rpx;

				}
			}
			.current {
				p {
					line-height: 60rpx;
					font-size: 30rpx;
					// span {
					// 	color: #999;
					// }
				}
			}
			.listBox {
				display: flex;
				width: 100%;
				// overflow: hidden;
				.historyStore {
					margin-top: 28rpx;
					// width: 30vw;
					flex-shrink: 0;
					border: 1rpx solid (rgba(0, 0, 0, 0.05));
					box-shadow: 1rpx 1rpx 5rpx 1px rgba(0, 0, 0, 0.05);
					font-size: 32rpx;
					padding: 20rpx;
					margin-right: 24rpx;
					p {
						font-size: 30rpx;
					}
				}
			}
			.score {
				p {
					display: flex;
					align-items: center;
					line-height: 80rpx;
					font-size: 30rpx;
				}
			}
		}
	}
	.dialog_text {
		padding: 80rpx;
		width: 90vw;
		box-sizing: border-box;
		text-align: center;
		font-size: 36rpx;
	}
	.dialog_footer {
		width: 100%;
		display: flex;
		justify-content: center;
		padding-bottom: 20rpx;
		.dialog_bth {
			border: 2rpx solid rgba(33, 140, 254, 0.5);
			padding: 20rpx 60rpx;
			text-align: center;
			display: inline-block;
			border-radius: 12rpx;
			background-color: rgb(33, 140, 254);
			color: #fff;
		}
	}

}
</style>
