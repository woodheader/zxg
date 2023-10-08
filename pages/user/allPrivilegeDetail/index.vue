<template>
	<view>
		<view class="img-box">
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name: ''
			}
		},
		onLoad(options) {
			this.name = options.e
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
.title {
	text-align: center;
	padding: 20rpx 0;
	background-color: #fff;
	font-size: 36rpx;
	color: #593600;
	.text {
		position: relative;
		&::after {
			position: absolute;
			content: '';
			bottom: -10rpx;
			left: 50%;
			transform: translateX(-50%);
			width: 50rpx;
			height: 8rpx;
			background-color: #593600;
		}
	}
}
.img-box {
	padding: 30rpx 50rpx;
	
}
</style>
