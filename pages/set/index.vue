<template>
	<view class="wrap">
		<view class="item" @click="handleConceal">
			<text>服务与隐私</text>
			<u-icon name="arrow-right" color="#d4ced1"></u-icon>
		</view>
		<view class="item" @click="handleSafe">
			<text>账户与安全</text>
			<u-icon name="arrow-right" color="#d4ced1"></u-icon>
		</view>
		<view class="item">
			<text>小程序版本</text>
			<text>1.0.0</text>
		</view>
		
		<!-- 退出登录 -->
		<view v-if="isLogin" class="my-logout">
			<view class="logout-btn" @click="handleLogout()">
				<text>退出登录</text>
			</view>
		</view>
	</view>
</template>

<script>
	import store from '@/store'
	import {
		checkLogin
	} from '@/core/app'
	
	export default {
		data() {
			return {
				// 是否已登录
				isLogin: false,
			}
		},
		onShow() {
			this.onRefreshPage()
			
			
		},
		methods: {
			
			//刷新页面
			onRefreshPage() {
				// 判断是否已登录
				this.isLogin = checkLogin()
			},
			
			
			// 退出登录
			handleLogout() {
				const app = this
				uni.showModal({
					title: '友情提示',
					content: '您确定要退出登录吗?',
					success(res) {
						if (res.confirm) {
							store.dispatch('Logout', {})
								.then(result => app.onRefreshPage())
							app.$navTo('pages/login/index')
						} else if (res.cancel) {
							
						}
						
					}
				})
			},
			
			//跳转账号与安全
			handleSafe() {
				this.$navTo('pages/safe/index')
			},
			
			//跳转隐私政策
			handleConceal() {
				this.$navTo('pages/conceal/index')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		padding: 0 30rpx;
		height: 100vh;
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
		// 退出登录
		.my-logout {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			display: flex;
			justify-content: center;
			margin-top: 50rpx;
			padding-bottom: 50rpx;
			.logout-btn {
				width: 60%;
				margin: 0 auto;
				font-size: 28rpx;
				color: #616161;
				border-radius: 20rpx;
				border: 1px solid #dcdcdc;
				padding: 16rpx 0;
				text-align: center;
			}
		}
	}

</style>
