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

    <!--view v-for="(item, index) in noticeList" :key="index">
      <MsgNotice :itemStyle="item.style" :params="item.params" />
    </view-->

    <!-- 生活服务 -->
    <view class="my-service" v-for="(item, index) in lifeList.cate" :key="index">
      <view class="service-title">{{item.cate_name}}</view>
      <view class="service-content clearfix">
        <block v-for="(life, index2) in item.life_info" :key="index2">
          <view class="service-item" @click="handleLife(life)">
            <view class="">
              <view class="item-icon">
                <text class="wyiconfont" :class="[`icon-${life.life_icon}`]" :style="{color:`${life.life_icon_color}`}"></text>
              </view>
            </view>
            <view class="item-name">{{ life.life_name }}</view>
          </view>
        </block>
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
  import MsgNotice from '@/components/page/msgNotice/index.vue'
  import * as PageApi from '@/api/page'
  import * as LifeApi from "../../api/life/life";
	export default {
		components: {
			Search,
      MsgNotice
		},
		onLoad() {
      this.treeList()
			this.getPageData()
		},
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
      this.treeList()
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
        // 消息通知，消息题
        noticeList: [],
        // 生活服务
        lifeList: {},

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

      // 跳转到服务页面
      handleLife(item) {
        this.$navTo('pages/life/life/detail', {lifeId:item.life_id})
      },

      // 获取生活服务
      treeList() {
        LifeApi.treeList({}).then(res => {
          this.lifeList = res.data.list
          console.log(this.lifeList)
        }).catch(err => console.log('get notice catch', err))
      },

      // 设置tabbar 红点
      setTabBarRedDot(){
        let hasMsgNotice = false
        this.noticeList.forEach(item => {
          if (item.type === 'msgNotice') {
            hasMsgNotice = true
          }
        })
        if (hasMsgNotice) {
          uni.showTabBarRedDot({
            index: 1
          })
        } else {
          uni.hideTabBarRedDot({
            index: 1,
            fail(r) {
              console.log(r, 'false')
            }
          })
        }
      },

      getNotices(){
        let app = this
        let params = 'life'
        PageApi.notices(params).then(res => {
          app.noticeList = res.data
          app.setTabBarRedDot()
        }).catch(err => console.log('get notice catch', err))
      },

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
            // 设置tabbar角标
            // app.setTabBarRedDot()
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

			//跳转到保洁详情页面
			onDetail(lifeId) {
				this.$navTo('pages/life/life/detail', {lifeId})
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
		padding-top: 20rpx;
		padding-bottom: 30rpx;
	}

  // 我的服务
  .my-service {
    margin: 22rpx auto 22rpx auto;
    padding: 22rpx 0;
    width: 94%;
    box-shadow: 0 1rpx 5rpx 0px rgba(0, 0, 0, 0.05);
    border-radius: 5rpx;
    background: #fff;

    .service-title {
      padding: 20rpx 30rpx;
      font-size: 30rpx;
      font-weight: normal;
      color: #777;
    }

    .service-content {

      margin-bottom: -20rpx;

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
  }
}
</style>
