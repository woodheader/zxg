<template>
	<view class="payment-wrap">
		<view class="" v-if="!isFirstload">
			<view class="" v-if="wy_role_name != '普通用户'">

				<!--  -->
				<view class="bill-wrap">
					<view class="bill-item" v-if="isLogin">
						<view class="bill-title" @click="showList = true">
							<view class="left">
								<text class="wy-time">{{billList[currentRoomIndex].village_name}} {{billList[currentRoomIndex].room}}</text>
							</view>
							<view class="right">
								<u-icon name="arrow-down-fill"></u-icon>
							</view>
						</view>

						<view class="bill_block">
							<view class="bill_block_title">
								房间信息：
							</view>
							<view class="bill_block_content">
								<view class="house-wrap">
									<view class="house-item">
										<text class="bill_block_tips">小区：</text>
										{{ billList[currentRoomIndex].province }}{{ billList[currentRoomIndex].city }}{{ billList[currentRoomIndex].district }}{{ billList[currentRoomIndex].village_name }} 
									</view>
								</view>
								<view class="house-wrap">
									<view class="house-item">
										<text class="bill_block_tips">房号：</text>
										{{ billList[currentRoomIndex].room }}
									</view>
									<view class="house-item"><text class="bill_block_tips">房屋面积：</text>{{ billList[currentRoomIndex].room_size }}㎡</view>
								</view>
								<view class="house-wrap">
									<view class="house-item"><text class="bill_block_tips">收房时间：</text>{{ billList[currentRoomIndex].first_time }}年</view>
									<view class="house-item"><text class="bill_block_tips">物业单价：</text>{{ billList[currentRoomIndex].wyf_unit_price }}元/㎡/月</view>
								</view>
								<view class="house-wrap">
									<view class="house-item"><text class="bill_block_tips">垃圾费：</text>{{ billList[currentRoomIndex].lj_price }}元/户/年</view>
								</view>
							</view>
							
						</view>

						<view class="bill-list">
							<view class="bill_block">
								<view class="bill_block_title">
									物业账单：
								</view>
								<view class="bill_block_content">
									<view class="bill-order-item">
										<view>账单时间</view>
										<view>缴费金额(元)</view>
										<view>送知珠(个)</view>
										<view>缴费状态</view>	
									</view>
									<view  v-if="billList[currentRoomIndex].bills.length > 0">
										<!-- 查看已缴费 -->
										<view class="yPayList-box">
											<view class="y-pay">
												<view class="y-pay-list" @click="lookPay" v-if="!yPlay">
													查看已缴费账单
												</view>
												<view class="y-pay-list2" @click="hiddenPay" v-else>
													收起已缴费账单
												</view>
											</view>
											<view class="bill-order-item"
												:class="{'bill-order-item-no-border':index === billList[currentRoomIndex].bills.length - 1}"
												v-for="(item,index) of billList[currentRoomIndex].bills" :key="index"
												v-if="item.pay_status === 'YES' && yPlay == true">
												
												<view> {{ item.wy_time }}</view>
												<view> ¥{{ item.amount }}</view>
												<view>{{item.send_points}}</view>
												<view class="info-wrap-r">
													<wy-button v-if="item.pay_status === 'NO'" :padding="0" @click="pay(item)">立即缴费</wy-button>
													<view v-else class="pay" @click="payInfo(item)">已缴费</view>
												</view>
											</view>
										</view>
										<view class="bill-order-item"
											:class="{'bill-order-item-no-border':index === billList[currentRoomIndex].bills.length - 1}"
											v-for="(item,index) of billList[currentRoomIndex].bills" :key="index"
											v-if="item.pay_status === 'NO'">
											
											<view> {{ item.wy_time }}</view>
											<view> ¥{{ item.amount }}</view>
											<view>{{item.send_points}}</view>
											<view class="info-wrap-r">
												<!-- <view class="no_pay" v-if="item.pay_status === 'NO'" @click="pay(item)">
													立即缴费</view> -->
												<wy-button v-if="item.pay_status === 'NO'" :padding="0" @click="pay(item)">立即缴费</wy-button>
												<view v-else class="pay" @click="payInfo(item)">已缴费</view>
											</view>
										</view>
									</view>

									<view style="text-align: center;color: #C0C0C0" v-else>
										<text>暂无未缴费账单</text>
									</view>

								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- //选择房间列表 -->
				<u-select v-model="showList" mode="single-column" :list="billList" @confirm="confirmList"></u-select>
			</view>


			<view v-else>
				<u-modal v-model="showToBind" title="温馨提示" :show-cancel-button="false" @confirm="toIndex" @cancel="toIndex"
					 cancel-text="回首页">
					<view class="toBind">您还没有自己的房屋</view>
					<view class="toBind2">(房屋绑定手机和登录手机须一致)</view>
				</u-modal>
			</view>
		</view>

		<!--u-modal v-model="useUserPointsModal" title="使用账户知珠" :show-cancel-button="true" @confirm="usePointsConfirm()" 
			confirm-text='确认'>
			<view class="usePoints">
				  <text class="points-money col-m">-￥{{needToPayPoints}}</text>
				  <u-switch v-model="isUsePoints" size="48" active-color="#07c160" @change="useIt()"></u-switch>
			</view>
			<view class="needToPayDesc">
				<text class="pay-desc col-m">微信支付金额：￥{{needToPayActure}}</text>
			</view>
			<view class="usePointsDesc">
				<text class="points-desc">使用知珠抵扣，需最低支付0.01元</text>
			</view>
		</u-modal-->
		
		<u-modal v-model="useUserPointsModal" :title="`物业账单详情-${needToPayDate}年`" :show-cancel-button="true" @confirm="usePointsConfirm()"
			confirm-text='支付'>
			<view class="container">
			  <!-- 商品金额 -->
			  <view class="flow-all-money b-f" style="margin: 28rpx;">
			    <view class="flow-all-list dis-flex">
			      <text class="flex-five">账单总金额：</text>
			      <view class="flex-five t-r">
			        <text class="col-m">￥{{ needToPayTotalAmount }}</text>
			      </view>
			    </view>
			    
			    <!-- 积分抵扣 -->
			    <view class="points flow-all-list dis-flex flex-y-center">
			      <view class="block-left flex-five" @click="handleShowPoints()">
			        <text class="title">可用知珠抵扣：</text>
			      </view>
			      <view class="flex-five dis-flex flex-x-end flex-y-center">
			        <text class="points-money col-m">-￥{{ needToPayPoints }}</text>
			        <u-switch v-model="isUsePoints" size="48" active-color="#07c160" @change="useIt()"></u-switch>
			      </view>
			    </view>
				
				<view class="flow-all-list dis-flex">
				  <text class="flex-five">实付款：</text>
				  <view class="flex-five t-r">
				    <text class="col-m">￥{{ needToPayActure }}</text>
				  </view>
				</view>
				<view class="usePointsDesc">
					<text class="points-desc">使用知珠抵扣，需最低支付0.01元</text>
				</view>
			  </view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import store from '@/store'
	import * as UserApi from '@/api/user'

	import {
		checkLogin,
		wxPayment
	} from '@/core/app'
	export default {
		data() {
			return {
				showToBind: true,
				yPlay: false,
				noPayList: {
					list: [],
					room: {}
				},
				billList: [{
					bills: []
				}],
				payList: [],
				// screeningList: [],
				params: {
					year: true,
				},
				selectMonth: '',
				// 是否已登录
				isLogin: false,
				// 正在加载
				isLoading: true,
				// 首次加载
				isFirstload: true,
				wy_role_name: '',
				//弹出选择房间
				showList: false,
				//切换房间索引
				currentRoomIndex: 0,
				// 使用账户知珠弹窗
				useUserPointsModal: false,
				// 使用账户知珠开关
				isUsePoints: false,
				// 正在支付的账单ID
				billId: 0,
				// 当前用户的账户剩余积分
				userPoints: 0,
				// 知珠可抵扣的物业费
				needToPayPoints: 0,
				// 实际支付的金额
				needToPayActure: 0,
				// 账单总金额
				needToPayTotalAmount: 0,
				// 账单时间
				needToPayDate: ''
			}
		},
		onLoad() {
		},
		onShow() {
			// this.screeningList[0] = this.billList[0]
			this.onRefreshPage()
		},
		methods: {
			pay(item) {
				this.useUserPointsModal = true
				this.billId = item.bill_id
				this.isUsePoints = false
				this.needToPayTotalAmount = item.amount
				// 积分数量大于账单金额，则至少需要支付0.01元，其余是知珠抵扣数量
				this.userPoints = parseFloat(this.userPoints)
				this.needToPayPoints = this.userPoints
				if (this.userPoints > item.amount) {
					this.needToPayPoints = item.amount - 0.01
				}
				// 实际需要支付的金额
				this.needToPayActure = item.amount
				this.needToPayDate = item.wy_time
				// 同时调起订阅消息授权
				/*let tmpIds = ['ZYXlaNqABlMxuac5_AGIgLhf3lxrOPBfYFldvHoMsOk', 'Vq3IZLNLg6mr4WGiRqJzeMwo98xLjZ6N9JhnqNfYUDo']
				uni.requestSubscribeMessage({
					tmplIds: tmpIds,
					success: function (res) {
						if (res.errMsg !== 'requestSubscribeMessage:ok') {
							console.log('获取授权失败.'+res.errMsg)
						} else {
							console.log(res)
							console.log('获取授权成功')
						}
					}
				})*/
			},
			usePointsConfirm() {
				let billId = this.billId
				let usePoint = this.isUsePoints
				UserApi.billPay({
					billId,
					usePoint
				}).then(result => {
					wxPayment(result.data.payment)
						.then(() => app.$success('支付成功'))
						.catch(err => app.$error('订单未支付'))
						.finally(() => {
							this.onRefreshPage()
						})
				})
			},
			useIt() {
				this.isUsePoints = this.isUsePoints ? true : false
				if (this.isUsePoints) {
					this.needToPayActure = this.needToPayTotalAmount - this.needToPayPoints
					this.needToPayActure = this.needToPayActure.toFixed(2)
				} else {
					this.needToPayActure = this.needToPayTotalAmount
				}
			},
			// 已支付查看详情
			payInfo(bill) {
				let bill_info = JSON.stringify(bill)
				this.$navTo('pages/payment/recordDetail/index',{
					bill_info
				})
			},
			//刷新页面
			onRefreshPage() {
				this.showToBind = true
				// 判断是否已登录
				this.isLogin = checkLogin()
				// 获取页面数据
				this.getPageData()
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

			// 获取页面数据
			getPageData(callback) {
				const app = this
				app.getUserInfo().then(res => {
					app.getPayList()
					this.isFirstload = false
				})
				if (callback) {
					setTimeout(callback, 1000)
				}
			},


			// 获取当前用户信息
			getUserInfo() {
				const app = this
				return new Promise((resolve, reject) => {
					!app.isLogin ? resolve(null) : UserApi.info({}, {
							load: app.isFirstload
						})
						.then(result => {
							resolve(result)
							this.wy_role_name = result.data.userInfo.wy_role_name
							this.userPoints = result.data.userInfo.points
						})
						.catch(err => {
							if (err.result && err.result.status == 401) {
								app.isLogin = false
								resolve(null)
							} else {
								// reject(err)
							}
						})
				})
			},

			//获取未缴费账单列表
			getPayList() {
				if (this.wy_role_name == '普通用户') {
					return
				} else {
					UserApi.bill({}).then(result => {
						result.data.map((item, index) => {
							item.label = item.village_name +' | '+ item.room 
							item.value = index
						})
						this.billList = result.data
					})
				}

			},
			
			confirmList(e) {
				this.currentRoomIndex = e[0].value
			},
			
			lookPay() {
				this.yPlay = true
			},
			
			hiddenPay() {
				this.yPlay = false
			},

			// 跳转支付详情
			onTargetPay(billId) {
				this.$navTo('pages/payment/payDetail/index', {
					billId
				})
			},
			//跳转我的页面
			toBind() {
				this.$navTo('pages/user/addRoom/index')
			},
			//回首页
			toIndex() {
				this.$navTo('pages/index/index')
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "../checkout/style.scss";
	.payment-wrap {
		// padding: 40rpx;

		.pay-wrap {
			margin-top: 32rpx;
			background-color: #fff;
			border-radius: 20rpx;

			.info-title {
				position: relative;
				padding: 30rpx 0 30rpx 40rpx;
				border-bottom: 1px solid #f2f2f2;

				&::before {
					position: absolute;
					content: '';
					left: 0;
					top: 50%;
					transform: translateY(-50%);
					width: 8rpx;
					height: 30rpx;
					background-color: rgb(250, 34, 9);
				}
			}

			.info-wrap {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 50rpx;

				.info-wrap-l {
					display: flex;
					align-items: center;

					.img {
						margin-right: 20rpx;
					}

					.user {
						.num {
							display: flex;
							font-size: 24rpx;
							color: #999;

							view {
								padding: 0 10rpx;
							}

							.item {
								position: relative;

								&::after {
									position: absolute;
									content: '';
									right: 0;
									top: 50%;
									transform: translateY(-50%);
									width: 2rpx;
									height: 24rpx;
									background-color: #999;
								}
							}

							.user-code {
								position: relative;

								&::after {
									position: absolute;
									content: '';
									right: 0;
									top: 50%;
									transform: translateY(-50%);
									width: 2rpx;
									height: 24rpx;
									background-color: #999;
								}
							}
						}
					}
				}

			}

		}


		.bill-wrap {
			// margin-top: 20rpx;

			.bill-item {

				.bill_block {
					margin-top: 20rpx;
					background-color: #fff;
					padding: 30rpx 30rpx;
					border-bottom: 1px solid #f2f2f2;

					.bill_block_title {
						padding: 10rpx 0;
						font-weight: bold;
					}

					.bill_block_content {
						padding: 20rpx;
						border: 1px solid #f2f2f2;
						border-radius: 10rpx;
						
						.yPayList-box {
							
						}
						
						.y-pay {
							text-align: center;
							margin-top: 15rpx;
							color: #c2bfba;
							.y-pay-list2 {
								
							}
						}
						
						.bill_block_item {
							padding: 10rpx 0;
						}
						
						.house-wrap {
							display: flex;
							justify-content: space-between;
							position: relative;
							margin-top: 40rpx;
							
							.house-item {
								flex: 1;
								display: flex;
								align-items: center;
								color: #303133;
							}
							
							.bill_block_tips{
								display: inline-block;
								width: 160rpx;
							}
							
						}
					}
					
					.bill_block_tips{
						display: inline-block;
						width: 150rpx;
					}
					
				}


				.bill-title {
					display: flex;
					justify-content: space-between;
					position: relative;
					background-color: #fff;
					padding: 30rpx 30rpx;
					border-bottom: 1px solid #f2f2f2;

					.left {
						.item {

							&+.item {
								margin-left: 10rpx;
							}

						}

						.wy-time {}
					}

					.right {}
				}

				.bill-list {
					// margin-top: 32rpx;
					// border-radius: 120rpx;
					.bill-order-item {
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding: 10rpx 0;
						background-color: #fff;
						line-height: 50px;
						border-bottom: 1px solid #f2f2f2;

						view{
							flex: 1;
							text-align: center;
						}
						
						.no_pay{
								color: #007AFF;
								background-color: #FFFFFF;
								border-radius: 10rpx;
								border: 1px solid;
								line-height: 70rpx;
						}
						.pay{
							color: #c2bfba;	
							background-color: #FFFFFF;
							border-radius: 10rpx;
							border: 1px solid #007AFF;
						}
						
						.title {
							.title-item {
								display: flex;
								font-size: 24rpx;
								color: #999;

								.item {
									padding-right: 10rpx;
									position: relative;

									&::after {
										position: absolute;
										content: '';
										right: 0;
										top: 50%;
										transform: translateY(-50%);
										width: 2rpx;
										height: 24rpx;
										background-color: #999;
									}

									&+.item {
										margin-left: 10rpx;
									}

									&:last-child::after {
										display: none;
									}

								}

								&+.title-item {
									margin-top: 10rpx;
								}

							}

							.price-wrap {
								margin-top: 20rpx;
								font-weight: 700;

								.price {
									color: #f00;
								}

								.guanzhu {
									color: #f00;
									font-size: 24rpx;
									margin-left: 20rpx;
								}
							}

						}


						&+.bill-item {
							margin-top: 20rpx;
						}

					}
					.bill-order-item-no-border {
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding: 10rpx 0;
						background-color: #fff;
						line-height: 50px;
						border-bottom: none;
					}

				}


			}

		}

		.record_box {
			.bill-list {
				// margin-top: 32rpx;
				// border-radius: 120rpx;

				.bill-order-item {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 30rpx;
					background-color: #fff;


					.title {
						.title-item {
							display: flex;
							font-size: 24rpx;
							color: #999;

							.item {
								padding-right: 10rpx;
								position: relative;

								&::after {
									position: absolute;
									content: '';
									right: 0;
									top: 50%;
									transform: translateY(-50%);
									width: 2rpx;
									height: 24rpx;
									background-color: #999;
								}

								&+.item {
									margin-left: 10rpx;
								}

								&:last-child::after {
									display: none;
								}

							}

							&+.title-item {
								margin-top: 10rpx;
							}

						}

						.price-wrap {
							margin-top: 20rpx;
							font-weight: 700;

							.price {
								color: #f00;
							}

							.guanzhu {
								color: #f00;
								font-size: 24rpx;
								margin-left: 20rpx;
							}
						}

					}


					&+.bill-item {
						margin-top: 20rpx;
					}

				}

			}
		}

		.record {
			margin-top: 40rpx;
		}

		.select-time-wrap {
			margin-top: 20rpx;

			.record-box {
				display: flex;

				.select-time {
					margin-right: 16rpx;
				}
			}

			.select-list-wrap {
				background-color: #fff;
				margin-top: 20rpx;

				.select-list-box {
					display: flex;
					justify-content: space-between;
					padding: 40rpx;
					border-bottom: 2rpx solid #f2f2f2;

					.select-list-l {
						display: flex;
						align-items: center;

						.img-box {
							margin-right: 20rpx;
						}

						.name {
							font-size: 28rpx;
						}

						.account-no {
							font-size: 24rpx;
							color: #999;
							padding: 14rpx 0;
						}

						.time {
							font-size: 24rpx;
							color: #999;
						}
					}

					.select-list-r {
						font-size: 32rpx;
						font-weight: 600;
					}
				}
			}
		}

		.toBind {
			text-align: center;
			padding: 40rpx 0 14rpx 0;
			font-weight: 700;
		}
		.toBind2 {
			text-align: center;
			padding: 0rpx 0 26rpx 0;
		}
		.usePoints {
			text-align: center;
			padding: 40rpx 0;
			font-weight: 700;
			align-items: center;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			.points-money {
			  margin-right: 20rpx;
			}
		}
		.usePointsDesc {
			text-align: center;
			font-weight: 200;
			align-items: center;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			.points-desc {
				font-size: 20rpx;
			}
		}
		.needToPayDesc {
			text-align: center;
			padding-bottom: 40rpx;
			font-weight: 700;
			align-items: center;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			.pay-desc {
				font-size: 24rpx;
				color: red;
			}
		}
	}
</style>
