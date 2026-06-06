/**
 * 合成革企业环境绩效分级评价系统 V1.0
 * 基本要求判定服务
 *
 * 根据研究报告第三章"基本要求"一节，对企业的五项基本资格进行一票否决制判定。
 */

import { BASIC_CHECK_ITEMS } from '@/utils/constants'

/**
 * 执行企业基本要求判定
 * 五项必须全部通过，任一不通过则企业不具备参评资格
 *
 * @param {Object} checkData - { env_accident, safety_accident, quality_accident, credit_record, drain_compliance }
 * @returns {{
 *   overallPass: boolean,
 *   criteria: Array,
 *   passCount: number,
 *   failCount: number,
 *   failedItems: Array
 * }}
 */
export function performBasicCheck(checkData) {
  if (!checkData) {
    return {
      overallPass: false,
      criteria: [],
      passCount: 0,
      failCount: BASIC_CHECK_ITEMS.length,
      failedItems: BASIC_CHECK_ITEMS.map(item => item.label),
      error: '未提供判定数据'
    }
  }

  const criteria = BASIC_CHECK_ITEMS.map(item => {
    const data = checkData[item.key]
    const pass = data?.pass === true
    return {
      key: item.key,
      label: item.label,
      pass,
      evidence: data?.evidence || '未提供佐证材料'
    }
  })

  const failedItems = criteria.filter(c => !c.pass)
  const passCount = criteria.filter(c => c.pass).length
  const failCount = failedItems.length

  return {
    overallPass: failCount === 0,
    criteria,
    passCount,
    failCount,
    failedItems: failedItems.map(f => f.label)
  }
}

/**
 * 检查是否可直接认定一级（使用水性聚氨酯等无DMF原料的企业）
 * @param {boolean} usesWaterBasedPU - 是否100%使用水性/无溶剂聚氨酯
 * @returns {boolean}
 */
export function checkDirectLevel1(usesWaterBasedPU) {
  return usesWaterBasedPU === true
}

/**
 * 获取基本要求判定项列表
 * @returns {Array}
 */
export function getBasicCheckItems() {
  return BASIC_CHECK_ITEMS
}
