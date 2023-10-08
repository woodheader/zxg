<template>
	<view class="wrap">
		<view class="item" @click="handleCancellation">
			<text>注销账号</text>
			<u-icon name="arrow-right"></u-icon>
		</view>
		
		<u-modal v-model="show" :content="content" :show-cancel-button="true" @confirm="confirm"></u-modal>
	</view>
</template>

<script>
	import * as UserApi from '@/api/user'
	export default {
		data() {
			return {
				show: false,
				content: '您确定要注销用户吗？'
			}
		},
		methods: {
			//跳转到注销原因选择
			handleCancellation() {
				this.show = true
			},
			
			confirm() {
				UserApi.delUser().then(res => {
					console.log(res);
					uni.showToast({
						title: res.message,
						icon: 'none',
						duration: 1500
					})
					this.$navTo('pages/index/index')
				})
				
			}
		}
	}
</script>

<style lang="scss" scoped>
.wrap {
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
