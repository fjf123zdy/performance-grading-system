/**
 * 合成革企业环境绩效分级评价系统 V1.0
 * AHP 层次分析法服务
 *
 * 实现 AHP（Analytic Hierarchy Process）的完整计算流程：
 *   1. 构造判断矩阵
 *   2. 和积法 / 幂迭代法 计算权重向量
 *   3. 最大特征值计算
 *   4. 一致性检验（CR < 0.1）
 *   5. 层次总排序
 *
 * 参考：Saaty, T.L. (1980) The Analytic Hierarchy Process.
 */

import {
  sumProductMethod,
  consistencyCheck,
  powerMethod,
  hierarchyTotalSort as totalSort
} from '@/utils/mathHelper'
import {
  RI_TABLE,
  SAATY_SCALE,
  QUALITATIVE_INDICATORS
} from '@/utils/constants'
import { mockExperts, indicatorChildrenMap, level1IndicatorKeys } from './mockData'

// ============================================================
// 一、获取所有专家数据
// ============================================================

/**
 * 获取所有专家的基本信息
 * @returns {Array} 专家信息列表
 */
export function getExperts() {
  return mockExperts.map(e => ({
    id: e.id,
    name: e.name,
    title: e.title,
    affiliation: e.affiliation,
    specialty: e.specialty,
    yearsOfExperience: e.yearsOfExperience
  }))
}

/**
 * 获取指定专家的判断矩阵
 * @param {string} expertId - 专家ID
 * @returns {Object} 所有判断矩阵
 */
export function getExpertMatrices(expertId) {
  const expert = mockExperts.find(e => e.id === expertId)
  if (!expert) return null
  return expert.matrices
}

// ============================================================
// 二、单个判断矩阵的 AHP 分析
// ============================================================

/**
 * 对单个判断矩阵执行完整的 AHP 分析
 * @param {number[][]} matrix - 判断矩阵（正互反矩阵）
 * @returns {{
 *   weights: number[],
 *   lambdaMax: number,
 *   CI: number,
 *   CR: number,
 *   RI: number,
 *   pass: boolean,
 *   matrix: number[][],
 *   n: number
 * }}
 */
export function analyzeMatrix(matrix) {
  const n = matrix.length
  const result = consistencyCheck(matrix)

  // 同时用幂迭代法计算，互相验证
  let pwResult = null
  try {
    pwResult = powerMethod(matrix)
  } catch (e) {
    pwResult = null
  }

  return {
    weights: result.weights,
    lambdaMax: result.lambdaMax,
    CI: result.CI,
    CR: result.CR,
    RI: result.RI,
    pass: result.pass,
    matrix,
    n,
    powerMethod: pwResult
      ? { eigenvalue: pwResult.eigenvalue, eigenvector: pwResult.eigenvector }
      : null
  }
}

// ============================================================
// 三、专家全部判断矩阵的一键分析
// ============================================================

/**
 * 对指定专家的所有判断矩阵执行 AHP 分析
 * @param {string} expertId - 专家ID
 * @returns {Object} 各矩阵的分析结果 + 层次总排序
 */
export function analyzeExpertAll(expertId) {
  const matrices = getExpertMatrices(expertId)
  if (!matrices) return null

  const results = {}

  // 分析一级指标矩阵
  results.level1 = analyzeMatrix(matrices.level1)

  // 分析各二级指标矩阵
  const subResults = {}
  const subCRs = {}
  for (const key of level1IndicatorKeys) {
    if (matrices[key]) {
      const r = analyzeMatrix(matrices[key])
      subResults[key] = r
      subCRs[key] = r.CR
    }
  }
  results.subIndicators = subResults

  // 层次总排序
  if (results.level1.pass) {
    // 构建二级指标权重映射
    const level2WeightsMap = {}
    for (const key of level1IndicatorKeys) {
      if (subResults[key]) {
        level2WeightsMap[key] = subResults[key].weights
      }
    }

    const totalResult = totalSort(
      results.level1.weights,
      level2WeightsMap,
      indicatorChildrenMap
    )
    results.totalSort = totalResult
  }

  return results
}

// ============================================================
// 四、生成 Saaty 标度参考表
// ============================================================

/**
 * 获取 Saaty 1-9 标度说明
 * @returns {Array} 标度值及含义
 */
export function getSaatyScaleInfo() {
  return SAATY_SCALE
}

// ============================================================
// 五、创建空判断矩阵
// ============================================================

/**
 * 创建指定维度的空判断矩阵（对角线为1，其余为null待填充）
 * @param {number} n - 矩阵维度
 * @returns {number[][]} n×n 矩阵
 */
export function createEmptyMatrix(n) {
  const matrix = Array.from({ length: n }, () => Array(n).fill(null))
  for (let i = 0; i < n; i++) {
    matrix[i][i] = 1
  }
  return matrix
}

/**
 * 根据上三角元素填充判断矩阵的下三角（互反关系）
 * @param {number[][]} matrix - 部分填充的矩阵
 * @returns {number[][]} 完整的正互反矩阵
 */
export function fillReciprocal(matrix) {
  const n = matrix.length
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (matrix[i][j] !== null && matrix[i][j] !== undefined) {
        matrix[j][i] = matrix[i][j] !== 0 ? 1 / matrix[i][j] : 0
      }
      if (matrix[j][i] !== null && matrix[j][i] !== undefined && matrix[i][j] === null) {
        matrix[i][j] = matrix[j][i] !== 0 ? 1 / matrix[j][i] : 0
      }
    }
  }
  return matrix
}

// ============================================================
// 六、获取指标体系结构（供UI展示）
// ============================================================

/**
 * 获取定性指标体系结构
 * @returns {Array} 6个一级指标及其二级指标
 */
export function getIndicatorStructure() {
  return QUALITATIVE_INDICATORS
}

/**
 * 获取一级指标对应的二级指标个数
 * @returns {Object} { key: count }
 */
export function getSubIndicatorCounts() {
  const counts = {}
  for (const key of level1IndicatorKeys) {
    counts[key] = (indicatorChildrenMap[key] || []).length
  }
  return counts
}
