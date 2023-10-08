<template>
	<view class="add-wrap">
		<view class="add-title">
			<view>成员列表</view>
		</view>
		<view class="add-list">
			<view class="add-item" v-for="(item,index) in telList" :key="index">
				<view class="">
					<view class="name spaceing">
						<u-checkbox
							class="checkBtn"
							v-model="item.checked" 
							:name="item.name"
							v-if="showFinish"
							@change="change"
						>
						</u-checkbox>
						<view>成员姓名：</view> <span>{{item.user_name}}</span>
					</view>
					<view class="status spaceing">
						<view>成员身份：</view> <span>{{item.user_role_name}}</span>
					</view>
					<view class="tel spaceing">
						<view>手机号码：</view> <span>{{item.user_mobile}}</span>
					</view>
				</view>
				<view style="display: flex; justify-content: space-around;  margin-top: 20rpx; margin-bottom: 20rpx;">
					<view class="manage" ><button @click="getDelFamilyMember(item)">删除</button></view>
					<view class="manage" ><button @click="editMember(item)">修改成员</button></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import * as UserApi from '@/api/user'
	
	export default {
		data() {
			return {
				telList: [],
				addTel: '',
				addName: '',
				addStatus: '',
				wyPid: 0,
				wyId: 0,
			}
		},
		async onShow() {
			this.getYzUser(this.wyId)
		},
		onLoad(options) {
			this.wyId = options.id
		},
		methods: {
			
			// 获取当前用户信息
			getUserInfo() {
				
			  return UserApi.info({})
			},
			//成员列表
			getYzUser(wyId) {
				UserApi.getYzUser({wy_id:this.wyId}).then(res => {
					this.telList = res.data.list
				})
			},
			// 编辑成员
			editMember(item) {
				this.$navTo(`pages/user/addRoom/index`, {...item})
			},
			//删除成员
			getDelFamilyMember(item) {
				let that = this
				uni.showModal({
					title: '温馨提示',
					content: '您确定要删除吗?',
					success(res) {
						if (res.confirm) {
							UserApi.removeMember({
								yz_user_id: item.yz_user_id
							}).then(result => {
								that.getYzUser(that.wyId)
							})
						}
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.add-wrap {
		padding: 40rpx 30rpx;
		.add-title {
			display: flex;
			justify-content: space-between;
			.manage-box {
				display: flex;
				.manage {
					margin-right: 20rpx;
				}
				.finish {
					color: rgb(250, 34, 9);
				}
			}
		}
		.add-list {
			margin-top: 30rpx;
			background-color: #fff;
			border-radius: 20rpx;
			.spaceing {
				display: flex;
				view {
					// width: 80px;
				}
				
				.checkBtn {
					// width: 20px;
				}
				
			}
			.name {
				padding: 30rpx 20rpx 0 20rpx;
			}
			.status {
				padding: 20rpx 20rpx 0 20rpx;
			}
			.tel {
				padding: 20rpx;
			}
			.add-item {
				border-bottom: 1px solid #f2f2f2;
				.manage {
					margin-right: 30rpx;
					button {
						background-color: #fff;
						color: #007AFF;
						padding: 0 40rpx;
						line-height: 70rpx;
						font-size: 30rpx;
						border-radius: 10rpx;
						border:2rpx solid #007AFF;
					}
					&:first-child {
						button {
						color: #fa3534;
						border-color: #fa3534;
						}
					}
				}
			}
		}
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
		.popup-box {
			padding: 0 40rpx 20rpx 40rpx;
			.popup-title {
				text-align: center;
				font-size: 36rpx;
				font-weight: 600;
			}
			.from-box {
				display: flex;
				flex-direction: column;
				justify-content: center;
				margin-top: 20rpx;
			}
			.submit-box {
				display: flex;
				view {
					flex: 1;
					text-align: center;
					padding: 20rpx 0;
				}
				.submit {
					color: rgb(250, 34, 9);
				}
			}
		}
	}
</style>
