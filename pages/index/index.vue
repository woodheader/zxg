<template>
	<view class="container">
		<Search :itemStyle='defaultData.search.style' :params='defaultData.search.params' />
		<NavBar :itemStyle="defaultData.navbar.style" :params="defaultData.navbar.params"
			:dataList="defaultData.navbar.data">
		</NavBar>
		<swiper class="swiper" circular :indicator-dots="true">
			<swiper-item class="u-swiper-item" v-for="(item, index) in Math.ceil(service.length / 8)" :key="index"
				:current="current">
				<block v-for="(dataitem, dataindex) in serviceList(index)" :key="dataindex">
					<view v-if="dataitem.type == 'link'" class="service-item" @click="handleService(dataitem)">
						<view class="">
							<view class="item-icon" v-if="dataitem.wyiconfont">
								<text class="wyiconfont" :class="[`icon-${dataitem.icon}`]" :style="{color: dataitem.color}"></text>
							</view>
							<view class="item-icon" v-else>
								<text class="iconfont" :class="[`icon-${dataitem.icon}`]"></text>
							</view>
						</view>
						<view class="item-name">{{ dataitem.name }}</view>
						<view class="item-badge" v-if="dataitem.count && dataitem.count > 0">
							<text v-if="dataitem.count <= 99" class="text">{{ dataitem.count }}</text>
							<text v-else class="text">99+</text>
						</view>
					</view>
					<view v-if="dataitem.type == 'button' && platform == 'MP-WEIXIN'" class="service-item">
						<button class="btn-normal" :open-type="dataitem.openType">
							<view class="item-icon">
								<text class="iconfont" :class="[`icon-${item.icon}`]"></text>
							</view>
							<view class="item-name">{{ dataitem.name }}</view>
						</button>
					</view>
				</block>
			</swiper-item>
		</swiper>
		<official-account bindload="loadSuccess"></official-account>
		<view style="background-color: #fff;">
			<view class="shop_title" style="border-bottom: 1rpx solid #e8e8e8; margin: 20rpx 20rpx 0; padding:20rpx 0;">
				<p>最新消息</p>
			</view>
			<view class="new_content" v-if="shopList.newList.length">
				<view class="" v-for="(item, index) in shopList.newList" :key="index" @click="tointeraction(item.id)">
					<p>{{item.msg_type_desc}} :</p>
					<p>{{item.title}}</p>
				</view>
			</view>
			<view class="new_content" v-else>
				<u-empty text="暂无消息" mode="news" margin-top="20"></u-empty>
			</view>
		</view>
		<view>
			<view class="shop_title">
				<p>优选商城</p>
				<i>送知珠、可抵扣</i>
				<navigator url="/pages/category/index">更多商品>></navigator>
			</view>
			<view class="shop_content">
				<view class="" v-for="(item, index) in shopList.indexList" :key="index" @click="toShop(item.goods_id)">
					<image :src="item.goods_image" mode=""></image>
					<p>{{item.goods_name}}</p>
				</view>
			</view>
		</view>
		<view>
			<view class="shop_title">
				<p>上门服务</p>
				<i>送知珠、可抵扣</i>
				<!-- <span @click="toService()">更多服务>></span> -->
				<navigator url="/pages/life/life/list">更多服务>></navigator>
			</view>
			<view class="shop_content">
				<view class="" v-for="(item, index) in shopList.lifeList" :key="index" @click="toServe(item.life_id)">
					<image :src="item.life_image" mode=""></image>
					<p>{{item.life_name}}</p>
				</view>
			</view>
		</view>
		<view class="logo" @click="toMine()">
			<!-- <img src="@/static/logo.png" alt=""> -->
			<view class="">
				<p style="font-size: 30rpx;">专注、便捷、实惠</p>
				<p style="font-size: 30rpx;">知小管智慧物业，您手中的房屋管家</p>
			</view>
		</view>
		<view style="height: 10rpx;"></view>
	</view>
</template>

<script>
	import {
		setCartTabBadge
	} from '@/core/app'
	import * as Api from '@/api/page'
	import * as UserApi from '@/api/user'
	import Page from '@/components/page'
	import Search from '@/components/page/search/index.vue'
	import NavBar from '@/components/page/navBar/index.vue'
	const service = [{
			id: 'wy_service',
			name: '物业服务',
			icon: 'wuyebaoxiu',
			type: 'link',
			url: 'pages/tools/wy_service/wy_service',
			color: '#FFAE45',
			wyiconfont: true
		},
		{
			id: 'complaint',
			name: '管家服务',
			icon: 'a-kefukefuzhongxin',
			type: 'link',
			url: 'pages/tools/houseKeep/index',
			color: '#FF7C48',
			wyiconfont: true
		},
		{
			id: 'complaint',
			name: '便民电话',
			icon: 'iconfontphone',
			type: 'link',
			url: 'pages/tools/mbook/index',
			color: '#0C92F2',
			wyiconfont: true
		},
		{
			id: 'complaint',
			name: '投诉中心',
			icon: 'nanguanjia',
			type: 'link',
			url: 'pages/tools/complaint/index',
			color: '#87C99E',
			wyiconfont: true
		},
		{
			id: 'interaction',
			name: '互动中心',
			icon: 'fuwu_o',
			type: 'link',
			url: 'pages/tools/interaction/index',
			color: '#FF7C48',
			wyiconfont: true
		},
		{
			id: 'interaction',
			name: '物业通知',
			icon: 'tongzhi',
			type: 'link',
			url: 'pages/tools/interaction/index',
			color: '#0C92F2',
			wyiconfont: true
		},
		{
			id: 'interaction',
			name: '公示投票',
			icon: 'toupiao1',
			type: 'link',
			url: `pages/tools/interaction/index?type=${1}`,
			color: '#FFAE45',
			wyiconfont: true
		},
		{
			id: 'interaction',
			name: '物业活动',
			icon: 'huodong1',
			type: 'link',
			url: `pages/tools/interaction/index?type=${2}`,
			color: '#FF7C48',
			wyiconfont: true
		},

	]
	const App = getApp()

	export default {
		components: {
			Search,
			NavBar,
			Page
		},
		data() {
			return {
				current: 0,
				defaultData: {
					search: {
						name: "搜索框",
						type: "search",
						params: {
							placeholder: "请输入关键字进行搜索"
						},
						style: {
							background: "#66affe",
							textAlign: "left",
							textColor: "#ffffff",
							searchStyle: "round"
						}
					},
					navbar: {
						name: "导航组",
						type: "navBar",
						style: {
							rowsNum: 4,
							background: "#218cfe",
							paddingTop: 0,
							textColor: "#ffffff"
						},
						data: [{
								icon: "iconfontphone",
								imgUrl: "/static/index/jiaofei.png",
								"imgName": "icon-2.jpg",
								link: {
									id: "bb2f7f1",
									title: "物业缴费",
									type: "PAGE",
									param: {
										path: "pages/payment/index",
										url: "pages/payment/index"
									}
								},
								text: "物业缴费"
							},
							{
								icon: "iconfontphone",
								imgUrl: "/static/index/yaoqing.png",
								link: {
									id: "bb2f7f1",
									title: "邀请家人",
									type: "PAGE",
								},
								text: "邀请家人"
							},
							{
								icon: "a-kefukefuzhongxin",
								imgUrl: "/static/index/guanjia.png",
								link: {
									type: "NUM",
									user: "",
									stewardPhone: "",
								},
								text: "联系管家",
							},
							{
								icon: "iconfontphone",
								imgUrl: "/static/index/fangwu.png",
								link: {
									id: "bb2f7f1",
									title: "房屋管理",
									type: "PAGE",
									param: {
										/*"path": "pages/youxuan/index",
										"url": "pages/youxuan/index"*/
										path: "pages/user/setRoom/index",
										url: "pages/user/setRoom/index"
									}
								},
								text: "房屋管理"
							}
						]
					},

				},
				service,

				// 页面参数
				options: {},
				// 页面属性
				page: {},
				// 页面元素
				items: [],
				shopList: {
					indexList: [],
					lifeList: [],
					newList: []
				}
			}
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			// 当前页面参数
			this.options = options
			// 加载页面数据
			this.getPageData();
		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow() {
			// 更新购物车角标
			// setCartTabBadge()
			//获取当前登录用户
			this.getUserInfo()
			this.getShopList()
		},

		methods: {

			loadSuccess(val) {
				console.log(val)
			},
			toMine() {
				this.$navTo('pages/article/detail?articleId=10015')
			},
			toServe(lifeId) {
				this.$navTo('pages/life/life/detail', {
					lifeId
				})
			},
			toShop(goodsId) {
				this.$navTo('pages/goods/detail', {
					goodsId
				})
			},
			tointeraction(id) {
				this.$navTo('pages/tools/interaction/detailes/detailes', {
					id
				})
			},
			// 获取所有列表数据
			getShopList() {
				Api.newList().then(res => {
					this.shopList.newList = res.data.list.data
				})
				Api.indexList().then(res => {
					this.shopList.indexList = res.data.list.data
				})
				Api.lifeList().then(res => {
					this.shopList.lifeList = res.data.list.data
				})
			},
			// 跳转到服务页面
			handleService(item) {
				console.log(item.url)
				this.$navTo(item.url)
			},

			serviceList(index) {
				return this.service.slice(index * 8, (index + 1) * 8)
			},
			/**
			 * 针对普通用户，用户点击：物业缴费、联系管家，需要增加错误提示
			 */
			normalUserDialog() {
				if (this.wy_role_name === '普通用户') {
					uni.showModal({
						title: '温馨提示',
						content: '访问此功能，需要先添加您的房屋信息',
						showCancel: false,
						confirmText: '我知道了'
					});
				} else {
					uni.showModal({
						title: '温馨提示',
						content: '您是否要拨打此管家电话？\n' + this.stewardPhone,
						success: function(res) {
							if (res.confirm) {

							}
						}
					});
				}
			},

			/**
			 * 加载页面数据
			 * @param {Object} callback
			 */
			getPageData(callback) {
				const app = this
				const pageId = app.options.pageId || 0
				Api.detail(pageId)
					.then(result => {
						// 设置页面数据
						const {
							data: {
								pageData
							}
						} = result
						app.page = pageData.page
						app.items = pageData.items
						//获取当前登录用户
						app.getUserInfo();
						// 设置顶部导航栏栏
						app.setPageBar();

					}).catch(() => {

					})
					.finally(() => callback && callback())
			},

			/**
			 * 设置顶部导航栏
			 */
			setPageBar() {
				const {
					page
				} = this
				// 设置页面标题
				uni.setNavigationBarTitle({
					title: page.params.title,
				});
				// 设置navbar标题、颜色
				uni.setNavigationBarColor({
					frontColor: page.style.titleTextColor === 'white' ? '#ffffff' : '#000000',
					backgroundColor: page.style.titleBackgroundColor
				})
			},

			//获取当前用户信息
			getUserInfo() {
				UserApi.info().then(res => {
					if (res.status === 410) {
						store.dispatch('Logout', {})
							.then(result => app.onRefreshPage())
						app.$navTo('pages/login/index')
						return false;
					}
					this.wy_role_name = res.data.userInfo.wy_role_name
					this.stewardPhone = res.data.userInfo.stewardPhone
					// console.log(this.defaultData.navbar.data[3].link.user);
					let sendPoints = 1;
					if (this.wy_role_name === '业主') {
						sendPoints = 2;
					}
					if (res.data.userInfo.is_new_register == 1) {
						uni.showModal({
							title: '登录成功',
							content: '系统已赠送你' + sendPoints + '个知珠!',
							showCancel: false,
							confirmText: "确认",
							success: res => {
								if (res.confirm) {
									uni.navigateTo({
										url: "/pages/index/index"
									})
								}
							}
						})
					}
				}).catch((e) => {
					console.log(e)
				})
			},

		},

		/**
		 * 下拉刷新
		 */
		onPullDownRefresh() {
			// 获取首页数据
			this.getPageData(() => {
				uni.stopPullDownRefresh()
			})
		},

		/**
		 * 分享当前页面
		 */
		onShareAppMessage() {
			const app = this
			const {
				page
			} = app
			return {
				title: page.params.share_title,
				path: "/pages/index/index?" + app.$getShareUrlParams()
			}
		},

		/**
		 * 分享到朋友圈
		 * 本接口为 Beta 版本，暂只在 Android 平台支持，详见分享到朋友圈 (Beta)
		 * https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share-timeline.html
		 */
		onShareTimeline() {
			const app = this
			const {
				page
			} = app
			return {
				title: page.params.share_title,
				path: "/pages/index/index?" + app.$getShareUrlParams()
			}
		}

	}
</script>

<style lang="scss" scoped>
	/deep/ .diy-search {
		background-color: #218cfe !important;
	}

	.container {
		background: #f6f6f6;
	}

	.swiper {
		height: 360rpx
	}

	.u-swiper-item {
		background-color: #fff;
		margin-bottom: 20rpx;
		padding-top: 20rpx;

		.service-item {
			position: relative;
			width: 25%;
			float: left;
			margin-bottom: 30rpx;

			.item-icon {
				text-align: center;
				margin: 0 auto;
				padding: 14rpx 0;
				// color: #ff3800;
				font-size: 44rpx;

				.wyiconfont {
					font-size: 44rpx !important;
				}
			}

			.item-name {
				font-size: 30rpx;
				color: #545454;
				text-align: center;
				margin-right: 10rpx;
			}

		}
	}

	.shop_title {
		padding: 20rpx 20rpx;
		background-color: #fff;
		display: flex;
		align-items: center;
		margin-top: 20rpx;

		p {
			font-size: 30rpx;
			font-weight: bold;
		}

		i {
			font-size: 24rpx;
			margin-top: 10rpx;
			color: red;
			margin-left: 10rpx;
		}

		navigator {
			position: absolute;
			right: 40rpx;
			color: #218cfe;
		}

		span {
			position: absolute;
			right: 40rpx;
			color: #218cfe;
		}
	}

	.shop_content {
		display: flex;
		width: 100%;
		padding: 0 20rpx;
		justify-content: space-between;
		background-color: #fff;

		view {
			width: 30%;

			image {
				width: 100%;
				height: 30vw;
			}

			p {
				display: inline-block;
				width: 100%;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				text-align: center;
				margin-top: 10rpx;
				padding-bottom: 20rpx;
			}
		}
	}

	.new_content {
		width: 100%;
		padding: 0 20rpx;
		background-color: #fff;

		>view {
			display: flex;
			padding: 20rpx 0;
			border-top: 1rpx solid #e8e8e8;

			&:first-child {
				border-top: none;
			}

			p {
				font-size: 30rpx;

				&:first-child {
					font-weight: bold;
					color: #666;
				}

				&:last-child {
					margin-left: 10rpx;
					width: calc(100vw - 250rpx);
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
			}
		}
	}

	.logo {
		margin: 20rpx;
		padding: 60rpx 0;
		border-radius: 20rpx;
		text-align: center;
		margin-bottom: 0;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;

		// img {
		// 	width: 120rpx;
		// 	height: 120rpx;
		// 	marign-right: 20rpx;
		// }

		p {
			line-height: 60rpx;
			font-family: cursive;
			&:first-child {
				font-weight: bold;
			}
		}
	}
</style>

<style>
	/* wx */
	wx-swiper .wx-swiper-dot {
		width: 25rpx;
		height: 6rpx;
		background-color: #777888;
	}
	wx-swiper .wx-swiper-dot-active {
		/* background-color: #fb0303; */
		width: 40rpx;
		border-radius: 6rpx !important;
		overflow:hidden;
	}
</style>