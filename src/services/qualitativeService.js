/**
 * 合成革企业环境绩效分级评价系统 V1.0
 * 定性指标评分服务
 *
 * 对6个一级指标、15个二级指标进行打分（每项0-10分），
 * 结合 AHP 权重计算加权总分。
 */

import { QUALITATIVE_INDICATORS } from '@/utils/constants'
import { indicatorChildrenMap } from './mockData'

// ============================================================
// 一、获取指标体系
// ============================================================

/**
 * 获取完整的定性指标体系结构
 * @returns {Array} 指标体系（6个一级指标及其二级指标）
 */
export function getIndicatorSystem() {
  return QUALITATIVE_INDICATORS
}

/**
 * 获取所有二级指标的扁平列表
 * @returns {Array} 所有二级指标 [{ id, name, maxScore, parentId, parentName }]
 */
export function getAllSubIndicators() {
  const result = []
  for (const first of QUALITATIVE_INDICATORS) {
    for (const child of first.children) {
      result.push({
        ...child,
        parentId: first.id,
        parentName: first.name
      })
    }
  }
  return result
}

// ============================================================
// 二、评分计算
// ============================================================

/**
 * 计算各一级指标的得分
 * 一级指标得分 = Σ(二级指标得分 × 二级指标权重)
 *
 * @param {Object} scores - 各二级指标得分 { indicator_id: score(0-10) }
 * @param {Object} weights - 层次总排序得到的各二级指标最终权重
 * @returns {Object} 评分结果
 */
export function calculateIndicatorScores(scores, weights) {
  const result = {
    firstLevel: [],
    totalScore: 0,
    subDetails: {}
  }

  for (const first of QUALITATIVE_INDICATORS) {
    const childIds = indicatorChildrenMap[first.id] || []
    let firstScore = 0
    let firstWeightSum = 0

    const subDetails = childIds.map(childId => {
      const score = scores[childId] || 0
      const weight = weights?.[childId] || (1 / childIds.length)  // 如果没有权重，按均权
      const weighted = score * weight

      firstScore += weighted
      firstWeightSum += weight

      return {
        id: childId,
        name: first.children.find(c => c.id === childId)?.name || childId,
        score,
        weight,
        weighted
      }
    })

    // 归一化（确保权重和为1）
    const normalizedScore = firstWeightSum > 0 ? firstScore / firstWeightSum : firstScore

    result.firstLevel.push({
      id: first.id,
      name: first.name,
      score: normalizedScore,
      maxScore: 10,
      percentage: (normalizedScore / 10) * 100,
      subDetails
    })
  }

  // 计算总分（各一级指标得分加权求和）
  // 一级指标权重使用各一级指标的权重，如果没有则均权
  result.totalScore = result.firstLevel.reduce((sum, item) => sum + item.score, 0)
    / Math.max(result.firstLevel.length, 1)

  return result
}

/**
 * 计算简单总分（未加权，仅供预评估，在权重确定前使用）
 * @param {Object} scores - 各二级指标得分
 * @returns {Object} 简单评分汇总
 */
export function calculateSimpleScores(scores) {
  const allSubs = getAllSubIndicators()
  const totalItems = allSubs.length
  const totalMax = totalItems * 10

  let actualTotal = 0
  const details = []

  for (const sub of allSubs) {
    const score = scores[sub.id] || 0
    actualTotal += score
    details.push({ ...sub, score })
  }

  return {
    totalScore: actualTotal,
    maxScore: totalMax,
    percentage: (actualTotal / totalMax) * 100,
    averageScore: actualTotal / totalItems,
    details
  }
}

// ============================================================
// 三、分级判定
// ============================================================

/**
 * 根据定性评分总分判定等级
 * @param {number} totalScore - 加权总分（0-10分制）或百分比
 * @param {boolean} isPercentage - totalScore是否为百分比
 * @returns {{ level: number, label: string, color: string }}
 */
export function judgeQualitativeLevel(totalScore, isPercentage = false) {
  const score = isPercentage ? totalScore : totalScore * 10  // 统一转为百分制

  if (score >= 85) {
    return { level: 1, label: '一级（引领级）', color: 'level-1' }
  }
  if (score >= 70) {
    return { level: 2, label: '二级（先进级）', color: 'level-2' }
  }
  if (score >= 60) {
    return { level: 3, label: '三级（基础级）', color: 'level-3' }
  }
  return { level: 4, label: '不达标', color: 'danger' }
}

/**
 * 计算加权定性评分（使用群决策得出的权重）
 * @param {Object} scores - 各二级指标得分
 * @param {Object} weights - 层次总排序得到的各二级指标最终权重
 * @returns {Object} 综合评分结果
 */
export function performQualitativeAnalysis(scores, weights) {
  // 计算加权得分
  const indicatorResult = calculateIndicatorScores(scores, weights)

  // 简单均分（备用）
  const simpleResult = calculateSimpleScores(scores)

  // 判定等级
  // 这里的 totalScore 是一级指标得分的平均值（0-10分制），需转为百分制
  const percentage = indicatorResult.totalScore * 10
  const level = judgeQualitativeLevel(percentage, true)

  return {
    indicatorResult,
    simpleResult,
    totalScore: indicatorResult.totalScore,
    percentage,
    level
  }
}
