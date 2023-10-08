import Enum from '../enum'

/**
 * 枚举类：订单状态
 * OrderStatusEnum
 */
export default new Enum([
  { key: 'NORMAL', name: '进行中', value: 10 },
  { key: 'CANCELLED', name: '已取消', value: 20 },
  { key: 'APPLY_CANCEL', name: '待取消', value: 21 },
  { key: 'COMPLETED', name: '已完成', value: 30 }
])
