<template>
  <mescroll-body ref="mescrollRef" :sticky="true" @init="mescrollInit" :down="{ native: true }" @down="downCallback" :up="upOption" @up="upCallback">
    <!-- 页面头部 -->
    <view class="header">
      <search class="search" :tips="options.search ? options.search : dynamicTitle" @event="handleSearch" />
      <!-- 切换列表显示方式 -->
      <view class="show-view" @click="handleShowView">
        <text class="iconfont icon-view-tile" v-if="showView"></text>
        <text class="iconfont icon-view-list" v-else></text>
      </view>
    </view>

    <!-- 排序标签 -->
    <view class="store-sort">
      <view class="sort-item" :class="{ active: sortType === 'all' }" @click="handleSortType('all')">
        <text>综合</text>
      </view>
      <view class="sort-item" :class="{ active: sortType === 'newest' }" @click="handleSortType('newest')">
        <text>最新</text>
      </view>
      <view class="sort-item" :class="{ active: sortType === 'sales' }" @click="handleSortType('sales')">
        <text>销量</text>
      </view>
      <view class="sort-item sort-item-price" :class="{ active: sortType === 'price' }" @click="handleSortType('price')">
        <text>价格</text>
        <view class="price-arrow">
          <view class="icon up" :class="{ active: sortType === 'price' && !sortPrice }">
            <text class="iconfont icon-arrow-up"></text>
          </view>
          <view class="icon down" :class="{ active: sortType === 'price' && sortPrice }">
            <text class="iconfont icon-arrow-down"></text>
          </view>
        </view>
      </view>
    </view>

    <!-- 服务列表 -->
    <view class="life-list clearfix" :class="['column-' + (showView ? '1' : '2')]">
      <view class="life-item" v-for="(item, index) in list.data" :key="index" @click="onTargetDetail(item.life_id)">
        <!-- 单列显示 -->
        <view v-if="showView" class="dis-flex">
			<view class="life-mask-single" v-if="item.stock_total <= 0">
				<text class="wyiconfont icon-lianxi-yishouqing"></text>
			</view>
          <!-- 服务图片 -->
          <view class="life-item_left">
            <image class="image" :src="item.life_image"></image>
          </view>
          <view class="life-item_right">
            <!-- 服务名称 -->
            <view class="life-name">
              <text class="twoline-hide">{{ item.life_name }}</text>
            </view>
            <view class="life-item_desc">
              <!-- 服务卖点 -->
              <view class="desc-selling_point dis-flex">
                <text class="oneline-hide">{{ item.selling_point }}</text>
              </view>
              <!-- 服务销量 -->
              <view class="desc-life_sales dis-flex">
                <text>已售{{ item.life_sales }}件</text>
              </view>
              <!-- 服务价格 -->
              <view class="desc_footer">
                <text class="price_x">¥{{ item.life_price_min }}</text>
                <text class="price_y col-9" v-if="item.line_price_min > 0">¥{{ item.line_price_min }}</text>
              </view>
			  <view style="margin: 10rpx 0">
			  	<text v-if="item.is_points_gift==1"
			  		style="background-color: #fff;color: #d55852;padding: 2rpx 7rpx;border-radius: 7rpx;border: 1px solid #d55852;">
			  		送知珠:{{(item.life_price_min*item.gift_ratio/100).toFixed(2)}}
			  	</text>
			  	<text v-if="item.is_tejia==1"
			  		style="background-color: #fff;color: #d55852;padding: 2rpx 7rpx;border-radius: 7rpx;border: 1px solid #d55852;margin-left: 10rpx;">
			  		限时特价
			  	</text>
			  </view>
            </view>
          </view>
        </view>
        <!-- 多列显示 -->
        <view v-else class="">
			<view class="life-mask" v-if="item.stock_total <= 0">
				<text class="wyiconfont icon-lianxi-yishouqing"></text>
			</view>
          <!-- 服务图片 -->
          <view class="life-image">
            <image class="image" mode="aspectFill" :src="item.life_image"></image>
          </view>
          <view class="detail">
            <!-- 服务标题 -->
            <view class="life-name">
              <text class="twoline-hide">{{ item.life_name }}</text>
            </view>
            <!-- 服务价格 -->
            <view class="detail-price oneline-hide">
              <text class="life-price f-30 col-m">￥{{ item.life_price_min }}</text>
              <text v-if="item.line_price_min > 0" class="line-price col-9 f-24">￥{{ item.line_price_min }}</text>
            </view>
			<view style="margin: 10rpx 0">
				<text v-if="item.is_points_gift==1"
					style="background-color: #fff;color: #d55852;padding: 2rpx 7rpx;border-radius: 7rpx;border: 1px solid #d55852;">
					送知珠:{{(item.life_price_min*item.gift_ratio/100).toFixed(2)}}
				</text>
				<text v-if="item.is_tejia==1"
					style="background-color: #fff;color: #d55852;padding: 2rpx 7rpx;border-radius: 7rpx;border: 1px solid #d55852;margin-left: 10rpx;">
					限时特价
				</text>
			</view>
          </view>
        </view>
      </view>
    </view>
  </mescroll-body>
</template>

<script>
  import MescrollBody from '@/components/mescroll-uni/mescroll-body.vue'
  import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins'
  import * as LifeApi from '@/api/life/life'
  import { getEmptyPaginateObj, getMoreListData } from '@/core/app'
  import Search from '@/components/search'
import { isEmpty } from '../../../utils/util'

  const pageSize = 15
  const showViewKey = 'LifeList-ShowView';

  export default {
    components: {
      MescrollBody,
      Search
    },

    mixins: [MescrollMixin],

    data() {
      return {
        showView: true, // 列表显示方式 (true列表、false平铺)
        sortType: 'all', // 排序类型
        sortPrice: false, // 价格排序 (true高到低 false低到高)
        options: {}, // 当前页面参数
        list: getEmptyPaginateObj(), // 服务列表数据

        // 上拉加载配置
        upOption: {
          // 首次自动执行
          auto: true,
          // 每页数据的数量; 默认10
          page: { size: pageSize },
          // 数量要大于4条才显示无更多数据
          noMoreSize: 4,
        },
		// 当前页面的分类ID
		categoryId: 0,
		// 动态标题
		dynamicTitle: '搜索服务',
      }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      // 记录options
      this.options = options
      this.categoryId = options.categoryId
      this.sortType = isEmpty(options.sortType) ? this.sortType : options.sortType
      // 设置默认列表显示方式
      this.setShowView()
    },

    methods: {

      /**
       * 上拉加载的回调 (页面初始化时也会执行一次)
       * 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10
       * @param {Object} page
       */
      upCallback(page) {
        const app = this
        // 设置列表数据
        app.getLifeList(page.num)
          .then(list => {
            const curPageLen = list.data.length
            const totalSize = list.data.total
            app.mescroll.endBySize(curPageLen, totalSize)
          })
          .catch(() => app.mescroll.endErr())
      },

      // 设置默认列表显示方式
      setShowView() {
        this.showView = uni.getStorageSync(showViewKey) || true
      },

      /**
       * 获取服务列表
       * @param {number} pageNo 页码
       */
      getLifeList(pageNo = 1) {
        const app = this
        const param = {
          sortType: app.sortType,
          sortPrice: Number(app.sortPrice),
          categoryId: app.options.categoryId || 0,
          lifeName: app.options.search || '',
		      lifeNo: app.options.lifeNo || '',
          page: pageNo
        }
        return new Promise((resolve, reject) => {
          LifeApi.list(param)
            .then(result => {
              // 合并新数据
              const newList = result.data.list
              app.list.data = getMoreListData(newList, app.list, pageNo)
              resolve(newList)
            })
            .catch(reject)
        })
      },

      // 切换排序方式
      handleSortType(newSortType) {
        const app = this
        const newSortPrice = newSortType === 'price' ? !app.sortPrice : true
        app.sortType = newSortType
        app.sortPrice = newSortPrice
		app.options.lifeNo = ''
        // 刷新列表数据
        app.list = getEmptyPaginateObj()
        app.mescroll.resetUpScroll()
      },

      // 切换列表显示方式
      handleShowView() {
        const app = this
        app.showView = !app.showView
        uni.setStorageSync(showViewKey, app.showView)
      },

      // 跳转服务详情页
      onTargetDetail(lifeId) {
        this.$navTo('pages/life/life/detail', { lifeId })
      },

      /**
       * 服务搜索
       */
      handleSearch() {
        const searchPageUrl = 'pages/search/index'
        // 判断来源页面
        let pages = getCurrentPages()
        if (pages.length > 1 &&
          pages[pages.length - 2].route === searchPageUrl) {
          uni.navigateBack()
          return
        }
        // 跳转到服务搜索页
        this.$navTo(searchPageUrl)
      }

    },


    /**
     * 设置分享内容
     */
    onShareAppMessage() {
      // 构建分享参数
      return {
        title: "全部分类",
        path: "/pages/category/index?" + this.$getShareUrlParams()
      }
    },

    /**
     * 分享到朋友圈
     * 本接口为 Beta 版本，暂只在 Android 平台支持，详见分享到朋友圈 (Beta)
     * https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share-timeline.html
     */
    onShareTimeline() {
      // 构建分享参数
      return {
        title: "全部分类",
        path: "/pages/category/index?" + this.$getShareUrlParams()
      }
    }

  }
</script>

<style lang="scss" scoped>
  // 页面头部
  .header {
    display: flex;
    align-items: center;
    background-color: #fff;

    // 搜索框
    .search {
      flex: 1;
    }

    // 切换显示方式
    .show-view {
      width: 60rpx;
      height: 60rpx;
      line-height: 60rpx;
      font-size: 36rpx;
      color: #505050;
    }
  }

  // 排序组件
  .store-sort {
    position: sticky;
    top: var(--window-top);
    display: flex;
    padding: 20rpx 0;
    font-size: 28rpx;
    background: #fff;
    color: #000;
    z-index: 99;

    .sort-item {
      flex-basis: 33.3333%;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 50rpx;

      &.active {
        color: #e49a3d;
      }
    }

    .sort-item-price .price-arrow {
      margin-left: 20rpx;
      font-size: 24rpx;
      color: #000;

      .icon {
        &.active {
          color: #e49a3d;
        }

        &.up {
          margin-bottom: -16rpx;
        }

        &.down {
          margin-top: -16rpx;
        }
      }

    }

  }

  // 服务列表
  .life-list {
	width: 100%;
    padding: 4rpx;
    box-sizing: border-box;
  }

  // 单列显示
  .life-list.column-1 {
    .life-item {
      width: 100%;
      /*height: 280rpx;*/
      margin-bottom: 12rpx;
      padding: 20rpx;
      box-sizing: border-box;
      background: #fff;
      line-height: 1.6;

      &:last-child {
        margin-bottom: 0;
      }

	  .life-mask-single {
	  	position: absolute;
	  	background-color: #eee;
	  	opacity: .7;
	  	z-index: 98;
	  	display: flex;
	  	.wyiconfont {
	  		font-size: 120rpx;
			margin-top:-7rpx;
			position: absolute;
	  	}
	  }
    }

    .life-item_left {
      display: flex;
      width: 300rpx;
      background: #fff;
      align-items: center;

      .image {
        display: block;
        width: 240rpx;
        height: 240rpx;
      }
    }

    .life-item_right {
      position: relative;
      // width: 450rpx;
      flex: 1;

      .life-name {
        margin-top: 10rpx;
        min-height: 68rpx;
        white-space: normal;
        color: #484848;
		line-height: 1.5;
		font-size: 32rpx;
		letter-spacing: 1rpx;

      }
    }

    .life-item_desc {
      margin-top: 8rpx;
    }

    .desc-selling_point {
      width: 400rpx;
      font-size: 24rpx;
      color: #e49a3d;
    }

    .desc-life_sales {
      color: #999;
      font-size: 24rpx;
    }

    .desc_footer {
      font-size: 24rpx;

      .price_x {
        margin-right: 16rpx;
        color: #f03c3c;
        font-size: 30rpx;
      }

      .price_y {
        text-decoration: line-through;
      }
    }
  }

  // 平铺显示
  .life-list.column-2 {
    .life-item {
      width: 50%;
    }
  }

  .life-item {
    float: left;
    box-sizing: border-box;
    padding: 6rpx;

	.life-mask {
		position: absolute;
		background-color: #eee;
		opacity: .7;
		z-index: 98;
		display: flex;
		.wyiconfont {
			font-size: 200rpx;
			margin-top:-8rpx;
			position: absolute;
		}
	}

    .life-image {
      position: relative;
      width: 100%;
      height: 0;
      padding-bottom: 100%;
      overflow: hidden;
      background: #fff;

      &:after {
        content: '';
        display: block;
        margin-top: 100%;
      }

      .image {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        -o-object-fit: cover;
        object-fit: cover;
      }
    }

    .detail {
      padding: 8rpx;
      background: #fff;

      .life-name {
        min-height: 68rpx;
        line-height: 32rpx;
        white-space: normal;
        color: #484848;
        font-size: 32rpx;
		line-height: 1.5;
		letter-spacing: 1rpx;
      }

      .detail-price {
        .life-price {
          margin-right: 8rpx;
        }

        .line-price {
          text-decoration: line-through;
        }
      }
    }
  }
</style>
