<template>
  <view class="container" v-if="isRecord">
    <!-- 一级分类 -->
    <scroll-view class="cate-left" :scroll-y="true" :style="{ height: `${scrollHeight}px` }">
      <text class="type-nav" :class="{ selected: curIndex == -1 }" @click="handleSelectNav(-1)">全部</text>
      <text class="type-nav" :class="{ selected: curIndex == index }" v-for="(item, index) in list" :key="index"
        @click="handleSelectNav(index)">{{ item.name }}</text>
    </scroll-view>

    <mescroll-body ref="mescrollRef" :sticky="true" @init="mescrollInit" :down="{ use: false }" :up="upOption" :bottombar="false" @up="upCallback">
      <view class="cate-content">
        <!-- 商品列表 -->
        <view class="goods-list">
          <view class="goods-item--container" v-for="(item, index) in goodsList.data" :key="index">
            <view class="goods-item" @click="onTargetGoods(item.goods_id)">
				<view class="goods-mask-single" v-if="item.stock_total <= 0">
					<text class="wyiconfont icon-lianxi-yishouqing"></text>
				</view>
              <!-- 商品图片 -->
              <view class="goods-item_left">
                <image class="image" :src="item.goods_image"></image>
              </view>
              <view class="goods-item_right">
                <!-- 商品标题 -->
                <view class="goods-name">
                  <text class="twoline-hide">{{ item.goods_name }}</text>
                </view>
				<view style="margin: 10rpx 0">
					<!--text v-if="item.is_points_gift==1"
						style="background-color: #fff;color: #d55852;padding: 2rpx 7rpx;border-radius: 7rpx;border: 1px solid #d55852;">
						送知珠:{{(item.goods_price_min*item.gift_ratio/100).toFixed(2)}}
					</text-->
					<text v-if="item.is_tejia==1"
						style="background-color: #fff;color: #d55852;padding: 2rpx 7rpx;border-radius: 7rpx;border: 1px solid #d55852;margin-left: 10rpx;">
						限时特价
					</text>
				</view>
                <!-- 商品信息 -->
                <view class="goods-item_desc">
                  <view class="desc_footer">
                    <view class="item-prices oneline-hide">
                      <text class="price_x">¥{{ item.goods_price_min }}</text>
                      <text v-if="item.line_price_min > 0" class="price_y">¥{{ item.line_price_min }}</text>
                    </view>
                    <add-cart-btn v-if="setting.showAddCart" :btnStyle="setting.cartStyle" @click="handleAddCart(item, index)" :total="item"/>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
				<view class="shopping_card" v-if="cartTotal" @click="toCart">
					<u-icon name="shopping-cart" color="#fff" size="48"></u-icon>
					<p>{{cartTotal? cartTotal: ''}}</p>
				</view>
				
        <!-- 加入购物车组件 -->
        <AddCartPopup ref="AddCartPopup" @addCart="onUpdateCartTabBadge" />
      </view>
    </mescroll-body>
  </view>
</template>

<script>
  import MescrollBody from '@/components/mescroll-uni/mescroll-body.vue'
  import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins'
  import { getEmptyPaginateObj, getMoreListData, setCartTabBadge } from '@/core/app'
  import { PageCategoryStyleEnum } from '@/common/enum/store/page/category'
  import Empty from '@/components/empty'
  import AddCartBtn from '@/components/add-cart-btn'
  import AddCartPopup from '@/components/add-cart-popup'
  import { rpx2px } from '@/utils/util'
  import * as GoodsApi from '@/api/goods'
	import * as CartApi from '@/api/cart'

  const pageSize = 15

  export default {
    components: {
      MescrollBody,
      Empty,
      AddCartBtn,
      AddCartPopup
    },
    mixins: [MescrollMixin],
    props: {
      // 分类列表
      list: {
        type: Array,
        default: []
      },
      // 分类设置
      setting: {
        type: Object,
        default: () => {}
      },
    },
    data() {
      return {
        // 枚举类
        PageCategoryStyleEnum,
        // 列表高度
        scrollHeight: 0,
        // 一级分类：指针
        curIndex: -1,
        // 商品列表
        goodsList: getEmptyPaginateObj(),
        // 上拉加载配置
        upOption: {
          // 首次自动执行
          auto: true,
          // 每页数据的数量; 默认10
          page: { size: pageSize },
          // 数量要大于3条才显示无更多数据
          noMoreSize: 3,
          // 返回顶部
          toTop: { right: 30, bottom: 48, zIndex: 9 }
        },
				// 购物车列表
				cartList: [],
				isRecord: true,
				cartTotal: 0
      }
    },
    created() {
      // 设置分类列表高度
      this.setListHeight()
			this.getCartList()
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
        app.getGoodsList(page.num)
          .then(list => {
            const curPageLen = list.data.length
            const totalSize = list.data.total
            app.mescroll.endBySize(curPageLen, totalSize)
          })
          .catch(() => app.mescroll.endErr())
      },
			
			/**
			 * 跳转到购物车
			 * */
			toCart() {
				this.$navTo('pages/cart/index')
			},
			/**
			 * 获取购物车列表
			 * @param {Number} pageNo 页码
			 */
			getCartList() {
				const app = this
				CartApi.list().then(res => {
					this.cartList = res.data
					this.cartTotal = res.data.cartTotal
				})
			},
			async record() {
				this.isRecord = false;
				await this.getCartList()
				console.log(23)
				this.$nextTick(() => {
					this.isRecord = true
				})
			},
      /**
       * 获取商品列表
       * @param {Number} pageNo 页码
       */
      getGoodsList(pageNo = 1) {
        const app = this
        const categoryId = app.curIndex > -1 ? app.list[app.curIndex].category_id : 0
        return new Promise((resolve, reject) => {
          GoodsApi.list({ categoryId, page: pageNo }, { load: false })
            .then(result => {
              const newList = result.data.list
              app.goodsList.data = getMoreListData(newList, app.goodsList, pageNo)
							app.goodsList.data.forEach(item => {
								app.cartList.list.forEach(k => {
									if (item.goods_id === k.goods_id && !item.goods_num) {
										item.goods_num = k.goods_num
									} else if (item.goods_id === k.goods_id && item.spec_type === 20){
										item.goods_num += k.goods_num
									}
								})
							})
              app.goodsList.last_page = newList.last_page
              resolve(newList)
            })
            .catch(reject)
        })
      },

      // 设置列表内容的高度
      setListHeight() {
        const { windowHeight } = uni.getSystemInfoSync()
        this.scrollHeight = windowHeight - rpx2px(96)
      },

      // 一级分类：选中分类
      handleSelectNav(index) {
        this.curIndex = index
        this.onRefreshList()
      },

      // 刷新列表数据
      onRefreshList() {
        this.goodsList = getEmptyPaginateObj()
        setTimeout(() => this.mescroll.resetUpScroll(), 120)
      },

      // 跳转至商品列表页
      onTargetGoods(goodsId) {
        this.$navTo('pages/goods/detail', { goodsId })
      },

      // 点击加入购物车
      handleAddCart(item, index) {
        this.$refs.AddCartPopup.handle(item)
      },

      // 更新购物车角标
      onUpdateCartTabBadge(cartTotal, selectShop) {
				const { goods_id, buy_num } = selectShop
				this.goodsList.data.forEach(item => {
					if(item.goods_id === goods_id && buy_num > 0 && item.spec_type === 20) {
						if (item.goods_num) {
							item.goods_num += buy_num
						} else {
							item.goods_num = buy_num
						}
						this.record()
					}
				})
				this.cartTotal = cartTotal
        setCartTabBadge()
      },
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    padding-left: 173rpx;
  }

  // 分类内容
  .cate-content {
    z-index: 1;
    background: #fff;
    padding-top: 96rpx;
  }

  // 一级分类+二级分类 20
  .cate-left {
    width: 173rpx;
    height: 100%;
    background: #f8f8f8;
    color: #444;

    position: fixed;
    top: calc(96rpx + var(--window-top));
    left: var(--window-left);
    bottom: var(--window-bottom);
  }

  // 左侧一级分类
  .type-nav {
    position: relative;
    height: 90rpx;
    z-index: 10;
    display: block;
    font-size: 26rpx;
    display: flex;
    justify-content: center;
    align-items: center;

    &.selected {
      background: #fff;
      color: #fa2209;
      border-right: none;
      font-size: 28rpx;
    }
  }

  // 商品列表
  .goods-list {
    background: #fff;
  }

  .goods-item {
    padding: 28rpx 22rpx;
    display: flex;
	.goods-mask-single {
		position: absolute;
		background-color: #eee;
		opacity: .7;
		z-index: 8;
		display: flex;
		.wyiconfont {
			font-size: 100rpx;
			margin-top:-5rpx;
			position: absolute;
		}
	}
  }

  .goods-item_left {
    position: relative;
    background: #fff;
    margin-right: 20rpx;

    .image {
      display: block;
      width: 180rpx;
      height: 180rpx;
    }
  }

  .goods-item_right {
    position: relative;
    flex: 1;

    .goods-name {
      display: block;
      width: 100%;
      min-height: 68rpx;
      font-size: 28rpx;
      line-height: 1.3;
      color: #333;
    }
  }

  .goods-item_desc {
    margin-top: 20rpx;

    .people {
      margin-right: 14rpx;
    }

    .desc_footer {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: absolute;
      right: 0rpx;
      bottom: 0rpx;
      min-height: 44rpx;

      .item-status {
        color: #ff1d1c;
      }

      .item-prices {
        padding-right: 6rpx;

        .price_x {
          margin-right: 14rpx;
          color: rgb(240, 60, 60);
          font-size: 28rpx;
        }

        .price_y {
          color: #999;
          text-decoration: line-through;
          font-size: 24rpx;
        }
      }

    }
  }
	.shopping_card {
		width: 72rpx;
		height: 72rpx;
		background-color: #e73e1f;
		position: fixed;
		right: 30rpx;
		bottom: 200rpx;
		border-radius: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		p {
			position: absolute;
			top: -10%;
			right: -10%;
			background-color: #e73e1f;
			color: #fff;
			border-radius: 100%;
			width: 36rpx;
			height: 36rpx;
			font-size: 20rpx;
			line-height: 36rpx;
			display: flex;
			justify-content: center;
		}
	}
</style>
