import Enum from '../../enum'

/**
 * 枚举类：订单验收状态
 * ReceiptStatusEnum
 */
export default new Enum([
  { key: 'NOT_RECEIVED', name: '未验收', value: 10 },
  { key: 'RECEIVED', name: '已验收', value: 20 }
])
