<template>
  <goods-sku-popup :value="value" @input="onChangeValue" border-radius="20" :localdata="goodsInfo" :mode="skuMode"
    :maskCloseAble="true" @open="openSkuPopup" @close="closeSkuPopup" @add-cart="addCart" @buy-now="buyNow"
    buyNowText="立即购买" />
</template>

<script>
  import { setCartTotalNum } from '@/core/app'
  import * as CartApi from '@/api/cart'
  import GoodsSkuPopup from '@/components/goods-sku-popup'

  export default {
    components: {
      GoodsSkuPopup
    },
    model: {
      prop: 'value',
      event: 'input'
    },
    props: {
      // true 组件显示 false 组件隐藏
      value: {
        Type: Boolean,
        default: false
      },
      // 模式 1:都显示 2:只显示购物车 3:只显示立即购买
      skuMode: {
        type: Number,
        default: 1
      },
      // 商品详情信息
      goods: {
        type: Object,
        default: {}
      }
    },

    data() {
      return {
        goodsInfo: {}
      }
    },

    created() {
      const app = this
      const { goods } = app
      app.goodsInfo = {
        _id: goods.goods_id,
        name: goods.goods_name,
        goods_thumb: goods.goods_image,
        sku_list: app.getSkuList(),
        spec_list: app.getSpecList()
      }
    },

    methods: {

      // 监听组件显示隐藏
      onChangeValue(val) {
        this.$emit('input', val)
      },

      // 整理商品SKU列表
      getSkuList() {
        const app = this
        const { goods: { goods_name, goods_image, skuList } } = app
        const skuData = []
        skuList.forEach(item => {
          skuData.push({
            _id: item.id,
            goods_sku_id: item.goods_sku_id,
            goods_id: item.goods_id,
            goods_name: goods_name,
            image: item.image_url ? item.image_url : goods_image,
            price: item.goods_price * 100,
            stock: item.stock_num,
            spec_value_ids: item.spec_value_ids,
            sku_name_arr: app.getSkuNameArr(item.spec_value_ids)
          })
        })
        return skuData
      },

      // 获取sku记录的规格值列表
      getSkuNameArr(specValueIds) {
        const app = this
        const defaultData = ['默认']
        const skuNameArr = []
        if (specValueIds) {
          specValueIds.forEach((valueId, groupIndex) => {
            const specValueName = app.getSpecValueName(valueId, groupIndex)
            skuNameArr.push(specValueName)
          })
        }
        return skuNameArr.length ? skuNameArr : defaultData
      },

      // 获取指定的规格值名称
      getSpecValueName(valueId, groupIndex) {
        const app = this
        const { goods: { specList } } = app
        const res = specList[groupIndex].valueList.find(specValue => {
          return specValue.spec_value_id == valueId
        })
        return res.spec_value
      },

      // 整理规格数据
      getSpecList() {
        const { goods: { specList } } = this
        const defaultData = [{ name: '默认', list: [{ name: '默认' }] }]
        const specData = []
        specList.forEach(group => {
          const children = []
          group.valueList.forEach(specValue => {
            children.push({ name: specValue.spec_value })
          })
          specData.push({
            name: group.spec_name,
            list: children
          })
        })
        return specData.length ? specData : defaultData
      },

      // sku组件 开始-----------------------------------------------------------
      openSkuPopup() {
        // console.log("监听 - 打开sku组件")
      },

      closeSkuPopup() {
        // console.log("监听 - 关闭sku组件")
      },

      // 加入购物车按钮
      addCart(selectShop) {
        const app = this
        const { goods_id, goods_sku_id, buy_num } = selectShop
        CartApi.add(goods_id, goods_sku_id, buy_num)
          .then(result => {
            // 显示成功
            app.$toast(result.message)
            // 隐藏当前弹窗
            app.onChangeValue(false)
            // 购物车商品总数量
            const cartTotal = result.data.cartTotal
            // 缓存购物车数量
            setCartTotalNum(cartTotal)
            // 传递给父级
            app.$emit('addCart', cartTotal)
          })
      },

      // 立即购买
      buyNow(selectShop) {
        // 跳转到订单结算页
        this.$navTo('pages/checkout/index', {
          mode: 'buyNow',
          goodsId: selectShop.goods_id,
          goodsSkuId: selectShop.goods_sku_id,
          goodsNum: selectShop.buy_num
        })
        // 隐藏当前弹窗
        this.onChangeValue(false)
      }

    }
  }
</script>

<style lang="scss" scoped>

</style>
