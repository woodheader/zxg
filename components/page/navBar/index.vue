<template>
	<!-- 导航组 -->
	<view class="diy-navBar" :style="{ background: itemStyle.background, color: itemStyle.textColor }">
		<view class="data-list" :class="[`avg-sm-${itemStyle.rowsNum}`]">
			<view class="item-nav" v-for="(dataItem, index) in dataList" :key="index">
				<view v-if="dataItem.text ==='联系管家'" class="nav-to" @click="onCall(dataItem.link)">
					<view class="item-image">
						<image class="image" mode="widthFix" :src="dataItem.imgUrl"></image>
					</view>
					<view class="item-text oneline-hide">{{ dataItem.text }}</view>
				</view>
				<view v-else-if="dataItem.text ==='邀请家人'" class="nav-to">
					<button class="share-btn dis-flex flex-dir-column" open-type="share"
						style="padding: 0; background-color: rgb(33, 140, 254); margin: 0">
						<view class="item-image">
							<image class="image" mode="widthFix" :src="dataItem.imgUrl"></image>
						</view>
						<view class="item-text oneline-hide" style="color: #fff">{{ dataItem.text }}</view>
					</button>
				</view>
				<view v-else-if="dataItem.text ==='物业缴费'" class="nav-to" @click="onLink(dataItem.link)">
					<view class="bubble">
						<p>送知珠、可抵扣</p>
						<view class="bubble_footer">
						</view>
					</view>
					<view class="item-image">
						<image class="image" mode="widthFix" :src="dataItem.imgUrl"></image>
					</view>
					<view class="item-text oneline-hide" style="color: #fff">{{ dataItem.text }}</view>
				</view>
				<view v-else class="nav-to">
					<view class="item-image" style="background-color: transparent;" @click="onLink(dataItem.link)">
						<image class="image" mode="widthFix" :src="dataItem.imgUrl"></image>
					</view>
					<view class="item-text oneline-hide">{{ dataItem.text }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import mixin from '../mixin'

	export default {
		name: "NavBar",
		/**
		 * 组件的属性列表
		 * 用于组件自定义设置
		 */
		props: {
			itemIndex: String,
			itemStyle: Object,
			params: Object,
			dataList: Array
		},
		data() {
			return {
				title: '邀请您一起使用知小管智慧社区，周边消费送知珠可抵扣物业费'
			}
		},

		mixins: [mixin],

		/**
		 * 分享当前页面
		 */
		onShareAppMessage() {
			return {
				title: this.title,
				path: `pages/index/index`
			}
		},
		/**
		 * 组件的方法列表
		 * 更新属性和数据的方法与更新页面数据的方法类似
		 */
		methods: {

		}

	}
</script>

<style lang="scss" scoped>
	.diy-navBar .data-list::after {
		clear: both;
		content: " ";
		display: table;
	}

	.item-nav {
		float: left;
		margin: 10px 0;
		text-align: center;

		.item-text {
			font-size: 26rpx;
			height: 30rpx;
			line-height: 30rpx;
			;
		}

		.item-image {
			margin-bottom: 4px;
			height: 100rpx;
			// font-size: 0;
		}

		.item-image image {
			width: 88rpx;
			height: 88rpx;
		}

	}

	/* 分列布局 */

	.diy-navBar .avg-sm-3>.item-nav {
		width: 33.33333333%;
	}

	.diy-navBar .avg-sm-4>.item-nav {
		width: 25%;
	}

	.diy-navBar .avg-sm-5>.item-nav {
		width: 20%;
	}
	.nav-to {
		position: relative;
		.bubble {
			position: absolute;
			left: 50%;
			top: -20%;
			z-index: 9999;
			p {
				font-size: 16rpx;
				white-space: nowrap;
				padding: 10rpx;
				background-color: red;
				border-radius: 10rpx;
			}
		}
	}
</style>