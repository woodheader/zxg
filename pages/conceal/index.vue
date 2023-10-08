<template>
	<view class="wrap">
		<view class="item" @click="onXieyi">
			<text>隐私政策</text>
			<u-icon name="arrow-right"></u-icon>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			onXieyi() {
				this.$navTo('pages/article/detail?articleId=10002')
			}
		}
	}
</script>

<style lang="scss" scoped>
.wrap {
	height: 100vh;
		padding: 0 30rpx;
		background-color: #fff;
		.item {
			display: flex;
			justify-content: space-between;
			padding: 30rpx 0;
			border-bottom: 1rpx solid #dcdcdc;
			text {
				font-size: 32rpx;
			}
		}
	}
</style>
