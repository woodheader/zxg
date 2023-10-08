<template>
  <view class="container">
    <view class="addres-list">
	  <!-- <view class="cbook_title">投诉电话本</view> -->
	  <Dialog :cbookList="navList" @add="addList"></Dialog>
      <view class="address-item" v-for="(item, index) in list" :key="index">
        <view class="contacts">
          <text class="name">{{ item.cate_name }}</text>
        </view>
        <view class="address" v-for="(mobile, idx) in item.mobile_list" :key="idx">
            <view style="">{{ mobile.name }}</view>
            <view style="color: rgb(33, 140, 254);" @click="phoneList(mobile.mobile)">拨打热线</view>
			<view v-if="active" class="dialog-content" @click.self="active = false">
				<view class="content-text">
					<view v-for="(item,index) in phone" :key="index" class="text-item" @click="makePhone(item)">
						{{ item }}
					</view>
				</view>
				<view class="content-clear" @click="active = false">
					取消
				</view>
			</view>
        </view>
      </view>
    </view>
    <empty v-if="!list.length" :isLoading="isLoading" tips="亲，暂无可用电话信息" />
  </view>
</template>

<script>
  import * as AddressApi from '@/api/mbook'
  import Empty from '@/components/empty'
  import Dialog from '@/components/dialog'
import { isArray } from '../../../utils/util'

  export default {
    components: {
      Empty,
	  Dialog
    },
    data() {
      return {
        //当前页面参数
        options: {},
        // 正在加载
        isLoading: true,
        // 投诉电话本列表
        list: [],
        // 默认投诉电话本ID
        defaultId: null,
		// 弹窗显示隐藏
		active: false,
		// 手机号列表
		phone: [],
		// 导航栏列表
		navList: []
      }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      // 当前页面参数
      this.options = options
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
      // 获取页面数据
      this.getPageData()
    },

    methods: {

      // 获取页面数据
      getPageData() {
        const app = this
        app.isLoading = true
        Promise.all([ app.getList()])
          .then(() => {
          })
          .finally(() => app.isLoading = false)
      },

      // 获取投诉电话本列表
      getList() {
        const app = this
        return new Promise((resolve, reject) => {
          AddressApi.list()
            .then(result => {
              app.list = result.data.list
			  app.navList = result.data.list.map(item => item.cate_name)
			  app.navList.unshift('全部');
              resolve(result)
            })
            .catch(reject)
        })
      },

	  // 点击获取
	  getNavList(object) {
		  const app = this
		  return new Promise((resolve, reject) => {
		    AddressApi.list(object)
		      .then(result => {
		        app.list = result.data.list
		        resolve(result)
		      })
		      .catch(reject)
		  })
	  },

	  // 分类请求数据
	  async addList(name) {
		  this.isLoading = false;
		  if (name === '全部' ) {
			  await this.getNavList()
		  } else {
			  await this.getNavList({cate_name : name})
		  }

		  this.isLoading = true;
	  },

	  // 拨打电话
	  makePhone(phone) {
		  uni.makePhoneCall({
		  	phoneNumber: phone ,//仅为示例
			success: (res) =>{
				this.active = false
			},
			fail: (err) =>{
				console.log(err)
			}
		  });
	  },

      // 判断手机号数量
      phoneList(phone) {
        if (phone.length > 1 && isArray(phone)) {
          this.active = true
          this.phone = phone
        } else {
          this.makePhone(phone[0])
        }
	    },

      /**
       * 分享当前页面
       */
      onShareAppMessage() {
        const app = this
        return {
          title: '便民电话本',
          path: `pages/tools/mbook/index`
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
          title: '便民电话本',
          path: `pages/tools/mbook/index`
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .addres-list {
    // padding-top: 20rpx;
    // 设置ios刘海屏底部横线安全区域
    padding-bottom: calc(constant(safe-area-inset-bottom) + 140rpx);
    padding-bottom: calc(env(safe-area-inset-bottom) + 140rpx);
	.cbook_title {
		width:  100%;
		padding: 80rpx;
		text-align: center;
		background-color: #01b9e5;
		color: #fff;
		font-size: 30rpx;
		font-weight: bold;
		white-space: 20rpx;
	}
  }

  // 项目内容
  .address-item {
    margin: 20rpx auto 20rpx auto;
    padding: 30rpx 40rpx;
    width: 94%;
    box-shadow: 0 1rpx 5rpx 0px rgba(0, 0, 0, 0.05);
    border-radius: 16rpx;
    background: #fff;
  }

  .contacts {
    font-size: 30rpx;
    margin-bottom: 16rpx;

    .name {
      margin-right: 16rpx;
	  font-weight: bold;
    }
  }

  .address {
    font-size: 30rpx;
	padding: 20rpx 0;
	border-top: 1px solid rgba(0, 0, 0, 0.05);
	display: flex;
	justify-content: space-between;

    .region {
      margin-right: 10rpx;
    }

    .link {
      text-align: right;
    }
  }
  .dialog-content {
  	position: fixed;
  	top: 0;
  	right: 0;
  	left: 0;
  	bottom: 0;
  	background-color: rgba(0, 0, 0, 0.05);
  	.content-text {
  		position: absolute;
  		bottom: 160rpx;
  		width: calc(100% - 32rpx);
		margin: 20rpx;
		border-radius: 16rpx;
  		background-color: #fff;
		overflow: hidden;
  		z-index: 111;
  		.text-item {
  			border-bottom: 1px solid  rgba(0, 0, 0, 0.05);
  			display: flex;
  			padding: 20rpx 20rpx;
  			color: rgb(33, 140, 254);
  			justify-content: center;
  		}
  	}
	.content-clear {
		position: absolute;
		bottom: 50rpx;
		width: calc(100% - 32rpx);
		margin: 20rpx;
		border-radius: 16rpx;
		background-color: #fff;
		overflow: hidden;
		z-index: 111;
		color: rgb(33, 140, 254);
		padding: 20rpx 20rpx;
		text-align: center;
	}
  }

  .line {
    margin: 20rpx 0;
    border-bottom: 1rpx solid #f3f3f3;
  }

  .item-option {
    display: flex;
    justify-content: space-between;
    height: 48rpx;

    // 单选框
    .item-radio {
      font-size: 28rpx;

      .radio {
        vertical-align: middle;
        transform: scale(0.76)
      }

      .text {
        vertical-align: middle;
      }
    }

    // 操作
    .events {
      display: flex;
      align-items: center;
      line-height: 48rpx;

      .event-item {
        font-size: 28rpx;
        margin-right: 26rpx;
        color: #4c4c4c;

        &:last-child {
          margin-right: 0;
        }

        .title {
          margin-left: 8rpx;
        }
      }
    }

  }


  // 底部操作栏
  .footer-fixed {
    position: fixed;
    bottom: var(--window-bottom);
    left: 0;
    right: 0;
    min-height: 120rpx;
    z-index: 11;
    box-shadow: 0 -4rpx 40rpx 0 rgba(151, 151, 151, 0.24);
    background: #fff;

    // 设置ios刘海屏底部横线安全区域
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);

    .btn-wrapper {
      height: 120rpx;
      display: flex;
      align-items: center;
      padding: 0 40rpx;
    }

    .btn-item {
      flex: 1;
      font-size: 28rpx;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      color: #fff;
      border-radius: 50rpx;
    }

    .btn-item-main {
      background: linear-gradient(to right, #f9211c, #ff6335);
    }

  }
</style>
