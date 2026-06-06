/**
 * 合成革企业环境绩效分级评价系统 V1.0
 * PSO 粒子群优化算法服务
 *
 * 当专家打分矩阵不满足一致性要求（CR ≥ 0.1）时，
 * 使用粒子群优化算法在最小修改的前提下修正判断矩阵。
 *
 * 参考：
 *   Kennedy, J. & Eberhart, R. (1995) Particle Swarm Optimization.
 *   Shi, Y. & Eberhart, R. (1998) A Modified Particle Swarm Optimizer.
 *
 * 核心设计：
 *   1. 粒子位置 = 判断矩阵上三角元素（n×(n-1)/2 维）
 *   2. 适应度函数 = α×|CR| + β×||A' - A_original||_F
 *   3. 惯性权重线性递减（0.9 → 0.4）
 */

import { PSO_DEFAULTS } from '@/utils/constants'
import { upperTriToMatrix, matrixToUpperTri, frobeniusNorm } from '@/utils/mathHelper'
import { analyzeMatrix, getExpertMatrices } from './ahpService'

// ============================================================
// 一、PSO 核心算法
// ============================================================

/**
 * 对不一致的判断矩阵执行 PSO 优化修正
 *
 * @param {number[][]} originalMatrix - 原始判断矩阵
 * @param {Object} options - 可选参数（覆盖 PSO_DEFAULTS）
 * @param {Function} onProgress - 进度回调 (iteration, gBestFitness, convergenceData)
 * @returns {{
 *   optimizedMatrix: number[][],
 *   optimizedWeights: number[],
 *   originalCR: number,
 *   optimizedCR: number,
 *   fitnessHistory: number[],
 *   gBestFitness: number,
 *   iterations: number,
 *   convergenceData: Array
 * }}
 */
export function optimizeMatrix(originalMatrix, options = {}, onProgress = null) {
  const n = originalMatrix.length
  const dims = n * (n - 1) / 2  // 上三角元素个数

  // 合并参数
  const params = { ...PSO_DEFAULTS, ...options }

  // 提取原始上三角元素
  const originalUpper = matrixToUpperTri(originalMatrix)

  // 计算原始 CR
  const originalResult = analyzeMatrix(originalMatrix)
  const originalCR = originalResult.CR

  // 如果原始矩阵已经满足一致性，直接返回
  if (originalCR < params.targetCR) {
    return {
      optimizedMatrix: originalMatrix,
      optimizedWeights: originalResult.weights,
      originalCR,
      optimizedCR: originalCR,
      fitnessHistory: [0],
      gBestFitness: 0,
      iterations: 0,
      convergenceData: []
    }
  }

  // ---- 初始化粒子群 ----
  const particles = []
  for (let i = 0; i < params.populationSize; i++) {
    const position = []
    const velocity = []
    for (let d = 0; d < dims; d++) {
      // 在原始值附近 ±50% 范围内随机初始化
      const baseVal = originalUpper[d]
      const range = Math.min(baseVal * 0.5, 2)
      const low = Math.max(params.positionMin, baseVal - range)
      const high = Math.min(params.positionMax, baseVal + range)
      position.push(low + Math.random() * (high - low))
      velocity.push((Math.random() - 0.5) * params.velocityMax)
    }
    particles.push({ position, velocity, pBestPosition: [...position], pBestFitness: Infinity })
  }

  // 全局最优
  let gBestPosition = [...particles[0].position]
  let gBestFitness = Infinity

  // ---- 初始化适应度 ----
  for (const p of particles) {
    const fit = fitness(p.position, originalUpper, n, originalMatrix, params)
    p.pBestFitness = fit
    if (fit < gBestFitness) {
      gBestFitness = fit
      gBestPosition = [...p.position]
    }
  }

  // ---- 迭代优化 ----
  const fitnessHistory = [gBestFitness]
  const convergenceData = [{ iteration: 0, gBestFitness, avgFitness: avgFitnessValue(particles) }]

  for (let iter = 1; iter <= params.maxIterations; iter++) {
    // 计算当前惯性权重（线性递减）
    const w = params.inertiaWeightStart -
      (params.inertiaWeightStart - params.inertiaWeightEnd) * (iter / params.maxIterations)

    // 更新每个粒子
    for (const p of particles) {
      for (let d = 0; d < dims; d++) {
        const r1 = Math.random()
        const r2 = Math.random()

        // 速度更新
        p.velocity[d] = w * p.velocity[d]
          + params.cognitiveFactor * r1 * (p.pBestPosition[d] - p.position[d])
          + params.socialFactor * r2 * (gBestPosition[d] - p.position[d])

        // 速度限制
        if (p.velocity[d] > params.velocityMax) p.velocity[d] = params.velocityMax
        if (p.velocity[d] < -params.velocityMax) p.velocity[d] = -params.velocityMax

        // 位置更新
        p.position[d] += p.velocity[d]

        // 位置边界处理
        if (p.position[d] > params.positionMax) {
          p.position[d] = params.positionMax
          p.velocity[d] *= -1
        }
        if (p.position[d] < params.positionMin) {
          p.position[d] = params.positionMin
          p.velocity[d] *= -1
        }
      }

      // 计算新适应度
      const fit = fitness(p.position, originalUpper, n, originalMatrix, params)
      if (fit < p.pBestFitness) {
        p.pBestFitness = fit
        p.pBestPosition = [...p.position]
      }
      if (fit < gBestFitness) {
        gBestFitness = fit
        gBestPosition = [...p.position]
      }
    }

    // 记录数据
    fitnessHistory.push(gBestFitness)
    convergenceData.push({
      iteration: iter,
      gBestFitness,
      avgFitness: avgFitnessValue(particles)
    })

    // 进度回调
    if (onProgress) {
      onProgress(iter, gBestFitness, convergenceData)
    }

    // 早停：如果已经达到目标 CR
    const currentMatrix = upperTriToMatrix(gBestPosition, n)
    const crResult = analyzeMatrix(currentMatrix)
    if (crResult.CR < params.targetCR && gBestFitness < 0.01) {
      break
    }
  }

  // ---- 构建优化后的矩阵 ----
  const optimizedMatrix = upperTriToMatrix(gBestPosition, n)
  const optimizedResult = analyzeMatrix(optimizedMatrix)

  return {
    optimizedMatrix,
    optimizedWeights: optimizedResult.weights,
    originalCR,
    optimizedCR: optimizedResult.CR,
    fitnessHistory,
    gBestFitness,
    iterations: fitnessHistory.length - 1,
    convergenceData
  }
}

// ============================================================
// 二、适应度函数
// ============================================================

/**
 * 计算粒子的适应度值（越低越好）
 *
 * fitness = α × |CR| + β × normalized_deviation
 *
 * @param {number[]} position - 上三角元素数组
 * @param {number[]} originalUpper - 原始上三角元素
 * @param {number} n - 矩阵维度
 * @param {number[][]} originalMatrix - 原始矩阵（用于 Frobenius 范数计算）
 * @param {Object} params - PSO 参数
 * @returns {number} 适应度值
 */
function fitness(position, originalUpper, n, originalMatrix, params) {
  // 构造完整矩阵
  const matrix = upperTriToMatrix(position, n)

  // 计算 CR
  const result = analyzeMatrix(matrix)

  // 归一化的偏离度（Frobenius 范数 / n²）
  const deviation = frobeniusNorm(matrix, originalMatrix) / (n * n)

  return params.alphaCR * Math.abs(result.CR) + params.betaDeviation * deviation
}

// ============================================================
// 三、辅助函数
// ============================================================

/**
 * 计算粒子群的平均适应度
 * @param {Array} particles - 粒子数组
 * @returns {number}
 */
function avgFitnessValue(particles) {
  if (particles.length === 0) return 0
  const sum = particles.reduce((s, p) => s + p.pBestFitness, 0)
  return sum / particles.length
}

/**
 * 对未通过一致性检验的专家矩阵执行 PSO 优化
 *
 * @param {string} expertId - 专家ID
 * @param {Object} options - PSO 参数
 * @param {Function} onProgress - 进度回调
 * @returns {Object} 优化结果汇总
 */
export function optimizeExpertMatrices(expertId, options = {}, onProgress = null) {
  const matrices = getExpertMatrices(expertId)
  if (!matrices) return null

  const results = {}

  // 优化一级指标矩阵
  const level1Result = analyzeMatrix(matrices.level1)
  if (!level1Result.pass) {
    results.level1 = optimizeMatrix(matrices.level1, options, (iter, fitness) => {
      if (onProgress) onProgress('level1', iter, fitness)
    })
  } else {
    results.level1 = {
      optimizedMatrix: matrices.level1,
      originalCR: level1Result.CR,
      optimizedCR: level1Result.CR,
      needOptimize: false
    }
  }

  // 优化各二级指标矩阵
  results.subIndicators = {}
  const subKeys = ['raw_material', 'waste_gas', 'wastewater', 'rainwater', 'solid_waste', 'monitoring']
  for (const key of subKeys) {
    if (matrices[key]) {
      const subResult = analyzeMatrix(matrices[key])
      if (!subResult.pass) {
        results.subIndicators[key] = optimizeMatrix(matrices[key], options, (iter, fitness) => {
          if (onProgress) onProgress(key, iter, fitness)
        })
      } else {
        results.subIndicators[key] = {
          optimizedMatrix: matrices[key],
          originalCR: subResult.CR,
          optimizedCR: subResult.CR,
          needOptimize: false
        }
      }
    }
  }

  return results
}

/**
 * 获取默认 PSO 参数
 * @returns {Object}
 */
export function getDefaultPSOParams() {
  return { ...PSO_DEFAULTS }
}
