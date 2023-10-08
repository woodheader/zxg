<template>
  <view class="container p-bottom">

    <!-- 商品金额 -->
    <view class="flow-all-money b-f m-top20">
      <view class="flow-all-list dis-flex">
        <text class="flex-five">订单总金额：</text>
        <view class="flex-five t-r">
          <text class="col-m">￥{{ order.orderTotalPrice }}</text>
        </view>
      </view>
      
      <!-- 积分抵扣 -->
      <view v-if="order.isAllowPoints" class="points flow-all-list dis-flex flex-y-center">
        <view class="block-left flex-five" @click="handleShowPoints()">
          <text class="title">可用知珠抵扣：</text>
          <text class="iconfont icon-help"></text>
        </view>
        <view class="flex-five dis-flex flex-x-end flex-y-center">
          <text class="points-money col-m">-￥{{ order.pointsMoney }}</text>
          <u-switch v-model="isUsePoints" size="48" active-color="#07c160" @change="getOrderData()"></u-switch>
        </view>
      </view>
    </view>

    <!-- 提交订单 -->
    <view class="flow-fixed-footer b-f m-top10">
      <view class="dis-flex chackout-box">
        <view class="chackout-left pl-12">实付款：
          <text class="col-m">￥{{ order.orderPayPrice }}</text>
        </view>
        <view class="chackout-right" @click="onSubmitOrder()">
          <view class="flow-btn f-32" :class="{ disabled }">提交订单</view>
        </view>
      </view>
    </view>
  </view>

</template>

<script>

  export default {
    data() {
      return {
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
    },

    methods: {
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../checkout/style.scss";
</style>
