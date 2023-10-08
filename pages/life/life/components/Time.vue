<template>
  <view class="time-wrapper">
    <!-- 服务简述 -->
    <view class="time-simple" @click="handlePopup">
      <view class="s-list">
        <view class="s-item">
          <text class="item-icon iconfont icon-timeline"></text>
          <text class="item-val">上门时间</text>
        </view>
      </view>
      <!-- 扩展箭头 -->
      <view class="s-arrow f-26 col-9 t-r">
        <text>{{selectedTime}}</text>
        <text class="iconfont icon-arrow-right"></text>
      </view>
    </view>
    <!-- 详情内容弹窗 -->
    <u-popup ref="popTimer" v-model="showPopup" mode="bottom" :z-index="18899" :closeable="true" :border-radius="26">
      <view class="time-content">
        <view class="title">选择上门时间</view>
        <scroll-view class="content-scroll" :scroll-y="true">
          <view class="s-list clearfix">
            <picker-view class="picker-view" v-if="visible" :indicator-style="indicatorStyle" :value="value" @change="bindChange">
              <picker-view-column>
                <view class="item" v-for="(item,index) in years" :key="index">{{item}}年</view>
              </picker-view-column>
              <picker-view-column>
                <view class="item" v-for="(item,index) in months" :key="index">{{item}}月</view>
              </picker-view-column>
              <picker-view-column>
                <view class="item" v-for="(item,index) in days" :key="index">{{item}}日</view>
              </picker-view-column>
              <picker-view-column>
                <view class="item" v-for="(item,index) in hours" :key="index">{{item}}点</view>
              </picker-view-column>
              <picker-view-column>
                <view class="item" v-for="(item,index) in minus" :key="index">{{item}}分</view>
              </picker-view-column>
            </picker-view>

          </view>

        </scroll-view>
      </view>
    </u-popup>
  </view>
</template>

<script>
  import * as ServiceApi from '@/api/life/service'

  export default {
    props: {
    },
    data() {
      const date = new Date()
      const years = []
      const year = date.getFullYear()
      const months = []
      const month = date.getMonth() + 1
      const days = []
      const day = date.getDate()
      const hours = []
      const hour = date.getHours()
      const minus = []
      const minu = date.getMinutes()
      for (let i = 2023; i <= date.getFullYear(); i++) {
        years.push(i)
      }
      for (let i = month; i <= 12; i++) {
        months.push(i)
      }
      for (let i = day; i <= 31; i++) {
        days.push(i)
      }
      for (let i = hour; i <= 17; i++) {
        hours.push(i)
      }
      for (let i = minu; i < 60; i++) {
        minus.push(i)
      }
      return {
        // 正在加载
        isLoading: true,
        // 显示详情内容弹窗
        showPopup: false,
        // 服务列表数据
        list: [],
        years,
        year,
        months,
        month,
        days,
        day,
        hours,
        minus,
        hour: '8',
        minutes: 1,
        visible: true,
        value: [9999, 0, 0, 0, 0],
        indicatorStyle: `height: 50px;`,
        selectedTime: ''
      }
    },

    created() {
      // 设置默认选中事件
      this.setDefaultTime()
    },

    methods: {

      setDefaultTime() {
        this.selectedTime = undefined
      },

      bindChange: function (e) {
        const val = e.detail.value
        this.year = this.years[val[0]]
        this.month = this.months[val[1]]
        this.day = this.days[val[2]]
        this.hour = this.hours[val[3]]
        this.minutes = this.minus[val[4]]
        if (this.year === undefined) {
          this.year = (new Date()).getFullYear()
        }
        if (this.hour === undefined) {
          this.hour = this.hours[0]
        }
        if (this.minutes === undefined) {
          this.minutes = this.minus[0]
        }
        // 回显到页面
        this.selectedTime = this.year+'年'+this.month+'月'+this.day+'日 '+this.hour+'点'+this.minutes+'分'
        // 传递给父级
        this.$emit('setTime', this.year+'年'+this.month+'月'+this.day+'日 '+this.hour+'点'+this.minutes+'分')
      },

      // 显示弹窗
      handlePopup() {
        this.selectedTime = this.year+'年'+this.month+'月'+this.day+'日 '+this.hour+'点'+this.minutes+'分'
        // 传递给父级
        this.$emit('setTime', this.year+'年'+this.month+'月'+this.day+'日 '+this.hour+'点'+this.minutes+'分')
        this.showPopup = true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .time-wrapper {
    min-height: 24rpx;
    margin-bottom: -24rpx;
  }

  // 服务简述
  .time-simple {
    padding: 24rpx 30rpx;
    display: flex;
    align-items: center;

    .s-list {
      flex: 1;
      margin-left: -15rpx;
    }

    .s-item {
      float: left;
      font-size: 26rpx;
      margin: 8rpx 15rpx;

      .item-icon {
        color: #cd3e3c;
      }

      .item-val {
        margin-left: 12rpx;
      }
    }


  }

  // 服务详细内容
  .time-content {
    padding: 24rpx 24rpx 0 0;

    .title {
      font-size: 30rpx;
      margin-bottom: 50rpx;
      font-weight: bold;
      text-align: center;
    }

    .content-scroll {
      min-height: 400rpx;
      max-height: 760rpx;
    }

    .s-list {
    }

    .s-item {
      position: relative;
      margin-bottom: 60rpx;

      .item-icon {
        position: absolute;
        top: 6rpx;
        left: -50rpx;
        color: #FA2209;
      }

      .item-val {
        font-size: 28rpx;
      }

      .item-summary {
        font-size: 26rpx;
        margin-top: 20rpx;
        color: #6d6d6d;
      }
    }

    .picker-view {
      width: 750rpx;
      height: 600rpx;
      margin-top: 20rpx;
    }
    .item {
      line-height: 100rpx;
      text-align: center;
    }

  }
</style>
