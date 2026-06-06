/**
 * 合成革企业环境绩效分级评价系统 V1.0
 * 数据格式化工具函数
 */

/**
 * 格式化为百分比字符串
 * @param {number} value - 0~1 之间的小数
 * @param {number} decimals - 小数位数
 * @returns {string}
 */
export function formatPercent(value, decimals = 2) {
  return (value * 100).toFixed(decimals) + '%'
}

/**
 * 格式化数值，保留指定位数小数
 * @param {number} value - 输入数值
 * @param {number} decimals - 小数位数
 * @returns {string}
 */
export function formatNumber(value, decimals = 2) {
  if (value === null || value === undefined || isNaN(value)) return '-'
  return Number(value).toFixed(decimals)
}

/**
 * 格式化为带单位的字符串
 * @param {number} value - 数值
 * @param {string} unit - 单位
 * @param {number} decimals - 小数位数
 * @returns {string}
 */
export function formatWithUnit(value, unit, decimals = 2) {
  return `${formatNumber(value, decimals)} ${unit}`
}

/**
 * 格式化 DMF 浓度值
 * @param {number} value - 浓度值（mg/m³）
 * @returns {string}
 */
export function formatDMF(value) {
  if (value < 0.01) return '< 0.01 mg/m³'
  return `${value.toFixed(2)} mg/m³`
}

/**
 * 格式化 VOC 浓度值
 * @param {number} value - 浓度值
 * @returns {string}
 */
export function formatVOC(value) {
  if (value < 0.01) return '< 0.01 mg/m³'
  return `${value.toFixed(2)} mg/m³`
}

/**
 * 格式化权重值
 * @param {number} weight - 权重值（0~1）
 * @returns {string}
 */
export function formatWeight(weight) {
  return (weight * 100).toFixed(2) + '%'
}

/**
 * 格式化 CR 值（一致性比率）
 * @param {number} cr - CR值
 * @returns {string}
 */
export function formatCR(cr) {
  return cr.toFixed(4)
}

/**
 * 格式化一致性检验结果
 * @param {number} cr - CR值
 * @returns {{ text: string, pass: boolean }}
 */
export function formatConsistencyResult(cr) {
  return {
    text: `CR = ${cr.toFixed(4)} ${cr < 0.1 ? '✓ 通过' : '✗ 不通过'}`,
    pass: cr < 0.1
  }
}

/**
 * 格式化日期（YYYY-MM-DD）
 * @param {Date|string} date - 日期
 * @returns {string}
 */
export function formatDate(date) {
  const d = typeof date === 'string' ? new Date(date) : date
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 格式化企业规模
 * @param {number} capacity - 年产能（万米/年）
 * @returns {string}
 */
export function formatCapacity(capacity) {
  if (capacity >= 1000) return `大型（${capacity}万米/年）`
  if (capacity >= 300) return `中型（${capacity}万米/年）`
  return `小型（${capacity}万米/年）`
}

/**
 * 格式化指标得分等级
 * @param {number} score - 得分
 * @returns {{ text: string, class: string }}
 */
export function formatScoreLevel(score) {
  if (score >= 8.5) return { text: '优秀', class: 'badge-success' }
  if (score >= 7) return { text: '良好', class: 'badge-info' }
  if (score >= 5) return { text: '一般', class: 'badge-warning' }
  return { text: '较差', class: 'badge-danger' }
}
