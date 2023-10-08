<template>
	<view v-if="!isLoading" class="container b-f p-b">


		<!--    <view class="article-title" style="text-align: center;margin: 0 auto;">
      <text class="f-32" >{{ detail.title }}</text>
    </view> -->

<!-- 		<view class="title">
			<text class="text">{{ detail.title }}</text>
		</view> -->

		<view class="article-little dis-flex flex-x-between m-top10">
			<!--      <view class="article-little__left">
        <text class="article-views f-24 col-8">{{ detail.show_views }}次浏览</text>
      </view> -->
			<view class="article-little__right">
				<text class="article-views f-24 col-8">{{ detail.view_time }}</text>
			</view>
		</view>
		<view class="article-content m-top20">
			<mp-html :content="detail.content" />
		</view>
		<!-- 快捷导航 -->
		<!-- <shortcut /> -->
	</view>
</template>

<script>
	import Shortcut from '@/components/shortcut'
	import * as ArticleApi from '@/api/article'

	export default {
		components: {
			Shortcut
		},
		data() {
			return {
				// 当前文章ID
				articleId: null,
				// 加载中
				isLoading: true,
				// 当前文章详情
				detail: null
			}
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			// 记录文章ID
			this.articleId = options.articleId
			// 获取文章详情
			this.getArticleDetail()
		},

		methods: {

			// 获取文章详情
			getArticleDetail() {
				const app = this
				app.isLoading = true
				ArticleApi.detail(app.articleId)
					.then(result => {
						app.detail = result.data.detail
						
						const { title } = result.data.detail
						
						uni.setNavigationBarTitle({
							title: (title ? (title + '-') : '') + '详情'
						})
						
					})
					.finally(() => app.isLoading = false)
			}

		},

		/**
		 * 分享当前页面
		 */
		onShareAppMessage() {
			const app = this
			// 构建页面参数
			const params = app.$getShareUrlParams({
				articleId: app.articleId
			});
			return {
				title: app.detail.title,
				path: "/pages/article/detail?" + params
			}
		},

		/**
		 * 分享到朋友圈
		 * 本接口为 Beta 版本，暂只在 Android 平台支持，详见分享到朋友圈 (Beta)
		 * https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share-timeline.html
		 */
		onShareTimeline() {
			const app = this
			// 构建页面参数
			const params = app.$getShareUrlParams({
				articleId: app.articleId
			});
			return {
				title: app.detail.title,
				path: "/pages/article/detail?" + params
			}
		}

	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #F1F1F1;
		padding-top: 40rpx;
	}

	.container {
		padding: 26rpx 30rpx;
		margin: 0 20rpx;
		border-radius: 16rpx;
		box-shadow: 2rpx 2rpx 20rpx 0rpx #dddddd;
		
		.title {
			text-align: center;
			background-color: #fff;
			font-size: 36rpx;
			color: #593600;
		
			.text {
				position: relative;
		
				&::after {
					position: absolute;
					content: '';
					bottom: -10rpx;
					left: 50%;
					transform: translateX(-50%);
					width: 50rpx;
					height: 8rpx;
					background-color: #593600;
				}
			}
		}
		
		.article-content {
			font-size: 28rpx;
		}
		
	}
	
</style>
