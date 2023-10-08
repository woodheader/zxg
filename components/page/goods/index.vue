<template>
	<!-- 商品组 -->
	<view class="diy-goods" :style="{ background: itemStyle.background }">
		<view class="goods-list" :class="[`display__${itemStyle.display}`, `column__${itemStyle.column}`]">
			<scroll-view :scroll-x="itemStyle.display === 'slide'">
				<view class="goods-item" v-for="(dataItem, index) in dataList" :key="index"
					@click="onTargetGoods(dataItem.goods_id)">

					<!-- 单列商品 -->
					<block v-if="itemStyle.column === 1">
						<view class="dis-flex">
							<view class="goods-mask-single" v-if="dataItem.stock_total <= 0">
								<text class="wyiconfont icon-lianxi-yishouqing"></text>
							</view>
							<!-- 商品图片 -->
							<view class="goods-item_left">
								<image class="image" :src="dataItem.goods_image"></image>
							</view>
							<view class="goods-item_right">
								<!-- 商品名称 -->
								<view v-if="itemStyle.show.includes('goodsName')" class="goods-name">
									<text class="twoline-hide">{{ dataItem.goods_name }}</text>
								</view>
								<view class="goods-item_desc">
									<!-- 商品卖点 -->
									<view v-if="itemStyle.show.includes('sellingPoint')"
										class="desc-selling_point dis-flex">
										<text class="oneline-hide">{{ dataItem.selling_point }}</text>
									</view>
									<!-- 商品销量 -->
									<view v-if="itemStyle.show.includes('goodsSales')"
										class="desc-goods_sales dis-flex">
										<text>已售{{ dataItem.goods_sales }}件</text>
									</view>
									<!-- 商品价格 -->
									<view class="desc_footer">
										<text v-if="itemStyle.show.includes('goodsPrice')"
											class="price_x">¥{{ dataItem.goods_price_min }}</text>
										<text class="price_y col-9"
											v-if="itemStyle.show.includes('linePrice') && dataItem.line_price_min > 0">¥{{ dataItem.line_price_min }}</text>
									</view>
									<view style="margin: 10rpx 0">
										<text v-if="dataItem.is_points_gift==1"
											style="background-color: #fff;color: #d55852;padding: 2rpx 7rpx;border-radius: 7rpx;border: 1px solid #d55852;">
											送知珠:{{(dataItem.goods_price_min*dataItem.gift_ratio/100).toFixed(2)}}
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
					<!-- 多列商品 -->
					<block v-else>
							<view class="goods-mask" v-if="dataItem.stock_total <= 0">
								<text class="wyiconfont icon-lianxi-yishouqing"></text>
							</view>
							<!-- 商品图片 -->
							<view class="goods-image">
								<u-image class="image" mode="aspectFill" height="100%" :src="dataItem.goods_image"></u-image>
								<!-- <image class="image " mode="aspectFill" :src="dataItem.goods_image"></image> -->
							</view>
							<view class="detail">
								<!-- 商品标题 -->
								<view v-if="itemStyle.show.includes('goodsName')" class="goods-name">
									<text class="twoline-hide">{{ dataItem.goods_name }}</text>
								</view>
								<!-- 商品价格 -->
								<view class="detail-price oneline-hide">
									<text v-if="itemStyle.show.includes('goodsPrice')"
										class="goods-price f-30 col-m">￥{{ dataItem.goods_price_min }}</text>
									<text v-if="itemStyle.show.includes('linePrice') && dataItem.line_price_min > 0"
										class="line-price col-9 f-24">￥{{ dataItem.line_price_min }}</text>
								</view>
								<view style="margin: 10rpx 0">
									<text v-if="dataItem.is_points_gift==1"
										style="background-color: #fff;color: #d55852;padding: 2rpx 7rpx;border-radius: 7rpx;border: 1px solid #d55852;">
										送知珠:{{(dataItem.goods_price_min*dataItem.gift_ratio/100).toFixed(2)}}
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
		name: "Goods",
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
			 * 跳转商品详情页
			 */
			onTargetGoods(goodsId) {
				this.$navTo(`pages/goods/detail`, {
					goodsId
				})
			}

		}

	}
</script>

<style lang="scss" scoped>
	.diy-goods {
		.goods-list {
			padding: 4rpx;
			box-sizing: border-box;

			.goods-item {
				box-sizing: border-box;
				padding: 6rpx;
				
				.goods-mask-single {
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
				
				.goods-mask {
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

				.goods-image {
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

					.goods-name {
						min-height: 68rpx;
						line-height: 1.5;
						white-space: normal;
						color: #484848;
						font-size: 32rpx;
						letter-spacing: 1rpx;
					}

					.detail-price {
						.goods-price {
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

				.goods-item {
					display: inline-block;
				}
			}

			&.display__list {
				.goods-item {
					float: left;
				}
			}

			&.column__2 {
				.goods-item {
					width: 50%;
				}
			}

			&.column__3 {
				.goods-item {
					width: 33.33333%;
				}
			}

			&.column__1 {
				.goods-item {
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

				.goods-item_left {
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

				.goods-item_right {
					position: relative;
					width: 60%;

					.goods-name {
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

				.goods-item_desc {
					margin-top: 8rpx;
				}

				.desc-selling_point {
					width: 400rpx;
					font-size: 24rpx;
					color: #e49a3d;
				}

				.desc-goods_sales {
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
