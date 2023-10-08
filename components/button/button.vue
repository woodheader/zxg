<template>
	<view>
		<view class="el_button" :class="type === 'mini'? 'mini' : ''" :style="{padding: padding? padding + 'rpx' : '0 40rpx'}" @click="handledreClick">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		name: "button",
		props: {
			type: String,
			padding: Number
		},
		data() {
			return {

			};
		},
		methods: {
			handledreClick() {
				this.$emit('click')
			}
		}
	}
</script>

<style lang="scss">
	.el_button {
		line-height: 70rpx;
		padding: 0 40rpx;
		background-color: #fff;
		font-size: 30rpx;
		border-radius: 10rpx;
		border: 2rpx solid #007AFF;
		color: #007AFF;
		white-space: nowrap;
	}
</style>