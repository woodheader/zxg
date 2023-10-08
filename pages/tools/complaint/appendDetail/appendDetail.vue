<template>
	<view class="container">
		<view class="details_top" v-if="type !== 1">
			<p v-if="type === 2">表扬对象： {{details.object_name}}</p>
			<p v-if="type === 3">建议标题： {{details.object_name}}</p>
		</view>
		
			<h2 v-if="type === 1">我的投诉</h2>
		<view class="details_content">
			<view class="details_footer">
				<p v-if="type === 1">投诉标题： {{details.object_name}}</p>
				<p v-if="type === 1">投诉时间： {{details.update_time}}</p>
				<view class="content" style="padding: 0;">
					<p v-if="type === 1">投诉内容: {{ details.object_desc }}</p>
					<p v-if="type !== 1">{{ details.object_desc }}</p>
				</view>
			</view>

			<view class="details_img">
				<view class="img" v-for="(item, index) in details.file_list">
					<img :src="item.external_url" alt="" @tap="previewImage(index)">
				</view>
			</view>
		</view>
		<h2 v-if="type === 1  && details.object_reply">投诉响应</h2>
		<view class="details_footer" v-if="type === 1 && details.object_reply">
			
			<p>响应时间： {{details.reply_time}}</p>
			<p>响应人： {{details.reply_user_name}}</p>
			<view class="content">
				<p>响应内容：</p>
				<view class="text" v-html="details.object_reply">
				</view>
			</view>
		</view>
		<h2 v-if="type === 1 && details.object_result">投诉处理</h2>
		<view class="details_footer" v-if="type === 1 && details.object_result" style="margin-top: 5rpx">
			
			<p>处理时间： {{details.process_time}}</p>
			<p>处理人： {{details.process_user_name}}</p>
			<view class="content">
				<p>处理内容：</p>
				<view class="text" v-html="details.object_result">
				</view>
			</view>
		</view>
		<view style="height: 60rpx;">
			
		</view>
	</view>
</template>

<script>
	import * as Api from '@/api/complaint.js'
	const tabsNum = [{
			name: '投诉',
			value: 1
		},
		{
			name: '表扬',
			value: 2
		},
		{
			name: '建议',
			value: 3
		}
	]
	export default {
		data() {
			return {
				details: [],
				tabsNum,
				type: 1,
				urlList: []
			};
		},
		onLoad(option) {
			this.type = Number(option.type)
			this.eid = option.id
		},
		onShow() {
			this.getDetail(this.type, this.eid)
		},
		methods: {
			getDetail(type, id) {
				this.urlList = []
				if (type === 1) {
					Api.complaintDetail({
						id: id
					}).then(res => {
						this.details = res.data
						if (res.data.file_list) {
							res.data.file_list.forEach(item => {
								this.urlList.push(item.external_url)
							})
						}

						this.details.object_reply = (this.details.object_reply).replace(/\<img/gi,
							'<img style="max-width:100%;height:auto" ')
						this.details.object_result = (this.details.object_result).replace(/\<img/gi,
							'<img style="max-width:100%;height:auto" ')
					})
					console.log(this.details)
				} else if (type === 2) {
					Api.praiseDetail({
						id: id
					}).then(res => {
						this.details = res.data
						res.data.file_list.forEach(item => {
							this.urlList.push(item.external_url)
						})
					})
				} else {
					Api.adviceDetail({
						id: id
					}).then(res => {
						this.details = res.data
						res.data.file_list.forEach(item => {
							this.urlList.push(item.external_url)
						})
					})
				}
			},
			/**
			 * @param {Object} 图片预览
			 */
			previewImage(e) {
				uni.previewImage({
					urls: this.urlList, // 需要预览的图片链接列表，可以写你图片链接的数组或者跟我一样，就写一个单独的链接
					current: e,
					fail: res => {
						console.log(res)
					} // 为当前显示图片的链接/索引值，不填或填写的值无效则为 urls 的第一张
				});
			},
		}
	}
</script>
<style>
	page {
		background-color: #f4f4f4;
	}
</style>
<style lang="scss">
	h2 {
		font-weight: bold;
		font-size: 30rpx;
		line-height: 80rpx;
		padding-left: 20rpx;
	}
	.container {
		// padding: 20rpx 0;
	}

	.details_top {
		padding: 20rpx;
		background-color: #fff;
		border-bottom: 1rpx solid #e8e8e8;

		p {
			font-size: 30rpx;
		}
	}

	.details_content {
		.content {
			// min-height: 200rpx;
			padding: 20rpx;
			// margin-top: 20rpx;
			background-color: #fff;
		}

		.details_img {
			margin-top: 10rpx;
			overflow: hidden;
			padding: 0 20rpx 0 0;

			img {
				width: 29vw;
				height: 29vw;
				float: left;
				margin-left: 25rpx;
				margin-top: 15rpx;
			}
		}
	}

	.details_footer {
		padding: 20rpx;
		background-color: #fff;
		// border-radius: 20rpx;

		p {
			font-size: 30rpx;
			line-height: 50rpx;
			flex: 1;
			white-space: nowrap;
			max-width: 150rpx;
		}
	}

	.content {
		p {
			// border-top: 1rpx solid #e8e8e8;
			max-width: 100%;
			// text-align: center;
		}
		.text {
			margin-left: 10rpx;
			margin-top: 10rpx;
		}
	}
</style>