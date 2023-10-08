<template>
	<view v-if="isLoad" class="login">
		<!--MpWeixin v-if="isMpWeixinAuth" @success="onGetUserInfoSuccess" /> -->

		<view class="wrap">
			<view class="title">
				<image src="https://zxg-public-1304297107.cos.ap-beijing.myqcloud.com/10001/20230514/46e2ac2fa80fe6042547f46640573dfb.png" mode=""></image>
				<text>知小管</text>
			</view>

			<view class="text">
				你手中的&nbsp;房屋管家
			</view>

			<view class="text2">
				安全，便捷，高效
			</view>
		</view>

		<view class="login-btn">
			<!-- 获取微信用户信息 -->
			<button v-if="!checked" class="button btn-normal" @click="jiaBtn">手机号快捷登录</button>
			<button v-else class="button btn-normal" open-type="getPhoneNumber"
				@getphonenumber="handelMpWeixinMobileLogin($event)">手机号快捷登录</button>
		</view>
		<view class="no-login-btn">
			<button class="button btn-normal" @click="onShowRegister">手机号验证码登录</button>
		</view>

		<view class="xieyi">
			<u-checkbox @change="checkboxChange" v-model="checked" shape="circle" :label-disabled="false"
				label-size="30">我已阅读并同意 <text @click="onFuwu">服务协议</text> 及 <text @click="onYinsi">隐私协议</text>
			</u-checkbox>
		</view>

	</view>
</template>

<script>
	import store from '@/store'
	import {
		isEmpty
	} from '@/utils/util'
	import MpWeixin from './components/mp-weixin'
	import SettingKeyEnum from '@/common/enum/setting/Key'
	import SettingModel from '@/common/model/Setting'

	export default {
		components: {
			MpWeixin
		},

		data() {
			return {
				// 数据加载完成 [防止在微信小程序端onLoad和view渲染同步进行]
				isLoad: false,
				// 是否显示微信小程序授权登录
				isMpWeixinAuth: false,
				// 是否存在第三方用户信息
				isParty: false,
				// 第三方用户信息数据
				partyData: {},
				checked: false,
				// 微信login-code
				code: ''
			}
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		async onLoad(options) {
			// 设置当前是否显示微信小程序授权登录
			await this.setShowUserInfo()
			// 数据加载完成
			this.isLoad = true
			// 获取微信code
			this.getWxCode()
		},

		methods: {

			// 获取到用户信息的回调函数
			onGetUserInfoSuccess({ oauth, code, userInfo }) {
			  // 记录第三方用户信息数据
			  this.partyData = { oauth, code, userInfo }
			  // 是否显示授权登录页面
			  this.isMpWeixinAuth = false
			  // 已获取到了第三方用户信息
			  this.isParty = true
			},

			// 显示注册页面
			onShowRegister() {
				// 是否显示微信小程序授权登录
				this.isMpWeixinAuth = false
				// 已获取到了第三方用户信息
				this.isParty = true
				this.$navTo('pages/login/telLogin')
			},

			checkboxChange(e) {
				console.log(e);
			},

			jiaBtn() {
				uni.showToast({
					icon: 'none',
					title: '请阅读并同意服务协议与隐私协议'
				})
			},

			/**
			 * 设置当前是否显示微信小程序授权登录
			 *  - 条件1: 只有微信小程序才显示获取用户信息按钮
			 *  - 条件2: 后台设置是否已开启该选项 [后台-客户端-注册设置]
			 */
			async setShowUserInfo() {
				const app = this
				// 判断当前客户端是微信小程序, 并且支持getUserProfile接口
				const isMpWeixin = app.platform === 'MP-WEIXIN' && wx.canIUse('getUserProfile')

				// 获取后台设置
				await SettingModel.item(SettingKeyEnum.REGISTER.value, false)
					.then(setting => {
						app.isMpWeixinAuth = isMpWeixin && setting.isOauthMpweixin
					})
			},

			// 按钮点击事件: 获取微信手机号按钮
			// 实现目的: 在getphonenumber事件触发之前获取微信登录code
			// 因为如果在getphonenumber事件中获取code的话,提交到后端的encryptedData会存在解密不了的情况
			getWxCode() {
				let that = this
				this.getCode().then((code) => {
					that.code = code
				})
			},

			// 微信授权获取手机号一键登录
			// getphonenumber事件的回调方法
			handelMpWeixinMobileLogin({
				detail
			}) {
				const app = this
				if (detail.errMsg != 'getPhoneNumber:ok') {
					console.log('微信授权获取手机号失败', detail.errMsg)
					return
				}
				app.isLoading = true
				store.dispatch('LoginMpWxMobile', {
						code: app.code,
						encryptedData: detail.encryptedData,
						iv: detail.iv,
						isParty: app.isParty,
						partyData: app.partyData,
						refereeId: store.getters.refereeId
					})
					.then(result => {
						// 显示登录成功
						app.$toast(result.message)
						setTimeout(() => {
							app.$navTo('pages/index/index')
						}, 2000)
					})
					.catch(err => {
						const resultData = err.result.data
						// 显示错误信息
						if (isEmpty(resultData)) {
							app.$toast(err.result.message)
						}
						// 跳转回原页面
						if (resultData.isBack) {
							app.$toast(err.result.message)
							setTimeout(() => app.$navTo('pages/index/index'), 2000)
						}
					})
					.finally(() => app.isLoading = false)
			},

			// 获取微信登录的code
			// https://developers.weixin.qq.com/miniprogram/dev/api/open-api/login/wx.login.html
			getCode() {
				return new Promise((resolve, reject) => {
					uni.login({
						provider: 'weixin',
						success: res => {
							console.log('code', res.code)
							resolve(res.code)
						},
						fail: reject
					})
				})
			},

			/**
			 * 登录成功-跳转回原页面
			 */
			onNavigateBack(delta = 1) {
				const pages = getCurrentPages()
				this.$navTo('pages/index/index')
				/*if (pages.length > 1) {
					uni.navigateBack({
						delta: Number(delta || 1)
					})
				} else {
					this.$navTo('pages/index/index')
				}*/
			},

			//跳转服务协议
			onFuwu() {
				this.$navTo('pages/article/detail?articleId=10013')
			},

			//跳转隐私协议
			onYinsi() {
				this.$navTo('pages/article/detail?articleId=10002')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.login-btn {
		padding: 0 20rpx;

		.button {
			height: 88rpx;
			background: #29ABFF;
			color: #fff;
			font-size: 32rpx;
			border-radius: 999rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}


	.no-login-btn {
		margin-top: 20rpx;
		padding: 0 20rpx;

		.button {
			height: 88rpx;
			color: #555579;
			font-size: 28rpx;
			border-radius: 999rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}

	.wrap {
		display: flex;
		align-items: center;
		flex-direction: column;
		color: #876831;

		.title {
			display: flex;
			align-items: center;
			font-size: 48rpx;
			font-weight: bold;
			margin-top: 50rpx;

			image {
				width: 80rpx;
				height: 80rpx;
				margin-right: 20rpx;
			}
		}

		.text {
			font-size: 62rpx;
			font-weight: bold;
			margin-top: 32rpx;
		}

		.text2 {
			font-size: 28rpx;
			margin-top: 20rpx;
			margin-bottom: 30rpx;
		}
	}

	.xieyi {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 50rpx;
		padding-bottom: 50rpx;

		text {
			color: #29ABFF;
		}
	}
</style>
