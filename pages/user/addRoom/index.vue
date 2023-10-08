<template>
	<view class="wrap">
		<!-- <view class="">
			房间信息
		</view> -->
		<u-form :model="form" ref="uForm" label-width="180rpx">
			<u-form-item label="成员姓名" prop="nick_name">
				<u-input v-model="form.nick_name" type="nick_name" placeholder="请输入成员称呼" />
			</u-form-item>
			<u-form-item label="成员手机号" prop="mobile">
				<u-input v-model="form.mobile" type="mobile" placeholder="请输入成员手机号" maxlength="11" />
			</u-form-item>
			<u-form-item label="成员身份" prop="wy_role_name">
				<u-radio-group v-model="form.wy_role_name">
					<u-radio name="租户">
						租户
					</u-radio>
					<u-radio name="家庭成员">
						家庭成员
					</u-radio>
				</u-radio-group>
			</u-form-item>
		</u-form>

		<view class="add-btn" @click="addRoom" v-if="!isEdit">
			编辑成员
		</view>
		<view class="add-btn" @click="addRoom" v-else>
			绑定成员
		</view>
		<view class="notify">
			<p>提示：绑定完成后，亲友用该手机号登陆即可完成房屋绑定</p>
		</view>
		<!-- <u-select v-model="showSex" :list="sexList" @confirm="confirmSex"></u-select>
		<u-picker v-model="showTime" mode="time" :params="params" @confirm="confirmTime"></u-picker> -->
	</view>
</template>

<script>
	import * as UserApi from '@/api/user'
	import SelectRegion from '@/components/select-region/select-region'

	// 表单验证规则
	const rules = {
		nick_name: [{
			required: true,
			message: '请输入业主姓名',
			trigger: ['blur', 'change']
		}],
		mobile: [{
			required: true,
			message: '请输入业主手机号',
			trigger: ['blur', 'change']
		}],
	}
	export default {
		components: {
			SelectRegion
		},
		data() {
			return {
				form: {
					nick_name: '',
					mobile: '',
					wy_role_name: ''
				},
				// 验证规则
				rules,
				//需要显示得时间
				params: {
					year: true,
				},
				user_id: '',
				isEdit: false,
				items: {}
			}
		},

		onLoad(options) {
			this.items = {
				...options
			}
			if (options.id) {
				this.user_id = options.id
				this.isEdit = true
			} else {
				this.isEdit = false
				this.form.nick_name = this.items.user_name,
				this.form.mobile = this.items.user_mobile,
				this.form.wy_role_name = this.items.user_role_name
			}

		},

		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.rules)
			if (this.isEdit) {
				uni.setNavigationBarTitle({
					title: '绑定成员'
				})
			} else {
				uni.setNavigationBarTitle({
					title: '编辑成员'
				})
			}
		},

		methods: {
			addRoom() {
				let that = this
				this.$refs.uForm.validate(valid => {
					if (valid) {
						let str = /^[1][3-9][0-9]{9}$/;
						if (!str.test(this.form.mobile)) {
							uni.showToast({
								title: '请输入正确得手机号',
								icon: 'none',
								duration: 1500
							})
							return false
						}
						if (this.isEdit) {
							UserApi.addMember({
									...this.form,
									wy_id: this.user_id
								})
								.then(res => {
									this.form = {
										nick_nanme: '',
										mobile: '',
										wy_role_name: ''
									}
									uni.showModal({
										title: '',
										content: res.message,
										showCancel: false,
										confirmText: '确定',
										success: function(res) {
											if (res.confirm) {
												// 相应全局事件订阅: 刷新上级页面数据
												uni.$emit('syncRefresh', true)
												// 跳转回原页面
												uni.navigateBack()
											}
										}
									});
								})
						} else {
							UserApi.editMember({
									...this.form,
									yz_user_id: this.items.yz_user_id
								})
								.then(res => {
									this.form = {
										nick_nanme: '',
										mobile: '',
										wy_role_name: ''
									}
									uni.showModal({
										title: '',
										content: res.message,
										showCancel: false,
										confirmText: '确定',
										success: function(res) {
											if (res.confirm) {
												// 相应全局事件订阅: 刷新上级页面数据
												uni.$emit('syncRefresh', true)
												// 跳转回原页面
												uni.navigateBack()
											}
										}
									});
								})
						}
					}
				});
			},

			// //更新性别
			// confirmSex(e) {
			// 	// console.log(e[0].label);
			// 	this.form.sex = e[0].label
			// },

			// //更新购房时间
			// confirmTime(e) {
			// 	// console.log(e.year + '-' + e.month + '-' + e.day);
			// 	this.form.first_time = e.year
			// }
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		padding: 0 30rpx 40rpx 30rpx;

		.add-btn {
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 28rpx;
			padding: 20rpx 0;
			margin-top: 40rpx;
			color: #fff;
			background-color: rgb(250, 34, 9);
			border-radius: 60rpx;
		}
	}
	.notify {
		width:98%;
		margin: 20rpx auto;
		height: 300rpx;
		background-color: #fff;
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		padding: 0 20rpx;
	}
</style>