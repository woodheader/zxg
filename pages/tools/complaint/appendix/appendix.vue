<template>
	<view class="container">
		<u-sticky offset-top="0" v-if="type === 1">
			<!-- 只能有一个根元素 -->
			<view class="dropdown">
				<p>投诉部门：</p>
				<u-dropdown>
					<u-dropdown-item v-model="value1" :title="title" :options="departList" @change="change"></u-dropdown-item>
				</u-dropdown>
			</view>
		</u-sticky>
		<view class="from">
			<u-field v-model="mobile" :label="`投诉问题`" :placeholder="`请填写投诉问题`" :border-bottom="false" v-if="type === 1">
			</u-field>
			<u-field v-model="mobile" :label="`表扬对象`" :placeholder="`请填写表扬对象`" :border-bottom="false" v-if="type === 2">
			</u-field>
			<u-field v-model="mobile" :label="`建议标题`" :placeholder="`请填写建议标题`" :border-bottom="false" v-if="type === 3">
			</u-field>
			<!-- <u-field v-model="describe" :placeholder="`请填写${tabsNum[type - 1].name}内容`" type="textarea" :border-bottom="false"
				:maxlength="-1">
			</u-field> -->
			<textarea id="story" name="story" placeholder="详细描述" v-model="describe"></textarea>
			<!-- 图片列表 -->
			<view class="image-list">
				<view class="image-preview" v-for="(image, imageIndex) in formData.imageList" :key="imageIndex">
					<text class="image-delete iconfont icon-shanchu" @click="deleteImage( imageIndex)"></text>
					<image class="image" mode="aspectFill" :src="image.path"></image>
				</view>
				<view v-if="!formData.imageList || formData.imageList.length < maxImageLength" class="image-picker"
					@click="chooseImage()">
					<text class="choose-icon iconfont icon-camera"></text>
					<text class="choose-text">上传图片</text>
				</view>
			</view>
		</view>
		<view class="content">
			<view class="content_bth" @click="handleSubmit()">
				<h5>我要{{ tabsNum[type - 1].name}}</h5>
			</view>
		</view>
		<u-popup ref="popTimer" v-model="active" mode="center" :z-index="999999" :closeable="true" :border-radius="30"
			:mask-close-able="false">
			<view v-if="type === 1" class="dialog_text">
				<p>您的投诉已提交成功！</p>
				<p>相关观部门会在24小时内作出响应和处理！</p>
			</view>
			<view v-if="type === 2" class="dialog_text">
				<p>表扬成功！</p>
				<p>感谢您对物业服务的支持！</p>
			</view>
			<view v-if="type === 3" class="dialog_text">
				<p>您的建议提交成功！</p>
				<p>感谢您对物业服务的支持！</p>
			</view>
			<view class="dialog_footer">
				<p class="dialog_bth" @click="onReload()">确定</p>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import * as Api from '@/api/complaint.js'
	import * as UploadApi from '@/api/upload'
	const maxImageLength = 9
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
				departList: [],
				value1: '',
				title: '请选择投诉部门',
				mobile: '',
				describe: '',
				formData: {
					content: '',
					imageList: [],
					uploaded: [],
				},
				maxImageLength,
				tabsNum,
				type: 1,
				active: false
			};
		},
		onLoad(option) {
			this.type = Number(option.type)
			this.getDepart()
		},
		methods: {
			//刷新页面
			onReload() {
				setTimeout(() => {
					this.active = false
					this.disabled = false
					uni.navigateBack()
				}, 0)
			},
			// 部门详情列表
			getDepart() {
				Api.departmentList().then(res => {
					res.data.forEach((item, index) => {
						this.departList.push({
							value: item.id,
							label: item.dpt_name
						})
					})
				})
			},
			// 下拉菜单关闭触发
			change(index) {
				const name = this.departList.filter(item => item.value === index)
				this.title = name[0].label
			},
			// 选择图片
			chooseImage() {
				const app = this
				const oldImageList = app.formData.imageList
				// 选择图片
				uni.chooseImage({
					count: maxImageLength - oldImageList.length,
					sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
					success({
						tempFiles
					}) {
						// tempFiles = [{path:'xxx', size:100}]
						app.formData.imageList = oldImageList.concat(tempFiles)
					}
				});
			},
			// 删除图片
			deleteImage(imageIndex) {
				this.formData.imageList.splice(imageIndex, 1)
			},
			// 表单提交
			handleSubmit() {
				const app = this
				if (app.formData.imageList.length) {
					app.uploadFile()
						.then(() => {
							app.onSubmit()
						})
						.catch(err => {
							app.disabled = false
							if (err.statusCode !== 0) {
								app.$toast(err.errMsg)
							}
						})
				} else {
					app.onSubmit()
				}
			},
			// 提交到后端
			onSubmit() {
				const app = this
				if (app.type === 1) {
					const data = {
						dpt_id: this.value1,
						title: this.mobile,
						desc: this.describe,
						file_list: app.formData.uploaded
					}
					Api.doComplaint(data)
						.then(result => {
							this.active = true
						})
						.catch(err => app.disabled = false)
				} else if (app.type === 2) {
					const data = {
						object_name: this.mobile,
						praise_content: this.describe,
						file_list: app.formData.uploaded
					}
					Api.doPraise(data)
						.then(result => {
							this.active = true
						})
						.catch(err => app.disabled = false)
				} else {
					const data = {
						object_name: this.mobile,
						advice_content: this.describe,
						file_list: app.formData.uploaded
					}
					Api.doAdvice(data)
						.then(result => {
							this.active = true
						})
						.catch(err => app.disabled = false)
				}

			},
			// 上传图片
			uploadFile() {
				const app = this
				const {
					formData
				} = app
				// 批量上传
				return new Promise((resolve, reject) => {
					UploadApi.image(formData.imageList)
						.then(fileIds => {
							app.formData.uploaded = fileIds
							console.log(app.formData)
							resolve(fileIds)
						})
						.catch(reject)
				})
			}
		}
	}
</script>

<style lang="scss">
	.dropdown {
		display: flex;
		align-items: center;
		position: relative;

		.u-dropdown {
			padding: 20rpx;

			.u-dropdown__menu__item__arrow {
				position: absolute;
				right: 20rpx;
			}
		}

		p {
			position: absolute;
			font-size: 30rpx;
			left: 20rpx;
		}
	}

	.from {
		.images {
			display: flex;
			flex-wrap: wrap;
		}

		.addImage {
			width: 30vw;
			height: 30vw;
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: #f3f4f6;
			color: #909399;
			margin-left: 20rpx;
			margin-top: 20rpx;
		}
	}

	.content {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 40rpx 0;

		.content_bth {
			display: inline-block;
			border: 2rpx solid rgba(33, 140, 254, 0.5);
			padding: 20rpx 70rpx;
			border-radius: 12rpx;
		}
	}

	.image-list {
		padding: 0 20rpx;
		margin-top: 20rpx;
		margin-bottom: -20rpx;

		&:after {
			clear: both;
			content: " ";
			display: table;
		}

		.image {
			display: block;
			width: 100%;
			height: 100%;
		}

		.image-picker,
		.image-preview {
			width: 29vw;
			height: 29vw;
			margin-right: 20rpx;
			margin-bottom: 20rpx;
			float: left;

			&:nth-child(3n+0) {
				margin-right: 0;
			}
		}

		.image-picker {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			border: 1rpx dashed #ccc;
			color: #ccc;

			.choose-icon {
				font-size: 48rpx;
				margin-bottom: 6rpx;
			}

			.choose-text {
				font-size: 24rpx;
			}
		}

		.image-preview {
			position: relative;

			.image-delete {
				position: absolute;
				top: -15rpx;
				right: -15rpx;
				height: 42rpx;
				width: 42rpx;
				line-height: 42rpx;
				background: rgba(0, 0, 0, 0.64);
				border-radius: 50%;
				color: #fff;
				font-weight: bolder;
				font-size: 22rpx;
				z-index: 10;
				text-align: center;
			}
		}
	}

	#story {
		min-height: 200rpx;
		background-color: #fff;
		border-radius: 10rpx;
		border: 1rpx solid #e8e8e8;
		// text-align: center;
		width: 98%;
		font-size: 30rpx;
		margin: 10rpx;
		padding: 20rpx;
		box-sizing: border-box;
		margin-top: 40rpx;
	}

	::v-deep .u-field {
		background-color: #fff;
		margin-top: 20rpx;
	}

	.dialog_text {
		padding: 80rpx;
		width: 93vw;
		box-sizing: border-box;
		text-align: center;

		p:first-child {
			font-size: 36rpx;
		}

		p:last-child {
			margin-top: 20rpx;
		}
	}

	.dialog_footer {
		width: 100%;
		display: flex;
		justify-content: center;
		padding-bottom: 20rpx;

		.dialog_bth {
			border: 2rpx solid rgba(33, 140, 254, 0.5);
			padding: 20rpx 60rpx;
			text-align: center;
			display: inline-block;
			border-radius: 12rpx;
			background-color: rgb(33, 140, 254);
			color: #fff;
		}
	}
</style>