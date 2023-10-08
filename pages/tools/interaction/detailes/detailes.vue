<template>
	<view class="container" v-if="isRecord">
		<view class="detail_title">
			{{ details.title }}
		</view>
		<u-sticky :offset-top="0">
			<view class="detail_top">
				<u-icon name="clock" :label="`时间: ${details.interact_start_time.slice(0,  10)}`"
					margin-left="10"></u-icon>
				<u-icon name="order" :label="`阅读: ${details.visit_num}`" margin-left="10"></u-icon>
				<button class="share-btn dis-flex flex-dir-column" open-type="share"
					style="padding: 0; background-color: #fff;">
					<u-icon name="zhuanfa" :label="`分享`" size="36"></u-icon>
				</button>
			</view>
		</u-sticky>

		<view class="details_content">
			<view class="tz_detail" v-if="details.interact_type === 1">
				<view class="content" v-html="details.content">
				</view>
			</view>
			<view class="tp_detail" v-else-if="details.interact_type === 2">
				<view class="content" v-html="details.content">
				</view>
				<view class="footer">
					<view class="footer-top"
						v-if="!(details.log_info.is_vote_agree === 0 || details.log_info.is_vote_agree === 1) && details.vote_status === 1">
						<u-button type="primary" size="medium" @click=doVote(1) :loading="isLoading">
							<p :class="isActive? 'text_p' : ''">赞成({{details.vote_agree_num}})<i class='a' style="color: #2979ff;">+1</i></p>
						</u-button>
						<u-button type="error" size="medium" @click=doVote(0) :loading="noLoading">
							<p :class="noactive? 'text_p' : ''">反对({{details.vote_against_num}})<i class='a'style="color: #fa3534">+1</i></p>
						</u-button>
					</view>
					<view class="footer-top"
						v-else-if="(details.log_info.is_vote_agree === 0 || details.log_info.is_vote_agree === 1) && details.vote_status === 1">
						<u-button type="primary" size="medium" disabled>
							赞成({{details.vote_agree_num}})
						</u-button>
						<u-button type="error" size="medium" disabled>
							反对({{details.vote_against_num}})
						</u-button>
						
					</view>
					<view class="footer-top" v-if="details.vote_status === 2 || details.vote_status === 3">
						<p>活动已结束，禁止投票</p>
					</view>
					<view class="footer-top" v-else-if="details.vote_status === 0">
						<p>活动未开始，禁止投票</p>
					</view>
					<view class="footer_body">
						<p>投票说明：</p>
						<p>1.仅小区业主或住户有投票权</p>
						<p>2.一个用户仅一次投票权</p>
					</view>
				</view>
			</view>
			<view class="hd_detail" v-else>
				<view class="content" v-html="details.content">
				</view>
				<view class="footer">
					<view class="footer-top" v-if="!details.log_info.is_apply && details.apply_status === 1">
						<u-button type="primary" size="medium" @click=doApply() :loading="isLoading">
							<p :class="active? 'text_p' : ''">报名参加({{details.apply_num}})<i class='a' style="color: #2979ff;">+1</i></p>
						</u-button>
					</view>
					<view class="footer-top" v-else-if="details.apply_status === 1 && details.log_info.is_apply">
						<!-- <u-button type="primary" size="medium" disabled>已报名</u-button> -->
						<p>已报名({{details.apply_num}})</p>
					</view>
					<view class="footer-top" v-if="details.apply_status === 0">
						<p>活动未开始</p>
					</view>
					<view class="footer-top" v-if="details.apply_status === 2">
						<p>活动已结束</p>
					</view>
				</view>
			</view>
			<view style="height: 60rpx;">
			</view>
		</view>
		<u-popup ref="popTimer" v-model="active" mode="center" :z-index="18899" :closeable="true" :border-radius="30">
			<p class="dialog_text">{{ text }}成功，感谢支持</p>
			<view class="dialog_footer">
				<p class="dialog_bth" @click="onReload()">确定</p>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import * as Api from '@/api/interaction.js'
	export default {
		data() {
			return {
				details: [],
				routeIndex: 0,
				isLoading: false,
				noLoading: false,
				isRecord: true,
				active: false,
				text: '投票',
				noactive: false,
				isActive: false
			}
		},
		onLoad(option) {
			this.getDetails(option.id)
			this.eid = option.id
		},
		methods: {
			//刷新页面
			onReload() {
				this.isRecord = false;
				this.active = false;
				this.isActive = false
				this.noactive = false
				this.getDetails(this.eid)
				this.$nextTick(() => {
					this.isRecord = true
				})
			},
			// 请求详情
			getDetails(eid) {
				Api.details({
					id: eid
				}).then(res => {
					this.details = res.data
					this.details.content = (this.details.content).replace(/\<img/gi,
						'<img style="max-width:100%;height:auto" ')
					this.text = details.interact_type === 1 ? '投票' : '报名'
				})
			},
			/**
			 * 分享当前页面
			 */
			onShareAppMessage() {
				const app = this
				// 构建页面参数
				const params = app.$getShareUrlParams({
					id: app.details.id,
				})
				return {
					title: app.details.title,
					path: `/pages/tools/interaction/detailes/detailes?${params}`
				}
			},
			// 进行投票操作
			doVote(i) {
				if (i) {
					this.isLoading = true
				} else {
					this.noLoading = true
				}
				Api.doVote({
					id: this.details.id,
					vote_status: i
				}).then(res => {
					this.isLoading = false
					this.noLoading = false
					this.active = true
					if (i) {
						this.isActive = true
					} else {
						this.noactive = true
					}
				}).catch(err => {
					this.onReload()
				})
			},
			// 报名
			doApply() {
				this.isLoading = true
				Api.doApply({
					id: this.details.id
				}).then(res => {
					this.isLoading = false
					this.active = true
				}).catch(err => {
					this.onReload()
				})
			}
		}
	}
</script>
<style>
	page {
		background-color: #fff;
	}
</style>
<style lang="scss" scoped>
	.detail_title {
		width: 100%;
		padding: 20rpx;
		font-size: 32rpx;
		font-weight: bold;
		white-space: 20rpx;
	}

	.detail_top {
		display: flex;
		justify-content: space-between;
		padding: 16rpx 20rpx;
		font-size: 36rpx;
		align-items: center;
		// border-bottom: 1rpx solid (rgba(0, 0, 0, 0.05));
		// box-shadow: 0 0rpx 0rpx 1rpx rgba(0, 0, 0, 0.05);
		background-color: #fff;

		u-icon {
			flex: 1;
		}
	}

	.details_content {
		.tz_detail {
			padding: 20rpx 0rpx;

			.content {
				width: 100vw;
				margin: 0 auto;
				// box-shadow: 0 1rpx 5rpx 0px rgba(0, 0, 0, 0.05);
				padding: 20rpx;
				background-color: #fff;
				min-height: calc(100vh - 320rpx);
				border-radius: 20rpx;
			}
		}

		.tp_detail {
			padding: 20rpx 0rpx;

			.content {
				width: 100vw;
				margin: 0 auto;
				box-shadow: 0 1rpx 5rpx 0px rgba(0, 0, 0, 0.05);
				padding: 20rpx;
				background-color: #fff;
				min-height: calc(100vh - 570rpx);
				border-radius: 20rpx;
				overflow: scroll;
			}

			.footer {
				width: 100vw;
				margin: 0 auto;
				box-shadow: 0 1rpx 5rpx 0px rgba(0, 0, 0, 0.05);
				padding: 20rpx;
				background-color: #fff;
				border-radius: 20rpx;
				margin-top: 20rpx;

				.footer-top {
					display: flex;
					justify-content: space-around;
					p {
						position: relative;
						i {
							position: absolute;
							top: 0;
							font-size: #2979ff;
							z-index: -1;
						}
						&.text_p {
							i {
								animation: tip 2s;
							}
						}
					}
				}

				.footer_body {
					margin: 20rpx;

					p {
						&:first-child {
							font-size: 28rpx;
							color: #aa0000;
						}
					}
				}
			}
		}

		.hd_detail {
			padding: 20rpx 0rpx;

			.content {
				width: 100vw;
				margin: 0 auto;
				box-shadow: 0 1rpx 5rpx 0px rgba(0, 0, 0, 0.05);
				padding: 20rpx;
				background-color: #fff;
				min-height: calc(100vh - 400rpx);
				border-radius: 20rpx;
				overflow: scroll;
			}

			.footer {
				width: 100vw;
				margin: 0 auto;
				box-shadow: 0 1rpx 5rpx 0px rgba(0, 0, 0, 0.05);
				padding: 20rpx;
				background-color: #fff;
				border-radius: 20rpx;
				margin-top: 20rpx;
			}

			.footer-top {
				width: 100%;
				display: flex;
				justify-content: center;
				p {
					position: relative;
					i {
						position: absolute;
						top: 0;
						font-size: #2979ff;
						z-index: -1;
					}
					&.text_p {
						i {
							animation: tip 2s;
						}
					}
				}
			}
		}
	}

	.dialog_text {
		padding: 80rpx;
		width: 90vw;
		box-sizing: border-box;
		text-align: center;
		font-size: 36rpx;
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

	@keyframes tip {
		0% {
			top: -100%;
			z-index: 10;
		}
		100% {
			top: -150%;
			z-index: 10;
		}
	}
</style>