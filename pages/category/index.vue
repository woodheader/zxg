<template>
  <view class="container">
    <!-- 搜索框 -->
    <search class="search" tips="搜索商品" @event="$navTo('pages/search/index')" />

    <!-- 一级分类 -->
    <primary v-if="setting.style == PageCategoryStyleEnum.ONE_LEVEL_BIG.value || setting.style == PageCategoryStyleEnum.ONE_LEVEL_SMALL.value"
      :display="setting.style" :list="list" />

    <!-- 二级分类 -->
    <secondary v-if="setting.style == PageCategoryStyleEnum.TWO_LEVEL.value" :list="list" />

    <!-- 分类+商品 -->
    <commodity v-if="setting.style == PageCategoryStyleEnum.COMMODITY.value" ref="mescrollItem" :list="list" :setting="setting"/>
  </view>
</template>

<script>
  import MescrollCompMixin from '@/components/mescroll-uni/mixins/mescroll-comp'
  import { setCartTabBadge } from '@/core/app'
  import SettingKeyEnum from '@/common/enum/setting/Key'
  import { PageCategoryStyleEnum } from '@/common/enum/store/page/category'
  import SettingModel from '@/common/model/Setting'
  import * as CategoryApi from '@/api/category'
  import Empty from '@/components/empty'
  import Search from '@/components/search'
  import Primary from './components/primary'
  import Secondary from './components/secondary'
  import Commodity from './components/commodity'

  // 最后一次刷新时间
  let lastRefreshTime;

  export default {
    components: {
      Search,
      Empty,
      Primary,
      Secondary,
      Commodity
    },
    mixins: [MescrollCompMixin],
    data() {
      return {
        // 枚举类
        PageCategoryStyleEnum,
        // 分类列表
        list: [],
        // 分类模板设置
        setting: {},
        // 正在加载中
        isLoading: true
      }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
      // 加载页面数据
      this.onRefreshPage()
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
			this.$refs.mescrollItem.record()
      // 每间隔5分钟自动刷新一次页面数据
      const curTime = new Date().getTime()
      if ((curTime - lastRefreshTime) > 5 * 60 * 1000) {
        this.onRefreshPage()
      }
    },
    methods: {

      // 刷新页面
      onRefreshPage() {
        // 记录刷新时间
        lastRefreshTime = new Date().getTime()
        // 获取页面数据
        this.getPageData()
        // 更新购物车角标
        setCartTabBadge()
      },

      // 获取页面数据
      getPageData() {
        const app = this
        app.isLoading = true
        Promise.all([
            // 获取分类模板设置
            // 优化建议: 可以将此处的false改为true 启用缓存
            SettingModel.data(false),
            // 获取分类列表
            CategoryApi.list()
          ])
          .then(result => {
            // 初始化分类模板设置
            app.initSetting(result[0])
            // 初始化分类列表数据
            app.initCategory(result[1])
          })
          .finally(() => app.isLoading = false)
      },

      /**
       * 初始化分类模板设置
       * @param {Object} result
       */
      initSetting(setting) {
        this.setting = setting[SettingKeyEnum.PAGE_CATEGORY_TEMPLATE.value]
      },

      /**
       * 初始化分类列表数据
       * @param {Object} result
       */
      initCategory(result) {
        this.list = result.data.list
      },

    },

    /**
     * 设置分享内容
     */
    onShareAppMessage() {
      const app = this
      return {
        title: _this.templet.shareTitle,
        path: '/pages/category/index?' + app.$getShareUrlParams()
      }
    },

    /**
     * 分享到朋友圈
     * 本接口为 Beta 版本，暂只在 Android 平台支持，详见分享到朋友圈 (Beta)
     * https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share-timeline.html
     */
    onShareTimeline() {
      const app = this
      return {
        title: _this.templet.shareTitle,
        path: '/pages/category/index?' + app.$getShareUrlParams()
      }
    }

  }
</script>

<style>
  page {
    background: #fff;
  }
</style>
<style lang="scss" scoped>
  // 搜索框
  .search {
    position: fixed;
    top: var(--window-top);
    left: var(--window-left);
    right: var(--window-right);
    z-index: 9;
    padding-bottom: 20rpx;
  }
</style>
