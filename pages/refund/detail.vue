<template>
  <view v-if="!isLoading" class="container p-bottom">

    <!-- 顶部状态栏 -->
    <view class="detail-header dis-flex flex-y-center">
      <view class="header-backdrop">
        <image class="image" src="/static/order/refund-bg.png"></image>
      </view>
      <view class="header-state">
        <text class="f-32 col-f">{{ detail.state_text }}</text>
      </view>
    </view>

    <!-- 商品详情 -->
    <view class="detail-goods b-f m-top20 dis-flex flex-dir-row" @click="onGoodsDetail(detail.orderGoods.goods_id)">
      <view class="left">
        <image class="goods-image" :src="detail.orderGoods.goods_image"></image>
      </view>
      <view class="right dis-flex flex-box flex-dir-column flex-x-around">
        <view class="goods-name">
          <text class="twoline-hide">{{ detail.orderGoods.goods_name }}</text>
        </view>
        <view class="dis-flex col-9 f-24">
          <view class="flex-box">
            <view class="goods-props clearfix">
              <view class="goods-props-item" v-for="(props, idx) in detail.orderGoods.goods_props" :key="idx">
                <text>{{ props.value.name }}</text>
              </view>
            </view>
          </view>
          <text class="t-r">×{{ detail.orderGoods.total_num }}</text>
        </view>
      </view>
    </view>

    <!-- 商品金额 -->
    <view class="detail-order b-f row-block">
      <view class="item dis-flex flex-x-end flex-y-center">
        <text class="">商品金额：</text>
        <text class="col-m">￥{{ detail.orderGoods.total_pay_price }}</text>
      </view>
    </view>

    <!-- 已退款金额 -->
    <view v-if="detail.status == RefundStatusEnum.COMPLETED.value && detail.type == 10"
      class="detail-order b-f row-block dis-flex flex-x-end flex-y-center">
      <text class="">已退款金额：</text>
      <text class="col-m">￥{{ detail.refund_money }}</text>
    </view>

    <!-- 售后信息 -->
    <view v-if="detail.status == RefundStatusEnum.REJECTED.value" class="detail-refund b-f m-top20">
      <view class="detail-refund__row dis-flex">
        <view class="text">
          <text>售后类型：</text>
        </view>
        <view class="flex-box">
          <text>{{ RefundTypeEnum[detail.type].name }}</text>
        </view>
      </view>
      <view class="detail-refund__row dis-flex">
        <view class="text">
          <text>申请原因：</text>
        </view>
        <view class="flex-box">
          <text>{{ detail.apply_desc }}</text>
        </view>
      </view>
      <view v-if="detail.images.length > 0" class="detail-refund__row dis-flex">
        <view class="text">
          <text>申请凭证：</text>
        </view>
        <view class="image-list flex-box">
          <view class="image-preview" v-for="(item, index) in detail.images" :key="index">
            <image class="image" mode="aspectFill" :src="item.image_url" @click="handlePreviewImages(index)"></image>
          </view>
        </view>
      </view>
    </view>

    <!-- 售后信息 -->
    <view v-if="detail.status.value == RefundStatusEnum.REJECTED.value" class="detail-refund b-f m-top20">
      <view class="detail-refund__row dis-flex">
        <view class="text">
          <text class="col-m">拒绝原因：</text>
        </view>
        <view class="flex-box">
          <text>{{ detail.refuse_desc }}</text>
        </view>
      </view>
    </view>

    <!-- 退货物流信息 -->
    <view v-if="detail.audit_status == AuditStatusEnum.REVIEWED.value && detail.is_user_send"
      class="detail-address b-f m-top20">
      <view class="detail-address__row address-title">
        <text class="col-m">退货物流信息</text>
      </view>
      <view class="detail-address__row address-details">
        <view class="address-details__row">
          <text>物流公司：{{ detail.express.express_name }}</text>
        </view>
        <view class="address-details__row">
          <text>物流单号：{{ detail.express_no }}</text>
        </view>
        <!-- <view class="address-details__row">
          <text>发货状态：{{ detail.is_user_send ? '已发货' : '未发货' }}</text>
        </view> -->
        <view class="address-details__row">
          <text>发货时间：{{ detail.send_time }}</text>
        </view>
      </view>
    </view>

    <!-- 商家收货地址 -->
    <view v-if="detail.audit_status == AuditStatusEnum.REVIEWED.value" class="detail-address b-f m-top20">
      <view class="detail-address__row address-title">
        <text class="col-m">商家退货地址</text>
      </view>
      <view class="detail-address__row address-details">
        <view class="address-details__row">
          <text>收货人：{{ detail.address.name }}</text>
        </view>
        <view class="address-details__row">
          <text>联系电话：{{ detail.address.phone }}</text>
        </view>
        <view class="address-details__row dis-flex">
          <view class="text">
            <text>详细地址：</text>
          </view>
          <view class="address flex-box">
            <text class="region" v-for="(region, idx) in detail.address.region" :key="idx">{{ region }}</text>
            <text class="detail">{{ detail.address.detail }}</text>
          </view>
        </view>
      </view>
      <view class="detail-address__row address-tips">
        <view class="f-26 col-9">
          <text>· 未与卖家协商一致情况下，请勿寄到付或平邮</text>
        </view>
        <view class="f-26 col-9">
          <text>· 请填写真实有效物流信息</text>
        </view>
      </view>
    </view>

    <!-- 填写物流信息 -->
    <form
      v-if="detail.type == RefundTypeEnum.RETURN.value && detail.audit_status == AuditStatusEnum.REVIEWED.value && !detail.is_user_send"
      @submit="onSubmit()">
      <view class="detail-express b-f m-top20">
        <view class="form-group dis-flex flex-y-center">
          <view class="field">物流公司：</view>
          <view class="flex-box">
            <picker mode="selector" :range="expressList" range-key="express_name" :value="expressIndex"
              @change="onChangeExpress">
              <text v-if="expressIndex > -1">{{ expressList[expressIndex].express_name }}</text>
              <text v-else class="col-80">请选择物流公司</text>
            </picker>
          </view>
        </view>
        <view class="form-group dis-flex flex-y-center">
          <view class="field">物流单号：</view>
          <view class="flex-box">
            <input class="input" v-model="formData.expressNo" placeholder="请填写物流单号"></input>
          </view>
        </view>
      </view>
      <!-- 操作按钮 -->
      <view class="footer">
        <view class="btn-wrapper">
          <button class="btn-item btn-item-main btn-normal" :class="{ disabled }" formType="submit">确认发货</button>
        </view>
      </view>
    </form>

  </view>
</template>

<script>
  import { AuditStatusEnum, RefundStatusEnum, RefundTypeEnum } from '@/common/enum/order/refund'
  import * as RefundApi from '@/api/refund'
  import * as ExpressApi from '@/api/express'

  export default {
    data() {
      return {
        // 枚举类
        AuditStatusEnum,
        RefundStatusEnum,
        RefundTypeEnum,
        // 正在加载
        isLoading: true,
        // 售后单ID
        orderRefundId: null,
        // 售后单详情
        detail: {},
        // 物流公司列表
        expressList: [],
        // 表单数据
        formData: {
          // 物流公司ID
          expressId: null,
          // 物流单号
          expressNo: ''
        },
        // 选择的物流公司索引
        expressIndex: -1,
        // 按钮禁用
        disabled: false
      }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad({ orderRefundId }) {
      // 售后单ID
      this.orderRefundId = orderRefundId
      // 获取页面数据
      this.getPageData()
    },

    methods: {

      // 获取页面数据
      getPageData() {
        const app = this
        app.isLoading = true
        Promise.all([app.getRefundDetail(), app.getExpressList()])
          .then(result => {
            app.isLoading = false
          })
      },

      // 获取售后单详情
      getRefundDetail() {
        const app = this
        return new Promise((resolve, reject) => {
          RefundApi.detail(app.orderRefundId)
            .then(result => {
              app.detail = result.data.detail
              resolve()
            })
            .catch(reject)
        })
      },

      // 获取物流公司列表
      getExpressList() {
        const app = this
        return new Promise((resolve, reject) => {
          ExpressApi.list()
            .then(result => {
              app.expressList = result.data.list
              resolve()
            })
            .catch(reject)
        })
      },

      // 跳转商品详情页
      onGoodsDetail(goodsId) {
        this.$navTo('pages/goods/detail', { goodsId })
      },

      // 凭证图片预览
      handlePreviewImages(index) {
        const { detail: { images } } = this
        const imageUrls = images.map(item => item.image_url)
        uni.previewImage({
          current: imageUrls[index],
          urls: imageUrls
        })
      },

      // 选择物流公司
      onChangeExpress(e) {
        const expressIndex = e.detail.value
        const { expressList } = this
        this.expressIndex = expressIndex
        this.formData.expressId = expressList[expressIndex].express_id
      },

      // 表单提交
      onSubmit() {
        const app = this
        // 判断是否重复提交
        if (app.disabled === true) return false
        // 按钮禁用
        app.disabled = true
        // 提交到后端
        RefundApi.delivery(app.orderRefundId, app.formData)
          .then(result => {
            app.$toast(result.message)
            setTimeout(() => {
              app.disabled = false
              uni.navigateBack()
            }, 1500)
          })
          .catch(err => app.disabled = false)
      }

    }
  }
</script>

<style lang="scss" scoped>
  // 顶部状态栏
  .detail-header {
    position: relative;
    width: 100%;
    height: 140rpx;

    .header-backdrop {
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 0;

      .image {
        display: block;
        width: 100%;
        height: 140rpx;
      }
    }
  }

  .header-state {
    z-index: 1;
    padding: 0 50rpx;
  }

  /* 商品详情 */
  .detail-goods {
    padding: 24rpx 20rpx;

    .left {
      .goods-image {
        display: block;
        width: 150rpx;
        height: 150rpx;
      }
    }

    .right {
      padding-left: 20rpx;
    }

    .goods-props {
      margin-top: 14rpx;
      height: 40rpx;
      color: #ababab;
      font-size: 24rpx;
      overflow: hidden;

      .goods-props-item {
        display: inline-block;
        margin-right: 14rpx;
        padding: 4rpx 16rpx;
        border-radius: 12rpx;
        background-color: #F5F5F5;
        width: auto;
      }
    }
  }

  .detail-order {
    padding: 15rpx 20rpx;
    font-size: 26rpx;

    .item {
      margin-bottom: 10rpx;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  /* 售后详情 */
  .detail-refund {
    padding: 15rpx 20rpx;
  }

  .detail-refund__row {
    margin: 20rpx 0;
  }

  /* 申请凭证 */
  .image-list {
    margin-bottom: -15rpx;

    .image-preview {
      margin: 0 15rpx 15rpx 0;
      float: left;

      .image {
        display: block;
        width: 180rpx;
        height: 180rpx;
      }

      &:nth-child(3n+0) {
        margin-right: 0;
      }
    }
  }

  /* 商家收货地址 */
  .detail-address {
    padding: 20rpx 34rpx;
  }

  .address-details {
    padding: 8rpx 0;
    border-bottom: 1px solid #eee;

    .address-details__row {
      margin: 14rpx 0;
    }
  }

  .address-tips {
    margin-top: 16rpx;
    line-height: 46rpx;
  }

  .detail-address__row {
    // margin: 18rpx 0;
  }

  /* 填写物流信息 */
  .detail-express {
    padding: 10rpx 30rpx;
  }

  .form-group {
    height: 60rpx;
    margin: 14rpx 0;

    .input {
      height: 100%;
      font-size: 28rpx;
    }
  }


  /* 底部操作栏 */

  .footer {
    margin-top: 60rpx;

    .btn-wrapper {
      height: 100%;
      display: flex;
      align-items: center;
      padding: 0 20rpx;
    }

    .btn-item {
      flex: 1;
      font-size: 28rpx;
      height: 80rpx;
      color: #fff;
      border-radius: 50rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .btn-item-main {
      background: linear-gradient(to right, #f9211c, #ff6335);

      // 禁用按钮
      &.disabled {
        background: #ff9779;
      }
    }

  }
</style>
