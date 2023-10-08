<template>
	<view class="tab_type">
		<scroll-view scroll-x="true" class="abc" scroll-with-animation='true'>
			<!-- <u-tag :text="item.life_props[0].value.name" :type="tabNum === index? 'error': 'info'"
				v-for="(item, index) in life.skuList" :key="index" mode="light" @click="handerTab(index)" /> -->
			<view class="u-tag" v-for="(item, index) in life.skuList" :key="index" :class="tabNum === index? 'active': ''" @click="handerTab(index)">
				{{item.life_props[0].value.name}}
				<view class="icon" v-if="tabNum === index">
					<u-icon name="checkbox-mark" size="26"></u-icon>
				</view>
			</view>
		</scroll-view>

	</view>
</template>

<script>
	export default {
		props: {
			life: Object
		},
		data() {
			return {
				tabNum: 0,
			}
		},
		created() {
			console.log(this.life)
		},
		methods: {
			handerTab(index) {
				this.tabNum = index;
				this.$emit('changePrice', index)
			}
		}
	}
</script>

<style scoped lang="scss">
	.tab_type {
		padding: 0rpx 30rpx 50rpx;
		margin: 0rpx 0 20rpx;
		background-color: #fff;

		.u-tag {
			margin-right: 20rpx;
			padding: 30rpx 70rpx 30rpx 30rpx;
			font-size: 30rpx;
			border: 2rpx solid #d0d0d0;
			box-sizing: border-box;
			display: inline-block;
			border-radius: 10rpx;
			background-color: #f7f7f7;
			position: relative;
			&.active {
				border-color: #00c3a8;
				background-color: #e5f9f6;
				font-weight: bold;
			}
			.icon {
				padding: 0rpx 10rpx 0;
				position: absolute;
				background-color: #00c3a8;
				border-top-left-radius: 10rpx;
				color: #fff;
				bottom: 0;
				right: 0;
			}
			// width: 100rpx;
		}
	}

	.abc {
		width: 100%;
		white-space: nowrap;
	}
</style>