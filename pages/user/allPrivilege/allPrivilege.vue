<template>
	<view v-if="!isFirstload" class="all-privilege-page">
		<view class="privilege-wrap">
			<view class="privilege-item">
				<view class="privilege-title">
					<text class="title">花{{ setting[SettingKeyEnum.POINTS.value].points_name }}</text>
					<text class="desc">无条件限制</text>
				</view>
				<view class="privilege-block-wrap" >
					<view class="privilege-block-item" v-for="(item,index) in spendList" :key="index" @click="onAllPrivilegeDetail(item.articleId)">
						<text class="wyiconfont" :class="[`icon-${item.icon}`]"></text>
						<view class="title">{{item.title}}</view>
						<view class="rate-wrap">
							<text class="rate-text" v-if="false">{{item.times}}倍</text>
						</view>
					</view>
					<!-- <view class="privilege-block-item">
						<text class="wyiconfont icon-dingdan"></text>
						<view class="title">抵生活消费</view>
						<view class="rate-wrap">
							<text class="rate-text">1倍</text>
						</view>
					</view>
					<view class="privilege-block-item">
						<text class="wyiconfont icon-dingdan"></text>
						<view class="title">抵优选好物</view>
						<view class="rate-wrap">
							<text class="rate-text">1倍</text>
						</view>
					</view> -->
				</view>
			</view>
		
			<view class="privilege-item">
				<view class="privilege-title">赚{{ setting[SettingKeyEnum.POINTS.value].points_name }}</view>
				<view class="privilege-block-wrap">
					<view class="privilege-block-item" v-for="(item,index) in earnList" :key="index" @click="onAllPrivilegeDetail(item.articleId)">
						<text class="wyiconfont" :class="[`icon-${item.icon}`]"></text>
						<view class="title">{{item.title}}</view>
						<view class="rate-wrap">
							<text class="rate-text">{{item.percentage}}{{ setting[SettingKeyEnum.POINTS.value].points_name }}</text>
						</view>
					</view>
					<!-- <view class="privilege-block-item">
						<text class="wyiconfont icon-dingdan"></text>
						<view class="title">生活消费返</view>
						<view class="rate-wrap">
							<text class="rate-text">20%{{ setting[SettingKeyEnum.POINTS.value].points_name }}</text>
						</view>
					</view>
					<view class="privilege-block-item">
						<text class="wyiconfont icon-dingdan"></text>
						<view class="title">优选返{{ setting[SettingKeyEnum.POINTS.value].points_name }}</view>
						<view class="rate-wrap">
							<text class="rate-text">最高10%</text>
						</view>
					</view> -->
				</view>
			</view>
		
		</view>
	</view>
</template>

<script>
	import SettingKeyEnum from '@/common/enum/setting/Key'
	import SettingModel from '@/common/model/Setting'
	export default {
		data() {
			return {
				// 枚举类
				SettingKeyEnum,
				// 正在加载
				isLoading: true,
				// 首次加载
				isFirstload: true,
				// 系统设置
				setting: {},
				//花知珠列表
				spendList: [
					{
						icon: 'yiwudizhai',
						title: '物业缴费',
						times: 1,
						articleId:'10005'
					},
					{
						icon: 'baobao',
						title: '生活服务',
						times: 1,
						articleId:'10006'
					},
					{
						icon: 'liwu',
						title: '优选商品',
						times: 1,
						articleId:'10007'
					},
				],
				earnList: [
					{
						icon: 'renminshenghuo',
						title: '物业缴费',
						percentage: '1%-2%',
						articleId:'10008'
					},
					{
						icon: 'qianbao',
						title: '生活服务',
						percentage: '1%-10%',
						articleId:'10009'
					},
					{
						icon: 'qian4',
						title: '优选商品',
						percentage: '1%-20%',
						articleId:'10010'
					}
				]
			};
		},
		onLoad() {
			// 获取页面数据
			this.getPageData()
		},
		methods: {

			// 获取商城设置
			getSetting() {
				const app = this
				return new Promise((resolve, reject) => {
					SettingModel.data()
						.then(setting => {
							app.setting = setting
							resolve(setting)
						}).catch(reject)
				})
			},
			
			// 获取页面数据
			getPageData(callback) {
				const app = this
				app.isLoading = true
				Promise.all([app.getSetting()])
					.then(result => {
						app.isFirstload = false
						// 初始化我的服务数据
						// app.initService()
						// 初始化订单操作数据
						// app.initOrderTabbar()
						// 执行回调函数
						callback && callback()
					})
					.catch(err => console.log('catch', err))
					.finally(() => app.isLoading = false)
			},
			
			//跳转特权详情页面
			onAllPrivilegeDetail(e) {
				this.$navTo('pages/article/detail?articleId='+e)
			}
		}
	}
</script>

<style lang="scss" scoped>
page {
	background-color: #F1F1F1;
}

.all-privilege-page {
	
	padding-top: 40rpx;
	
	.privilege-wrap {
		
		.privilege-item {
			background-color: #fff;
			margin: 0 20rpx;
			border-radius: 16rpx;
			
			.privilege-title {
				padding: 26rpx 30rpx;
				font-size: 36rpx;
				font-weight: bold;
				border-bottom: 2rpx solid #f3f3f3;
				display: flex;
				justify-content: space-between;
				
				.desc {
					color: #ff7878;
					font-size: 28rpx;
					font-weight: normal;
				}
			}

			.privilege-block-wrap {
				margin: 20rpx 0;
				padding: 30rpx;
				display: flex;
				flex-wrap: wrap;
				$num: 3;
				$gap: 10rpx;

				.privilege-block-item {
					width: calc((100% - #{$gap} * (#{$num} - 1)) / #{$num});
					text-align: center;
					
					.wyiconfont {
						color: #ff0018;
						font-size: 60rpx;
					}
					
					.title {
						color: #999999;
						font-weight: bold;
						margin-top: 16rpx;
					}

					.rate-wrap {
						
						.rate-text {
							display: inline-block;
							margin-top: 4rpx;
							background-color: #3BA5FC;
							border-radius: 10rpx;
							color: #fff;
							font-size: 26rpx;
							padding: 4rpx 10rpx;
						}

					}
					
					&:nth-of-type(n + 4) {
						margin-top: 30rpx;
					}
					
				}
			}
			
			& + .privilege-item {
				margin-top: 40rpx;
			}
			
		}
		
	}
	
}

</style>
