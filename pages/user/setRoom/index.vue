<template>
	<view class="list-wrap">
		<view class="tilte">
			房屋列表
		</view>
		
		<view class="wrap" v-if="roomList.length > 0">
			<view>
			<view class="item" v-for="(item,index) in roomList" :key="index">
				
				<view class="mask" v-if="item.status == 'WAIT'">
					<text class="wyiconfont icon-shenhezhong"></text>
				</view>
				<view class="info">
					<view class="">
						地址：{{item.city}}{{item.district}}{{item.village_name}}{{item.room}}
					</view>
					<view class="">
						房号：{{item.room}}
					</view>
					<view class="">
						身份：{{item.wy_role_name}}
					</view>
				</view>
				<view class="set-user" v-if="item.wy_role_name == '业主'">
					<button  @click="onEditMember(item.wy_id)" >绑定成员</button>
					<button class="btn-edit"  @click="onAddMember(item.wy_id)" >成员管理</button>
					<button class="btn-delete"  open-type="share" >邀请家人</button>
				</view>
			</view>
			</view>
		</view>
		<view style="padding-top:30rpx; text-align:center;color: #C0C0C0" v-else>
			<text>您还没有自己的房屋</text>
		</view>
	</view>
</template>

<script>
	
	import * as UserApi from '@/api/user'
	
	export default {
		data() {
			return {
				userInfo: {},
				roomList: [],
				title: '邀请您一起使用知小管智慧社区，周边消费送知珠可抵扣物业费'
			}
		},
		/**
		 * 分享当前页面
		 */
		onShareAppMessage() {
			return {
				title: this.title,
				path: `pages/index/index`
			}
		},
		onLoad(options) {
			this.userInfo = options
			// console.log(options.mobile);
		},
		onShow() {
			this.getWyUserInfo()
		},
		methods: {
			
			//获取房间得列表
			getWyUserInfo() {
				UserApi.getWyUserInfo().then(res => {
					this.roomList = res.data.list
				})
			},
			
			//跳转添加成员列表
			onAddMember(wy_id) {
				this.$navTo(`pages/add-member/index?id=${wy_id}`)
			},
			
			// 添加成员
			onEditMember(wy_id) {
				this.$navTo(`pages/user/addRoom/index?id=${wy_id}`)
			},
			
			// 删除
			onDelMember(wy_id) {
				let that = this
				uni.showModal({
					title: '提示',
					content: '确定要删除吗？',
					showCancel: true,
					confirmText: '确定',
					success: function (res) {
						if (res.confirm) {
							UserApi.addWyUser({
								form: {
									wy_id: wy_id,
									is_delete: true
								}
							})
							.then(res => {
								// 跳转回原页面
								setTimeout(() => that.$router.go(), 500)
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.list-wrap {
	padding: 40rpx 30rpx;
	.wrap {
		background-color: #fff;
		margin-top: 20rpx;
		border-radius: 20rpx;
		.item {
			position: relative;
			padding: 20rpx;
			border-bottom: 1px solid #f4f4f4;
			font-size: 30rpx;
			.mask {
				position: absolute;
				left: 0;
				bottom: 0;
				width: 100%;
				height: 100%;
				background-color: #eee;
				opacity: .7;
				z-index: 998;
				display: flex;
				justify-content: center;
				align-items: center;
				.wyiconfont {
					font-size: 200rpx;
				}
			}
			.info {
				view {
					padding: 10rpx 0;
				}
			}
			.set-user {
				display: flex;
				justify-content: space-around;
				margin-top: 30rpx;
				button {
					background-color: #fff;
					color: #333;
					padding: 0 40rpx;
					line-height: 70rpx;
					font-size: 30rpx;
					border-radius: 10rpx;
					border:2rpx solid #007AFF;
					color: #007AFF;
				}
			}
		}
	}
}
</style>
