<template>
	<view>
		<u-sticky :offset-top="0">
			<view class="detail_top">
				<u-icon name="clock" :label="`时间: ${logDetail.log_info.log_dt}`" margin-left="10"></u-icon>
				<button class="share-btn dis-flex flex-dir-column" open-type="share"
					style="padding: 0; background-color: transparent; margin: 0">
					<u-icon name="zhuanfa" :label="`分享`" size="36"></u-icon>
				</button>
			</view>
		</u-sticky>
		<view class="detail_bottom">
			<img :src="item.external_url" alt="" v-for="(item, index) in logDetail.image_list" :key="item.file_id"
				@tap="previewImage(index)">
		</view>
		<view class="detail_content" v-html="logDetail.log_info.log_desc">
		</view>
	</view>
</template>

<script>
	import * as AddressApi from '@/api/wy_service.js'
	export default {
		data() {
			return {
				logDetail: {},
				urlList: []
			};
		},
		/**
			 * 分享当前页面
			 */
			onShareAppMessage(res) {
				console.log(res)
				if (res.from === 'button') { // 来自页面内分享按钮
					console.log(res.target)
				}
				return {
					path: '/pages/index/index'
				}
			},
		onLoad(option) {
			this.getDetails(option.id)
		},
		methods: {
			getDetails(eid) {
				AddressApi.logDetail(eid).then(res => {
					this.logDetail = res.data
					this.urlList = this.logDetail.image_list.map(item => item.external_url)
				})
			},
			/**
			 * @param {Object} 图片预览
			 */
			previewImage(e) {
				uni.previewImage({
					urls: this.urlList, // 需要预览的图片链接列表，可以写你图片链接的数组或者跟我一样，就写一个单独的链接
					current: e,
					fail: res => {
						console.log(res)
					} // 为当前显示图片的链接/索引值，不填或填写的值无效则为 urls 的第一张
				});
			},
		}
	}
</script>
<style>
	page {
		background-color: #fff;
	}
</style>
<style lang="scss" scoped>
	.detail_top {
		padding: 20rpx;
		font-size: $uni-font-size-sm;
		text-align: center;
		background-color: #fff;
		// border: 2rpx solid rgba(0, 0, 0, 0.05);
		box-shadow: 0 1rpx 5rpx 0px rgba(0, 0, 0, 0.05);
		display: flex;
		justify-content: space-between;
	}

	.detail_content {
		padding: 20rpx;
		// margin: 20rpx;
		// border: 2rpx solid rgba(0, 0, 0, 0.05);
	}

	.detail_bottom {
		padding: 20rpx;

		// margin: 20rpx;
		// border: 2rpx solid rgba(0, 0, 0, 0.05);
		img {
			max-width: 200rpx;
			height: 200rpx;
			margin: 12rpx 16rpx;
			border: 1rpx solid #f4f4f4;
		}
	}
</style>