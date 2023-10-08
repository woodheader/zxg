<template>
	<view class="wrap">
		<view class="payDetail-wrap">
			<view class="icon">
				<u-icon name="rmb-circle" color="#ccc" size="80"></u-icon>
			</view>
			
			<view class="price spacing">
				<view>应缴金额</view>	<span>{{noPayList.order.amount}}元</span>
			</view>
			<view class="name spacing">
				<view>缴费户名</view> <span>{{noPayList.room.truename}}</span>
			</view>
			<view class="account-no spacing">
				<view>缴费户号</view> <span>{{noPayList.room.room}}</span>
			</view>
			<view class="unit spacing">
				<view>缴费面积</view> <span>{{noPayList.room.room_size}}/平方米</span>
			</view>
			<view class="address spacing">
				<view>地址</view> <span>{{noPayList.room.village_name}}</span>
			</view>
			<view class="tel spacing">
				<view>手机号</view> <span>{{noPayList.room.mobile}}</span>
			</view>
			<!-- <view class="enter-amount">输入金额</view>
			<view class="input-box">
				<view class="qian">￥</view>
				<input v-model="num" type="number" placeholder="请输入缴费金额" class="input">
			</view> -->
			
		</view>
		<view class="pay-btn" @click="payBtn">
			立即缴费
		</view>
	</view>
</template>

<script>
	
	import * as UserApi from '@/api/user'
	
	
	export default {
		data() {
			return {
				// num: '',
				noPayList: {
					order: {},
					room: {}
				},
				billId: 0
			}
		},
		onLoad(options) {
			console.log(options);
			// this.billId = options.billId
			this.getBillById(options.billId)
		},
		onShow() {
			
		},
		methods: {
			payBtn() {
				if(this.noPayList.data.order.pay_status === 'NO_PAY') {
					return
					
				}
				console.log(1111);
			},
			
			
			getBillById(billId) {
				UserApi.getBillById(billId).then((res) => {
					console.log(res);
					this.noPayList = res.data
					console.log(this.noPayList);
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.wrap {
	padding-top: 80rpx;
}
.payDetail-wrap {
	position: relative;
	background-color: #fff;
	margin: 0 30rpx;
	padding: 0 40rpx 60rpx 40rpx;
	font-size: 24rpx;
	.icon {
		position: absolute;
		left: 50%;
		top: -40rpx;
		transform: translateX(-50%);
	}
	.spacing {
		display: flex;
		padding: 16rpx 0;
		view {
			width: 100rpx;
			margin-right: 140rpx;
			color: #999;	
		}
		span {
		}
	}
	.price {
		padding-top: 80rpx;
		padding-bottom: 20rpx;
		border-bottom: 2rpx solid #f2f2f2;
	}
	.name {
		margin-top: 20rpx;
	}
	.enter-amount {
		padding: 40rpx 0 0 0;
	}
	.input-box {
		position: relative;
		.input {
			font-size: 56rpx;
			padding-left: 50rpx;
			border-bottom: 2rpx solid #f2f2f2;
		}
		.input-placeholder {
			font-size: 32rpx;
		}
		.qian {
			position: absolute;
			left: 0;
			top: 50%;
			transform: translateY(-50%);
			font-size: 40rpx;
		}
	}
	
}
.pay-btn {
	left: 30rpx;
	font-size: 28rpx;
	padding: 20rpx 0;
	text-align: center;
	margin-left: 30rpx;
	margin-right: 30rpx;
	box-sizing: border-box;
	background-color: #00aa00;
	color: #fff;
	margin-top: 40rpx;
	border-radius: 40rpx;
}
</style>
