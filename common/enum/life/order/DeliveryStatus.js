import Enum from '../../enum'

/**
 * 枚举类：订单上门状态
 * DeliveryStatusEnum
 */
export default new Enum([
  { key: 'NOT_DELIVERED', name: '待上门', value: 10 },
  { key: 'DELIVERED', name: '已上门', value: 20 }
])
