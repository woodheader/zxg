<template>
  <view class="container p-bottom" v-if="order.goodsList.length > 0 || lifeOrder.lifeList.length > 0">

    <!-- 快递配送：配送地址 -->
    <view  @click="onSelectAddress" class="flow-delivery">
      <view class="flow-delivery__detail dis-flex flex-y-center">
        <view class="detail-location dis-flex">
          <text class="iconfont icon-dingwei"></text>
        </view>
        <view class="detail-content flex-box">
          <block v-if="order.address">
            <view class="detail-content__title dis-flex">
              <text class="f-30">{{ order.address.name }}</text>
              <text class="detail-content__title-phone f-28">{{ order.address.phone }}</text>
            </view>
            <view class="address detail-content__describe">
              <text class="region" v-for="(region, idx) in order.address.region" :key="idx">{{ region }}</text>
              <text class="detail">{{ order.address.detail }}</text>
            </view>
          </block>
          <block v-else>
            <view class="detail-content__describe dis-flex">
              <text class="col-6">请选择配送地址</text>
            </view>
          </block>
        </view>
        <view class="detail-arrow dis-flex">
          <text class="iconfont icon-arrow-right"></text>
        </view>
      </view>
    </view>

    <!-- 商品列表 -->
    <view class="m-top20">
      <view class="checkout_list" v-for="(item, index) in order.goodsList" :key="index">
        <view class="flow-shopList dis-flex" data-index="index" @click="onTargetGoods(item.goods_id)">
          <!-- 商品图片 -->
          <view class="flow-list-left">
            <image mode="scaleToFill" :src="item.goods_image"></image>
          </view>
          <view class="flow-list-right flex-box">
            <!-- 商品名称 -->
            <text class="goods-name twoline-hide">{{ item.goods_name }}</text>
            <!-- 商品规格 -->
            <view class="goods-props clearfix">
              <view class="goods-props-item" v-for="(props, idx) in item.skuInfo.goods_props" :key="idx">
                <text class="group-name">{{ props.group.name }}: </text>
                <text>{{ props.value.name }}；</text>
              </view>
            </view>
            <!-- 商品数量和单价 -->
            <view class="flow-list-cont dis-flex flex-x-between flex-y-center">
              <text class="small">×{{ item.total_num }}</text>
              <text class="flow-cont" :class="[item.is_user_grade ? 'price-delete' : '']">￥{{ item.goods_price }}</text>
            </view>
            <!-- 会员折扣价 -->
            <view v-if="item.is_user_grade" class="grade-price">
              <text>会员折扣价：￥{{ item.grade_goods_price }}</text>
            </view>
          </view>
        </view>
      </view>
      <view class="flow-num-box b-f" v-if="order.orderTotalNum > 0">
        <text>共{{ order.orderTotalNum }}件商品，合计：</text>
        <text class="flow-money col-m">￥{{ order.orderTotalPrice }}</text>
      </view>
    </view>

    <!-- 生活服务列表 -->
    <view class="m-top20">
      <view class="checkout_list" v-for="(item, index) in lifeOrder.lifeList" :key="index">
        <view class="flow-shopList dis-flex" data-index="index" @click="onTargetLife(item.life_id)">
          <!-- 商品图片 -->
          <view class="flow-list-left">
            <image mode="scaleToFill" :src="item.life_image"></image>
          </view>
          <view class="flow-list-right flex-box">
            <!-- 商品名称 -->
            <text class="goods-name twoline-hide">{{ item.life_name }}</text>
            <!-- 商品规格 -->
            <view class="goods-props clearfix">
              <view class="goods-props-item" v-for="(props, idx) in item.skuInfo.life_props" :key="idx">
                <text class="group-name">{{ props.group.name }}: </text>
                <text>{{ props.value.name }}；</text>
              </view>
            </view>
            <!-- 商品数量和单价 -->
            <view class="flow-list-cont dis-flex flex-x-between flex-y-center">
              <text class="small">×{{ item.total_num }}</text>
              <text class="flow-cont" :class="[item.is_user_grade ? 'price-delete' : '']">￥{{ item.life_price }}</text>
            </view>
            <!-- 会员折扣价 -->
            <view v-if="item.is_user_grade" class="grade-price">
              <text>会员折扣价：￥{{ item.grade_life_price }}</text>
            </view>
          </view>
        </view>
      </view>
      <view class="flow-num-box b-f" v-if="lifeOrder.orderTotalNum > 0">
        <text>共{{ lifeOrder.orderTotalNum }}件服务，合计：</text>
        <text class="flow-money col-m">￥{{ lifeOrder.orderTotalPrice }}</text>
      </view>
    </view>

    <!-- 商品金额 -->
    <view class="flow-all-money b-f m-top20">
      <view class="flow-all-list dis-flex">
        <text class="flex-five">订单总金额：</text>
        <view class="flex-five t-r">
          <text class="col-m">￥{{ parseFloat(order.orderTotalPrice) + parseFloat(lifeOrder.orderTotalPrice) }}</text>
        </view>
      </view>
      <!-- 优惠券 -->
      <!--view class="flow-all-list dis-flex">
        <text class="flex-five">优惠券：</text>
        <view class="flex-five t-r">
          <view v-if="order.couponList.length > 0" @click="handleShowPopup()">
            <text class="col-m" v-if="order.couponId > 0">-￥{{ order.couponMoney }}</text>
            <text class="col-m" v-else>有{{ order.couponList.length }}张优惠券</text>
            <text class="right-arrow iconfont icon-arrow-right"></text>
          </view>
          <text v-else class="">无优惠券可用</text>
        </view>
      </view-->
      <!-- 积分抵扣 -->
      <view v-if="order.isAllowPoints || lifeOrder.isAllowPoints" class="points flow-all-list dis-flex flex-y-center">
        <view class="block-left flex-five" @click="handleShowPoints()">
          <text class="title">可用{{ setting.points_name }}抵扣：</text>
          <text class="iconfont icon-help"></text>
        </view>
        <view class="flex-five dis-flex flex-x-end flex-y-center">
          <text class="points-money col-m">-￥{{ parseFloat(order.pointsMoney)  + parseFloat(lifeOrder.pointsMoney) }}</text>
          <u-switch v-model="isUsePoints" size="48" active-color="#07c160" @change="getOrderData()"></u-switch>
        </view>
      </view>
      <!-- 配送费用 -->
      <!--view v-if="curDelivery == DeliveryTypeEnum.EXPRESS.value" class="dis-flex flow-all-list">
        <text class="flex-five">配送费用：</text>
        <view class="flex-five t-r">
          <view v-if="order.address">
            <text class="col-m" v-if="order.isIntraRegion">+￥{{ order.expressPrice }}</text>
            <text v-else>不在配送范围</text>
          </view>
          <view v-else>
            <text class="col-7" @click="onSelectAddress">请先选择配送地址</text>
          </view>
        </view>
      </view-->
      <!-- 配送方式 -->
      <view class="points flow-all-list dis-flex flex-y-center" v-if="order.goodsList.length > 0">
        <view class="block-left flex-five" @click="handleShowTihuo()">
          <text class="title">配送方式：</text>
          <text class="iconfont icon-help"></text>
        </view>
        <view class="flex-five dis-flex flex-x-end flex-y-center" style="line-height: 40rpx;">
        <radio-group @change="deliveryChange" style="display: flex;">
          <label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in DeliveryTypeEnum.data" :key="item.value">
            <view style="width:120rpx">
              <radio :value="item.value.toString()" :checked="item.value.toString() === curDelivery" />{{item.name}}
            </view>
          </label>
        </radio-group>
        </view>
      </view>
    </view>

    <!-- 支付方式 -->
    <view class="pay-method flow-all-money b-f m-top20">
      <view class="flow-all-list dis-flex">
        <text class="flex-five">支付方式</text>
      </view>
      <!-- 微信支付 -->
      <view class="pay-item dis-flex flex-x-between" @click="handleSelectPayType(PayTypeEnum.WECHAT.value)">
        <view class="item-left dis-flex flex-y-center">
          <view class="item-left_icon wechat">
            <text class="iconfont icon-wechat-pay"></text>
          </view>
          <view class="item-left_text">
            <text>{{ PayTypeEnum.WECHAT.name }}</text>
          </view>
        </view>
        <view class="item-right col-m" v-if="curPayType == PayTypeEnum.WECHAT.value">
          <text class="iconfont icon-check"></text>
        </view>
      </view>
      <!-- 余额支付 -->
<!--      <view class="pay-item dis-flex flex-x-between" @click="handleSelectPayType(PayTypeEnum.BALANCE.value)">
        <view class="item-left dis-flex flex-y-center">
          <view class="item-left_icon balance">
            <text class="iconfont icon-balance-pay"></text>
          </view>
          <view class="item-left_text">
            <text>{{ PayTypeEnum.BALANCE.name }}</text>
          </view>
          <view class="user-balance">
            <text>(可用￥{{ personal.balance }}元)</text>
          </view>
        </view>
        <view class="item-right col-m" v-if="curPayType == PayTypeEnum.BALANCE.value">
          <text class="iconfont icon-check"></text>
        </view>
      </view> -->
    </view>

    <!-- 买家留言 -->
    <view class="flow-all-money b-f m-top20">
      <view class="ipt-wrapper dis-flex flow-all-list">
        <input v-model="remark" placeholder="选填：买家留言（50字以内）"></input>
      </view>
    </view>

    <!-- 提交订单 -->
    <view class="flow-fixed-footer b-f m-top10">
      <view class="dis-flex chackout-box">
        <view class="chackout-left pl-12">实付款：
          <text class="col-m">￥{{ parseFloat(order.orderPayPrice) + parseFloat(lifeOrder.orderPayPrice) }}</text>
        </view>
        <view class="chackout-right" @click="onSubmitOrder()">
          <view class="flow-btn f-32" :class="{ disabled }">提交订单</view>
        </view>
      </view>
    </view>

    <!-- 积分说明弹窗 -->
    <u-modal v-model="showPoints" :title="`${setting.points_name}说明`">
      <scroll-view class="points-content" :scroll-y="true">
        <text>{{ setting.points_describe }}</text>
      </scroll-view>
    </u-modal>

	<!-- 提货说明弹窗 -->
	<u-modal v-model="showTihuo" title="提货说明">
	  <scroll-view class="points-content" :scroll-y="true">
	    <text>{{ setting.tihuo_describe }}</text>
	  </scroll-view>
	</u-modal>

    <!-- 优惠券弹出框 -->
    <u-popup v-model="showPopup" mode="bottom">
      <view class="popup__coupon">
        <view class="coupon__title f-30">选择优惠券</view>
        <!-- 优惠券列表 -->
        <view class="coupon-list">
          <scroll-view :scroll-y="true" style="height: 565rpx;">
            <view class="coupon-item" v-for="(item, index) in order.couponList" :key="index">
              <view class="item-wrapper"
                :class="[item.is_apply ? 'color-' + CouponColors[index % CouponColors.length] : 'color-gray']"
                @click="handleSelectCoupon(index)">
                <view class="coupon-type">{{ CouponTypeEnum[item.coupon_type].name }}</view>
                <view class="tip dis-flex flex-dir-column flex-x-center">
                  <view v-if="item.coupon_type == CouponTypeEnum.FULL_DISCOUNT.value">
                    <text class="f-30">￥</text>
                    <text class="money">{{ item.reduce_price }}</text>
                  </view>
                  <text class="money"
                    v-if="item.coupon_type == CouponTypeEnum.DISCOUNT.value">{{ item.discount }}折</text>
                  <text class="pay-line">满{{ item.min_price }}元可用</text>
                </view>
                <view class="split-line"></view>
                <view class="content dis-flex flex-dir-column flex-x-between">
                  <view class="title">{{ item.name }}</view>
                  <view class="bottom dis-flex flex-y-center">
                    <view class="time flex-box">
                      <block v-if="item.start_time === item.end_time">{{ item.start_time }}</block>
                      <block v-else>{{ item.start_time }}~{{ item.end_time }}</block>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
        <!-- 不使用优惠券 -->
        <view class="coupon__do_not dis-flex flex-y-center flex-x-center">
          <view class="control dis-flex flex-y-center flex-x-center" @click="handleNotUseCoupon()">
            <text class="f-26">不使用优惠券</text>
          </view>
        </view>
      </view>
    </u-popup>

  </view>

</template>

<script>
  import * as Verify from '@/utils/verify'
  import * as CheckoutApi from '@/api/checkout'
  import { CouponTypeEnum } from '@/common/enum/coupon'
  import DeliveryTypeEnum from '@/common/enum/order/DeliveryType'
  import PayTypeEnum from '@/common/enum/order/PayType'
  import { wxPayment } from '@/core/app'

  const CouponColors = ['red', 'blue', 'violet', 'yellow']

  export default {
    data() {
      return {
        // 枚举类
        DeliveryTypeEnum,
        PayTypeEnum,
        CouponTypeEnum,
        // 当前页面参数
        options: {},
        // 优惠券颜色组
        CouponColors,
        // 当前选中的配送方式
        curDelivery: null,
        // 当前选中的支付方式
        curPayType: PayTypeEnum.WECHAT.value,
        // 选择的优惠券
        selectCouponId: 0,
        // 是否使用积分抵扣
        isUsePoints: false,
        // 买家留言
        remark: '',
        // 禁用submit按钮
        disabled: false,
        // 是否显示积分说明
        showPoints: false,
        // 是否显示提货说明
        showTihuo: false,
        // 是否显示优惠券弹窗
        showPopup: false,
        // 订单信息 (从后端api中获取)
        order: {
          // 商品列表
          goodsList: [],
          // 优惠券列表
          couponList: [],
          // 是否存在收货地址
          existAddress: false,
          // 默认收货地址
          address: null,
          // 当前用户收货城市是否存在配送规则中
          isIntraRegion: true,
          // 是否存在错误
          hasError: false,
          // 错误信息
          errorMsg: ''
        },
        // 订单信息 (从后端api中获取)
        lifeOrder: {
          // 商品列表
          lifeList: [],
          // 优惠券列表
          couponList: [],
          // 是否存在收货地址
          existAddress: false,
          // 默认收货地址
          address: null,
          // 当前用户收货城市是否存在配送规则中
          isIntraRegion: true,
          // 是否存在错误
          hasError: false,
          // 错误信息
          errorMsg: ''
        },
        // 个人信息
        personal: {},
        // 商城设置
        setting: {},
      }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      this.options = options
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
      // 获取当前订单信息
      this.getOrderData()
    },

    methods: {

      // 获取订单数据
      getOrderData() {
        const app = this
        // 请求的参数
        const params = {
          delivery: app.curDelivery || 0,
          couponId: app.selectCouponId || 0,
          isUsePoints: app.isUsePoints ? 1 : 0,
        }
        // 请求api
        CheckoutApi.order(app.options.mode, app.getRequestParam())
          .then(result => {
            app.initData(result.data)
          })
          .catch(err => err)
      },

      // 初始化数据
      initData({ order, lifeOrder, setting, personal }) {
        console.log('----',order.goodsList)
        console.log('2',parseFloat(personal.points))
        console.log('3',parseFloat(order.orderTotalPrice))
        console.log('4',parseFloat(lifeOrder.orderTotalPrice))
        const app = this
        if (parseFloat(personal.points)>=(parseFloat(order.orderTotalPrice) + parseFloat(lifeOrder.orderTotalPrice))){
          app.curPayType=PayTypeEnum.BALANCE.value
        }
        console.log('====',order.goodsList)
        app.order = order
        app.lifeOrder = lifeOrder
        app.personal = personal
        app.setting = setting
        // 显示错误信息
        if (order.hasError) {
          app.$toast(order.errorMsg)
        }
        // 当前选择的配送方式
        // app.curDelivery = DeliveryTypeEnum.ZITI.value.toString()//order.delivery
        // 如果只有一种配送方式则不显示选项卡
        app.isShowTab = setting.deliveryType.length > 1
        // 当前选择支付方式 (如果是微信小程序默认使用微信支付)
        if (app.$platform === 'MP-WEIXIN') {
          app.curPayType = PayTypeEnum.WECHAT.value
        }
      },

      // 获取api请求的参数
      getRequestParam() {
        const app = this
        const { options } = app
        // 结算模式的固定参数
        const modeParam = {}
        // 结算模式: 商品立即购买
        if (options.mode === 'buyNow') {
          modeParam.goodsId = options.goodsId
          modeParam.goodsNum = options.goodsNum
          modeParam.goodsSkuId = options.goodsSkuId
        }
        // 结算模式: 服务立即购买
        if (options.mode === 'lifeBuyNow') {
          modeParam.lifeId = options.lifeId
          modeParam.lifeNum = options.lifeNum
          modeParam.lifeSkuId = options.lifeSkuId
        }
        // 结算模式: 购物车
        if (options.mode === 'cart') {
          modeParam.cartIds = options.cartIds
        }
        // 订单结算参数(用户选择)
        const orderParam = {
          delivery: app.curDelivery || 0,
          couponId: app.selectCouponId || 0,
          isUsePoints: app.isUsePoints ? 1 : 0,
        }
        return { ...orderParam, ...modeParam }
      },

      // 显示积分说明
      handleShowPoints() {
        this.showPoints = true
      },

	  // 显示提货方式
	  handleShowTihuo() {
	    this.showTihuo = true
	  },

      // 显示优惠券弹窗
      handleShowPopup() {
        this.showPopup = true
      },

      // 选择优惠券
      handleSelectCoupon(index) {
        const app = this
        const { couponList } = app.order
        // 当前选择的优惠券
        const couponItem = couponList[index]
        // 判断是否在适用范围
        if (!couponItem.is_apply) {
          app.$toast(couponItem.not_apply_info)
          return
        }
        // 记录选中的优惠券id
        app.selectCouponId = couponItem.user_coupon_id
        // 重新获取订单信息
        app.getOrderData()
        // 隐藏优惠券弹层
        app.showPopup = false
      },

      // 不使用优惠券
      handleNotUseCoupon() {
        const app = this
        app.selectCouponId = 0
        // 重新获取订单信息
        app.getOrderData()
        // 隐藏优惠券弹层
        app.showPopup = false
      },

      // 选择支付方式
      handleSelectPayType(value) {
        this.curPayType = value
      },

      // 快递配送：选择收货地址
      onSelectAddress() {
        this.$navTo('pages/address/index', { from: 'checkout' })
      },

      // 跳转到商品详情页
      onTargetGoods(goodsId) {
        this.$navTo('pages/goods/detail', { goodsId })
      },

      // 跳转到服务详情页
      onTargetLife(lifeId) {
        this.$navTo('pages/life/life/detail', { lifeId })
      },

	  // 选择配送方式
	  deliveryChange(event) {
		  this.curDelivery = event.detail.value
	  },

      // 订单提交
      onSubmitOrder() {
        const app = this
        if (app.disabled) {
          return false
        }
        // 表单验证
        if (!app.onVerifyFrom()) {
          return false
        }
        // 根据结算台的商品类型，来区分是否验证配送方式
        if (app.order.goodsList.length > 0) {
          // 配送方式必填
          if (app.curDelivery === '' || app.curDelivery === undefined || app.curDelivery === null) {
            app.$toast('请选择配送方式后下单')
            return false
          }
        } else {
          // 服务类商品，配送方式默认送货
          app.curDelivery = DeliveryTypeEnum.EXPRESS.value
        }

        // 按钮禁用
        app.disabled = true
        // 请求api
        CheckoutApi.submit(app.options.mode, app.getFormData())
          .then(result => app.onSubmitCallback(result))
          .catch(err => {
            if (err.result) {
              const errData = err.result.data
              if (errData.is_created) {
                app.navToMyOrder()
                return false
              }
            }
            app.disabled = false
          })
      },

      // 订单提交成功后回调
      onSubmitCallback(result) {
        const app = this
        const navTo = result.data.navTo ? result.data.navTo : 'goods'
        // 发起微信支付
        if (result.data.payType == PayTypeEnum.WECHAT.value) {
          wxPayment(result.data.payment)
            .then(() => app.$success('支付成功'))
            .catch(err => app.$error('订单未支付'))
            .finally(() => {
              app.disabled = false
              navTo === 'goods' && app.navToMyOrder()
              navTo === 'life' && app.navToMyLifeOrder()
            })
        }
        // 余额支付
        if (result.data.payType == PayTypeEnum.BALANCE.value) {
          app.$success('支付成功')
          app.disabled = false
          navTo === 'goods' && app.navToMyOrder()
          navTo === 'life' && app.navToMyLifeOrder()
        }
      },

      // 跳转到我的订单(等待1秒)
      navToMyOrder() {
        setTimeout(() => {
          this.$navTo('pages/order/index')
        }, 1000)
      },

      // 跳转到我的服务订单(等待1秒)
      navToMyLifeOrder() {
        setTimeout(() => {
					uni.redirectTo({
						url: '/pages/life/order/index'
					})
          // this.$navTo('')
        }, 1000)
      },

      // 表单提交的数据
      getFormData() {
        const app = this
        const { options } = app
        // 表单数据
        const form = {
          delivery: app.curDelivery,
          payType: app.curPayType,
          couponId: app.selectCouponId || 0,
          isUsePoints: app.isUsePoints ? 1 : 0,
          remark: app.remark || '',
        }
        // 创建订单-立即购买
        if (options.mode === 'buyNow') {
          form.goodsId = options.goodsId
          form.goodsNum = options.goodsNum
          form.goodsSkuId = options.goodsSkuId
        }
        if (options.mode === 'lifeBuyNow') {
          form.lifeId = options.lifeId
          form.lifeNum = options.lifeNum
          form.lifeSkuId = options.lifeSkuId
          form.serveTime = options.serveTime
        }
        // 创建订单-购物车结算
        if (options.mode === 'cart') {
          form.cartIds = options.cartIds || null
        }
        return form
      },

      // 表单验证
      onVerifyFrom() {
        const app = this
        if (app.hasError) {
          app.$toast(app.errorMsg)
          return false
        }
        return true
      },

    }
  }
</script>

<style lang="scss" scoped>
  @import "./style.scss";
</style>
