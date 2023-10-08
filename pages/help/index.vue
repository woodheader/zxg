<template>
  <view class="container">
	  
	  
    <!-- <mescroll-body ref="mescrollRef" :sticky="true" @init="mescrollInit" :down="{ use: false }" :up="upOption"
      @up="upCallback">
      <view class="help cont-box b-f" v-for="(item, index) in list.data" :key="index">
        <view class="title">
          <text>{{ item.title }}</text>
        </view>
        <view class="content">
          <text>{{ item.content }}</text>
        </view>
      </view>
    </mescroll-body> -->
	
	<view class="kefu">
		<view class="call" @tap="call()">
			<text class="wyiconfont icon-iconfontphone call-icon"></text>
			<text>电话咨询</text>
		</view>
		<!-- <view class="online">
			<u-button class="contact" open-type="contact" size="mini" plain>
				<text class="wyiconfont icon-a-kefukefuzhongxin"></text>
			</u-button>
			<text>在线咨询</text>
		</view> -->
	</view>
	
  </view>
</template>

<script>
  // import MescrollBody from '@/components/mescroll-uni/mescroll-body.vue'
  // import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins'
//   import * as HelpApi from '@/api/help'
// import { fail } from 'assert'
// import { log } from 'console'
  // import { getEmptyPaginateObj, getMoreListData } from '@/core/app'

  // const pageSize = 15

  export default {
    components: {
      // MescrollBody
    },
    // mixins: [MescrollMixin],
    data() {
      return {
        // list: getEmptyPaginateObj(),
        // // 上拉加载配置
        // upOption: {
        //   // 首次自动执行
        //   auto: true,
        //   // 每页数据的数量; 默认10
        //   page: { size: pageSize },
        //   // 数量要大于12条才显示无更多数据
        //   noMoreSize: 12,
        //   // 空布局
        //   empty: {
        //     tip: '亲，暂无相关数据'
        //   }
        // }
      }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {},

    methods: {

      /**
       * 上拉加载的回调 (页面初始化时也会执行一次)
       * 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10
       * @param {Object} page
       */
      // upCallback(page) {
      //   const app = this
      //   // 设置列表数据
      //   app.getHelpList(page.num)
      //     .then(list => {
      //       const curPageLen = list.data.length
      //       const totalSize = list.data.total
      //       app.mescroll.endBySize(curPageLen, totalSize)
      //     })
      //     .catch(() => app.mescroll.endErr())
      // },

      // 获取帮助列表
      // getHelpList(pageNo = 1) {
      //   const app = this
      //   return new Promise((resolve, reject) => {
      //     HelpApi.list({ page: pageNo })
      //       .then(result => {
      //         // 合并新数据
      //         const newList = result.data.list
      //         app.list.data = getMoreListData(newList, app.list, pageNo)
      //         resolve(newList)
      //       })
      //   })
      // }
	  
	  call() {
		  uni.makePhoneCall({
		  	phoneNumber: '15757260301',
			success: () => {
				console.log('拨打成功');
			},
			fail: () => {
				console.log('拨打失败');
			}
		  })
	  }

    }
  }
</script>

<style lang="scss" scoped>
  .help {
    border-bottom: 1rpx solid #f6f6f9;

    .title {
      font-size: 32rpx;
      color: #333;
      margin-bottom: 10rpx;
    }

    .content {
      font-size: 26rpx;
      color: #666;
    }
  }
  
  .kefu {
	  position: absolute;
	  bottom: 0;
	  left: 0;
	  width: 100%;
	  background-color: #fff;
	  display: flex;
	  font-size: 24rpx;
	  .call {
		  display: flex;
		  flex-direction: column;
		  justify-content: center;
		  align-items: center;
		  flex: 1;
		  padding: 10rpx;
		  .call-icon {
			  font-size: 50rpx;
			  margin-bottom: 5rpx;
		  }
	  }
	  .online {
		  display: flex;
		  flex-direction: column;
		  justify-content: center;
		  align-items: center;
		  flex: 1;
		  padding: 10rpx;
	  }
	  .contact {
	  	.wyiconfont {
	  		font-size: 50rpx;
			margin-bottom: 5rpx;
	  	}
	  
	  	/deep/ button::after, &::after {
	  		display: none;
	  	}
	  }
  }
</style>
