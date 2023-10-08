<template>
	<view  v-if="reload">
		<!-- tab栏 -->
		<u-sticky :offset-top="0">
			<u-tabs :list="tabsNum" :is-scroll="false" :current="curTab" active-color="#218cfe" :duration="0.2"
				@change="onChangeTab"/>
		</u-sticky>
		<view class="container">
			<view class="tab_standard" v-if="curTab === 0">
				<view class="standard_top">
					<view class="" v-html="companyList.simple_desc">
					</view>
				</view>
				<view class="standard_body">
					<view class="" v-html="companyList.full_desc">
					</view>
				</view>
				<view class="standard_footer">
					<view class="file" v-for="(item, index) in companyList.download_list" :key="index"  @click="downloadFile(item.file_url)">
						<text class="wyiconfont icon-wenjianxiazai2" style="font-size: 40rpx;"></text>
						<a>{{ item.file_name }}</a>
					</view>
				</view>
			</view>
			<view class="tab_log" v-else-if="curTab === 1">
				<view v-for="(item, index) in serviceList.list" class="log_list" @click="toDetails(item, index)" :key="item.id">
					<view class="content" :class="isActive === index? 'active': ''">
						<text class="wyiconfont" :class="[`icon-${item.icon}`]"></text>
						{{ item.service_name }}
					</view>
				</view>
			</view>
			<view class="tab_evaluate" v-else>
				<view class="current">
					<p>服务主体：<span>{{ companyList.full_name }}</span></p>
					<p>前台电话：<span>{{ companyList.front_tel }}</span></p>
					<p>评分人数：<span>{{ companyList.score_people }}</span></p>
					<p>人均评分：<span>{{ companyList.score_avg }}</span></p>
				</view>
				<view class="illustrate">
					<p style="font-size: 28rpx;color: #999;">评分说明: 满分100分，服务态度和服务能力各20分<span></span></p>
				</view>
				<view class="score">
					<view v-if="!scoreInfo.length">
						<p v-for="(item, index) in rote" :key="item.service_id">
							{{ item.name }}<i></i>
							<u-rate :count="count" v-model="item.value" gutter="20" :min-count="1" :size="40"/>  {{ item.value * 5 }}分
						</p>
						<!-- <p>环境卫生<i></i><u-rate :count="count" v-model="rote.health" gutter="20" :min-count="1" :size="40"/>  {{ rote.health * 5 }}分</p>
						<p>工程设备<i></i><u-rate :count="count" v-model="rote.equipment" gutter="20" :min-count="1" :size="40"/>  {{ rote.equipment * 5 }}分</p>
						<p>服务态度<i></i><u-rate :count="count" v-model="rote.manner" gutter="20" :min-count="1" :size="40"/>  {{ rote.manner * 5 }}分</p>
						<p>综合管理<i></i><u-rate :count="count" v-model="rote.manage" gutter="20" :min-count="1" :size="40"/>  {{ rote.manage * 5 }}分</p> -->
						<view class="submit">
							<wy-button @click.native="submit()">点击提交</wy-button>
						</view>
					</view>
					<view class="submitScr" v-else>
						<h2 style="font-weight: bold; font-size: 30rpx;">您的评分已提交</h2>
						<p v-for="(item, index) in scoreInfo" :key="item.service_id">
							{{ item.service_name }}<i></i>
							<u-rate :count="count" v-model="item.score / 5" gutter="20" :min-count="1" :size="40" :disabled="true"/>  {{ item.score }}分
						</p>
						<p class="prompt" style="color: crimson; font-size: 28rpx; line-height: 32rpx; margin-top: 20rpx">提示: 每年可做一次评分!</p>
					</view>
				</view>
				<view class="history">
					<h2 style="font-weight: bold; font-size: 30rpx;">历史评分</h2>
						<scroll-view class="content-scroll" :scroll-x="true">
						<view class="listBox" v-if="historyList.length">
								<view class="historyStore" v-for="(item, index) in historyList" :key="index">
									<p>{{ item.score_dt }}年</p>
									<p>评分人数：<span>{{ item.score_people }}</span></p>
									<p>人均得分：<span>{{ item.score_avg }}</span></p>
								</view>
						</view>
						</scroll-view>
					</view>
			</view>
		</view>
		<view style="height: 50rpx;">

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
	import * as AddressApi from '@/api/wy_service.js'
	import { fail } from 'assert';
	export default {
		data() {
			return {
				tabsNum: [
					{name: '服务标准', value: 'standard'},
					{name: '服务日志', value: 'log'},
					{name: '服务评价', value: 'evaluate'}
				],
				curTab: 0,
				rote: [],
				count: 4, //选择星星的数量
				active: false, // 弹窗显示隐藏
				companyList: [],
				serviceList: [],
				isActive: 0,
				scoreInfo: [], //当年评分详情
				reload: true, //刷新页面
				historyList: []
			};
		},
		onShow() {
			this.getCompany();
			this.getScoreInfo()
		},
		methods: {
			// tab切换
			onChangeTab(val) {
				this.curTab = val
				if (val === 1) {
					this.getServiceList(null, 1)
				} else if (val === 2) {
					this.getCompany()
					this.getServiceList(1)
					this.scoreHistoryList()
				}
			},
			// 文件下载
			downloadFile(fileUrl) {
				// uni.showLoading({
				// 	title: '下载中'
				// });
				uni.downloadFile({
					url: fileUrl,
					success: function(res) {
						if (res.statusCode === 200) {
							// 保存到本地
							wx.getFileSystemManager().saveFile({
								tempFilePath: res.tempFilePath,
								success: function(res) {
									uni.openDocument({
										showMenu: true,
										filePath:res.savedFilePath,
										success: (res) => {
											uni.hideLoading()
										}
									})
								}
							})
						}
					}
				})
			},
			// 提交评分
			submit() {
				this.rote.forEach(item => {
					item.score = item.value * 5
				})
				AddressApi.doScore({
					score_list: this.rote
				}).then(res => {

					this.active = true
				})
			},
			async onReload() {
				this.reload = false
				await this.getCompany();
				await this.getScoreInfo();
				await this.scoreHistoryList()
				await this.getCompany();
				this.active = false
				this.$nextTick(() => {
					this.reload = true
				})
			},
			// 物业公司详情
			getCompany() {
				AddressApi.companyInfo().then(res => {
					this.companyList = res.data
				})
			},
			// 评分详情
			getScoreInfo() {
				AddressApi.scoreInfo().then(res => {
					this.scoreInfo = res.data.list
				})
			},
			// 历史评分
			scoreHistoryList() {
				AddressApi.scoreHistoryList().then(res => {
					this.historyList = res.data.list
					console.log(this.historyList)
				})
			},
			// 物业服务列表
			getServiceList(e, h) {
				this.rote = []
				AddressApi.ServiceList({
					has_log: h,
					can_score: e
				}).then(res => {
					this.serviceList = res.data
					if (this.serviceList.list.length > 0) {
						this.serviceList.list.forEach(item => {
							this.rote.push({
								service_id: item.id,
								value: 1,
								name: item.service_name
							})
						})
					}
				})
			},
			// 跳转服务日志列表页
			toDetails(item, h) {
				this.isActive = h;
				console.log(1)
				uni.navigateTo({
					url: `/pages/tools/wy_service/ServiceList?id=${item.id}`,
					success:function(res) {
						console.log(res)
					},
					fail:(res) => {
						console.log(res)
					}
				})
			},
      /**
       * 分享当前页面
       */
      onShareAppMessage() {
        const app = this
        return {
          title: '物业服务',
          path: `pages/tools/wy_service/wy_service`
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
          title: '物业服务',
          path: `pages/tools/wy_service/wy_service`
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

<style lang="scss" scoped>
	.container {
		padding: 20rpx;
		.tab_standard {
			>view {
				padding: 20rpx;
				background-color: #fff;
				border-radius: 20rpx;
				min-height: 200rpx;
				font-size: $uni-font-size-sm;
				&.standard_body {
					margin-top: 20rpx;
				}
				&.standard_footer {
					margin-top: 20rpx;
					display: flex;
					min-height: auto;
				}
				.file {
					display: flex;
					min-width: 33%;
					// justify-content: space-between;
					align-items: center;
					a {
						font-size: 26rpx;
						color: blue;
						text-align: center;
						margin-left: 6rpx;
						marign-bottom: 20rpx;
						// text-decoration: underline;
					}
				}
			}
		}
		.tab_log {
			width: 100%;
			overflow: hidden;
			.log_list {
				width: 23.5vw;
				height: 23.5vw;
				float: left;
				display: flex;
				align-items: center;
				justify-content: center;
				.content {
					width: 90%;
					height: 90%;
					border-radius: 100%;
					border: 1rpx solid rgba(0, 0, 0, 0.05);
					background-color: #fff;
					display: flex;
					justify-content: center;
					align-items: center;
					flex-direction: column;
					&.active {
						border-color: rgba(33, 140, 254, 0.5);
					}
					.wyiconfont {
						margin-bottom: 10rpx;
						font-size: 40rpx;
					}
				}
			}
		}
		.tab_evaluate {
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
</style>
