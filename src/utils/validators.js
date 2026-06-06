/**
 * 合成革企业环境绩效分级评价系统 V1.0
 * 表单校验规则
 */

/**
 * 校验必填字段
 * @param {*} value - 待校验值
 * @param {string} fieldName - 字段名称
 * @returns {{ valid: boolean, message: string }}
 */
export function required(value, fieldName = '此项') {
  if (value === null || value === undefined || value === '') {
    return { valid: false, message: `${fieldName}不能为空` }
  }
  return { valid: true, message: '' }
}

/**
 * 校验数值范围
 * @param {number} value - 待校验数值
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @param {string} fieldName - 字段名称
 * @returns {{ valid: boolean, message: string }}
 */
export function numberRange(value, min, max, fieldName = '数值') {
  if (typeof value !== 'number' || isNaN(value)) {
    return { valid: false, message: `${fieldName}必须是有效数值` }
  }
  if (value < min || value > max) {
    return { valid: false, message: `${fieldName}必须在 ${min} 到 ${max} 之间` }
  }
  return { valid: true, message: '' }
}

/**
 * 校验正数
 * @param {number} value - 待校验数值
 * @param {string} fieldName - 字段名称
 * @returns {{ valid: boolean, message: string }}
 */
export function positiveNumber(value, fieldName = '数值') {
  if (typeof value !== 'number' || isNaN(value) || value <= 0) {
    return { valid: false, message: `${fieldName}必须为正数` }
  }
  return { valid: true, message: '' }
}

/**
 * 校验非负数
 * @param {number} value - 待校验数值
 * @param {string} fieldName - 字段名称
 * @returns {{ valid: boolean, message: string }}
 */
export function nonNegativeNumber(value, fieldName = '数值') {
  if (typeof value !== 'number' || isNaN(value) || value < 0) {
    return { valid: false, message: `${fieldName}不能为负数` }
  }
  return { valid: true, message: '' }
}

/**
 * 校验判断矩阵的互反性
 * @param {number[][]} matrix - 判断矩阵
 * @returns {{ valid: boolean, message: string }}
 */
export function validateReciprocalMatrix(matrix) {
  const n = matrix.length
  for (let i = 0; i < n; i++) {
    if (matrix[i][i] !== 1) {
      return { valid: false, message: `对角线元素必须为1（第${i + 1}行第${i + 1}列）` }
    }
    for (let j = i + 1; j < n; j++) {
      const expected = matrix[i][j] !== 0 ? 1 / matrix[i][j] : 0
      if (Math.abs(matrix[j][i] - expected) > 0.001) {
        return {
          valid: false,
          message: `互反性不满足：a[${j + 1}][${i + 1}] 应为 ${expected.toFixed(3)}，当前为 ${matrix[j][i]}`
        }
      }
    }
  }
  return { valid: true, message: '' }
}

/**
 * 校验判断矩阵元素是否在 Saaty 标度范围内
 * @param {number[][]} matrix - 判断矩阵
 * @returns {{ valid: boolean, message: string }}
 */
export function validateSaatyScale(matrix) {
  const validValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1 / 2, 1 / 3, 1 / 4, 1 / 5, 1 / 6, 1 / 7, 1 / 8, 1 / 9]
  const n = matrix.length
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const val = matrix[i][j]
      const isClose = validValues.some(v => Math.abs(v - val) < 0.001)
      if (!isClose) {
        return {
          valid: false,
          message: `元素 a[${i + 1}][${j + 1}] = ${val} 不在 Saaty 1-9 标度范围内`
        }
      }
    }
  }
  return { valid: true, message: '' }
}

/**
 * 校验评分值是否在0-10范围内
 * @param {number} score - 评分值
 * @returns {{ valid: boolean, message: string }}
 */
export function validateScore(score) {
  if (!Number.isInteger(score)) {
    return { valid: false, message: '评分必须为整数' }
  }
  if (score < 0 || score > 10) {
    return { valid: false, message: '评分必须在 0 到 10 之间' }
  }
  return { valid: true, message: '' }
}
