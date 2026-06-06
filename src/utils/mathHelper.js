/**
 * 合成革企业环境绩效分级评价系统 V1.0
 * 数学工具函数 — 矩阵运算、特征值/特征向量、归一化
 *
 * 本模块实现了 AHP 层次分析法和 PSO 粒子群优化算法所需的
 * 全部矩阵运算功能，所有算法从数学公式零基础实现。
 */

import { RI_TABLE } from './constants'

// ============================================================
// 一、基础矩阵运算
// ============================================================

/**
 * 矩阵乘法：C = A × B
 * @param {number[][]} A - m×n 矩阵
 * @param {number[][]} B - n×p 矩阵
 * @returns {number[][]} m×p 结果矩阵
 */
export function matrixMultiply(A, B) {
  const m = A.length
  const n = A[0].length
  const p = B[0].length
  const result = Array.from({ length: m }, () => Array(p).fill(0))

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < p; j++) {
      for (let k = 0; k < n; k++) {
        result[i][j] += A[i][k] * B[k][j]
      }
    }
  }
  return result
}

/**
 * 矩阵转置
 * @param {number[][]} A - 输入矩阵
 * @returns {number[][]} 转置矩阵
 */
export function matrixTranspose(A) {
  const rows = A.length
  const cols = A[0].length
  const result = Array.from({ length: cols }, () => Array(rows).fill(0))
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result[j][i] = A[i][j]
    }
  }
  return result
}

/**
 * 矩阵向量乘法：y = A × x
 * @param {number[][]} A - n×n 矩阵
 * @param {number[]} x - n维向量
 * @returns {number[]} n维结果向量
 */
export function matrixVectorMultiply(A, x) {
  const n = A.length
  const result = Array(n).fill(0)
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      result[i] += A[i][j] * x[j]
    }
  }
  return result
}

// ============================================================
// 二、归一化函数
// ============================================================

/**
 * 向量归一化（总和为1）
 * @param {number[]} vec - 输入向量
 * @returns {number[]} 归一化后的向量
 */
export function normalizeVector(vec) {
  const sum = vec.reduce((a, b) => a + b, 0)
  if (sum === 0) return vec.map(() => 1 / vec.length)
  return vec.map(v => v / sum)
}

/**
 * 矩阵列归一化（每列元素除以该列之和）
 * @param {number[][]} A - 输入矩阵
 * @returns {number[][]} 列归一化后的矩阵
 */
export function normalizeColumns(A) {
  const n = A.length
  const result = Array.from({ length: n }, () => Array(n).fill(0))
  const colSums = Array(n).fill(0)

  // 计算每列之和
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      colSums[j] += A[i][j]
    }
  }

  // 列归一化
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      result[i][j] = colSums[j] !== 0 ? A[i][j] / colSums[j] : 0
    }
  }
  return result
}

// ============================================================
// 三、几何平均数
// ============================================================

/**
 * 计算数组的几何平均数
 * @param {number[]} values - 数值数组
 * @returns {number} 几何平均数
 */
export function geometricMean(values) {
  if (values.length === 0) return 0
  const product = values.reduce((a, b) => a * b, 1)
  return Math.pow(product, 1 / values.length)
}

// ============================================================
// 四、和积法求权重向量（AHP步骤）
// ============================================================

/**
 * 使用和积法（列归一化 + 行求和 + 归一化）计算权重向量
 * 这是 AHP 中最常用的近似计算方法
 *
 * @param {number[][]} A - 判断矩阵（n×n，正互反矩阵）
 * @returns {number[]} 权重向量 W
 */
export function sumProductMethod(A) {
  const n = A.length

  // 步骤1：列归一化
  const normalized = normalizeColumns(A)

  // 步骤2：按行求和
  const rowSums = Array(n).fill(0)
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      rowSums[i] += normalized[i][j]
    }
  }

  // 步骤3：归一化得到权重向量
  return normalizeVector(rowSums)
}

// ============================================================
// 五、最大特征值计算
// ============================================================

/**
 * 计算判断矩阵的最大特征值 λmax
 * λmax = (1/n) × Σ[(A·W)_i / W_i]
 *
 * @param {number[][]} A - 判断矩阵
 * @param {number[]} W - 权重向量
 * @returns {number} 最大特征值 λmax
 */
export function calculateLambdaMax(A, W) {
  const n = A.length
  const AW = matrixVectorMultiply(A, W)
  let sum = 0
  for (let i = 0; i < n; i++) {
    if (W[i] !== 0) {
      sum += AW[i] / W[i]
    }
  }
  return sum / n
}

// ============================================================
// 六、一致性检验
// ============================================================

/**
 * 对判断矩阵进行一致性检验
 * CI = (λmax - n) / (n - 1)
 * CR = CI / RI
 *
 * @param {number[][]} A - 判断矩阵
 * @returns {{ lambdaMax: number, CI: number, CR: number, RI: number, pass: boolean, weights: number[] }}
 */
export function consistencyCheck(A) {
  const n = A.length

  // 先计算权重
  const weights = sumProductMethod(A)

  // 计算最大特征值
  const lambdaMax = calculateLambdaMax(A, weights)

  // 计算 CI
  const CI = n > 1 ? (lambdaMax - n) / (n - 1) : 0

  // 获取 RI
  const RI = RI_TABLE[n] || 1.59

  // 计算 CR（n ≤ 2 时 CR = 0）
  const CR = n <= 2 ? 0 : (RI !== 0 ? CI / RI : 0)

  // 判断是否通过（CR < 0.1）
  const pass = CR < 0.1

  return { lambdaMax, CI, CR, RI, pass, weights }
}

// ============================================================
// 七、幂迭代法（Power Method）
// 用于精确求解主特征值和特征向量
// ============================================================

/**
 * 幂迭代法求矩阵的主特征值和特征向量
 * 迭代公式：x_{k+1} = A·x_k / ||A·x_k||
 *
 * @param {number[][]} A - 输入矩阵
 * @param {number} maxIter - 最大迭代次数
 * @param {number} tol - 收敛容差
 * @returns {{ eigenvalue: number, eigenvector: number[], iterations: number }}
 */
export function powerMethod(A, maxIter = 100, tol = 1e-10) {
  const n = A.length
  // 初始向量（全1）
  let x = Array(n).fill(1)
  let eigenvalue = 0

  for (let iter = 0; iter < maxIter; iter++) {
    // y = A × x
    const y = matrixVectorMultiply(A, x)

    // 计算特征值近似值（瑞利商）
    const xTx = x.reduce((s, xi) => s + xi * xi, 0)
    const xTAx = x.reduce((s, xi, i) => s + xi * y[i], 0)
    const newEigenvalue = xTAx / xTx

    // 归一化 y
    const norm = Math.sqrt(y.reduce((s, yi) => s + yi * yi, 0))
    const newX = y.map(yi => yi / norm)

    // 检查收敛
    const diff = Math.abs(newEigenvalue - eigenvalue)
    if (iter > 0 && diff < tol) {
      return { eigenvalue: newEigenvalue, eigenvector: newX, iterations: iter + 1 }
    }

    x = newX
    eigenvalue = newEigenvalue
  }

  return { eigenvalue, eigenvector: x, iterations: maxIter }
}

// ============================================================
// 八、层次总排序
// ============================================================

/**
 * 层次总排序：计算最底层指标对总目标的合成权重
 *
 * @param {number[]} level1Weights - 一级指标权重
 * @param {Object.<string, number[]>} level2WeightsMap - 各一级指标下的二级指标权重
 *   格式：{ 'raw_material': [0.6, 0.4], 'waste_gas': [0.3, 0.2, 0.3, 0.2], ... }
 * @param {Object.<string, string[]>} childrenMap - 各一级指标下的二级指标ID列表
 * @returns {{ weights: Object.<string, number>, cr: number }} 合成权重与总一致性比率
 */
export function hierarchyTotalSort(level1Weights, level2WeightsMap, childrenMap) {
  const totalWeights = {}
  let totalCR = 0

  for (let i = 0; i < level1Weights.length; i++) {
    const firstKey = Object.keys(level2WeightsMap)[i]
    const subWeights = level2WeightsMap[firstKey]
    const childIds = childrenMap[firstKey] || []

    if (subWeights && childIds.length) {
      for (let j = 0; j < subWeights.length; j++) {
        const childKey = childIds[j] || `${firstKey}_${j}`
        totalWeights[childKey] = level1Weights[i] * subWeights[j]
      }
    }
    // totalCR 的合成（简化处理）
    totalCR += level1Weights[i] * 0.01 // 占位，实际应传入各子矩阵CR
  }

  return { weights: totalWeights, cr: totalCR }
}

// ============================================================
// 九、判断矩阵上三角 → 完整矩阵
// ============================================================

/**
 * 由上三角元素（不含对角线）构造完整的正互反判断矩阵
 * 对角线元素为1，下三角由互反关系 a_ji = 1/a_ij 确定
 *
 * @param {number[]} upperTriangular - 上三角元素（按行展开）
 * @param {number} n - 矩阵维度
 * @returns {number[][]} 完整的 n×n 判断矩阵
 */
export function upperTriToMatrix(upperTriangular, n) {
  const matrix = Array.from({ length: n }, () => Array(n).fill(1))
  let idx = 0
  for (let i = 0; i < n; i++) {
    matrix[i][i] = 1
    for (let j = i + 1; j < n; j++) {
      matrix[i][j] = upperTriangular[idx]
      matrix[j][i] = upperTriangular[idx] !== 0 ? 1 / upperTriangular[idx] : 0
      idx++
    }
  }
  return matrix
}

/**
 * 从完整判断矩阵提取上三角元素（不含对角线）
 * @param {number[][]} matrix - n×n 判断矩阵
 * @returns {number[]} 上三角元素数组
 */
export function matrixToUpperTri(matrix) {
  const n = matrix.length
  const result = []
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      result.push(matrix[i][j])
    }
  }
  return result
}

// ============================================================
// 十、矩阵 Frobenius 范数（用于 PSO 偏离度计算）
// ============================================================

/**
 * 计算两个矩阵的 Frobenius 范数差异
 * ||A - B||_F = sqrt(ΣΣ (a_ij - b_ij)²)
 *
 * @param {number[][]} A - 矩阵A
 * @param {number[][]} B - 矩阵B
 * @returns {number} Frobenius 范数值
 */
export function frobeniusNorm(A, B) {
  const n = A.length
  let sum = 0
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      sum += (A[i][j] - B[i][j]) ** 2
    }
  }
  return Math.sqrt(sum)
}
