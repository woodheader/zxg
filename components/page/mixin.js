import store from '@/store'
import util from '@/utils/util'
import * as UserApi from '@/api/user'

export default {
	data() {
		return {
			wy_role_name: '',
			stewardPhone: ''
		}
	},
	methods: {

		//获取当前用户信息
		getUserInfo() {
			return new Promise((resolve,reject) => {
				UserApi.info().then(res => {
					this.wy_role_name = res.data.userInfo.wy_role_name 
					this.stewardPhone = res.data.userInfo.stewardPhone
					resolve()
				})
			})
		},

		onCall() {
			let that = this;
			this.getUserInfo().then(() => {
				if(this.wy_role_name == '普通用户') {
					uni.showModal({
						title: '温馨提示',
						content: '您还没有自己的房屋\n(房屋绑定手机和登录手机须一致)',
						showCancel: false,
						confirmText: '回首页',
						//cancelText: '回首页',
						success: function (res) {
							if (res.confirm) {
								//that.$navTo('pages/user/addRoom/index')
								that.$navTo('pages/index/index')
							} else if (res.cancel){
								that.$navTo('pages/index/index')
							}
						}
					});
				}else {
					uni.showModal({
						title: '温馨提示',
						content: '您是否要拨打此管家电话？\n'+that.stewardPhone,
						success: function (res) {
							if (res.confirm) {
								uni.makePhoneCall({
									phoneNumber: that.stewardPhone,
									success: () => {
										console.log('拨打成功');
									},
									fail: (err) => {
										console.log('拨打失败');
									}
								})
							}
						}
					});
				}
			})
		},

		onLink(linkObj) {
			if (!linkObj) return false
			// 跳转到指定页面
			if (linkObj.type === 'PAGE') {
				// 增加用户角色判断并提示
				/*if(this.wy_role_name === '普通用户' && linkObj.title === '物业缴费') {
					uni.showModal({
						title: '温馨提示',
						content: '请先添加您的房屋信息!',
						showCancel: false,
						confirmText: '我知道了'
					});
					return false
				}*/
				this.$navTo(linkObj.param.path, linkObj.param.query)
			}
			return true
		}
	},

}
