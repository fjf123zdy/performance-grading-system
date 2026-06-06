/**
 * 合成革企业环境绩效分级评价系统 V1.0
 * 模拟数据生成器
 *
 * 包含：
 *   5家企业数据（覆盖引领级、先进级、基础级、边界案例、不合格企业）
 *   5位专家AHP判断矩阵打分数据
 *   产品折算系数数据
 */

// ============================================================
// 一、模拟企业数据（5家）
// ============================================================
export const mockEnterprises = [
  {
    id: 'ENT001',
    name: '丽水华峰合成革有限公司',
    province: '浙江省',
    city: '丽水市',
    address: '丽水经济技术开发区绿谷大道88号',
    mainProducts: '超细纤维合成革、水性聚氨酯合成革',
    annualCapacity: 800,
    employeeCount: 420,
    establishedYear: 2005,
    // 基本要求判定数据
    basicCheck: {
      env_accident: { pass: true, evidence: '丽水市生态环境局合规证明（2023-2025）' },
      safety_accident: { pass: true, evidence: '安全生产标准化二级企业证书' },
      quality_accident: { pass: true, evidence: 'ISO 9001:2015 质量管理体系认证' },
      credit_record: { pass: true, evidence: '信用中国查询截图（无失信记录）' },
      drain_compliance: { pass: true, evidence: '规范化排污口验收文件（丽环排验[2022]018号）' }
    },
    // 产品产量数据（用于标准品折算）
    products: [
      { name: '超细纤维合成革', thickness: 0.9, width: 145, actualOutput: 320, unit: '万m' },
      { name: '水性PU合成革', thickness: 1.2, width: 150, actualOutput: 280, unit: '万m' },
      { name: '普通PU合成革', thickness: 1.5, width: 138, actualOutput: 200, unit: '万m' }
    ],
    // 排放数据
    emission: {
      wastewaterVolume: 5800,          // 年废水产生量（吨）
      rainwaterCollection: 1200,      // 初期雨水收集量（吨）
      vocsGeneration: 15000,          // 年VOCs产生量（kg）
      dmfConcentration: 8.5,          // 有组织排放DMF浓度（mg/m³）
      unorganizedVOC: 1.6,            // 非封闭区域手持VOC检测（mg/m³）
      codEmission: 42.3,              // COD排放浓度（mg/L）
      ammoniaNitrogen: 3.8            // 氨氮排放浓度（mg/L）
    },
    // 定性指标评分（0-10分）
    qualitativeScores: {
      auto_dosing: 9,
      pipeline_transport: 9,
      enclosed_collection: 8,
      spray_tower: 9,
      distillation: 8,
      unorganized_control: 9,
      closed_pipeline: 9,
      inlet_isolation: 8,
      clear_pool_sunny: 9,
      level_display: 8,
      ultrafiltration: 9,
      hazardous_waste: 9,
      general_waste: 8,
      online_water: 9,
      online_gas: 9,
      boundary_monitor: 8
    }
  },

  {
    id: 'ENT002',
    name: '福建隆丰合成革有限公司',
    province: '福建省',
    city: '福州市',
    address: '福州市闽侯县青口工业区15号',
    mainProducts: 'PU合成革、PVC人造革',
    annualCapacity: 500,
    employeeCount: 280,
    establishedYear: 2010,
    basicCheck: {
      env_accident: { pass: true, evidence: '福州市生态环境局合规证明' },
      safety_accident: { pass: true, evidence: '安全生产标准化三级企业证书' },
      quality_accident: { pass: true, evidence: 'ISO 9001 认证' },
      credit_record: { pass: true, evidence: '无失信记录' },
      drain_compliance: { pass: true, evidence: '规范化排污口验收文件' }
    },
    products: [
      { name: 'PU合成革', thickness: 1.1, width: 148, actualOutput: 300, unit: '万m' },
      { name: 'PVC人造革', thickness: 0.7, width: 135, actualOutput: 200, unit: '万m' }
    ],
    emission: {
      wastewaterVolume: 9200,
      rainwaterCollection: 1800,
      vocsGeneration: 28000,
      dmfConcentration: 15.2,
      unorganizedVOC: 3.8,
      codEmission: 58.7,
      ammoniaNitrogen: 5.2
    },
    qualitativeScores: {
      auto_dosing: 7,
      pipeline_transport: 8,
      enclosed_collection: 7,
      spray_tower: 6,
      distillation: 7,
      unorganized_control: 6,
      closed_pipeline: 7,
      inlet_isolation: 7,
      clear_pool_sunny: 7,
      level_display: 6,
      ultrafiltration: 6,
      hazardous_waste: 8,
      general_waste: 7,
      online_water: 8,
      online_gas: 7,
      boundary_monitor: 6
    }
  },

  {
    id: 'ENT003',
    name: '广东新丰合成革有限公司',
    province: '广东省',
    city: '东莞市',
    address: '东莞市厚街镇家具大道68号',
    mainProducts: 'PVC人造革、半PU合成革',
    annualCapacity: 350,
    employeeCount: 180,
    establishedYear: 2013,
    basicCheck: {
      env_accident: { pass: true, evidence: '东莞市生态环境局合规证明' },
      safety_accident: { pass: true, evidence: '安全生产标准化证书' },
      quality_accident: { pass: true, evidence: '质量体系认证' },
      credit_record: { pass: true, evidence: '信用记录良好' },
      drain_compliance: { pass: true, evidence: '排污口规范化文件' }
    },
    products: [
      { name: 'PVC人造革', thickness: 0.8, width: 140, actualOutput: 220, unit: '万m' },
      { name: '半PU合成革', thickness: 1.0, width: 146, actualOutput: 130, unit: '万m' }
    ],
    emission: {
      wastewaterVolume: 12500,
      rainwaterCollection: 2500,
      vocsGeneration: 35000,
      dmfConcentration: 22.5,
      unorganizedVOC: 7.2,
      codEmission: 75.4,
      ammoniaNitrogen: 8.9
    },
    qualitativeScores: {
      auto_dosing: 6,
      pipeline_transport: 6,
      enclosed_collection: 5,
      spray_tower: 5,
      distillation: 5,
      unorganized_control: 4,
      closed_pipeline: 6,
      inlet_isolation: 5,
      clear_pool_sunny: 5,
      level_display: 4,
      ultrafiltration: 4,
      hazardous_waste: 6,
      general_waste: 5,
      online_water: 6,
      online_gas: 5,
      boundary_monitor: 4
    }
  },

  {
    id: 'ENT004',
    name: '安徽皖维合成革有限公司',
    province: '安徽省',
    city: '合肥市',
    address: '合肥市循环经济示范园纬三路12号',
    mainProducts: '超细纤维合成革、水性合成革',
    annualCapacity: 600,
    employeeCount: 320,
    establishedYear: 2008,
    // 边界案例：DMF浓度略高于引领级阈值，但其他指标很优秀
    basicCheck: {
      env_accident: { pass: true, evidence: '合肥市生态环境局合规证明' },
      safety_accident: { pass: true, evidence: '安全生产标准化二级证书' },
      quality_accident: { pass: true, evidence: 'ISO 9001/IATF 16949 双认证' },
      credit_record: { pass: true, evidence: '无失信记录' },
      drain_compliance: { pass: true, evidence: '规范化排污口验收文件' }
    },
    products: [
      { name: '超细纤维合成革', thickness: 1.0, width: 150, actualOutput: 350, unit: '万m' },
      { name: '水性合成革', thickness: 0.85, width: 142, actualOutput: 250, unit: '万m' }
    ],
    emission: {
      wastewaterVolume: 7200,
      rainwaterCollection: 1500,
      vocsGeneration: 22000,
      dmfConcentration: 11.8,        // 关键：刚好在引领级和先进级边界
      unorganizedVOC: 2.3,           // 关键：接近引领级上限
      codEmission: 48.2,
      ammoniaNitrogen: 4.5
    },
    qualitativeScores: {
      auto_dosing: 8,
      pipeline_transport: 9,
      enclosed_collection: 8,
      spray_tower: 8,
      distillation: 7,
      unorganized_control: 8,
      closed_pipeline: 8,
      inlet_isolation: 9,
      clear_pool_sunny: 8,
      level_display: 7,
      ultrafiltration: 7,
      hazardous_waste: 9,
      general_waste: 8,
      online_water: 8,
      online_gas: 8,
      boundary_monitor: 7
    }
  },

  {
    id: 'ENT005',
    name: '河北鑫达合成革有限公司',
    province: '河北省',
    city: '保定市',
    address: '保定市白沟新城工业园区路9号',
    mainProducts: 'PVC人造革、箱包革',
    annualCapacity: 200,
    employeeCount: 95,
    establishedYear: 2015,
    // 不合格案例：有环境事故记录且废水排口不合规
    basicCheck: {
      env_accident: {
        pass: false,
        evidence: '2023年曾因废水超标排放被处罚（冀保环罚[2023]056号）'
      },
      safety_accident: { pass: true, evidence: '安全生产标准化证书' },
      quality_accident: { pass: true, evidence: '产品合格检测报告' },
      credit_record: { pass: true, evidence: '信用记录正常' },
      drain_compliance: {
        pass: false,
        evidence: '废水排口未设置规范化标识及在线监测设备接口'
      }
    },
    products: [
      { name: 'PVC箱包革', thickness: 0.6, width: 130, actualOutput: 150, unit: '万m' },
      { name: 'PVC鞋用革', thickness: 0.5, width: 125, actualOutput: 50, unit: '万m' }
    ],
    emission: {
      wastewaterVolume: 6800,
      rainwaterCollection: 900,
      vocsGeneration: 18000,
      dmfConcentration: 28.6,
      unorganizedVOC: 8.5,
      codEmission: 95.3,
      ammoniaNitrogen: 12.7
    },
    qualitativeScores: {
      auto_dosing: 4,
      pipeline_transport: 5,
      enclosed_collection: 3,
      spray_tower: 4,
      distillation: 3,
      unorganized_control: 2,
      closed_pipeline: 4,
      inlet_isolation: 3,
      clear_pool_sunny: 3,
      level_display: 2,
      ultrafiltration: 2,
      hazardous_waste: 5,
      general_waste: 4,
      online_water: 4,
      online_gas: 3,
      boundary_monitor: 2
    }
  }
]

// ============================================================
// 二、模拟专家 AHP 判断矩阵数据（5位专家）
// ============================================================

/**
 * 构建 Saaty 标度判断矩阵的辅助函数
 * 输入上三角元素（按行展开），自动补全下三角互反值和对角线1
 */
function buildMatrix(upperTriValues, n) {
  const matrix = Array.from({ length: n }, () => Array(n).fill(1))
  let idx = 0
  for (let i = 0; i < n; i++) {
    matrix[i][i] = 1
    for (let j = i + 1; j < n; j++) {
      matrix[i][j] = upperTriValues[idx]
      matrix[j][i] = 1 / upperTriValues[idx]
      idx++
    }
  }
  return matrix
}

// 一级指标判断矩阵维度: 6（原辅材料、废气、废水、雨水、固废、检测监控）
// 上三角元素个数: n*(n-1)/2 = 15

export const mockExperts = [
  {
    id: 'EXP001',
    name: '张明华',
    title: '教授',
    affiliation: '浙江大学环境与资源学院',
    specialty: '大气污染控制',
    yearsOfExperience: 25,
    matrices: {
      // 一级指标判断矩阵（6×6）
      level1: buildMatrix([
        3, 5, 4, 6, 7,    // 原辅材料 vs 废气/废水/雨水/固废/检测
        3, 2, 5, 5,       // 废气 vs 废水/雨水/固废/检测
        1 / 2, 3, 3,      // 废水 vs 雨水/固废/检测
        4, 4,             // 雨水 vs 固废/检测
        1                  // 固废 vs 检测
      ], 6),
      // 二级指标判断矩阵
      raw_material: buildMatrix([2], 2),           // 自动配料 vs 管道输送
      waste_gas: buildMatrix([1 / 3, 1, 1 / 3, 2, 3, 1], 4),  // 4个二级指标
      wastewater: buildMatrix([2], 2),
      rainwater: buildMatrix([2, 3, 2], 3),
      solid_waste: buildMatrix([2], 2),
      monitoring: buildMatrix([2, 3, 2], 3)
    }
  },

  {
    id: 'EXP002',
    name: '李红梅',
    title: '高级工程师',
    affiliation: '中国环境科学研究院',
    specialty: '水污染控制与废水处理',
    yearsOfExperience: 20,
    matrices: {
      level1: buildMatrix([
        2, 3, 5, 7, 8,    // 原辅材料 vs 废气/废水/雨水/固废/检测
        2, 4, 5, 6,       // 废气 vs 废水/雨水/固废/检测
        3, 4, 5,          // 废水 vs 雨水/固废/检测
        2, 3,             // 雨水 vs 固废/检测
        2                  // 固废 vs 检测
      ], 6),
      raw_material: buildMatrix([3], 2),
      waste_gas: buildMatrix([1 / 2, 2, 1 / 2, 3, 4, 1], 4),
      wastewater: buildMatrix([3], 2),
      rainwater: buildMatrix([3, 2, 1 / 2], 3),
      solid_waste: buildMatrix([1 / 2], 2),
      monitoring: buildMatrix([3, 2, 1 / 2], 3)
    }
  },

  {
    id: 'EXP003',
    name: '王建国',
    title: '教授级高工',
    affiliation: '福建省环境科学研究院',
    specialty: '合成革行业清洁生产',
    yearsOfExperience: 28,
    matrices: {
      level1: buildMatrix([
        4, 2, 3, 6, 5,    // 原辅材料 vs 废气/废水/雨水/固废/检测  — 此专家认为废水比废气重要
        1 / 3, 1 / 2, 3, 2,  // 废气 vs 废水/雨水/固废/检测
        2, 4, 3,          // 废水 vs 雨水/固废/检测
        3, 2,             // 雨水 vs 固废/检测
        1 / 2              // 固废 vs 检测
      ], 6),
      raw_material: buildMatrix([1 / 2], 2),
      waste_gas: buildMatrix([1, 1 / 2, 1 / 3, 1, 3, 1], 4),
      wastewater: buildMatrix([1 / 2], 2),
      rainwater: buildMatrix([1, 2, 2], 3),
      solid_waste: buildMatrix([1], 2),
      monitoring: buildMatrix([1, 1, 1], 3)
    }
  },

  {
    id: 'EXP004',
    name: '陈小华',
    title: '副教授',
    affiliation: '东华大学化学与化工学院',
    specialty: '合成革工艺与材料',
    yearsOfExperience: 15,
    matrices: {
      // 此专家的 level1 矩阵故意设置得不一致（供PSO修正演示）
      level1: buildMatrix([
        1 / 2, 1, 2, 3, 1,  // 原辅材料 vs 废气/废水/雨水/固废/检测
        3, 4, 5, 6,         // 废气 vs 废水/雨水/固废/检测
        1 / 2, 3, 1,        // 废水 vs 雨水/固废/检测  — 此处与上面产生不一致
        5, 3,               // 雨水 vs 固废/检测
        1 / 3                // 固废 vs 检测
      ], 6),
      raw_material: buildMatrix([1], 2),
      waste_gas: buildMatrix([1 / 4, 2, 1 / 4, 1, 1 / 2, 1 / 3], 4),
      wastewater: buildMatrix([1], 2),
      rainwater: buildMatrix([1 / 2, 1 / 3, 1 / 2], 3),
      solid_waste: buildMatrix([3], 2),
      monitoring: buildMatrix([1 / 2, 1 / 3, 1 / 2], 3)
    }
  },

  {
    id: 'EXP005',
    name: '赵志强',
    title: '研究员',
    affiliation: '丽水市生态环境局',
    specialty: '环境管理与政策',
    yearsOfExperience: 22,
    matrices: {
      level1: buildMatrix([
        5, 4, 6, 8, 7,    // 原辅材料 vs 废气/废水/雨水/固废/检测 — 强调源头控制
        1 / 2, 2, 4, 3,   // 废气 vs 废水/雨水/固废/检测
        3, 5, 4,          // 废水 vs 雨水/固废/检测
        2, 2,             // 雨水 vs 固废/检测
        1                  // 固废 vs 检测
      ], 6),
      raw_material: buildMatrix([4], 2),
      waste_gas: buildMatrix([1 / 2, 2, 1 / 3, 2, 2, 1], 4),
      wastewater: buildMatrix([2], 2),
      rainwater: buildMatrix([1, 3, 2], 3),
      solid_waste: buildMatrix([2], 2),
      monitoring: buildMatrix([1, 3, 2], 3)
    }
  }
]

// ============================================================
// 三、指标体系对应的二级指标ID映射
// ============================================================
export const indicatorChildrenMap = {
  raw_material: ['auto_dosing', 'pipeline_transport'],
  waste_gas: ['enclosed_collection', 'spray_tower', 'distillation', 'unorganized_control'],
  wastewater: ['closed_pipeline', 'inlet_isolation'],
  rainwater: ['clear_pool_sunny', 'level_display', 'ultrafiltration'],
  solid_waste: ['hazardous_waste', 'general_waste'],
  monitoring: ['online_water', 'online_gas', 'boundary_monitor']
}

// 一级指标顺序（与判断矩阵维度一致）
export const level1IndicatorKeys = [
  'raw_material',
  'waste_gas',
  'wastewater',
  'rainwater',
  'solid_waste',
  'monitoring'
]
