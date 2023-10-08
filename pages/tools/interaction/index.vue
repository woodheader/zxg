<template>
	<view class="container">
		<!-- view class="interaction_tabs">
			互动中心
		</view> -->
		<!-- tab栏 -->
		<u-sticky :offset-top="0">
			<u-tabs :list="tabsNum" :is-scroll="false" :current="curTab" active-color="#218cfe" :duration="0.2"
				@change="onChangeTab"/>
		</u-sticky>

		<!-- 列表展示 -->
		<view class="interaction_list" v-if="interactionList.length">
			<u-card :show-head="false" v-for="(item,index) in interactionList" :key="index">
				<template>
					<view  slot="body" class="card_body" @click="linkTo(item.id)">
						<view class="boay_left">
							<h2>{{ item.title }}</h2>
							<p>{{ timeName }} {{ curTab === 0? item.interact_start_time :  item.interact_start_time.slice(0, 10) + ' — ' + item.interact_end_time.slice(0, 10)}}</p>
						</view>
						<view class="body_right">
							<img :src="item.img_src" alt="" v-if="item.img_src">
							<view v-if="curTab === 1">
								<p :style="{color: voteStatus[item.vote_status].color}">{{ voteStatus[item.vote_status].name }}</p>
							</view>
							<view v-if="curTab === 2">
								<p :style="{color: applyStatus[item.apply_status].color}">{{ applyStatus[item.apply_status].name }}</p>
							</view>
						</view>
					</view>
				</template>
			</u-card>
		</view>
		<u-empty text="暂无数据" mode="list" margin-top="300" v-else></u-empty>
	</view>
</template>

<script>
	import * as Api from '@/api/interaction.js'
	export default {
		data() {
			return {
				tabsNum: [
					{name: '物业通知', value: 'notice'},
					{name: '公示投票', value: 'vote'},
					{name: '活动报名', value: 'application'}
				],
				voteStatus: [
					{name: '未开始', value: 'notice', id: 0, color: '#999'},
					{name: '投票中', value: 'notice', id: 1, color: '#01b9e5'},
					{name: '成功', value: 'notice', id: 2, color: '#2cea0f'},
					{name: '失败', value: 'notice', id: 3, color: '#f13f09'}
				],
				applyStatus: [
					{name: '未开始', value: 'notice', id: 0, color: '#999'},
					{name: '报名中', value: 'notice', id: 1, color: '#2cea0f'},
					{name: '报名结束', value: 'notice', id: 2, color: '#f13f09'}
				],
				curTab: 0,
				interactionList: [],
				timeName: '通知时间:',
				loading: {
					err: true,
					text: '加载中...'
				},
				params: {
					pageNum: 1
				},
				total: 0,
			};

		},
		onLoad(option) {
			if (option.type) {
				this.curTab = Number(option.type)
			}
			this.getList()
		},
		//下拉刷新触发方法(和onLoad同级)
		onPullDownRefresh () {
			this.params.pageNum = 1
		  this.getList()  //获取数据
		},
		//上拉加载触发方法
		onReachBottom() {
			this.params.pageNum = this.params.pageNum + 1
			this.getList()
		},
		methods:{
			// tab切换
			onChangeTab(index) {
				this.curTab = index
				this.interactionList = []
				this.params.pageNum = 1
				this.getList()
			},
			// 请求数据
			getList() {
				this.loading.err = false
				const page = {
					page: this.params.pageNum,
					pageSize: 7
				}
				if (this.curTab === 0) {
					this.timeName = '通知时间:'
					Api.notifyList(page).then(res => {
						// this.interactionList = res.data.list.data
						// this.interactionList.concat(res.data.list.data)
						// this.loading.err = true
						const data = res.data.list.data
						if (page.page === 1) {
							this.interactionList = res.data.list.data
						} else {
							this.interactionList = this.interactionList.concat(data)
						}
						this.total = res.data.total
						this.loading.err = true
						uni.stopPullDownRefresh()
					})
				} else if(this.curTab === 1) {
					this.timeName = '投票时间:'
					Api.voteList(page).then(res => {
						const data = res.data.list.data
						if (page.page === 1) {
							this.interactionList = res.data.list.data
						} else {
							this.interactionList = this.interactionList.concat(data)
							console.log(this.interactionList.concat(data))
						}
						this.total = res.data.total
						this.loading.err = true
						uni.stopPullDownRefresh()    //结束下拉刷新
					})
				} else {
					this.timeName = '活动时间:'
					Api.activityList(page).then(res => {
						const data = res.data.list.data
						if (page.page === 1) {
							this.interactionList = res.data.list.data
						} else {
							this.interactionList = this.interactionList.concat(data)
							console.log(this.interactionList.concat(data))
						}
						this.total = res.data.total
						this.loading.err = true
						uni.stopPullDownRefresh()
					})
				}
				const size = page.page * page.pageSize
				if (size >= this.total && this.total > 5) {
					this.loading.text = '亲，没有更多了'
				}
			},
			// 跳转页面
			linkTo(i) {
				uni.navigateTo({
					url: `/pages/tools/interaction/detailes/detailes?id=${i}`
				})
			},

      /**
       * 分享当前页面
       */
      onShareAppMessage() {
        const app = this
        return {
          title: '互动中心',
          path: `pages/tools/interaction/index`
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
          title: '互动中心',
          path: `pages/tools/interaction/index`
        }
      }
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f4f4f4;
	}
	.interaction_tabs {
		width: 100%;
		padding: 60rpx;
		text-align: center;
		background-color: #01b9e5;
		color: #fff;
		font-size: 48rpx;
		font-weight: bold;
		white-space: 20rpx;
	}
	.loading {
		height: calc(100vh - 400rpx);
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.card_body {
		display: flex;
		justify-content: space-between;
		align-items: center;
		img {
			width: 80rpx;
			height: 80rpx;
		}
		p {
			margin-top: 30rpx;
		}
		.body_right {
			p {
				margin-top: 0rpx;
			}
		}
	}
</style>
