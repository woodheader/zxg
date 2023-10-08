<template>
	<view v-if="!isFirstload" class="container">
		<!-- 页面头部 -->
		<view class="main-header"

			>
			<NavBar :itemStyle="defaultData.navbar.style"/>
			<view class="bg-image"></view>

			<!-- 用户信息 -->
			<view v-if="isLogin" class="user-info-wrap">
				<view class="user-info-content">
					<view class="user-avatar" @click="handlePersonal()">
						<avatar-image :url="userInfo.avatar_url" :width="100" />
					</view>
					<view class="user-content">
						<!-- 会员昵称 -->
						<view class="nick-name oneline-hide" @click="handlePersonal()">{{ userInfo.wy_role_name }}</view>
						<!-- 会员等级 -->
						<view v-if="userInfo.grade_id > 0 && userInfo.grade" class="user-grade">
							<view class="user-grade_icon">
								<image class="image"
									src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAA0lBMVEUAAAD/tjL/tzH/uDP/uC7/tjH/tzH/tzL/tTH+tTL+tjP/tDD/tTD+tzD/tjL/szD/uDH/tjL/tjL+tjD/tjT/szb/tzL/tTL+uTH+tjL/tjL/tjL/tTT/tjL/tjL+tjH/uTL/vDD/tjL/tjH/tzL9uS//tTL/nBr/sS7/tjH/ujL/szD/uTv+rzf/tzL+tzH+vDP+uzL+tjP+ry7+tDL9ki/7szf/sEX/tTL/tjL+tjL/tTH/tTT/tzH/tzL/tjP/sTX/uTP/wzX+rTn/vDX9vC8m8ckhAAAAOXRSTlMAlnAMB/vjxKWGMh0S6drMiVxPRkEY9PLy0ru0sKagmo5+dGtgVCMgBP716eXWyMGxqJGRe2o5KSmFNjaYAAABP0lEQVQ4y8XS13KDMBAF0AWDDe4t7r3ETu9lVxJgJ/n/X8rKAzHG5TE+Twz3zki7I/g/KXdghIbGJewrU4yzn08Ebgl6TuZzzuOC6W5es3HX6qsSz3NFShRU0MpucytDmOSpu3yULx3CA9RD1HjVedc0jSjqm6ZzhUjDsFDQhSp/OKj5GQvg0+ZCOixsbtDLAeTTOm/yGi8GyIphIVsgH737FEDV44LJa88IRKK/SetrwT9G/GUIr6vXjoy4GXn7+RboVXnghuSjaoGecwQxL2su3CwAKlO+QFoqxI4FMctHQhQd2OhxTu184jWUlI+rMTBTn1/IQcJHQ6GQdZ7pWiDaNdhTt330efISeiqYwQEzQpTlsURJLhzkEmpCPsERfeIUVyXr6MNuIyp5uziW6xURtt7hhGwzmMNJExfO4Bd9X0ZPqAxdNwAAAABJRU5ErkJggg==">
								</image>
							</view>
							<view class="user-grade_name">
								<text>{{ userInfo.grade.name }}</text>
							</view>
						</view>
						<!-- 会员无等级时显示手机号 -->
						<!-- <view v-else class="mobile">{{ userInfo.mobile }}</view> -->
					</view>

				</view>
			</view>
			<!-- 未登录 -->
			<view v-else class="user-info" @click="handleLogin">
				<view class="user-avatar">
					<avatar-image :width="100"/>
				</view>
				<view class="user-content">
					<view class="nick-name">登录/注册</view>
					<view class="login-tips">点击登录账号</view>
				</view>
			</view>

		</view>

		<view class="user-card">
			<view class="integral-title" @click="onGuanZhu">我的{{ setting[SettingKeyEnum.POINTS.value].points_name }}<text  class="wyiconfont icon-wenhao-yuankuang"></text> </view>
			<view class="integral-tip" @click="onGuanZhuDetailed">
				<view class="integral">
					<text class="points">{{ isLogin ? assets.points : '--' }}</text>
					<text v-if="isLogin">明细 > </text></view>
				<!-- <view class="no-login" v-if="!isLogin">登陆后查看{{ setting[SettingKeyEnum.POINTS.value].points_name }}余额</view> -->
			</view>
			<view class="privilege">
				<view class="title">
					<text>我的特权</text>
					<view class="all" @click="onAllPrivilege">
						查看全部<u-icon name="arrow-right" color="#908670" size="28"></u-icon>
					</view>
				</view>
				<!-- <view class="asset-left flex-box dis-flex flex-x-around balance">
					<view class="asset-left-item" style="max-width: 200rpx;" @click="onTargetWallet">
						<view class="item-value dis-flex flex-x-center">
							<text>{{ isLogin ? assets.balance : '--' }}</text>
						</view>
						<view class="item-name dis-flex flex-x-center">
							<text class="oneline-hide">账户余额</text>
						</view>
					</view>
					<view class="asset-left-item" @click="onTargetPoints">
						<view class="item-value dis-flex flex-x-center">
							<text>{{ isLogin ? assets.points : '--' }}</text>
						</view>
						<view class="item-name dis-flex flex-x-center">
							<text class="oneline-hide">{{ setting[SettingKeyEnum.POINTS.value].points_name }}</text>
						</view>
					</view>
					<view class="asset-left-item" @click="onTargetMyCoupon">
						<view class="item-value dis-flex flex-x-center">
							<text class="oneline-hide">{{ isLogin ? assets.coupon : '--' }}</text>
						</view>
						<view class="item-name dis-flex flex-x-center">
							<text>优惠券</text>
						</view>
					</view>

					<view class="asset-left-item" @click="onTargetWallet">
						<view class="item-value dis-flex flex-x-center">
							<text class="iconfont icon-qianbao"></text>
						</view>
						<view class="item-name dis-flex flex-x-center">
							<text>我的钱包</text>
						</view>
					</view>

				</view> -->
				<view class="asset-left flex-box dis-flex flex-x-around balance">
					<view class="asset-left-item" style="max-width: 200rpx;" @click="onLife">
						<view class="item-value dis-flex flex-x-center">
							<text class="wyiconfont icon-renminshenghuo"></text>
						</view>
						<view class="item-name dis-flex flex-x-center">
							<text class="oneline-hide">{{ setting[SettingKeyEnum.POINTS.value].points_name }}生活</text>
							<text class="oneline-hide oneline-small">畅通无阻</text>
						</view>
					</view>
					<view class="asset-left-item" @click="onAllPrivilegeDetail('10008')">
						<view class="item-value dis-flex flex-x-center">
							<text class="wyiconfont icon-qianbao"></text>
						</view>
						<view class="item-name dis-flex flex-x-center">
							<text class="oneline-hide">物业缴费</text>
							<text class="oneline-hide oneline-small">最高送2%</text>
						</view>
					</view>
					<view class="asset-left-item" @click="onAllPrivilegeDetail('10009')">
						<view class="item-value dis-flex flex-x-center">
							<text class="wyiconfont icon-qian4"></text>

						</view>
						<view class="item-name dis-flex flex-x-center">
							<text class="oneline-hide">生活服务</text>
							<text class="oneline-hide oneline-small">最高送10%</text>
						</view>
					</view>

					<view class="asset-left-item" @click="onAllPrivilegeDetail('10010')">
						<view class="item-value dis-flex flex-x-center">
							<text class="wyiconfont icon-qian4"></text>

						</view>
						<view class="item-name dis-flex flex-x-center">
							<text class="oneline-hide">优选商品</text>
							<text class="oneline-hide oneline-small">最高送20%</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- <view v-for="(item, index) in noticeList" :key="index">
			<MsgNotice :itemStyle="item.style" :params="item.params" />
		</view> -->

		<!-- 订单操作 -->
		<view class="order-navbar">
			<view class="title">我的订单</view>

			<view class="order-wrap">
				<view class="order-item" @click="onTargetLifeOrder(orderNavbar[0])">
					<view class="item-icon">
						<text class="wyiconfont icon-dingdan"></text>
					</view>
					<view class="item-name">生活订单</view>
					<view class="item-badge" v-if="orderNavbar[0] && orderNavbar[0].count && orderNavbar[0].count > 0">
						<text v-if="orderNavbar[0].count <= 99" class="text">{{ orderNavbar[0].count }}</text>
						<text v-else class="text">99+</text>
					</view>
				</view>
				<view class="order-item" @click="onTargetOrder(orderNavbar[0])">
					<view class="item-icon">
						<text class="wyiconfont icon-youxuan"></text>
					</view>
					<view class="item-name">优选订单</view>
					<view class="item-badge" v-if="orderNavbar[0] && orderNavbar[0].count && orderNavbar[0].count > 0">
						<text v-if="orderNavbar[0].count <= 99" class="text">{{ orderNavbar[0].count }}</text>
						<text v-else class="text">99+</text>
					</view>
				</view>
        <!--view class="order-item" @click="onTargetSupOrder()" v-if="userInfo.is_sup_user">
          <view class="item-icon">
            <text class="wyiconfont icon-shuitong"></text>
          </view>
          <view class="item-name">我的派单</view>
          <view class="item-badge" v-show="false">
          </view>
        </view-->

			</view>
		</view>

		<view class="">
			<view class="noLogin" v-if="!isLogin">
				<view  class="title">
					<view>登陆后可查看我的房屋</view>
					<view class="room-manager">
						<text @click="handleLogin">去登录</text>
					</view>
				</view>
			</view>

			<view class="" v-else>
				<view class="section" v-if="userInfo.wy_role_name == '业主'">
					<view class="header">
						<view class="title">我的房屋</view>
						<view class="title-right">
							<view class="room-manager" @click="onSetRoom">
								<text class="wyiconfont icon-shezhi"></text>
								<text>房屋管理</text>
							</view>
						</view>
					</view>

					<view class="section-wrap">
						<!-- <view v-if="isLogin" class="room">
							<view>登陆后可查看我的房间</view>
							<view class="please-login">
								<text @click="handleLogin">请登录</text>
							</view>
						</view> -->
						<view class="room">
							<view class="">
								<!-- <view>您还没有认领房间</view> -->
								<view class="roomInfo">
									<view class="">
										小区：{{roomInfo.village_name}}
									</view>
									 <view>门牌号：{{roomInfo.room}}</view>

								</view>
							</view>

							<!--view class="add-room">
								<text @click="onAddRoom">
									<text>添加房屋</text>
									<text class="iconfont" :class="[`icon-arrow-right`]"></text>
								</text>
							</view-->
						</view>

					</view>
				</view>

				<view class="section" v-else>
					<view class="header">
						<view class="title">我的房屋</view>
						<view class="title-right">
							<view class="room-manager" @click="onSetRoom">
								<text class="wyiconfont icon-shezhi"></text>
								<text>房屋管理</text>
							</view>
						</view>
					</view>

					<view class="section-wrap">
						<!-- <view v-if="isLogin" class="room">
							<view>登陆后可查看我的房间</view>
							<view class="please-login">
								<text @click="handleLogin">请登录</text>
							</view>
						</view> -->
						<view class="room">
							<view class="">
								<view>您还没有自己的房屋</view>
								<view>(房屋绑定手机和登录手机须一致)</view>
							</view>
							<!--view class="add-room">
								<text @click="onAddRoom">
									<text>添加房屋</text>
									<text class="iconfont" :class="[`icon-arrow-right`]"></text>
								</text>
							</view-->
						</view>

					</view>
				</view>
			</view>
		</view>




		<view class="section">
			<view class="header">
				<view class="title">联系管家</view>
			</view>

			<view class="section-wrap">
				<view class="daemon">
					<view>7*24小时为您守护</view>
				</view>
			</view>

			<u-button class="contact" @click="onHelp(stewardPhone)">
				<text class="wyiconfont icon-a-kefukefuzhongxin"></text>
			</u-button>

			<!-- <u-button class="contact" open-type="contact" size="mini" plain>
				<text class="wyiconfont icon-a-kefukefuzhongxin"></text>
			</u-button> -->

		</view>

		<!-- 我的服务 -->
		<view class="my-service">
			<view class="service-title">推荐工具</view>
			<view class="service-content clearfix">
				<block v-for="(item, index) in service" :key="index">
					<view v-if="item.type == 'link'" class="service-item" @click="handleService(item)">
						<view class="">
							<view class="item-icon" v-if="item.wyiconfont">
								<text class="wyiconfont" :class="[`icon-${item.icon}`]"></text>
							</view>
							<view class="item-icon" v-else>
								<text class="iconfont" :class="[`icon-${item.icon}`]"></text>
							</view>
						</view>

						<view class="item-name">{{ item.name }}</view>
						<view class="item-badge" v-if="item.count && item.count > 0">
							<text v-if="item.count <= 99" class="text">{{ item.count }}</text>
							<text v-else class="text">99+</text>
						</view>
					</view>
					<view v-if="item.type == 'button' && platform == 'MP-WEIXIN'" class="service-item">
						<button class="btn-normal" :open-type="item.openType">
							<view class="item-icon">
								<text class="iconfont" :class="[`icon-${item.icon}`]"></text>
							</view>
							<view class="item-name">{{ item.name }}</view>
						</button>
					</view>
				</block>
			</view>
		</view>

		<view style="height: 50rpx">

		</view>

		<!-- 退出登录 -->
		<!-- <view v-if="isLogin" class="my-logout">
			<view class="logout-btn" @click="handleLogout()">
				<text>退出登录</text>
			</view>
		</view> -->

		<u-modal v-model="showGjHelpModal" title="您还不是小区用户" :show-cancel-button="false"
			confirm-text='确认'>
			<view class="toBind">成为小区用户须满足以下条件之一</view>
			<view class="toBind2">(业主、租户、家庭成员)</view>
		</u-modal>

	</view>
</template>

<script>
	import store from '@/store'
	import AvatarImage from '@/components/avatar-image'
	import {
		setCartTabBadge
	} from '@/core/app'
	import SettingKeyEnum from '@/common/enum/setting/Key'
	import SettingModel from '@/common/model/Setting'
	import * as UserApi from '@/api/user'
	import * as OrderApi from '@/api/order'
	import * as PageApi from '@/api/page'
	import NavBar from '@/components/page/navBar/index.vue'
	import MsgNotice from '@/components/page/msgNotice/index.vue'
	import {
		checkLogin
	} from '@/core/app'
	import * as CartApi from '@/api/cart'
import { isEmpty } from '../../utils/util'

	// 订单操作
	const orderNavbar = [{
			id: 'all',
			name: '全部订单',
			icon: 'qpdingdan'
		},
		{
			id: 'payment',
			name: '待支付',
			icon: 'daifukuan',
			count: 0
		},
		{
			id: 'delivery',
			name: '待发货',
			icon: 'daifahuo',
			count: 0
		},
		{
			id: 'received',
			name: '待收货',
			icon: 'daishouhuo',
			count: 0
		},
	]

	/**
	 * 我的服务
	 * id: 标识; name: 标题名称; icon: 图标; type 类型(link和button); url: 跳转的链接
	 */
	const service = [
		{
			id: 'address',
			name: '收货地址',
			icon: 'shouhuodizhi',
			type: 'link',
			url: 'pages/address/index',
      wyiconfont: false
		},
		// {
		// 	id: 'coupon',
		// 	name: '领券中心',
		// 	icon: 'lingquan',
		// 	type: 'link',
		// 	url: 'pages/coupon/index'
		// },
		// {
		// 	id: 'myCoupon',
		// 	name: '优惠券',
		// 	icon: 'youhuiquan',
		// 	type: 'link',
		// 	url: 'pages/my-coupon/index'
		// },
		// {
		// 	id: 'help',
		// 	name: '我的帮助',
		// 	icon: 'bangzhu',
		// 	type: 'link',
		// 	url: 'pages/help/index'
		// },
		// {
		// 	id: 'contact',
		// 	name: '在线客服',
		// 	icon: 'kefu',
		// 	type: 'button',
		// 	openType: 'contact'
		// },
		{
			id: 'cart',
			name: '购物车',
			icon: 'cart',
			type: 'link',
			url: 'pages/cart/index',
      wyiconfont: false
		},
		{
			id: 'about',
			name: '关于我们',
			icon: 'guanyuwomen',
			type: 'link',
			url: 'pages/user/aboutUs/index',
      wyiconfont: false
		},
		{
			id: 'set',
			name: '设置',
			icon: 'shezhi1',
			type: 'link',
			url: 'pages/set/index',
      wyiconfont: true
		},
    {
      id: 'jjz',
      name: '进京证',
      icon: 'chuzuche',
      type: 'link',
      url: 'pages/jjz/index',
      wyiconfont: true
    },
	]

	export default {
		components: {
			AvatarImage,
			NavBar,
			MsgNotice
		},
		data() {
			return {
				// 枚举类
				SettingKeyEnum,
				// 正在加载
				isLoading: true,
				// 首次加载
				isFirstload: true,
				// 是否已登录
				isLogin: false,
				// 系统设置
				setting: {},
				// 当前用户信息
				userInfo: {},
				// 账户资产
				assets: {
					balance: '--',
					points: '--',
					coupon: '--'
				},
				// 我的服务
				service,
				// 订单操作
				orderNavbar,
				// 当前用户待处理的订单数量
				todoCounts: {
					payment: 0,
					deliver: 0,
					received: 0
				},
				//navBar
				defaultData: {
					navbar: {
						"name": "导航组",
						"type": "navBar",
						"style": {
							"background": "#E6C48D",
							"textColor": "#000"
						},
					}
				},
				roomInfo: {} ,
				//管家号码
				stewardPhone: '',
				// 点击管家电话，显示弹窗
				showGjHelpModal: false,
				// 购物车总数量
				cartTotal: 0,
				// 消息通知，消息题
				noticeList: []
			}
		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow(options) {
			this.onRefreshPage()
		},

		onLoad() {

		},

		methods: {

			// 刷新页面
			onRefreshPage() {
				let app = this
				// 更新购物车角标
				// setCartTabBadge()
				// 判断是否已登录
				this.isLogin = checkLogin()
				// 获取页面数据
				this.getPageData(() => {
				})
				// 消息通知
				this.getNotices()
			},

			// 设置tabbar 红点
			setTabBarRedDot(){
				if (isEmpty(this.noticeList)) {
					uni.hideTabBarRedDot({
						 index: 3,
						 fail(r) {
						  console.log(r, 'false')
						 }
					})
				} else {
					uni.showTabBarRedDot({
						index: 3
					})
				}
			},

			getNotices(){
				let app = this
				PageApi.notices('').then(res => {
					app.noticeList = res.data
					app.setTabBarRedDot()
				}).catch(err => console.log('get notice catch', err))
			},

			// 获取页面数据
			getPageData(callback) {
				const app = this
				app.isLoading = true
				Promise.all([app.getSetting(), app.getUserInfo(), app.getUserAssets(), app.getTodoCounts(), app.getCartTotal()])
					.then(result => {
						app.isFirstload = false
						// 初始化我的服务数据
						app.initService()
						// 初始化订单操作数据
						// app.initOrderTabbar()
						// 设置顶部导航栏栏
						app.setPageBar();
						app.getWyUserInfo()
						//执行回调函数
						callback && callback()
					})
					.catch(err => console.log('catch', err))
					.finally(() => app.isLoading = false)
			},

			// 获取购物车总数量
			getCartTotal() {
			  const app = this
			  return new Promise((resolve, reject) => {
			    CartApi.total()
			      .then(result => {
			        app.cartTotal = result.data.cartTotal
			        resolve(result)
			      })
			      .catch(reject)
			  })
			},

			//获取房间信息
			getWyUserInfo() {
				if(this.userInfo.wy_role_name == '业主') {
					UserApi.getWyUserInfo({form: {mobile: this.userInfo.mobile}}).then(res => {
						this.roomInfo = res.data.list[0]
						res.data.list.forEach((item, index) => {
							if (item.mobile === this.userInfo.mobile && item.status === 'YES') {
								this.roomInfo = item
							}
						})
					})
				}else {

				}

			},

			/**
			 * 设置顶部导航栏
			 */
			setPageBar() {

				const {
					page
				} = this

				// 设置页面标题
				uni.setNavigationBarTitle({
					title: '个人中心',
					// title: page.params.title
				});
				// 设置navbar标题、颜色
				uni.setNavigationBarColor({
					frontColor: false ? '#ffffff' : '#000000',
					backgroundColor: '#E6C48D',
					// frontColor: page.style.titleTextColor === 'white' ? '#ffffff' : '#000000',
					// backgroundColor: page.style.titleBackgroundColor
				})



				// const {
				// 	page
				// } = this
				// // 设置页面标题
				// uni.setNavigationBarTitle({
				// 	title: "个人中心"
				// 	// title: page.params.title
				// });
				// // 设置navbar标题、颜色
				// uni.setNavigationBarColor({
				// 	frontColor: '#fff',
				// 	backgroundColor: '#E6C48D',
				// 	// frontColor: page.style.titleTextColor === 'white' ? '#ffffff' : '#000000',
				// 	// backgroundColor: page.style.titleBackgroundColor
				// 	// titleBackgroundColor
				// 	// :
				// 	// "#218cfe",
				// 	// titleTextColor
				// 	// :
				// 	// "white"
				// })
			},



			// 初始化我的服务数据
			initService() {
				const app = this
				const newService = []
				service.forEach(item => {
					if (item.id === 'points') {
						item.name = '我的' + app.setting[SettingKeyEnum.POINTS.value].points_name
					}
					// 数据角标
					if (item.count != undefined) {
						item.count = app.todoCounts[item.id]
					}
					if (item.id === 'cart') {
						item.count = app.cartTotal
					}
					newService.push(item)
				})
				// //移除添加的成员
				// if (this.userInfo.wy_role_name != '业主') {
				// 	newService.splice(0, 1)
				// }
				app.service = newService
			},

			// 初始化订单操作数据
			initOrderTabbar() {
				const app = this
				const newOrderNavbar = []
				orderNavbar.forEach(item => {
					if (item.count != undefined) {
						item.count = app.todoCounts[item.id]
					}
					newOrderNavbar.push(item)
				})
				app.orderNavbar = newOrderNavbar
			},

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

			// 获取当前用户信息
			getUserInfo() {
				const app = this
				return new Promise((resolve, reject) => {
					UserApi.info({}, {
							load: app.isFirstload
						})
						.then(result => {
							app.userInfo = result.data.userInfo
							app.stewardPhone =  result.data.userInfo.stewardPhone
							resolve(app.userInfo)
						})
						.catch(err => {
							if (err.result && err.result.status == 401) {
								app.isLogin = false
								resolve(null)
							} else {
								reject(err)
							}
						})
				})
			},

			// 获取账户资产
			getUserAssets() {
				const app = this
				return new Promise((resolve, reject) => {
					!app.isLogin ? resolve(null) : UserApi.assets({}, {
							load: app.isFirstload
						})
						.then(result => {
							app.assets = result.data.assets
							resolve(app.assets)
						})
						.catch(err => {
							if (err.result && err.result.status == 401) {
								app.isLogin = false
								resolve(null)
							} else {
								reject(err)
							}
						})
				})
			},

			// 获取当前用户待处理的订单数量
			getTodoCounts() {
				const app = this
				return new Promise((resolve, reject) => {
					!app.isLogin ? resolve(null) : OrderApi.todoCounts({}, {
							load: app.isFirstload
						})
						.then(result => {
							app.todoCounts = result.data.counts
							resolve(app.todoCounts)
						})
						.catch(err => {
							if (err.result && err.result.status == 401) {
								app.isLogin = false
								resolve(null)
							} else {
								reject(err)
							}
						})
				})
			},

			// 跳转到登录页
			handleLogin() {
				!this.isLogin && this.$navTo('pages/login/index')
			},

			//跳转添加房间
			onAddRoom() {
				this.$navTo('pages/user/addRoom/index')
			},

			//跳转房间设置
			onSetRoom() {
				var e = this.userInfo
				this.$navTo('pages/user/setRoom/index', e)
			},


			// 跳转到修改个人信息页
			handlePersonal() {
				if (this.userInfo.wy_role_name == '业主') {
					return
				}
				this.$navTo('pages/user/personal/index')
			},

			// 退出登录
			// handleLogout() {
			// 	const app = this
			// 	uni.showModal({
			// 		title: '友情提示',
			// 		content: '您确定要退出登录吗?',
			// 		success(res) {
			// 			if (res.confirm) {
			// 				store.dispatch('Logout', {})
			// 					.then(result => app.onRefreshPage())
			// 			}
			// 		}
			// 	})
			// },

			// 跳转到钱包页面
			onTargetWallet() {
				this.$navTo('pages/wallet/index')
			},

			// 跳转到订单页
			onTargetOrder(item) {
				this.$navTo('pages/order/index', {
					dataType: item.id
				})
			},

      // 跳转到服务订单页
      onTargetLifeOrder(item) {
        this.$navTo('pages/life/order/index', {
          dataType: item.id
        })
      },

      onTargetSupOrder() {
        this.$navTo('pages/life/sup/index', {})
      },

			// 跳转到特权详情页面
			onAllPrivilegeDetail(id) {
				this.$navTo('pages/article/detail?articleId='+id)
			},

			// 跳转到我的优惠券页
			onTargetMyCoupon(e) {
				this.$navTo('pages/user/allPrivilegeDetail/index', {e})
			},

			//跳转生活页页面
			onLife() {
				this.$navTo('pages/user/allPrivilege/allPrivilege')
			},

			//跳转全部特权页面
			onAllPrivilege() {
				this.$navTo('pages/user/allPrivilege/allPrivilege')
			},

			//跳转知珠介绍页面
			onGuanZhu() {
				this.$navTo('pages/user/guanzhu/index')
			},

			//跳转知珠明细
			onGuanZhuDetailed() {
				if (!this.isLogin) {
					uni.showToast({
						title: '登录后才能查看知珠明细',
						icon: 'none'
					})
					return false
				}
				this.$navTo('pages/user/guanZhuDetailed/index')
			},

			//跳转帮助页面
			onHelp(mobile) {
				const app = this
				if (!this.isLogin) {
					uni.showToast({
						title: '登录后才能联系管家',
						icon: 'none'
					})
					return false
				}
				this.getUserInfo()
				if(this.userInfo.wy_role_name == '普通用户') {
					app.showGjHelpModal = true
				}else {
					uni.makePhoneCall({
						phoneNumber: mobile,
						success: () => {
							console.log('拨打成功');
						},
						fail: () => {
							app.getUserInfo()
							console.log('拨打失败');
						}
					})
				}
			},

			// 跳转到服务页面
			handleService(item) {
				if (item.id === 'about') {
					this.onAllPrivilegeDetail('10015')
				} else {
					this.$navTo(item.url)
				}
			},

		},

		/**
		 * 下拉刷新
		 */
		onPullDownRefresh() {
			// 获取首页数据
			this.getPageData(() => {
				uni.stopPullDownRefresh()
			})
		},


	}
</script>

<style lang="scss" scoped>
	.toBind {
		text-align: center;
		padding: 40rpx 0 14rpx 0;

	}
	.toBind2 {
		text-align: center;
		font-size: 20rpx;
		padding: 0rpx 0 26rpx 0;
		font-weight: 700;
	}
	// 页面头部
	.main-header {
		background-color: #fff;
		// background-image: url('/static/background/user-header.png');
		position: relative;
		width: 100%;
		height: 400rpx;
		background-size: 100% 100%;
		overflow: hidden;
		display: flex;
		// align-items: center;
		// padding-top: 40rpx;
		padding-left: 40rpx;

		.bg-image {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: 0;
			background: #E6C48D;
		}

		.user-info-wrap {
			// display: flex;
			// height: 100rpx;
			z-index: 1;
			margin-top: 40rpx;

			.user-info-content {
				display: flex;

				.user-content {
						display: flex;
						flex-direction: column;
						justify-content: center;
						margin-left: 30rpx;
						color: #c59a46;

						.nick-name {
							font-size: 40rpx;
							font-weight: bold;
							max-width: 270rpx;
							color: #927444;
						}

						.mobile {
							margin-top: 15rpx;
							font-size: 28rpx;
						}

						.user-grade {
							align-self: baseline;
							display: flex;
							align-items: center;
							background: #3c3c3c;
							margin-top: 12rpx;
							border-radius: 10rpx;
							padding: 4rpx 12rpx;

							.user-grade_icon .image {
								display: block;
								width: 32rpx;
								height: 32rpx;
							}

							.user-grade_name {
								margin-left: 5rpx;
								font-size: 26rpx;
								color: #EEE0C3;
							}

						}

						.login-tips {
							margin-top: 12rpx;
							font-size: 26rpx;
						}

					}

				}

			}
	}

	// 角标组件
	.item-badge {
		position: absolute;
		top: 0;
		right: 55rpx;
		background: #fa2209;
		color: #fff;
		border-radius: 100%;
		min-width: 38rpx;
		height: 38rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 1rpx;
		font-size: 24rpx;
	}

	.user-card {
		position: relative;
		margin: 10rpx 40rpx;
		// height: 300rpx;
		background: linear-gradient(135deg, #504D55, #2C2B31);
		border-radius: 30rpx;
		margin-top: -100px;
		z-index: 999;
		padding: 30rpx 30rpx;
		color: #fff;

		.integral-title {
			font-size: 32rpx;
			text {
				font-size: 28rpx;
				margin-left: 10rpx;
			}
		}

		.integral-tip {
			margin-top: 20rpx;
			display: flex;

			.integral {
				font-size: 32rpx;
				font-weight: bold;
				text {
					font-size: 24rpx;
				}

				.points {
					color: #FFFAEA;
					font-size: 52rpx;
					margin-right: 20rpx;
				}

			}

			.no-login {
				margin-left: 40rpx;
			}
		}

		.privilege {
			color: #F5DFA2;
			margin-top: 50rpx;

			.title {
				display: flex;
				font-size: 32rpx;
				justify-content: space-between;
				.all {
					font-size: 28rpx;
					color: #908670;
				}
			}

			.asset-left-item {
				max-width: 183rpx;
				text-align: center;
				padding: 0 16rpx;

				.item-value {
					font-size: 34rpx;
					.wyiconfont {
						font-size: 60rpx;
					}
				}

				.item-name {
					display: flex;
					flex-direction: column;
					justify-content: center;
					margin-top: 6rpx;
					.oneline-small {
						font-size: 24rpx;
						color: #CE9266;
					}
				}

				.item-name {
					margin-top: 14rpx;
					font-size: 28rpx;
				}
			}

			.title {
				font-weight: bold;
			}

			.balance {
				margin: 20rpx 0;
			}

			.asset-left-item {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
			}

		}



	}

	// 订单操作
	.order-navbar {
		margin: 20rpx auto;
		padding: 20rpx 30rpx;
		width: 94%;
		box-shadow: 0 1rpx 5rpx 0px rgba(0, 0, 0, 0.05);
		border-radius: 10rpx;
		background: #fff;

		.title {
			font-size: 40rpx;
			font-weight: bold;
		}

		.order-wrap {
			display: flex;
			justify-content: space-between;
			position: relative;
			margin-top: 40rpx;

			.order-item {
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				color: #666;

				.wyiconfont {
					color: #FF5E40;
					font-size: 80rpx;
					margin-right: 10rpx;
				}
			}

			&::before {
				content: '';
				width: 2rpx;
				height: 80%;
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%) translateY(-50%);
				background-color: #DDEAFF;
			}

		}

		&-item {
			position: relative;
			width: 25%;

			.item-icon {
				text-align: center;
				margin: 0 auto;
				padding: 10rpx 0;
				color: #545454;
				font-size: 44rpx;

			}

			.item-name {
				font-size: 28rpx;
				color: #545454;
				text-align: center;
				margin-right: 10rpx;
			}

		}
	}

	.noLogin {
		margin: 20rpx auto;
		padding: 20rpx 30rpx;
		width: 94%;
		box-shadow: 0 1rpx 5rpx 0px rgba(0, 0, 0, 0.05);
		border-radius: 10rpx;
		background: #fff;
		.title {
			font-size: 40rpx;
			font-weight: bold;
		}
		.room-manager {
			font-size: 34rpx;
			margin-top: 30rpx;
			color: #4DA0F3;
			font-weight: normal;
		}
	}

	.section {
		margin: 20rpx auto;
		padding: 20rpx 30rpx;
		width: 94%;
		box-shadow: 0 1rpx 5rpx 0px rgba(0, 0, 0, 0.05);
		border-radius: 10rpx;
		background: #fff;
		position: relative;

		.header {
			display: flex;
			justify-content: space-between;

			.title {
				font-size: 40rpx;
				font-weight: bold;
			}

			.title-right {

				.room-manager {
					display: flex;
					align-items: center;
					color: #FFC27C;

					.wyiconfont {
						font-size: 50rpx;
 					}

				}

			}

		}

		.section-wrap {
			display: flex;
			justify-content: space-between;
			position: relative;
			margin-top: 40rpx;

			.room {
				font-size: 30rpx;
				color: #808080;
				padding: 0 0 50rpx 0;

				.roomInfo {
					display: flex;
					flex-direction: column;
				}

				.please-login {
					font-size: 34rpx;
					margin-top: 10rpx;
				}

				.add-room {
					font-size: 34rpx;
					margin-top: 10rpx;
					color: #4DA0F3;
				}

			}

			.daemon {

			}

		}

		.contact {
			position: absolute;
			top: 30rpx;
			right: 30rpx;

			.wyiconfont {
				font-size: 60rpx;
			}

			/deep/ button::after, &::after {
				display: none;
			}
		}
	}

	// 我的服务
	.my-service {
		margin: 22rpx auto 22rpx auto;
		padding: 22rpx 0;
		width: 94%;
		box-shadow: 0 1rpx 5rpx 0px rgba(0, 0, 0, 0.05);
		border-radius: 5rpx;
		background: #fff;

		.service-title {
			padding: 20rpx 30rpx;
			font-size: 40rpx;
			font-weight: bold;
		}

		.service-content {

			margin-bottom: -20rpx;

			.service-item {
				position: relative;
				width: 25%;
				float: left;
				margin-bottom: 30rpx;

				.item-icon {
					text-align: center;
					margin: 0 auto;
					padding: 14rpx 0;
					// color: #ff3800;
					font-size: 44rpx;
					.wyiconfont {
						font-size: 44rpx !important;
					}
				}

				.item-name {
					font-size: 28rpx;
					color: #545454;
					text-align: center;
					margin-right: 10rpx;
				}

			}
		}
	}

	// 退出登录
	.my-logout {
		display: flex;
		justify-content: center;
		margin-top: 50rpx;
		margin-bottom: 50rpx;
		.logout-btn {
			width: 60%;
			margin: 0 auto;
			font-size: 28rpx;
			color: #616161;
			border-radius: 20rpx;
			border: 1px solid #dcdcdc;
			padding: 16rpx 0;
			text-align: center;
		}
	}
</style>
