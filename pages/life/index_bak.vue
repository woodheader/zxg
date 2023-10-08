<template>
	<view class="container" v-if="!isFirstload">
		<Search :itemStyle='defaultData.search.style' :params='defaultData.search.params'  style="background-color: #fff;"/>

		<view class="wrap">
			<view class="title">
				品质服务，一站齐享
			</view>
			<view class="title-small">
				保洁 丨 装修 丨 出游......用心护航美好生活
			</view>
			<view class="interest-wrap">
				<view class="item">
					<text class="wyiconfont icon-qianbao icon-img"></text>
					<view class="text">
						<text>{{ setting[SettingKeyEnum.POINTS.value].points_name }}抵扣</text>
						<text class="fs-12">乐享权益</text>
					</view>
				</view>

				<view class="item">
					<text class="wyiconfont icon-fuwu_o icon-img"></text>
					<view class="text">
						<text>严选服务</text>
						<text class="fs-12">专业品质</text>
					</view>
				</view>

				<view class="item">
					<text class="wyiconfont icon-shouhoufuwu icon-img"></text>
					<view class="text">
						<text>售后无忧</text>
						<text class="fs-12">服务至上</text>
					</view>
				</view>
			</view>
		</view>

		<view class="card-container">
			<view class="card-box service-card">
				<view class="card-top service-top">
					<view class="title">保洁清洗</view>
					<view>高质量高效率送知珠</view>
				</view>
				<view class="service-bottom">
					<view class="service-bottom-r">
						<view class="" style="height: 100%;">
							<view class="service-bottom-r-box service-bottom-r-b">
								<view class="service-bottom-r-item blue-bg" @click="onLifeCate('pages/life/category?categoryId=10001')">
                  <image src="../../static/logo.png" style="width: 50px;height: 50px;"></image>
									<view>日常保洁</view>
								</view>
                <view class="service-bottom-r-item blue-bg" @click="onLifeCate('pages/life/category?categoryId=10002')">
                  <text class="wyiconfont icon-shuitong blue-bg"></text>
                  <view>深度保洁</view>
                </view>
                <view class="service-bottom-r-item blue-bg" @click="onLifeCate('pages/life/category?categoryId=10003')">
                  <text class="wyiconfont icon-shuitong blue-bg"></text>
                  <view>开荒保洁</view>
                </view>
								<view class="service-bottom-r-item blue-bg" @click="toastMassage">
									<u-icon name="plus-circle" size="60"></u-icon>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>

      <view class="card-box service-card">
        <view class="card-top service-top">
          <view class="title">家电维修</view>
          <view>高质量高效率送知珠</view>
        </view>
        <view class="service-bottom">
          <view class="service-bottom-r">
            <view class="" style="height: 100%;">
              <view class="service-bottom-r-box service-bottom-r-b">
                <view class="service-bottom-r-item blue-bg" @click="onLifeCate('pages/life/category?categoryId=10001')">
                  <text class="wyiconfont icon-shuitong blue-bg"></text>
                  <view>空调</view>
                </view>
                <view class="service-bottom-r-item blue-bg" @click="onLifeCate('pages/life/category?categoryId=10002')">
                  <text class="wyiconfont icon-shuitong blue-bg"></text>
                  <view>冰箱</view>
                </view>
                <view class="service-bottom-r-item blue-bg" @click="onLifeCate('pages/life/category?categoryId=10003')">
                  <text class="wyiconfont icon-shuitong blue-bg"></text>
                  <view>洗衣机</view>
                </view>
                <view class="service-bottom-r-item blue-bg" @click="onLifeCate('pages/life/category?categoryId=10001')">
                  <text class="wyiconfont icon-shuitong blue-bg"></text>
                  <view>电视</view>
                </view>
              </view>
              <view class="service-bottom-r-box service-bottom-r-b">
                <view class="service-bottom-r-item blue-bg" @click="onLifeCate('pages/life/category?categoryId=10001')">
                  <text class="wyiconfont icon-shuitong blue-bg"></text>
                  <view>热水器</view>
                </view>
                <view class="service-bottom-r-item blue-bg" @click="onLifeCate('pages/life/category?categoryId=10002')">
                  <text class="wyiconfont icon-shuitong blue-bg"></text>
                  <view>燃气灶</view>
                </view>
                <view class="service-bottom-r-item blue-bg" @click="onLifeCate('pages/life/category?categoryId=10003')">
                  <text class="wyiconfont icon-shuitong blue-bg"></text>
                  <view>燃气灶</view>
                </view>

              </view>
            </view>



          </view>
        </view>
      </view>

		</view>


		<view class="add">
			---生活服务项陆续添加中---
		</view>
	</view>
</template>

<script>
	import Search from '@/components/page/search/index.vue'
	import SettingKeyEnum from '@/common/enum/setting/Key'
	import SettingModel from '@/common/model/Setting'
	export default {
		components: {
			Search,
		},
		onLoad() {
			this.getPageData()
		},
		data() {
			return {
				// 枚举类
				SettingKeyEnum,
				// 正在加载
				isLoading: true,
				// 首次加载
				isFirstload: true,
				// 系统设置
				setting: {},

				defaultData: {
					search: {
						"name": "搜索框",
						"type": "search",
						"params": {
							"placeholder": "搜索商品/服务/旅游"
						},
						"style": {
							"background": "#ECECEC",
							"textAlign": "left",
							"textColor": "#CECDCD",
							"searchStyle": "round"
						}
					},
				},
				imgList: [
					'/static/life/img3.png',
					'/static/life/img3.png',
					'/static/life/img3.png',
					// 'https://cdn.uviewui.com/uview/swiper/swiper3.png',
					// 'https://cdn.uviewui.com/uview/swiper/swiper2.png',
					// 'https://cdn.uviewui.com/uview/swiper/swiper1.png',
				],
			}
		},
		methods: {

			// 获取商城设置
			getSetting() {
				const app = this
				return new Promise((resolve, reject) => {
					SettingModel.data()
						.then(setting => {
							app.setting = setting
							resolve(setting)
						}).catch(reject)
				})
			},

			// 获取页面数据
			getPageData(callback) {
				const app = this
				app.isLoading = true
				Promise.all([app.getSetting()])
					.then(result => {
						app.isFirstload = false
						// 初始化我的服务数据
						// app.initService()
						// 初始化订单操作数据
						// app.initOrderTabbar()
						// 执行回调函数
						callback && callback()
					})
					.catch(err => console.log('catch', err))
					.finally(() => app.isLoading = false)
			},


			//提示功能完善中
			toastMassage() {
				uni.showToast({
					title: '服务正在添加完善中',
					icon: 'none',
					duration: 1500,
				})
			},

			//跳转到对应的生活服务列表页面
      onLifeCate(link) {
				this.$navTo(link)
			}
		}
	}
</script>

<style lang="scss" scoped>
.container {
	/deep/ .diy-search {
		background-color: #ffffff !important;
	}

	.fs-12 {
		font-size: 24rpx;
		color: #A8956A;
		margin-top: 10rpx;
	}

	.wrap {
		padding: 40rpx 30rpx 0 30rpx;
		.title {
			font-size: 38rpx;
			font-weight: bold;
		}
		.title-small {
			color: #b8b8b8;
		}
		.interest-wrap {
			display: flex;
			justify-content: space-between;
			padding: 30rpx 40rpx;
			background-color: #F7DDA9;
			border-radius: 20rpx;
			margin-top: 10rpx;
			.item {
				display: flex;
				align-items: center;
				.icon-img {

					font-size: 60rpx;
				}
				.text {
					display: flex;
					flex-direction: column;
					color: #614A23;
				}
			}
		}
	}

	.card-container {
		padding: 40rpx 30rpx;
		.card-box {
			background-color: #fff;
			margin-bottom: 40rpx;
			border-radius: 20rpx;
			padding: 35rpx 20rpx;
			.card-top {
				display: flex;
				align-items: center;
				font-size: 28rpx;
				color: #999;
				.title {
					position: relative;
					font-size: 36rpx;
					color: #000;
					margin-right: 40rpx;
					&::after {
						position: absolute;
						content: '';
						right: -20rpx;
						top: 50%;
						transform: translateY(-50%);
						width: 2rpx;
						height: 30rpx;
						background-color: #999;
					}
				}
			}
			.service-bottom {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 20rpx;
				.service-bottom-l {
					width: 38%;
				}
				.service-bottom-r {
					// width: 58%;
					width: 100%;
					margin-left: 20rpx;
					.service-bottom-r-box {
						display: flex;
						justify-content: space-between;
						.service-bottom-r-item {
							display: flex;
							width: 30%;
							flex-direction: column;
							align-items: center;
							justify-content: center;
							padding: 16rpx 12rpx;
							box-sizing: border-box;
							white-space: nowrap;
							text {
								font-size: 60rpx;
							}
							view {
								font-size: 24rpx;
							}
						}
						.orange-bg {
							background-color: #FAF1E9;
							color: #F6883A;
						}
						.blue-bg {
							background-color: #EDF7FF;
							color: #4099EE;
						}
					}
					.service-bottom-r-b {
					}

				}
			}
			.recommend-bottom {
				display: -webkit-box;
				justify-content: space-between;
				margin-top: 20rpx;
				.recommend-bottom-l {
					width: 40%;
					margin-right: 20rpx;
					.swiper {
						height: 100%;
					}
					/deep/ .u-swiper-wrap {
						height: 100%;

					}

					// /deep/ swiper {
					// 	height: 100% !important;
					// }

					/deep/ uni-swiper {
						height: 100% !important;
					}


				}
				.recommend-bottom-r {
					width: 57.5%;
					height: 100%;
					.img {
						height: 100%;
						/deep/ .u-image__image {
							height: 100%;
						}
					}
					display: flex;
					flex-direction: column;
				}
			}
		}
	}

	.add {
		text-align: center;
		color: #999;
	}
}
</style>
