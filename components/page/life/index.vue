<template>
	<!-- 服务组 -->
	<view class="diy-life" :style="{ background: itemStyle.background }">
		<view class="life-list" :class="[`display__${itemStyle.display}`, `column__${itemStyle.column}`]">
			<scroll-view :scroll-x="itemStyle.display === 'slide'">
				<view class="life-item" v-for="(dataItem, index) in dataList" :key="index"
					@click="onTargetLife(dataItem.life_id)">

					<!-- 单列服务 -->
					<block v-if="itemStyle.column === 1">
						<view class="dis-flex">
							<view class="life-mask-single" v-if="dataItem.stock_total <= 0">
								<text class="wyiconfont icon-lianxi-yishouqing"></text>
							</view>
							<!-- 服务图片 -->
							<view class="life-item_left">
								<image class="image" :src="dataItem.life_image"></image>
							</view>
							<view class="life-item_right">
								<!-- 服务名称 -->
								<view v-if="itemStyle.show.includes('lifeName')" class="life-name">
									<text class="twoline-hide">{{ dataItem.life_name }}</text>
								</view>
								<view class="life-item_desc">
									<!-- 服务卖点 -->
									<view v-if="itemStyle.show.includes('sellingPoint')"
										class="desc-selling_point dis-flex">
										<text class="oneline-hide">{{ dataItem.selling_point }}</text>
									</view>
									<!-- 服务销量 -->
									<view v-if="itemStyle.show.includes('lifeSales')"
										class="desc-life_sales dis-flex">
										<text>已售{{ dataItem.life_sales }}件</text>
									</view>
									<!-- 服务价格 -->
									<view class="desc_footer">
										<text v-if="itemStyle.show.includes('lifePrice')"
											class="price_x">¥{{ dataItem.life_price_min }}</text>
										<text class="price_y col-9"
											v-if="itemStyle.show.includes('linePrice') && dataItem.line_price_min > 0">¥{{ dataItem.line_price_min }}</text>
									</view>
									<view style="margin: 10rpx 0">
										<text v-if="dataItem.is_points_gift==1"
											style="background-color: #fff;color: #d55852;padding: 2rpx 7rpx;border-radius: 7rpx;border: 1px solid #d55852;">
											送知珠:{{(dataItem.life_price_min*dataItem.gift_ratio/100).toFixed(2)}}
										</text>
										<text v-if="dataItem.is_tejia==1"
											style="background-color: #fff;color: #d55852;padding: 2rpx 7rpx;border-radius: 7rpx;border: 1px solid #d55852;margin-left: 10rpx;">
											限时特价
										</text>
									</view>
								</view>
							</view>
						</view>
					</block>
					<!-- 多列服务 -->
					<block v-else>
							<view class="life-mask" v-if="dataItem.stock_total <= 0">
								<text class="wyiconfont icon-lianxi-yishouqing"></text>
							</view>
							<!-- 服务图片 -->
							<view class="life-image">
								<u-image class="image" mode="aspectFill" height="100%" :src="dataItem.life_image"></u-image>
								<!-- <image class="image " mode="aspectFill" :src="dataItem.life_image"></image> -->
							</view>
							<view class="detail">
								<!-- 服务标题 -->
								<view v-if="itemStyle.show.includes('lifeName')" class="life-name">
									<text class="twoline-hide">{{ dataItem.life_name }}</text>
								</view>
								<!-- 服务价格 -->
								<view class="detail-price oneline-hide">
									<text v-if="itemStyle.show.includes('lifePrice')"
										class="life-price f-30 col-m">￥{{ dataItem.life_price_min }}</text>
									<text v-if="itemStyle.show.includes('linePrice') && dataItem.line_price_min > 0"
										class="line-price col-9 f-24">￥{{ dataItem.line_price_min }}</text>
								</view>
								<view style="margin: 10rpx 0">
									<text v-if="dataItem.is_points_gift==1"
										style="background-color: #fff;color: #d55852;padding: 2rpx 7rpx;border-radius: 7rpx;border: 1px solid #d55852;">
										送知珠:{{(dataItem.life_price_min*dataItem.gift_ratio/100).toFixed(2)}}
									</text>
									<text v-if="dataItem.is_tejia==1"
										style="background-color: #fff;color: #d55852;padding: 2rpx 7rpx;border-radius: 7rpx;border: 1px solid #d55852;margin-left: 10rpx;">
										限时特价
									</text>
								</view>
							</view>
					</block>

				</view>

			</scroll-view>
		</view>


	</view>
</template>

<script>
	export default {
		name: "Life",
		/**
		 * 组件的属性列表
		 * 用于组件自定义设置
		 */
		props: {
			itemIndex: String,
			itemStyle: Object,
			params: Object,
			dataList: Array
		},

		data() {
			return {
				loading: true
			}
		},

		/**
		 * 组件的方法列表
		 * 更新属性和数据的方法与更新页面数据的方法类似
		 */
		methods: {

			/**
			 * 跳转服务详情页
			 */
			onTargetLife(lifeId) {
				this.$navTo(`pages/life/life/detail`, {
					lifeId
				})
			},

		}

	}
</script>

<style lang="scss" scoped>
	.diy-life {
		.life-list {
			padding: 4rpx;
			box-sizing: border-box;

			.life-item {
				box-sizing: border-box;
				padding: 6rpx;

				.life-mask-single {
					position: absolute;
					background-color: #eee;
					opacity: .7;
					z-index: 997;
					display: flex;
					.wyiconfont {
						font-size: 120rpx;
						margin-top:-3rpx;
						position: absolute;
					}
				}

				.life-mask {
					position: absolute;
					background-color: #eee;
					opacity: .7;
					z-index: 997;
					display: flex;
					.wyiconfont {
						font-size: 200rpx;
						margin-top:-8rpx;
						position: absolute;
					}
				}

				.life-image {
					position: relative;
					width: 100%;
					height: 0;
					padding-bottom: 100%;
					overflow: hidden;
					background: #fff;

					&:after {
						content: '';
						display: block;
						margin-top: 100%;
					}

					.image {
						position: absolute;
						width: 100%;
						height: 100%;
						top: 0;
						left: 0;
						-o-object-fit: cover;
						object-fit: cover;
					}
				}

				.detail {
					padding: 8rpx;
					background: #fff;

					.life-name {
						min-height: 68rpx;
						line-height: 1.5;
						white-space: normal;
						color: #484848;
						font-size: 32rpx;
						letter-spacing: 1rpx;
					}

					.detail-price {
						.life-price {
							margin-right: 8rpx;
						}

						.line-price {
							text-decoration: line-through;
						}
					}
				}
			}

			&.display__slide {
				white-space: nowrap;
				font-size: 0;

				.life-item {
					display: inline-block;
				}
			}

			&.display__list {
				.life-item {
					float: left;
				}
			}

			&.column__2 {
				.life-item {
					width: 50%;
				}
			}

			&.column__3 {
				.life-item {
					width: 33.33333%;
				}
			}

			&.column__1 {
				.life-item {
					width: 100%;
					/*height: 280rpx;*/
					margin-bottom: 12rpx;
					padding: 20rpx;
					box-sizing: border-box;
					background: #fff;
					line-height: 1.6;

					&:last-child {
						margin-bottom: 0;
					}
				}

				.life-item_left {
					display: flex;
					width: 40%;
					background: #fff;
					align-items: center;

					.image {
						display: block;
						width: 240rpx;
						height: 240rpx;
					}
				}

				.life-item_right {
					position: relative;
					width: 60%;

					.life-name {
						margin-top: 20rpx;
						min-height: 68rpx;
						line-height: 1.5;
						white-space: normal;
						color: #484848;
						line-height: 1.5;
						font-size: 32rpx;
						letter-spacing: 1rpx;
					}
				}

				.life-item_desc {
					margin-top: 8rpx;
				}

				.desc-selling_point {
					width: 400rpx;
					font-size: 24rpx;
					color: #e49a3d;
				}

				.desc-life_sales {
					color: #999;
					font-size: 24rpx;
				}

				.desc_footer {
					font-size: 24rpx;

					.price_x {
						margin-right: 16rpx;
						color: #f03c3c;
						font-size: 30rpx;
					}

					.price_y {
						text-decoration: line-through;
					}
				}
			}
		}


		.loading {

		}
	}
</style>
