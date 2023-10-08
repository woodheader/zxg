<template>
	<view class="record-box">
		<view class="top">
			<view class="icon">
				<u-icon name="rmb-circle" color="#ccc" size="80"></u-icon>
			</view>
			<view class="price">
				￥ {{bill_info.amount}}
			</view>
		</view>
		<view class="record-detail">
			<view class="price spacing">
				<view class="record-detail-title">缴费状态</view>	
				<span v-if="bill_info.pay_status == 'YES'">缴费成功</span>
				<span v-else>未缴费</span>
			</view>
			<view class="name spacing">
				<view class="record-detail-title">缴费用户</view><span>{{bill_info.pay_user_role}}</span>
			</view>
			<view class="account-no spacing">
				<view class="record-detail-title">缴费户号</view><span>{{bill_info.room}}</span>
			</view>
			<view class="unit spacing">
				<view class="record-detail-title">知珠赠送</view> <span>{{bill_info.send_points}}个</span>
			</view>
			<view class="unit spacing">
				<view class="record-detail-title">发票下载</view> 
				<span><a href="javascript:void(0)" @click="downloadBillImg(bill_info.bill_img)" style="color: blue;">点击下载</a></span>
			</view>
			<view class="address spacing">
				<view class="record-detail-title">交易时间</view> <span>{{bill_info.pay_time}}</span>
			</view>
			<view class="tel spacing">
				<view class="record-detail-title">交易单号</view> <span>{{bill_info.pay_id}}</span>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bill_info: {}
			}
		},
		created () {
		},
		onLoad(options) {
			this.bill_info = JSON.parse(options.bill_info)
		},
		methods: {
			openSetting () {
				uni.openSetting({
					success(res) {
						uni.showToast({
							icon: 'success',
							title: '授权成功'
						})
					}
				});
			},
			downloadBillImg (img) {
				if (img === '') {
					uni.showToast({
						icon: 'none',
						title: '发票生成中，请稍后下载'
					})
					return false
				}
				let that = this
				uni.getSetting({
					success(res) {
						if (!res.authSetting['scope.writePhotosAlbum']) {
							uni.authorize({
								scope: 'scope.writePhotosAlbum',
								success(res) {
									that.saveBillImg(img)
								},
								fail(err) {
									uni.showModal({
										title: '温馨提示',
										content: '检测到您没有授权保存图片到相册，为了更好的体验，请前往设置授权',
										success: function(res) {
											if (res.confirm) {
												that.openSetting()
											} else if (res.cancel) {
												console.log('用户点击取消');
											}
										}
									});
								}
							})
						} else {
							that.saveBillImg(img)
						}
					}
				})
			},
			saveBillImg (img) {
				let that = this
				uni.downloadFile({
					url: img,
					success: function (res) {
						if (res.statusCode === 200) {
							that.saveToAlbum(res.tempFilePath)
						}
					},
					fail: function () {
						uni.showToast({
							icon: 'none',
							title: '下载发票图片失败'
						})
					}
				})
			},
			saveToAlbum (file) {
				uni.saveImageToPhotosAlbum({
					filePath: file,
					success: function () {
						uni.showToast({
							icon: 'none',
							title: '保存成功，请到手机相册中查看'
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.record-box {
	padding: 0 40rpx;
	.top {
		text-align: center;
		padding: 80rpx 0;
		border-bottom: 1px solid #f2f2f2;
		.price {
			font-size: 64rpx;
		}
	}
	.record-detail {
		font-size: 28rpx;
		text-align: center;
		.spacing {
			display: flex;
			padding: 16rpx 0;
			view {
				width: 320rpx;
				margin-right: 40rpx;
				color: #999;	
			}
			span {
			}
			.record-detail-title {
				font-size: 28rpx;
			}
		}
	}
}
</style>
