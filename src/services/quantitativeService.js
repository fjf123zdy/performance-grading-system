/**
 * 合成革企业环境绩效分级评价系统 V1.0
 * 定量指标计算服务
 *
 * 核心计算公式（来自研究报告第三章）：
 *   1. 标准品产量 Qbz = Σ(实际产量_i × 折算系数_i)
 *   2. 单位产品废水产生量 Vci = Vc / Qbz
 *   3. 单位产品 VOCs 产生量 = Gvoc / Qbz
 *   4. DMF 有组织排放浓度
 *   5. 非封闭区域 VOC 检测值
 */

import { STANDARD_CONVERSION, QUANTITATIVE_THRESHOLDS } from '@/utils/constants'

// ============================================================
// 一、标准品折算系数查询
// ============================================================

/**
 * 根据产品厚度查询折算系数
 * @param {number} thickness - 厚度（mm）
 * @returns {number} 折算系数
 */
export function getThicknessCoefficient(thickness) {
  for (const range of STANDARD_CONVERSION.thickness) {
    if (thickness >= range.min && thickness <= range.max) {
      return range.coefficient
    }
  }
  return 1.0
}

/**
 * 根据产品幅宽查询折算系数
 * @param {number} width - 幅宽（cm）
 * @returns {number} 折算系数
 */
export function getWidthCoefficient(width) {
  for (const range of STANDARD_CONVERSION.width) {
    if (width >= range.min && width <= range.max) {
      return range.coefficient
    }
  }
  return 1.0
}

/**
 * 计算单个产品的综合折算系数
 * 综合系数 = 厚度系数 × 幅宽系数
 *
 * @param {number} thickness - 厚度（mm）
 * @param {number} width - 幅宽（cm）
 * @returns {number} 综合折算系数
 */
export function getProductCoefficient(thickness, width) {
  return getThicknessCoefficient(thickness) * getWidthCoefficient(width)
}

// ============================================================
// 二、标准品产量计算
// ============================================================

/**
 * 计算标准品总产量 Qbz（按研究报告公式1）
 * Qbz = Σ(实际产量_i × 折算系数_i)
 *
 * @param {Array} products - 产品列表 [{ thickness, width, actualOutput }]
 * @returns {number} 标准品总产量（万m）
 */
export function calculateStandardOutput(products) {
  if (!products || products.length === 0) return 0

  let total = 0
  for (const p of products) {
    const coef = getProductCoefficient(p.thickness, p.width)
    total += p.actualOutput * coef
  }
  return total
}

// ============================================================
// 三、单位产品废水产生量计算
// ============================================================

/**
 * 计算单位产品废水产生量 Vci（按研究报告公式3）
 * Vci = Vc / Qbz
 *
 * @param {number} wastewaterVolume - 年废水产生量（吨）
 * @param {number} standardOutput - 标准品产量（万m）
 * @returns {{ value: number, unit: string }} 单位产品废水产生量（t/万m）
 */
export function calculateWastewaterPerUnit(wastewaterVolume, standardOutput) {
  if (!standardOutput || standardOutput === 0) {
    return { value: 0, unit: 't/万m', error: '标准品产量不能为0' }
  }
  return {
    value: wastewaterVolume / standardOutput,
    unit: 't/万m'
  }
}

// ============================================================
// 四、单位产品 VOCs 产生量计算
// ============================================================

/**
 * 计算单位产品 VOCs 产生量（按研究报告公式4）
 * VOCs_unit = Gvoc / Qbz
 *
 * @param {number} vocsGeneration - 年VOCs产生量（kg）
 * @param {number} standardOutput - 标准品产量（万m）
 * @returns {{ value: number, unit: string }} 单位产品VOCs产生量（kg/万m）
 */
export function calculateVOCsPerUnit(vocsGeneration, standardOutput) {
  if (!standardOutput || standardOutput === 0) {
    return { value: 0, unit: 'kg/万m', error: '标准品产量不能为0' }
  }
  return {
    value: vocsGeneration / standardOutput,
    unit: 'kg/万m'
  }
}

// ============================================================
// 五、定量指标分级判定
// ============================================================

/**
 * 判定单个定量指标的等级
 * @param {number} value - 实际值
 * @param {Object} thresholds - 该指标的阈值定义
 * @returns {{ level: number, label: string, color: string }}
 */
export function judgeIndicatorLevel(value, thresholds) {
  // 值越低越好
  if (value <= thresholds.level1.max) {
    return { level: 1, label: '一级（引领级）', color: 'var(--color-level-1)' }
  }
  if (value <= thresholds.level2.max) {
    return { level: 2, label: '二级（先进级）', color: 'var(--color-level-2)' }
  }
  if (value <= thresholds.level3.max) {
    return { level: 3, label: '三级（基础级）', color: 'var(--color-level-3)' }
  }
  return { level: 4, label: '不达标', color: 'var(--color-danger)' }
}

/**
 * 执行全部定量指标的计算与分级判定
 *
 * @param {Object} emission - 排放数据
 * @param {Array} products - 产品列表
 * @returns {Object} 完整的定量分析结果
 */
export function performQuantitativeAnalysis(emission, products) {
  // 步骤1：计算标准品产量
  const standardOutput = calculateStandardOutput(products)

  // 步骤2：计算各单位指标
  const wastewaterPerUnit = calculateWastewaterPerUnit(
    emission?.wastewaterVolume || 0,
    standardOutput
  )
  const vocsPerUnit = calculateVOCsPerUnit(
    emission?.vocsGeneration || 0,
    standardOutput
  )
  const dmfConcentration = {
    value: emission?.dmfConcentration || 0,
    unit: 'mg/m³'
  }
  const unorganizedVOC = {
    value: emission?.unorganizedVOC || 0,
    unit: 'mg/m³'
  }

  // 步骤3：分级判定
  const results = {
    standardOutput: {
      value: standardOutput,
      unit: '万m',
      detail: products.map(p => ({
        name: p.name,
        productOutput: p.actualOutput,
        coefficient: getProductCoefficient(p.thickness, p.width),
        standardOutput: p.actualOutput * getProductCoefficient(p.thickness, p.width)
      }))
    },
    wastewaterPerUnit: {
      ...wastewaterPerUnit,
      level: judgeIndicatorLevel(wastewaterPerUnit.value, QUANTITATIVE_THRESHOLDS.wastewaterPerUnit),
      threshold: QUANTITATIVE_THRESHOLDS.wastewaterPerUnit
    },
    vocsPerUnit: {
      ...vocsPerUnit,
      level: judgeIndicatorLevel(vocsPerUnit.value, QUANTITATIVE_THRESHOLDS.vocsPerUnit),
      threshold: QUANTITATIVE_THRESHOLDS.vocsPerUnit
    },
    dmfConcentration: {
      ...dmfConcentration,
      level: judgeIndicatorLevel(dmfConcentration.value, QUANTITATIVE_THRESHOLDS.dmfEmission),
      threshold: QUANTITATIVE_THRESHOLDS.dmfEmission
    },
    unorganizedVOC: {
      ...unorganizedVOC,
      level: judgeIndicatorLevel(unorganizedVOC.value, QUANTITATIVE_THRESHOLDS.unorganizedVOC),
      threshold: QUANTITATIVE_THRESHOLDS.unorganizedVOC
    }
  }

  // 综合定量等级（取最差）
  const levels = Object.values(results)
    .filter(r => r.level)
    .map(r => r.level.level)
  const worstLevel = levels.length > 0 ? Math.max(...levels) : 4

  results.overallLevel = worstLevel
  results.overallLabel =
    worstLevel === 1 ? '一级（引领级）' :
    worstLevel === 2 ? '二级（先进级）' :
    worstLevel === 3 ? '三级（基础级）' : '不达标'

  return results
}

/**
 * 获取定量指标阈值定义
 * @returns {Object}
 */
export function getQuantitativeThresholds() {
  return QUANTITATIVE_THRESHOLDS
}
