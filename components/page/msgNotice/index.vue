<template>
  <!-- 消息通知 -->
  <view class="diy-notice" 
  :style="{ paddingTop: `${itemStyle.paddingTop}px`, paddingBottom: `${itemStyle.paddingTop}px`}"
  v-show="isShow"
  >
    <u-notice-bar padding="10rpx 24rpx" 
	:mode="params.mode" 
	:border-radius="params.borderRadius"
	:close-icon="params.closeIcon" 
	:play-state="params.playState" 
	:type="params.type" 
	:volume-icon="params.showIcon" 
	:autoplay="false"
    :bg-color="itemStyle.background" 
	:color="itemStyle.textColor" 
	:font-size="itemStyle.fontSize"
	@close="doRead('close', params)"
	@click="doRead('click', params)"
	:list="[params.text]"></u-notice-bar>
  </view>
</template>

<script>
  import mixin from '../mixin'
  import * as UserApi from '@/api/user'

  export default {
	name: "MsgNotice",
	
	data() {
		return {
			// 是否显示
			isShow: true,
		}
	},
	
    /**
     * 组件的属性列表
     * 用于组件自定义设置
     */
    props: {
      itemStyle: Object,
      params: Object
    },

    mixins: [mixin],

    /**
     * 组件的方法列表
     * 更新属性和数据的方法与更新页面数据的方法类似
     */
    methods: {
		close(title) {
			this.isShow = false
			this.$router.go(0)
		},
		click(linkObj) {
			this.onLink(linkObj)
		},
		doRead(type, params) {
			let app = this
			let title = params.title
			let linkObj = params.link
			let msgId = params.msg_id
			UserApi.doRead({form:{msg_id: msgId}}).then(res => {
				if (type === 'click') {
					app.click(linkObj);
				}
				if (type === 'close') {
					app.close(title)
				}
			}).catch((e)=>{
				console.log(e)
			})
		}
    }

  }
</script>

<style lang="scss" scoped>
</style>
