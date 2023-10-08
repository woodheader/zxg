<template>
	<view>
		<u-sticky :offset-top="0">
			<view class="log_tab">
				<button @click="show = true">{{ yearNum }}年 <u-icon :name="show? 'arrow-up-fill':'arrow-down-fill'" style="margin-left: 10rpx;" size="28"></u-icon></button>
				<button @click="mounthShow = true">{{ mounth }}月 <u-icon :name="mounthShow? 'arrow-up-fill':'arrow-down-fill'" style="margin-left: 10rpx" size="28"></u-icon></button>
			</view>
		</u-sticky>
		<view class="log_list">
			<view v-for="(item,index) in logList.data" :key="index" @click="ToDetail(item)">
				{{item.log_dt}}
			</view>
		</view>
		<u-select v-model="show" :list="yearList" @confirm="yearConfirm"></u-select>
		<u-select v-model="mounthShow" :list="mounthList" :default-value="[mounth - 1]" @confirm="mouthConfirm"></u-select>
	</view>
</template>

<script>
	import * as AddressApi from '@/api/wy_service.js'
	export default {
		data() {
			return {
				logList: [],
				show: false,
				mounthShow: false,
				yearNum: '',
				mounth: '',
				eid: ''
			};
		},
		computed: {
			yearList() {
				const time = new Date()
				const yearList = []
				this.yearNum = time.getFullYear()
				this.mounth = time.getMonth() + 1
				const year = time.getFullYear()
				if (year >= 2023) {
					for(let i = year; i >= 2023; i--) {
						yearList.push({
							value: i,
							label: i
						})
					}
				}
				return yearList
			},
			mounthList() {
				const mounthList = []
				for(let i = 1; i <= 12; i++) {
					mounthList.push({
						value: i,
						label: i
					})
				}
				return mounthList
			}
		},
		onLoad(option) {
			this.getService(option.id)
			this.eid = option.id
		},
		methods: {
			getService(eid) {
				const data = {
					service_id : eid,
					log_dt_year : this.yearNum,
					log_dt_month : this.mounth
				}
				AddressApi.logList(data).then(res => {
					this.logList = res.data.list
				})
			},
			yearConfirm(e) {
				this.yearNum = e[0].value
				this.getService(this.eid)
			},
			mouthConfirm(e) {
				this.mounth = e[0].value
				this.getService(this.eid)
			},
			ToDetail(item) {
				uni.navigateTo({
					url: `/pages/tools/wy_service/ServiceDetail?id=${item.id}`
				})
			}
		}
	}
</script>
<style>
	page {
		background-color: #f4f4f4;
	}
</style>
<style lang="scss" scoped>
.log_tab {
	display: flex;
	button {
		width: 50%;
		background-color: #fff;
		// border: 1rpx solid  rgba(33, 140, 254, 0.5);
	}
}
.log_list {
	view {
		padding: 30rpx 20rpx;
		border-bottom:1rpx solid #f4f4f4;
		box-shadow: 0 1rpx 5rpx 0px rgba(0, 0, 0, 0.05);
		background-color: #fff;
	}
}
</style>
