<template>
  <goods-sku-popup :value="visible" @input="onChangeValue" border-radius="20" :localdata="localdata" :mode="2" :maskCloseAble="true"
    @add-cart="addCart" @buy-now="buyNow" buyNowText="立即购买" />
</template>

<script>
  import { setCartTotalNum } from '@/core/app'
  import { SpecTypeEnum } from '@/common/enum/goods'
  import * as CartApi from '@/api/cart'
  import * as GoodsApi from '@/api/goods'
  import GoodsSkuPopup from '@/components/goods-sku-popup'

  export default {
    components: {
      GoodsSkuPopup
    },
    props: {
      // 购物车按钮样式 1 2 3
      btnStyle: {
        type: Number,
        default: 1
      },
    },
    data() {
      return {
        // 是否显示
        visible: false,
        // 主商品信息
        goods: {},
        // SKU商品信息
        localdata: {}
      }
    },
    methods: {

      // 加入购物车事件
      async handle(goods) {
        this.goods = goods
        if (goods.spec_type == SpecTypeEnum.SINGLE.value) {
          this.singleEvent()
        }
        if (goods.spec_type == SpecTypeEnum.MULTI.value) {
          this.multiEvent()
        }
      },

      // 单规格商品事件
      singleEvent() {
        const { goods } = this
        this.addCart({
          goods_id: goods.goods_id,
          goods_sku_id: '0',
          buy_num: 1
        })
      },

      // 多规格商品事件
      async multiEvent() {
        const app = this
        const { goods } = app
        // 获取商品的规格信息
        const { data: { specData } } = await GoodsApi.specData(goods.goods_id)
        goods.skuList = specData.skuList
        goods.specList = specData.specList
        // 整理SKU商品信息
        app.localdata = {
          _id: goods.goods_id,
          name: goods.goods_name,
          goods_thumb: goods.goods_image,
          sku_list: app.getSkuList(),
          spec_list: app.getSpecList()
        }
        this.visible = true
      },

      // 监听组件显示隐藏
      onChangeValue(val) {
        this.visible = val
      },

      // 整理商品SKU列表 (多规格)
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

      // 整理规格数据 (多规格)
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

      // 加入购物车按钮
      addCart(selectShop) {
        const app = this
        const { goods_id, goods_sku_id, buy_num } = selectShop
        CartApi.add(goods_id, goods_sku_id, buy_num)
          .then(result => {
            // 显示成功
            app.$toast(result.message, 1000, false)
            // 隐藏当前弹窗
            app.onChangeValue(false)
            // 购物车商品总数量
            const cartTotal = result.data.cartTotal
            // 缓存购物车数量
            setCartTotalNum(cartTotal)
            // 传递给父级
            app.$emit('addCart', cartTotal, selectShop)
          })
      }

    }
  }
</script>

<style lang="scss" scoped>
  .add-cart {
    font-size: 38rpx;
    padding: 0 20rpx;
    color: #fa2209;
  }
</style>
