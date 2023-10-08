<template>
  <view class="container">
    <mescroll-body ref="mescrollRef" :sticky="true" @init="mescrollInit" :down="{ native: true }" @down="downCallback" :up="upOption" @up="upCallback">

      <!-- tab栏 -->
      <u-tabs :list="tabs" :is-scroll="false" :current="curTab" active-color="#FA2209" :duration="0.2" @change="onChangeTab" />

      <!-- 订单列表 -->
      <view class="order-list">
        <view class="order-item" v-for="(item, index) in list.data" :key="index">
          <view class="item-top">
            <view class="item-top-left">
              <text class="order-time">订单时间：{{ item.create_time }}</text>
            </view>
            <view class="item-top-right">
              <text class="state-text">{{ item.state_text }}</text>
            </view>
          </view>
          <!-- 服务列表 -->
          <view class="life-list" @click="handleTargetDetail(item.order_id)">
            <view class="life-item" v-for="(life, idx) in item.life" :key="idx">
              <!-- 服务图片 -->
              <view class="life-image">
                <image class="image" :src="life.life_image" mode="scaleToFill"></image>
              </view>
              <!-- 服务信息 -->
              <view class="life-content">
                <view class="life-title"><text class="twoline-hide">{{ life.life_name }}</text></view>
                <view class="life-props clearfix">
                  <view class="life-props-item" v-for="(props, idx) in life.life_props" :key="idx">
                    <text>{{ props.value.name }}</text>
                  </view>
                </view>
              </view>
              <!-- 交易信息 -->
              <view class="life-trade">
                <view class="life-price">
                  <text class="unit">￥</text>
                  <text class="value">{{ life.is_user_grade ? life.grade_life_price : life.life_price }}</text>
                </view>
                <view style="margin-bottom: 16rpx">
                  <text>×{{ life.total_num }}</text>
                </view>
              </view>
            </view>
          </view>

          <!-- 订单操作 -->
          <view class="order-handle">
            <view class="btn-group clearfix">
              <!-- 订单状态 -->
              <block class="tihuo">
                <view class="btn-item-tihuo" style="background-color: #fff;">
                  订单状态：
                  <text style="color:#777" v-if="item.pay_status == PayStatusEnum.PENDING.value">待支付-></text>
                  <text style="color:#b7eb8f" v-else>已支付-></text>
                  <text style="color:#777" v-if="item.is_jiedan == JieDanEnum.NO.value">待接单-></text>
                  <text style="color:#b7eb8f" v-else>已接单-></text>
                  <text style="color:#777" v-if="item.delivery_status == DeliveryStatusEnum.NOT_DELIVERED.value">待上门-></text>
                  <text style="color:#b7eb8f" v-else>已上门-></text>
                  <text style="color:#777" v-if="item.receipt_status == ReceiptStatusEnum.NOT_RECEIVED.value">未完成</text>
                  <text style="color:#b7eb8f" v-else>已完成</text>
                </view>
              </block>
              <block v-if="item.receipt_status == ReceiptStatusEnum.NOT_RECEIVED.value">
                <!--  -->
                <block>
                  <view class="btn-item" @click="onShangMen(item.order_id)">已上门</view>
                </block>
              </block>
            </view>
          </view>

        </view>
      </view>
    </mescroll-body>
  </view>

</template>

<script>
  import {
    DeliveryStatusEnum,
    DeliveryTypeEnum,
    OrderStatusEnum,
    PayStatusEnum,
    PayTypeEnum,
    ReceiptStatusEnum,
    JieDanEnum
  } from '@/common/enum/life/order'
  import MescrollBody from '@/components/mescroll-uni/mescroll-body.vue'
  import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins'
  import { getEmptyPaginateObj, getMoreListData } from '@/core/app'
  import * as OrderApi from '@/api/lifeOrder'
  import { wxPayment } from '@/core/app'

  // 每页记录数量
  const pageSize = 15

  // tab栏数据
  const tabs = [{
    name: `待上门`,
    value: 'all'
  }]

  export default {
    components: {
      MescrollBody
    },
    mixins: [MescrollMixin],
    data() {
      return {
        // 枚举类
        DeliveryStatusEnum,
        DeliveryTypeEnum,
        OrderStatusEnum,
        PayStatusEnum,
        PayTypeEnum,
        ReceiptStatusEnum,
        JieDanEnum,

        // 当前页面参数
        options: { dataType: 'all' },
        // tab栏数据
        tabs,
        // 当前标签索引
        curTab: 0,
        // 订单列表数据
        list: getEmptyPaginateObj(),

        // 上拉加载配置
        upOption: {
          // 首次自动执行
          auto: true,
          // 每页数据的数量; 默认10
          page: { size: pageSize },
          // 数量要大于4条才显示无更多数据
          noMoreSize: 4,
          // 空布局
          empty: {
            tip: '亲，暂无订单记录'
          }
        },
        // 控制onShow事件是否刷新订单列表
        canReset: false,
        // 支付方式弹窗
        showPayPopup: false
      }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      // 初始化当前选中的标签
      this.initCurTab(options)
      // 注册全局事件订阅: 是否刷新订单列表
      uni.$on('syncRefresh', canReset => {
        this.canReset = canReset
      })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
      this.canReset && this.onRefreshList()
      this.canReset = false
    },

    /**
     * 生命周期函数--监听页面的卸载
     */
    onUnload() {
      // 卸载全局事件订阅
      uni.$off('syncRefresh')
    },

    methods: {

      // 初始化当前选中的标签
      initCurTab(options) {
        const app = this
        if (options.dataType) {
          const index = app.tabs.findIndex(item => item.value == options.dataType)
          app.curTab = index > -1 ? index : 0
        }
      },

      /**
       * 上拉加载的回调 (页面初始化时也会执行一次)
       * 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10
       * @param {Object} page
       */
      upCallback(page) {
        const app = this
        // 设置列表数据
        app.getOrderList(page.num)
          .then(list => {
            const curPageLen = list.data.length
            const totalSize = list.data.total
            app.mescroll.endBySize(curPageLen, totalSize)
          })
          .catch(() => app.mescroll.endErr())
      },

      // 获取订单列表
      getOrderList(pageNo = 1) {
        const app = this
        return new Promise((resolve, reject) => {
          OrderApi.supOrderList({ dataType: app.getTabValue(), page: pageNo }, { load: false })
            .then(result => {
              // 合并新数据
              const newList = app.initList(result.data.list)
              app.list.data = getMoreListData(newList, app.list, pageNo)
              resolve(newList)
            })
        })
      },

      // 初始化订单列表数据
      initList(newList) {
        newList.data.forEach(item => {
          item.total_num = 0
          item.life.forEach(life => {
            item.total_num += life.total_num
          })
        })
        return newList
      },

      // 获取当前标签项的值
      getTabValue() {
        return this.tabs[this.curTab].value
      },

      // 切换标签项
      onChangeTab(index) {
        const app = this
        // 设置当前选中的标签
        app.curTab = index
        // 刷新订单列表
        app.onRefreshList()
      },

      // 刷新订单列表
      onRefreshList() {
        this.list = getEmptyPaginateObj()
        setTimeout(() => {
          this.mescroll.resetUpScroll()
        }, 120)
      },


      // 上门
      onShangMen(orderId) {
        const app = this
        uni.showModal({
          title: '温馨提示',
          content: '您确认已上门开始服务了么？',
          cancelText: '取消',
          confirmText: '确认',
          success(o) {
            if (o.confirm) {
              OrderApi.shangmen(orderId)
                  .then(result => {
                    // 我的页面
                    app.$navTo('pages/user/index')
                  })
            }
          }
        })
      },


      // 选择支付方式
      onSelectPayType(payType) {
        const app = this
        // 隐藏支付方式弹窗
        this.showPayPopup = false
        // 发起支付请求
        OrderApi.pay(app.payOrderId, payType)
          .then(result => app.onSubmitCallback(result))
      },

      // 订单提交成功后回调
      onSubmitCallback(result) {
        const app = this
        // 发起微信支付
        if (result.data.pay_type == PayTypeEnum.WECHAT.value) {
          wxPayment(result.data.payment)
            .then(() => {
              app.$success('支付成功')
              setTimeout(() => {
                app.onRefreshList()
              }, 1500)
            })
            .catch(err => {
              app.$error('订单未支付')
            })
            .finally(() => {
              app.disabled = false
            })
        }
        // 余额支付
        if (result.data.pay_type == PayTypeEnum.BALANCE.value) {
          app.$success('支付成功')
          app.disabled = false
          setTimeout(() => {
            app.onRefreshList()
          }, 1500)
        }
      },

	  // 删除订单
	  onRemove(orderId) {
		  let app = this
		  OrderApi.remove(orderId).then(result => {
			  app.$success(result.message)
			  setTimeout(() => {
			    app.onRefreshList()
			  }, 1500)
		  })
	  },

      // 跳转到订单详情页
      handleTargetDetail(orderId) {
        this.$navTo('pages/life/order/detail', { orderId })
      },

      // 跳转到订单评价页
      handleTargetComment(orderId) {
        this.$navTo('pages/life/order/comment/index', { orderId })
      }

    },

  }
</script>

<style lang="scss" scoped>
  // 项目内容
  .order-item {
    margin: 20rpx auto 20rpx auto;
    padding: 30rpx 30rpx;
    width: 94%;
    box-shadow: 0 1rpx 5rpx 0px rgba(0, 0, 0, 0.05);
    border-radius: 16rpx;
    background: #fff;
  }

  // 项目顶部
  .item-top {
    display: flex;
    justify-content: space-between;
    font-size: 26rpx;
    margin-bottom: 40rpx;

    .order-time {
      color: #777;
    }

    .state-text {
      color: $uni-text-color-active;
    }
  }

  // 服务列表
  .life-list {

    // 服务项
    .life-item {
      display: flex;
      margin-bottom: 40rpx;

      // 服务图片
      .life-image {
        width: 180rpx;
        height: 180rpx;

        .image {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 8rpx;
        }
      }

      // 服务内容
      .life-content {
        flex: 1;
        padding-left: 16rpx;
        padding-top: 16rpx;

        .life-title {
          font-size: 26rpx;
          max-height: 76rpx;
        }

        .life-props {
          margin-top: 14rpx;
          height: 40rpx;
          color: #ababab;
          font-size: 24rpx;
          overflow: hidden;

          .life-props-item {
            display: inline-block;
            margin-right: 14rpx;
            padding: 4rpx 16rpx;
            border-radius: 12rpx;
            background-color: #F5F5F5;
            width: auto;
          }
        }


      }

      // 交易信息
      .life-trade {
        padding-top: 16rpx;
        width: 220rpx;
        text-align: right;
        color: $uni-text-color-grey;
        font-size: 26rpx;

        .life-price {
          vertical-align: bottom;
          margin-bottom: 16rpx;

          .unit {
            margin-right: -2rpx;
            font-size: 24rpx;
          }
        }
      }

    }

  }

  // 订单合计
  .order-total {
    font-size: 26rpx;
    vertical-align: bottom;
    text-align: right;
    height: 40rpx;
    margin-bottom: 30rpx;

    .unit {
      margin-left: 8rpx;
      margin-right: -2rpx;
      font-size: 26rpx;
    }

    .money {
      font-size: 28rpx;
    }
  }

  // 订单操作
  .order-handle {
    .btn-group {

	  .tihuo {
		  float: left;
	  }

	  .btn-item-tihuo {
	    border-radius: 6rpx;
		color: #777;
		background: #f6ffed;
	    padding: 6rpx 20rpx;
	    //margin-left: 15rpx;
	    font-size: 26rpx;
	    float: left;
	    border: 1rpx solid #b7eb8f;
		//margin-top: 8px;

	    &:last-child {
	      margin-left: 0;
	    }

	    &.active {
	      color: $uni-text-color-active;
	      border: 1rpx solid $uni-text-color-active;
	    }
	  }

	  .btn-item-cacel {
		  border-radius: 6rpx;
		  color: #a8a8a8;
		  background: #f6ffed;
		  padding: 6rpx 20rpx;
		  margin-left: 30rpx;
		  font-size: 20rpx;
		  float: left;
		  border: 1rpx solid #a8a8a8;
		  margin-top: 8px;
	  }

      .btn-item {
        border-radius: 10rpx;
        padding: 6rpx 20rpx;
        margin-left: 15rpx;
        font-size: 28rpx;
        float: right;
        color: #383838;
        border: 1rpx solid #a8a8a8;

        &:last-child {
          margin-left: 0;
        }

        &.active {
          color: $uni-text-color-active;
          border: 1rpx solid $uni-text-color-active;
        }
      }

    }

  }

  // 弹出层-支付方式
  .pay-popup {
    padding: 24rpx;

    .title {
      font-size: 30rpx;
      margin-bottom: 40rpx;
      font-weight: bold;
      text-align: center;
    }

    .pop-content {
      min-height: 260rpx;
      padding: 0 10rpx;

      .pay-item {
        padding: 24rpx 35rpx;
        font-size: 28rpx;
        border-bottom: 1rpx solid #f1f1f1;

        &:last-child {
          border-bottom: none;
        }

        .item-left_icon {
          margin-right: 20rpx;
          font-size: 32rpx;

          &.wechat {
            color: #00c800;
          }

          &.balance {
            color: #ff9700;
          }
        }
      }
    }
    .serve-time {
      border-radius: 6 rpx;
      color: #52c41a;
      background: #f6ffed;
      padding: 6 rpx 20 rpx;
      margin-left: 15 rpx;
      font-size: 20 rpx;
      float: left;
      border: 1 rpx solid #b7eb8f;
      margin-top: 8px;
    }
  }
</style>
