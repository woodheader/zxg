<template>
	<view>
		<u-sticky :offset-top="0">
		<view class="text" @click="isActive()">
			<view class="text_name">
				{{ name }}
				<view class="icon">
				</view>
			</view>
		</view>
		</u-sticky>
		<u-popup ref="popTimer" v-model="active" mode="bottom" :z-index="18899" :closeable="false" :border-radius="26" >
			<view class="content-text">
				<view class="dialog_top">
					<view class="clear" @click="active = false">
						取消
					</view>
					<view class="clear" @click="addValue()">
						确认
					</view>
				</view>
				<view class="dialog_middle">
					<!-- <view v-for="(item,index) in cbookList" :key="index" class="dialog_list"
						:class="[index === isIndex? 'active' : '']" @click="seleact(index, item)">
						{{ item }}
					</view> -->
					<scroll-view class="content-scroll" :scroll-y="true">
					  <picker-view class="picker-view"  :indicator-style="indicatorStyle" :value="value" @change="bindChange" :immediate-change="true">
					    <picker-view-column>
					      <view class="item" v-for="(item,index) in cbookList" :key="index">{{item}}</view>
					    </picker-view-column>
					  </picker-view>
					  					
					</scroll-view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				active: false,
				name: '全部',
				navName: '',
				value: [0],
				indicatorStyle: `height: 36px;`,
			};
		},
		props: {
			cbookList: Array,
		},
		methods: {
			isActive() {
				this.active = true;
				if (this.name !== '全部') {
					const index = this.cbookList.indexOf(this.name)
					this.value = [index]
				}
			},
			addValue() {
				if (this.navName !== '') {
					this.name = this.navName
				}
				this.$emit('add', this.name)
				this.active = false
			},
			bindChange(e) {
				console.log(this.cbookList[e.detail.value[0]])
				this.navName = this.cbookList[e.detail.value[0]]
			}
		}
	}
</script>

<style lang="scss">
	.text {
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		background-color: #fff;
		.text_name {
			height: 100%;
			width: 100%;
			font-size: 30rpx;
			.icon {
				display: inline-block;
				border-top: 10rpx solid #000;
				border-left: 10rpx solid transparent;
				border-right: 10rpx solid transparent;
				border-bottom: 10rpx solid transparent;
				// top: 50%;
				// // padding-top: 10rpx;
				// left: 50%;
				margin-left: 20rpx;
				// transform: translateY(-50

			}
		}
	}

	.content-text {
		position: relative;
		bottom: 0;
		width: 100%;
		height: 580rpx;
		background-color: #fff;
		overflow: hidden;
		z-index: 111;
		background-color: #fafafa;
		.dialog_top {
			border-bottom: 2rpx solid rgba(0, 0, 0, 0.05);
			display: flex;
			padding: 20rpx 20rpx;
			color: rgb(33, 140, 254);
			justify-content: space-between;
			position: absolute;
			z-index: 99999;
			width: 100%;
			background-color: #fff;
		}
		.picker-view {
			// position: absolute;
			// bottom: 100rpx;
			width: 750rpx;
			height: 430rpx;
			margin-top: -160rpx;
			padding-bottom: 180rpx;
			border-bottom: 130rpx solid #fff;
		}
		.item {
		  line-height: 72rpx;
		  text-align: center;
		  font-size: 38rpx;
		}
	}
</style>