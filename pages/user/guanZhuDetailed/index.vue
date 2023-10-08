<template>
	<view class="wrap">
		<view class="top">
			<view class="top-left">
				<view class="" @click="showType = true">
					{{ typeText }}
					<u-icon class="down-icon" name="arrow-down-fill" size="24" color="#999"></u-icon>
				</view>
			</view>
			<view class="top-right">
				<view class="beginTime" @click="showBeginTime = true">
					{{ beginTime }}
					<u-icon class="down-icon" name="arrow-down-fill" size="24" color="#999"></u-icon>
				</view>
				至
				<view class="finishTime" @click="showFinishTime = true">
					{{ finishTime }}
					<u-icon class="down-icon" name="arrow-down-fill" size="24" color="#999"></u-icon>
				</view>
			</view>
		</view>

		<view class="content-box">
			<view class="item" v-for="(item,index) in pointList" :key="index">

			</view>
		</view>

		<view class="bill-item" v-if="isLogin">
			<view class="bill-list">
				<view class="bill_block">
					<view class="bill_block_content">
						<view v-if="pointList.length > 0">
							<view class="bill-order-item" v-for="(item, index) of pointList" :key="index">

								<view class="desc-point-wrap">
									<view class="desc">{{ item.describe }}</view>
									<view class="point">
										<text class="txt" v-if="item.value >= 0" style="color: #fdda72;">+{{ item.value }}</text>
										<text class="txt" v-else>{{ item.value }}</text>
									</view>
								</view>
								<!-- <view class="subtitle">
									<text v-if="item.value >= 0" class="log_tag">赚知珠</text>
									<text v-if="item.value < 0" class="log_tag">花知珠</text>
								</view> -->
								<view class="desc_bottom">
									<view class="time">{{ item.create_time }}</view>
									<view class="text">知珠余额 {{ item.balance }}</view>
								</view>


							</view>

							<view class="bottom-txt">
								<text>------ 已经到底了 ------</text>
							</view>
						</view>

						<view style="text-align: center;color: #C0C0C0" v-else>
							<text>暂无明细数据</text>
						</view>

					</view>
				</view>
			</view>
		</view>

		<!-- 选择类型 -->
		<u-action-sheet :list="list" v-model="showType" :cancel-btn="true" @click="clickType" :mask-close-able="false">
		</u-action-sheet>

		<!-- 开始时间 -->
		<u-picker mode="time" v-model="showBeginTime" :params="paramsTime" @confirm="selectBeginTime"
			:defaultTime="startTime"></u-picker>
		<!-- 结束时间 -->
		<u-picker mode="time" v-model="showFinishTime" :params="paramsTime" @confirm="selectFinishTime"
			:defaultTime="endTime"></u-picker>



	</view>
</template>

<script>
	import * as UserApi from '@/api/user'
	import {
		checkLogin,
	} from '@/core/app'

	export default {
		data() {
			return {
				list: [{
					text: '全部',
					value: 'all'
				}, {
					text: '赚知珠',
					value: 'zhuan'
				}, {
					text: '花知珠',
					value: 'hua'
				}],
				paramsTime: {
					year: true,
					month: true,
				},
				showType: false,
				showBeginTime: false,
				showFinishTime: false,
				type: 'all',
				typeText: '全部',
				beginTime: '2023-01',
				finishTime: '2023-03',
				startTime: '',
				endTime: '',
				pointList: [],
				// 是否已登录
				isLogin: false,
			}
		},
		onLoad() {
			this.setDefaultTime()
			this.getPoints()
			// 判断是否已登录
			this.isLogin = checkLogin()
		},
		watch: {
			endTime(val) {
				// this.beginTime = val
			},
			startTime(val) {
				// this.finishTime = val
			}
		},
		methods: {
			// 获取最近n个月时间
			getRecentThreeMonthDate(cha, hasDate) {
				var end = new Date();
				var year = end.getFullYear();
				var month = end.getMonth() + 1;
				var day = end.getDate();
				var dateObj = {};
				dateObj.end = this.formatDate(year, month, day, hasDate)
				var endMonthDay = new Date(year, month, 0).getDate();
				if (month - cha <= 0) {
					let mcha = Math.abs(month - cha)
					let mMonth = 0;
					let sYear = 1;
					if (mcha >= 12) {
						sYear = Math.floor(mcha / 12) + 1
						mMonth = 12 - Math.abs(12 - (cha - parseInt(month)))
						if (mMonth <= 0) {
							mMonth = 12
						}
					} else {
						mMonth = (12 - (cha - parseInt(month)))
					}
					var start3MonthDay = new Date((year - sYear), mMonth, 0).getDate();
					if (start3MonthDay < day) {
						dateObj.start = this.formatDate((year - sYear), mMonth, start3MonthDay, hasDate)
					} else {
						dateObj.start = this.formatDate((year - sYear), mMonth, day, hasDate)
					}
				} else {
					var start3MonthDay = new Date(year, (parseInt(month) - cha), 0).getDate();
					if (start3MonthDay < day) {
						if (day < endMonthDay) {
							dateObj.start = this.formatDate(year, (month - cha), (start3MonthDay - (endMonthDay - day)), hasDate)
						} else {
							dateObj.start = this.formatDate(year, (month - cha), start3MonthDay, hasDate)
						}
					} else {
						dateObj.start = this.formatDate(year, (month - cha), day, hasDate)
					}
				}
				return dateObj
			},
			// 格式化日期
			formatDate(y, m, d, hasDate) {
				if (m > 12) {
					m = m - 12
					//月份1-9月份加0
					if (m > 0 && m <= 9) {
						m = '0' + m
					}
				} else {
					if (m > 0 && m <= 9) {
						m = '0' + m;
					}
				}
				if (hasDate) {
					return y + '-' + m + '-' + d
				}
				return y + '-' + m;
			},
			// 默认日期
			setDefaultTime() {
				let dateObj = this.getRecentThreeMonthDate(2, false)
				this.beginTime = dateObj.start
				this.finishTime = dateObj.end
			},
			//选择类型
			clickType(index) {
				this.typeText = this.list[index].text
				this.type = this.list[index].value
				this.getPoints();
			},

			//选择结束时间
			selectBeginTime(e) {
				this.beginTime = e.year + '-' + e.month
				this.startTime = e.year + '-' + e.month
				this.getPoints();
			},

			//选择开始时间
			selectFinishTime(e) {
				this.finishTime = e.year + '-' + e.month
				this.endTime = e.year + '-' + e.month
				this.getPoints();
			},

			getPoints() {
				UserApi.pointsList({
					type: this.type,
					begin_time: this.beginTime,
					end_time: this.finishTime
				}).then(res => {
					this.pointList = res.data.list.data
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #fff;
	}

	.wrap {

		.top {
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1px solid #f1f1f1;
			padding: 0 30rpx 0 30rpx;
			height: 100rpx;
			background-color: #f7f7f7;

			.top-left {
				font-size: 32rpx;

				.down-icon {
					margin-left: 10rpx;
				}
			}

			.top-right {
				display: flex;
				align-items: center;

				.beginTime {
					display: flex;
					align-items: center;
					margin-right: 30rpx;
				}

				.finishTime {
					margin-left: 30rpx;
				}
			}
		}

		.bill-item {

			.bill_block {

				background-color: #fff;
				padding: 0 30rpx;

				.bill_block_title {
					padding: 10rpx 0;
				}

				.bill_block_content {

					.bottom-txt {
						text-align: center;
						color: #C0C0C0;
						font-size: 28rpx;
						padding: 40rpx 0;
					}

				}

				.bill_block_tips {
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
					flex-direction: column;
					justify-content: space-between;
					background-color: #fff;
					padding: 30rpx 0;
					border-bottom: 1rpx solid #f2f2f2;

					&+.bill-order-item {}

					.desc-point-wrap {
						width: 100%;
						display: flex;
						justify-content: space-between;

						.desc {
							font-size: 32rpx;
						}

						.point {
							color: #BA8C4F;
							display: flex;
							align-items: center;

							// .txt {
							// 	font-size: 40rpx;
							// 	margin-right: 8rpx;
							// }
							.txt {
								color: #333;
								font-size: 32rpx;
								margin-right: 8rpx;
							}

						}
					}

					.subtitle {
						color: #5B5B5B;
						margin: 14rpx 0;

						.log_tag {
							color: #999;
						}
					}

					.desc_bottom {
						display: flex;
						justify-content: space-between;
						margin-top: 16rpx;

						.time {
							font-size: 26rpx;
							color: #ADADAD;
						}

						.text {
							font-size: 26rpx;
							color: #ADADAD;
						}
					}

					.no_pay {
						color: #FFFFFF;
						background-color: #007AFF;
						border-radius: 10rpx;
					}

					.pay {
						color: #FFFFFF;
						background-color: #aaaa7f;
						border-radius: 10rpx;
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

			}


		}

	}
</style>