<template>
	<view class="container" v-if="isRecord">
		<!-- 吸顶 -->
		<u-sticky offset-top="0">
			<!-- tab导航栏 -->
			<u-tabs :list="tabsNum" :is-scroll="false" :current="curTab" active-color="#218cfe" :duration="0.2"
				@change="onChangeTab" />
		</u-sticky>
		<view class="content">
			<!-- <view class="content_bth" @click="submit(tabsNum[curTab].value)">

				<h5></h5>
			</view> -->
			<wy-button @click="submit(tabsNum[curTab].value)">我要{{ tabsNum[curTab].name }}</wy-button>
		</view>
		<view class="list">
			<view class="companyTitle">
				<p>我的{{tabsNum[curTab].name}}</p>
				<view class="price-arrow" @click="handerOrder()">
					<view class="icon up">
						<text class="iconfont icon-arrow-up" :class="order? 'active' : ''"></text>
					</view>
					<view class="icon down">
						<text class="iconfont icon-arrow-down" :class="!order? 'active' : ''"></text>
					</view>
				</view>
			</view>
			<u-card :show-head="false" v-for="(item,index) in complantList" :key="index">
				<template>
					<view slot="body" class="card_body">
						<view class="" @click="toDetail(item.id, tabsNum[curTab].value)" v-if="curTab === 0">
							<p>投诉标题：{{item.object_name}}</p>
							<p style="margin-top:20rpx;">投诉时间：{{item.create_time}}</p>
						</view>
						<view class="" @click="toDetail(item.id, tabsNum[curTab].value)" v-else-if="curTab === 1">
							<p>表扬对象：{{item.object_name}}</p>
							<p style="margin-top:20rpx;">表扬时间：{{item.create_time}}</p>
						</view>
						<view class="" @click="toDetail(item.id, tabsNum[curTab].value)" v-else>
							<p>建议标题：{{item.object_name}}</p>
							<p style="margin-top:20rpx;">建议时间：{{item.create_time}}</p>
						</view>
						<view class="complaint_bottom" v-if="curTab === 0" style="margin-top: 20rpx;">
							<p
								v-for="(ditem, dindex) in current[index].list"
								:key="dindex"
								:class="[currentTab[`tab${index}`] === dindex + 2? 'isactive' : '',ditem.class]"
								@click="handerTab(index,dindex,item)">{{ ditem.name }}</p>
						</view>

						<view class="complaint-footer" v-if="item.object_status >= 20 && currentTab[`tab${index}`] === 2">
							<p class="complaint_title">您的投诉已响应！</p>
							<p>响应人：{{item.reply_user_name}}</p>
							<p>响应时间： {{item.reply_time}}</p>
						</view>
						<view class="complaint-footer" v-if="item.object_status === 30 && currentTab[`tab${index}`] === 3">
							<p class="complaint_title">您的投诉已处理！</p>
							<p>处理人：{{item.process_user_name}}</p>
							<p>完成时间： {{item.process_time}}</p>
						</view>
						<view class="complaint-footer" v-if="item.mini_user_comment === 0 && item.object_status === 30 ">
							<p class="complaint_title">投诉处理评价!</p>
							<p class="evaluate">
								<i @click="evaluate(item.id, 1)">很满意</i>
								<i @click="evaluate(item.id, 2)">满意</i>
								<i @click="evaluate(item.id, 3)">不满意</i>
							</p>
						</view>
						<view class="complaint-scrvice" v-if="item.object_status === 30 && currentTab[`tab${index}`] === 4 && item.mini_user_comment !== 0 ">
							<p class="complaint_title">您的投诉已评价!</p>
							<p class="evaluate">
								您的评价为：
								<i v-if="item.mini_user_comment === 1">很满意</i>
								<i v-if="item.mini_user_comment === 2">满意</i>
								<i v-if="item.mini_user_comment === 3">不满意</i>
							</p>
						</view>
					</view>
				</template>
			</u-card>
		</view>
		<u-popup ref="popTimer" v-model="active" mode="center" :z-index="18899" :closeable="true" :border-radius="30">
			<p class="dialog_text">您的评价已提交成功！</p>
			<view class="dialog_footer">
				<p class="dialog_bth" @click="onReload()">确定</p>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import * as Api from '@/api/complaint.js'
	const list = [{
			name: '待响应'
		},
		{
			name: '待解决'
		},
		{
			name: '待评价'
		},
	]
	export default {
		data() {
			return {
				tabsNum: [{
						name: '投诉',
						value: 1
					},
					{
						name: '表扬',
						value: 2
					},
					{
						name: '建议',
						value: 3
					}
				],
				curTab: 0,
				current: [],
				list,
				complantList: [],
				active: false,
				isRecord: true,
				params: {
					pageNum: 1
				},
				order: false,
				currentTab: {},
				total: 0
			};
		},
		onShow() {
			this.getList()
		},
		//下拉刷新触发方法(和onLoad同级)
		onPullDownRefresh () {
			this.params.pageNum = 1
		  this.getList()  //获取数据
		},
		//上拉加载触发方法
		onReachBottom() {
			if (this.total > this.params.pageNum * 4) {
				this.params.pageNum = this.params.pageNum + 1
				this.getList()
			}
		},
		methods: {
			// 单条投诉状态切换
			handerTab(h,index,item) {
				if (item.object_status >= 30) {
					this.currentTab[`tab${h}`] = index + 2
				}
			},
			// tab切换
			onChangeTab(val) {
				this.curTab = val
				this.params.pageNum = 1
				this.getList()
			},
			// 正序倒叙切换
			handerOrder() {
				this.order = !this.order
				this.getList()
			},
			// 跳转到填写页
			submit(value) {
				uni.navigateTo({
					url: `/pages/tools/complaint/appendix/appendix?type=${value}`
				})
			},
			// 判断评价状态
			evaluateValue (item) {
				if (item === 1) {
					return '很满意'
				} else if(item === 2) {
					return '满意'
				} else if (item === 3) {
					return '不满意'
				}
			},
			// 跳转到详情页
			toDetail(eid, value) {
				uni.navigateTo({
					url: `/pages/tools/complaint/appendDetail/appendDetail?type=${value}&id=${eid}`
				})
			},
			// 投诉评价
			evaluate(id, stauts) {
					Api.doComment({
						id: id,
						comment_status: stauts
					}).then(res => {
						this.active = true
					})
			},
			//刷新页面
			async onReload() {
				this.isRecord = false;
				this.params.pageNum = 1
				await this.getList()
				this.active = false;
				this.$nextTick(() => {
					this.isRecord = true
				})
			},
			// 获取列表
			getList() {
				this.current = []
				const page = {
					page: this.params.pageNum,
					pageSize: 4,
					sort_type: this.order? 'asc' : 'desc'
				}
				if (this.curTab === 0) {
					Api.complaintList(page).then(res => {
						const data = res.data.list.data
						this.total = res.data.list.total
						if (page.page === 1) {
							this.complantList = res.data.list.data
						} else {
							this.complantList = this.complantList.concat(data)
						}
						this.complantList.forEach((item, index) => {
							this.$set(this.currentTab, `tab${index}`, item.object_status / 10,)
							this.current.push({
								value: item.object_status / 10,
								list: [
									{
										name: item.object_status >= 20? '已响应' : '待响应',
										class: item.object_status >= 20? 'active' : ''
									},
									{
										name: item.object_status === 30? '已处理' : '待处理',
										class: item.object_status === 30? 'active' : ''
									},
									{
										name: item.mini_user_comment === 0? '待评价' : this.evaluateValue(item.mini_user_comment),
										class: item.mini_user_comment !== 0? 'active' : ''
									},
								]
							})
						})
						uni.stopPullDownRefresh()
					})

				} else if (this.curTab === 1) {
					console.log(page)
					Api.praiseList(page).then(res => {
						const data = res.data.list.data
						if (page.page === 1) {
							this.complantList = res.data.list.data
						} else {
							this.complantList = this.complantList.concat(data)
						}
						uni.stopPullDownRefresh()
					})
				} else {
					Api.adviceList(page).then(res => {
						const data = res.data.list.data
						if (page.page === 1) {
							this.complantList = res.data.list.data
						} else {
							this.complantList = this.complantList.concat(data)
						}
						uni.stopPullDownRefresh()
					})
				}
			},

      /**
       * 分享当前页面
       */
      onShareAppMessage() {
        const app = this
        return {
          title: '投诉中心',
          path: `pages/tools/complaint/index`
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
          title: '投诉中心',
          path: `pages/tools/complaint/index`
        }
      }
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 40rpx 0;

		.content_bth {
			display: inline-block;
			border: 2rpx solid rgba(33, 140, 254, 0.5);
			padding: 20rpx 70rpx;
			border-radius: 12rpx;
		}
	}

	.companyTitle {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10rpx 20rpx;
		border-top: 1rpx solid #e8e8e8;
		border-bottom: 1rpx solid #e8e8e8;
	}
	.complaint_bottom {
		width: 100%;
		padding: 20rpx 0;
		border-radius: 10rpx;
		display: flex;
		background-color: #f4f4f4;
		justify-content: space-around;
		p {
			width: 30%;
			border-radius:  10rpx;
			padding: 10rpx 0;
			text-align:  center;
			&.active {
				background-color: #fff;
				font-weight: bold;
			}
			&.isactive {
				background-color: #fff;
				font-weight: bold;
				border: 2rpx solid rgba(33, 140, 254, 0.5);
			}
		}
	}
	.complaint-footer {
		width: 100%;
		padding: 20rpx;
		background-color: #f4f4f4;
		margin-top: 20rpx;
		border-radius:  10rpx;
		p {
			font-size: 30rpx;
			display: flex;
			&.evaluate {
				justify-content: space-between;
				margin-top: 20rpx;
			}
			&.complaint_title {
				margin-bottom: 20rpx;
				font-weight: bold;
				font-size: 36rpx;
			}
			i {
				padding: 20rpx 40rpx;
				border: 1rpx solid rgba(33, 140, 254, 0.5);
				border-radius: 10rpx;
			}
		}
	}
	.complaint-scrvice {
		width: 100%;
		padding: 20rpx;
		background-color: #f4f4f4;
		margin-top: 20rpx;
		border-radius:  10rpx;
		p {
			font-size: 30rpx;
			&.evaluate {
				justify-content: space-between;
				margin-top: 20rpx;
			}
			&.complaint_title {
				margin-bottom: 20rpx;
				font-weight: bold;
				font-size: 36rpx;
			}
			i {
				display: inline;
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
	.price-arrow {
		text {
			&.active {
				color: #f03c3c;
			}
		}
	}
</style>
