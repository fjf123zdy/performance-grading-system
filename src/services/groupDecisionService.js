/**
 * 合成革企业环境绩效分级评价系统 V1.0
 * 群决策融合服务
 *
 * 实现多专家打分结果的融合方法：
 *   1. 直接均值法 — 各专家权重取算术平均
 *   2. 群决策矩阵法 — 先对矩阵元素取几何平均，再做 AHP
 */

import { analyzeMatrix, getExpertMatrices } from './ahpService'
import { mockExperts, level1IndicatorKeys } from './mockData'
import { normalizeVector } from '@/utils/mathHelper'
import { optimizeMatrix } from './psoService'

// ============================================================
// 一、直接均值法
// ============================================================

/**
 * 直接均值法：对多位专家的权重向量取算术平均
 *
 * @param {string[]} expertIds - 专家ID数组
 * @param {string} matrixKey - 判断矩阵标识（'level1' 或二级指标key）
 * @returns {{ weights: number[], expertWeights: number[][], detail: string }}
 */
export function directMeanMethod(expertIds, matrixKey = 'level1') {
  const allWeights = []
  const detail = []

  for (const eid of expertIds) {
    const matrices = getExpertMatrices(eid)
    if (!matrices || !matrices[matrixKey]) continue

    const result = analyzeMatrix(matrices[matrixKey])
    allWeights.push(result.weights)
    detail.push({
      expertId: eid,
      expertName: mockExperts.find(e => e.id === eid)?.name || eid,
      weights: result.weights,
      CR: result.CR
    })
  }

  if (allWeights.length === 0) {
    return { weights: [], expertWeights: [], detail: '无有效数据' }
  }

  // 计算平均权重
  const n = allWeights[0].length
  const avgWeights = Array(n).fill(0)
  for (const w of allWeights) {
    for (let i = 0; i < n; i++) {
      avgWeights[i] += w[i]
    }
  }
  for (let i = 0; i < n; i++) {
    avgWeights[i] /= allWeights.length
  }

  return {
    weights: normalizeVector(avgWeights),
    expertWeights: allWeights,
    detail
  }
}

// ============================================================
// 二、群决策矩阵法（几何平均）
// ============================================================

/**
 * 群决策矩阵法：
 * 先对多位专家的判断矩阵各元素取几何平均，
 * 构造群决策矩阵，再执行 AHP 分析
 *
 * @param {string[]} expertIds - 专家ID数组
 * @param {string} matrixKey - 判断矩阵标识
 * @param {boolean} autoOptimize - 群决策矩阵不一致时是否自动 PSO 优化
 * @returns {{ weights: number[], groupMatrix: number[][], CR: number, pass: boolean, detail: string }}
 */
export function groupMatrixMethod(expertIds, matrixKey = 'level1', autoOptimize = true) {
  const matrices = []
  const detail = []

  for (const eid of expertIds) {
    const m = getExpertMatrices(eid)
    if (!m || !m[matrixKey]) continue
    matrices.push(m[matrixKey])
    detail.push({
      expertId: eid,
      expertName: mockExperts.find(e => e.id === eid)?.name || eid
    })
  }

  if (matrices.length === 0) {
    return { weights: [], groupMatrix: null, CR: 0, pass: false, detail: '无有效数据' }
  }

  // 对每个元素取几何平均
  const n = matrices[0].length
  const groupMatrix = Array.from({ length: n }, () => Array(n).fill(0))

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const values = matrices.map(m => m[i][j])
      const product = values.reduce((a, b) => a * b, 1)
      groupMatrix[i][j] = Math.pow(product, 1 / values.length)
    }
  }

  // 分析群决策矩阵
  let result = analyzeMatrix(groupMatrix)

  // 如果不一致，自动 PSO 优化
  if (!result.pass && autoOptimize) {
    const optimized = optimizeMatrix(groupMatrix)
    if (optimized.optimizedCR < result.CR) {
      return {
        weights: optimized.optimizedWeights,
        groupMatrix: optimized.optimizedMatrix,
        CR: optimized.optimizedCR,
        pass: optimized.optimizedCR < 0.1,
        originalCR: result.CR,
        optimized: true,
        detail
      }
    }
  }

  return {
    weights: result.weights,
    groupMatrix,
    CR: result.CR,
    pass: result.pass,
    optimized: false,
    detail
  }
}

// ============================================================
// 三、完整群决策流程（七步）
// ============================================================

/**
 * 执行完整的群决策流程：
 *   1. 对每位专家的7个判断矩阵进行分析
 *   2. 不一致的矩阵 → PSO 修正
 *   3. 两种方法融合权重
 *   4. 返回融合后的最终权重
 *
 * @param {string[]} expertIds - 专家ID数组
 * @param {string} fusionMethod - 'mean' | 'matrix' | 'both'
 * @returns {Object} 完整的群决策结果
 */
export function performGroupDecision(expertIds, fusionMethod = 'both') {
  const results = {
    method: fusionMethod,
    expertCount: expertIds.length,
    level1: {},
    subIndicators: {},
    totalWeights: {}
  }

  // 一级指标融合
  if (fusionMethod === 'mean' || fusionMethod === 'both') {
    results.level1.mean = directMeanMethod(expertIds, 'level1')
  }
  if (fusionMethod === 'matrix' || fusionMethod === 'both') {
    results.level1.matrix = groupMatrixMethod(expertIds, 'level1')
  }

  // 二级指标融合
  for (const key of level1IndicatorKeys) {
    results.subIndicators[key] = {}
    if (fusionMethod === 'mean' || fusionMethod === 'both') {
      results.subIndicators[key].mean = directMeanMethod(expertIds, key)
    }
    if (fusionMethod === 'matrix' || fusionMethod === 'both') {
      results.subIndicators[key].matrix = groupMatrixMethod(expertIds, key)
    }
  }

  return results
}

/**
 * 获取所有专家ID列表
 * @returns {string[]}
 */
export function getAllExpertIds() {
  return mockExperts.map(e => e.id)
}

/**
 * 默认选中的专家列表（排除故意不一致的EXP004作为单独演示用）
 * @returns {string[]}
 */
export function getDefaultExpertIds() {
  return ['EXP001', 'EXP002', 'EXP003', 'EXP005']
}
