/**
 * 合成革企业环境绩效分级评价系统 V1.0
 * 综合分级判定服务
 *
 * 整合基本要求判定、定量指标计算、定性指标评分的结果，
 * 给出企业最终的环保绩效等级。
 *
 * 分级规则（来自研究报告第四章）：
 *   一级（引领级）：基本要求通过 + 定量全部一级 + 定性≥85%
 *   二级（先进级）：基本要求通过 + 定量全部二级及以上 + 定性≥70%
 *   三级（基础级）：基本要求通过 + 定量全部三级及以上 + 定性≥60%
 *   不合格：任一条件不满足
 */

import { CONTROL_MEASURES } from '@/utils/constants'
import { performBasicCheck } from './basicCheckService'
import { performQuantitativeAnalysis } from './quantitativeService'
import { performQualitativeAnalysis } from './qualitativeService'

// ============================================================
// 一、综合分级判定
// ============================================================

/**
 * 执行完整的环境绩效分级评价
 *
 * @param {Object} enterprise - 企业完整数据
 * @param {Object} weights - 群决策得出的最终权重
 * @returns {Object} 完整的分级评价结果
 */
export function performGrading(enterprise, weights = null) {
  if (!enterprise) return null

  const result = {
    enterpriseId: enterprise.id,
    enterpriseName: enterprise.name,
    timestamp: new Date().toISOString(),
    basicCheck: null,
    quantitative: null,
    qualitative: null,
    finalGrade: null,
    gradeDetails: null
  }

  // 步骤1：基本要求判定
  result.basicCheck = performBasicCheck(enterprise.basicCheck)

  // 如果不通过，直接返回不合格
  if (!result.basicCheck.overallPass) {
    result.finalGrade = {
      level: 0,
      name: '不合格',
      label: '基本要求不通过，不具备参评资格',
      color: 'danger',
      badge: '❌'
    }
    result.gradeDetails = {
      reason: '基本要求判定不通过',
      failedItems: result.basicCheck.failedItems,
      canAppeal: true
    }
    return result
  }

  // 步骤2：定量指标计算
  result.quantitative = performQuantitativeAnalysis(
    enterprise.emission,
    enterprise.products
  )

  // 步骤3：定性指标评分
  if (enterprise.qualitativeScores) {
    result.qualitative = performQualitativeAnalysis(
      enterprise.qualitativeScores,
      weights
    )
  }

  // 步骤4：综合分级
  const quantLevel = result.quantitative.overallLevel
  const qualLevel = result.qualitative?.level?.level || 4

  // 定量和定性都需达标（取较差的）
  const overallLevel = Math.max(quantLevel, qualLevel)

  // 确定最终等级
  let finalGrade
  if (overallLevel <= 1) {
    finalGrade = {
      level: 1,
      name: '引领级',
      label: '一级（引领级）',
      color: 'level-1',
      badge: '🥇',
      description: '行业标杆企业，环保绩效水平引领行业发展'
    }
  } else if (overallLevel <= 2) {
    finalGrade = {
      level: 2,
      name: '先进级',
      label: '二级（先进级）',
      color: 'level-2',
      badge: '🥈',
      description: '行业先进企业，环保绩效水平较高'
    }
  } else if (overallLevel <= 3) {
    finalGrade = {
      level: 3,
      name: '基础级',
      label: '三级（基础级）',
      color: 'level-3',
      badge: '🥉',
      description: '基本合规企业，建议持续提标改造'
    }
  } else {
    finalGrade = {
      level: 4,
      name: '不达标',
      label: '不达标',
      color: 'danger',
      badge: '⚠️',
      description: '环保绩效水平不达标，需限期整改'
    }
  }

  result.finalGrade = finalGrade

  // 步骤5：汇总详细信息
  result.gradeDetails = {
    quantLevel,
    qualLevel,
    overallLevel,
    quantitativeBreakdown: {
      wastewater: result.quantitative.wastewaterPerUnit.level.level,
      vocs: result.quantitative.vocsPerUnit.level.level,
      dmf: result.quantitative.dmfConcentration.level.level,
      unorganizedVOC: result.quantitative.unorganizedVOC.level.level
    },
    qualitativeScore: result.qualitative?.percentage || 0
  }

  return result
}

// ============================================================
// 二、获取分级对应的管控措施
// ============================================================

/**
 * 获取指定等级的管控措施建议
 * @param {number} level - 等级（1/2/3）
 * @returns {Object} 管控措施详情
 */
export function getControlMeasures(level) {
  const key = `level${level}`
  return CONTROL_MEASURES[key] || null
}

/**
 * 获取所有等级定义
 * @returns {Array} 等级列表
 */
export function getAllGradeDefinitions() {
  return [
    {
      level: 1,
      name: '引领级',
      badge: '🥇',
      color: 'level-1',
      criteria: '基本要求通过 + 定量指标全部达到一级阈值 + 定性评分 ≥ 85%',
      benefits: '黄色及以上预警自主减排，可扩大产能，享受税收优惠与补贴'
    },
    {
      level: 2,
      name: '先进级',
      badge: '🥈',
      color: 'level-2',
      criteria: '基本要求通过 + 定量指标全部达到二级阈值 + 定性评分 ≥ 70%',
      benefits: '黄/橙预警停产50%，红色预警全面停产，保持现有产能'
    },
    {
      level: 3,
      name: '基础级',
      badge: '🥉',
      color: 'level-3',
      criteria: '基本要求通过 + 定量指标全部达到三级阈值 + 定性评分 ≥ 60%',
      benefits: '管控措施同先进级，连续两年三级须整改，逾期缩减产能'
    }
  ]
}
