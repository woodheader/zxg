<template>
  <view class="add-cart" @click.stop="handleAddCart">
    <text class="icon iconfont" :class="[`icon-jiagou${btnStyle}`]"></text>
		<p v-if="cateTotal">{{cateTotal}}</p>
  </view>
</template>

<script>
  export default {
    props: {
      // 购物车按钮样式 1 2 3
      btnStyle: {
        type: Number,
        default: 1
      },
			total: Object
    },
    data() {
      return {
        value: false,
        goodsInfo: {},
				cateTotal: this.total.goods_num || 0
      }
    },
		watch: {
			total: {
				deep: true,
				handler(val) {
					this.cateTotal = val.goods_num || 0
				}
			}
		},
    methods: {
      handleAddCart() {
				if (this.total.spec_type === 10) {
					this.cateTotal += 1
				}
        this.$emit('click')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .add-cart {
    font-size: 38rpx;
    padding: 0 20rpx;
    color: #f76b2d;
		position: relative;
		p {
			position: absolute;
			top: -5rpx;
			color: #fff;
			right: 0;
			background-color: #e73e1f;
			font-size: 20rpx;
			line-height: 30rpx;
			width: 30rpx;
			text-align: center;
			border-radius: 100%;
		}
  }
</style>
