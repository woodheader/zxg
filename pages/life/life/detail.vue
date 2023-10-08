<template>
  <view v-show="!isLoading" class="container">

    <!-- 服务图片轮播 -->
    <SlideImage v-if="!isLoading" :video="life.video" :videoCover="life.videoCover" :images="life.life_images" class="box"/>

    <!-- 服务信息 -->
    <view v-if="!isLoading" class="life-info m-top20">
      <!-- 价格、销量 -->
      <view class="info-item info-item__top dis-flex flex-x-between flex-y-end">
        <view class="block-left dis-flex flex-y-center">
          <!-- 服务售价 -->
          <text class="floor-price__samll">￥</text>
          <text class="floor-price">{{ life.skuList[tabNum].life_price }}</text>
          <!-- 会员价标签 -->
          <view v-if="life.is_user_grade" class="user-grade">
            <text>会员价</text>
          </view>
          <!-- 划线价 -->
          <text v-if="life.line_price_min > 0" class="original-price">￥{{ life.skuList[tabNum].line_price }}</text>
          <text v-if="life.is_points_gift==1"
            style="background-color: #fff;color: #d55852;padding: 2rpx 7rpx;border-radius: 7rpx;border: 1px solid #d55852;">
            送知珠:{{(life.skuList[tabNum].line_price*life.gift_ratio/100).toFixed(2)}}
          </text>
          <text v-if="life.is_tejia==1"
            style="background-color: #fff;color: #d55852;padding: 2rpx 7rpx;border-radius: 7rpx;border: 1px solid #d55852;margin-left: 10rpx;">
            限时特价
          </text>
        </view>
        <view class="block-right dis-flex">
          <!-- 销量 -->
          <view class="life-sales">
            <text>已售{{ life.life_sales }}件</text>
          </view>
        </view>
      </view>
      <!-- 标题、分享 -->
      <view class="info-item info-item__name dis-flex flex-y-center">
        <view class="life-name flex-box">
          <text class="twoline-hide">{{ life.life_name }}</text>
        </view>
        <!-- #ifdef MP-WEIXIN -->
        <view class="life-share__line"></view>
        <view class="life-share">
          <button class="share-btn dis-flex flex-dir-column" open-type="share">
            <text class="share__icon iconfont icon-fenxiang"></text>
            <text class="f-24">分享</text>
          </button>
        </view>
        <!-- #endif -->
      </view>
      <!-- 服务卖点 -->
      <view v-if="life.selling_point" class="info-item info-item_selling-point">
        <text>{{ life.selling_point }}</text>
      </view>
    </view>

    <!-- 选择服务规格 -->
    <!--view v-if="life.spec_type == 20" class="life-choice m-top20 b-f" @click="onShowSkuPopup(1)">
      <view class="spec-list">
        <view class="flex-box">
          <text class="col-8">选择：</text>
          <text class="spec-name" v-for="(item, index) in life.specList" :key="index">{{ item.spec_name }}</text>
        </view>
        <view class="f-26 col-9 t-r">
          <text class="iconfont icon-arrow-right"></text>
        </view>
      </view>
    </view-->

    <!-- 服务服务 -->
    <Service v-if="!isLoading" :life-id="lifeId" />
		
		<!-- 服务类型 -->
		<tabType :life="life" @changePrice="changePrice"></tabType>

    <!-- 上门时间 -->
    <Time v-if="!isLoading" :life-id="lifeId" @setTime="setTime"/>

    <!-- 服务SKU弹窗 -->
    <SkuPopup v-if="!isLoading" v-model="showSkuPopup" :skuMode="skuMode" :life="life" @addCart="onAddCart" />

    <!-- 排序标签 -->
    <!--view class="store-sort" v-show="cIndex > 0">
      <view class="sort-item" :class="{ active: isFixedTop[0]}" @click="goto(0)">
        <text>服务</text>
      </view>
      <view class="sort-item" :class="{ active: isFixedTop[1]}" @click="goto(1)">
        <text>评价</text>
      </view>
      <view class="sort-item" :class="{ active: isFixedTop[2]}" @click="goto(2)">
        <text>详情</text>
      </view>
    </view-->

    <!-- 服务评价 -->
    <Comment v-if="!isLoading" :life-id="lifeId" :limit="2" class="box"/>

    <!-- 收费标准 -->
    <!--view v-if="!isLoading && life.stdDataList.length > 0" class="life-content m-top20">
      <view class="item-title b-f">
        <text>收费标准</text>
      </view>
      <u-collapse :headStyle="headStyle" :bodyStyle="bodyStyle" v-for="(item, index) in life.stdDataList" :key="index">
        <u-collapse-item style="padding:0 16rpx 16rpx 16rpx" :title="item.std_cate_name">
          <text class="u-collapse-content" style="float: left">{{item.std_name}}</text>
          <text class="u-collapse-content" style="float: right">
            <text class="u-collapse-content" v-if="item.is_lock_price === 0">{{item.start_price}}-{{item.end_price}}/{{item.std_unit}}</text>
            <text class="u-collapse-content" v-else>{{item.end_price}}/{{item.std_unit}}</text>
          </text>
        </u-collapse-item>
      </u-collapse>
    </view-->

    <!-- 服务描述 -->
    <view v-if="!isLoading" class="life-content m-top20 box">
      <view class="item-title b-f">
        <text>{{dynamicTitle}}</text>
      </view>
      <block v-if="life.content != ''">
        <view class="life-content__detail b-f">
          <mp-html :content="life.content" />
        </view>
      </block>
      <empty v-else tips="亲，暂无服务描述" />
    </view>

    <!-- 底部选项卡 -->
    <view class="footer-fixed">
      <view class="footer-container">
        <!-- 导航图标 -->
        <view class="foo-item-fast">
          <!-- 首页 -->
          <view class="fast-item fast-item--home" @click="onTargetHome">
            <view class="fast-icon">
              <text class="iconfont icon-shouye"></text>
            </view>
            <view class="fast-text">
              <text>首页</text>
            </view>
          </view>
          <!-- 客服 (仅微信小程序端显示) -->
          <!-- #ifdef MP-WEIXIN -->
<!--          <button class="btn-normal" open-type="contact">
            <view class="fast-item">
              <view class="fast-icon">
                <text class="iconfont icon-kefu1"></text>
              </view>
              <view class="fast-text">
                <text>客服</text>
              </view>
            </view>
          </button> -->
          <!-- #endif -->
          <!-- 购物车 -->
          <!--view class="fast-item fast-item--cart" @click="onTargetCart">
            <view v-if="cartTotal > 0" class="fast-badge fast-badge--fixed">{{ cartTotal > 99 ? '99+' : cartTotal }}
            </view>
            <view class="fast-icon">
              <text class="iconfont icon-gouwuche"></text>
            </view>
            <view class="fast-text">
              <text>购物车</text>
            </view>
          </view-->
        </view>
        <!-- 操作按钮 -->
        <view class="foo-item-btn">
          <view class="btn-wrapper">
            <!--view class="btn-item btn-item-deputy" @click="onShowSkuPopup(2)" v-if="life.stock_total > 0">
              <text>加入购物车</text>
            </view-->
            <view class="btn-item btn-item-main" @click="onShowSkuPopup(3)" v-if="life.stock_total > 0">
              <text>立即下单</text>
            </view>
            <view class="btn-item btn-item-main" style="background-color: #c5c5c5;color:#fff" v-else>
              <text>已售罄</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 快捷导航 -->
    <!-- <shortcut bottom="120rpx" /> -->

  </view>
</template>

<script>
  import * as LifeApi from '@/api/life/life'
  import * as CartApi from '@/api/cart'
  // import Shortcut from '@/components/shortcut'
  import SlideImage from './components/SlideImage'
	import tabType from './components/tabType.vue'
  import SkuPopup from './components/SkuPopup'
  import Comment from './components/Comment'
  import Service from './components/Service'
  import Time from './components/Time'
  import UCollapse from "../../../uview-ui/components/u-collapse/u-collapse.vue";
  import UCollapseItem from "../../../uview-ui/components/u-collapse-item/u-collapse-item.vue";

  export default {
    components: {
      UCollapseItem,
      UCollapse,
			tabType,
      // Shortcut,
      SlideImage,
      SkuPopup,
      Comment,
      Service,
      Time
    },
    data() {
      return {
        // 正在加载
        isLoading: true,
        // 当前服务ID
        lifeId: null,
        // 服务详情
        life: {},
        // 购物车总数量
        cartTotal: 0,
        // 显示/隐藏SKU弹窗
        showSkuPopup: false,
        // 模式 1:都显示 2:只显示购物车 3:只显示立即购买
        skuMode: 1,
        // 服务分类
        categoryId: 0,
				// 标签下标
				tabNum: 0,
        // 动态标题
        dynamicTitle: '服务描述',

        isFixedTop:[],
        isFixedTop0:false,
        isFixedTop1:false,
        isFixedTop2:false,
        topDistance:[],
        topHeight:"",
        mainTitle:'',
        cIndex: -1,

        headStyle: {
          color: 'black',
          backgroundColor: '#eff3ff',
          fontSize: '26rpx',
          fontWeight: 'bold',
          paddingLeft: '14rpx',
          borderRadius: '6rpx'
        },
        bodyStyle: {
          paddingLeft: '16rpx',
          paddingRight: '16rpx',
          fontSize: '24rpx',
          color: 'black'
        },
      }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      // 记录服务ID
      this.lifeId = parseInt(options.lifeId)
      // 加载页面数据
      this.onRefreshPage()

      uni.pageScrollTo({
        scrollTop:0,
        duration:0
      })
      setTimeout(()=>{
        this.GetTop()
      },1000)
    },

    onPageScroll(e) {
      for(let i = 0; i < this.topDistance.length; i++){
        if(e.scrollTop > this.topDistance[i]){
          this.isFixedTop[i] = true
          this.$set(this.isFixedTop,i,true)
          this.cIndex = i
        }else{
          this.isFixedTop[i] = false
          this.$set(this.isFixedTop,i,false)
        }
      }
      for (let j = 0; j < this.topDistance.length; j++) {
        if (this.cIndex === j) {
          this.isFixedTop[j] = true
          this.$set(this.isFixedTop,j,true)
        } else {
          this.isFixedTop[j] = false
          this.$set(this.isFixedTop,j,false)
        }
      }
    },

    methods: {

      /**
       * 动态设置服务详情页面标题
       */
      setTitle() {
        uni.setNavigationBarTitle({
          title: this.life.life_name
        })
      },
			// 根据选择类型不同，更改价格
			changePrice(val){
				this.tabNum = val
			},

      goto(index) {
        for(let i = 0; i < this.topDistance.length; i++){
          if (i === index) {
            uni.pageScrollTo({
              scrollTop: this.topDistance[i]+1,
              duration: 300,
              complete: function () {
              }
            })
          }
        }
      },
      GetTop(){
        var _this = this
        uni.getSystemInfo({
          success:(resu)=>{
            const query = uni.createSelectorQuery().in(this)
            query.selectAll('.box').boundingClientRect()
            query.selectViewport().scrollOffset()
            query.exec(function(res){
              _this.recordTopDistance(res[0])
            })
          },
          fail:(res)=>{}
        })
      },
      recordTopDistance(res){
        for(let i = 0; i < res.length; i++){
          this.topDistance[i] = res[i].top
          this.isFixedTop[i] = false
        }
      },
      saoma(){

        uni.navigateTo({
          url:'./scan'
        })
      },

      // 刷新页面数据
      onRefreshPage() {
        const app = this
        app.isLoading = true
        Promise.all([app.getLifeDetail(), app.getCartTotal()])
          .finally(() => {
            app.isLoading = false
            this.setTitle()
          })
      },

      // 获取服务信息
      getLifeDetail() {
        const app = this
        return new Promise((resolve, reject) => {
          LifeApi.detail(app.lifeId)
            .then(result => {
              app.life = result.data.detail
              resolve(result)
            })
            .catch(reject)
        })
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

      // 更新购物车数量
      onAddCart(total) {
        this.cartTotal = total
      },

      // 设置时间
      setTime(time) {
        this.life.serveTime = time
      },

      /**
       * 显示/隐藏SKU弹窗
       * @param {skuMode} 模式 1:都显示 2:只显示购物车 3:只显示立即购买
       */
      onShowSkuPopup(skuMode = 1) {
				this.life.serveTime = ''
				// 跳转到订单结算页
				this.$navTo('pages/checkout/index', {
				  mode: 'lifeBuyNow',
				  lifeId: this.life.skuList[this.tabNum].life_id,
				  lifeSkuId: this.life.skuList[this.tabNum].life_sku_id,
				  lifeNum: 1,
				  serveTime: this.life.serveTime
				})
        // this.skuMode = skuMode
        // this.showSkuPopup = !this.showSkuPopup
      },

      // 跳转到首页
      onTargetHome(e) {
        this.$navTo('pages/index/index')
      },

      // 跳转到购物车页
      onTargetCart() {
        this.$navTo('pages/cart/index')
      },

    },

    /**
     * 分享当前页面
     */
    onShareAppMessage() {
      const app = this
      // 构建页面参数
      const params = app.$getShareUrlParams({
        lifeId: app.lifeId,
      })
      return {
        title: app.life.life_name,
        path: `/pages/life/life/detail?${params}`
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
        lifeId: app.lifeId,
      })
      return {
        title: app.life.life_name,
        path: `/pages/life/life/detail?${params}`
      }
    }
  }
</script>

<style>
  page {
    background: #fafafa;
  }
</style>
<style lang="scss" scoped>
  @import "./detail.scss";
</style>
