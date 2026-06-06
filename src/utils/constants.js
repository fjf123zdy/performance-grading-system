/**
 * 合成革企业环境绩效分级评价系统 V1.0
 * 系统常量定义
 *
 * 包含：RI随机一致性指标表、标准品折算系数表、分级阈值、
 *       定性指标体系定义、管控措施文本、Saaty标度说明等
 */

// ============================================================
// 一、AHP 随机一致性指标 RI 表（1-15阶）
// ============================================================
export const RI_TABLE = {
  1: 0,
  2: 0,
  3: 0.58,
  4: 0.90,
  5: 1.12,
  6: 1.24,
  7: 1.32,
  8: 1.41,
  9: 1.45,
  10: 1.49,
  11: 1.51,
  12: 1.53,
  13: 1.56,
  14: 1.57,
  15: 1.59
}

// ============================================================
// 二、标准品折算系数表
// 基准：厚度 1.00mm，成品幅宽 136cm～156cm
// ============================================================
export const STANDARD_CONVERSION = {
  // 厚度折算系数（基准厚度 1.0mm，系数 1.0）
  thickness: [
    { min: 0, max: 0.40, coefficient: 0.25 },
    { min: 0.41, max: 0.60, coefficient: 0.50 },
    { min: 0.61, max: 0.80, coefficient: 0.75 },
    { min: 0.81, max: 1.20, coefficient: 1.00 },
    { min: 1.21, max: 1.60, coefficient: 1.40 },
    { min: 1.61, max: 2.00, coefficient: 1.80 },
    { min: 2.01, max: 99, coefficient: 2.30 }
  ],
  // 幅宽折算系数（基准幅宽 136-156cm，系数 1.0）
  width: [
    { min: 0, max: 100, coefficient: 0.70 },
    { min: 101, max: 120, coefficient: 0.85 },
    { min: 121, max: 135, coefficient: 0.95 },
    { min: 136, max: 156, coefficient: 1.00 },
    { min: 157, max: 180, coefficient: 1.20 },
    { min: 181, max: 99, coefficient: 1.40 }
  ]
}

// ============================================================
// 三、定量指标分级阈值
// ============================================================
export const QUANTITATIVE_THRESHOLDS = {
  wastewaterPerUnit: {
    label: '单位产品废水产生量',
    unit: 't/万m',
    level1: { min: 0, max: 15 },
    level2: { min: 15, max: 25 },
    level3: { min: 25, max: 40 }
  },
  vocsPerUnit: {
    label: '单位产品VOCs产生量',
    unit: 'kg/万m',
    level1: { min: 0, max: 30 },
    level2: { min: 30, max: 60 },
    level3: { min: 60, max: 100 }
  },
  dmfEmission: {
    label: '有组织排放DMF浓度',
    unit: 'mg/m³',
    level1: { min: 0, max: 10 },
    level2: { min: 10, max: 20 },
    level3: { min: 20, max: 30 }
  },
  unorganizedVOC: {
    label: '非封闭区域手持VOC检测值',
    unit: 'mg/m³',
    level1: { min: 0, max: 2 },
    level2: { min: 2, max: 5 },
    level3: { min: 5, max: 10 }
  }
}

// ============================================================
// 四、定性指标体系定义（6个一级指标、15个二级指标）
// ============================================================
export const QUALITATIVE_INDICATORS = [
  {
    id: 'raw_material',
    name: '原辅材料准备',
    children: [
      { id: 'auto_dosing', name: '粉料自动配料系统：密闭式自动计量配料，物料通过管道或密闭容器输送', maxScore: 10 },
      { id: 'pipeline_transport', name: '液态物料管道密闭输送：储罐→管道→生产线全密闭输送', maxScore: 10 }
    ]
  },
  {
    id: 'waste_gas',
    name: '废气治理',
    children: [
      { id: 'enclosed_collection', name: '包围型废气收集装置：生产线废气产生点全覆盖收集', maxScore: 10 },
      { id: 'spray_tower', name: '喷淋塔运行管理：液气比≥2.0L/m³，填料层高度≥3m，末级清水喷淋', maxScore: 10 },
      { id: 'distillation', name: '精馏塔管理：DMF回收精馏塔回流比控制，塔顶水严禁回用冷却塔/除尘/冲洗', maxScore: 10 },
      { id: 'unorganized_control', name: '无组织排放控制：车间门窗密闭，负压收集，自动关门系统', maxScore: 10 }
    ]
  },
  {
    id: 'wastewater',
    name: '废水收集和处理',
    children: [
      { id: 'closed_pipeline', name: '废水密闭管道收集：全厂废水通过密闭管网输送，防止DMF/二甲胺外泄', maxScore: 10 },
      { id: 'inlet_isolation', name: '废水处理设施接入口隔离：各股废水独立计量，接入口与排出口采取环境空气隔离措施', maxScore: 10 }
    ]
  },
  {
    id: 'rainwater',
    name: '初期雨水收集和处理',
    children: [
      { id: 'clear_pool_sunny', name: '晴天清空制度：初期雨水收集池在晴天保持清空状态（最低液位）', maxScore: 10 },
      { id: 'level_display', name: '液位显示与监控：设立显示屏实时显示雨水收集池液位等参数', maxScore: 10 },
      { id: 'ultrafiltration', name: '超滤膜回用系统：初期雨水经超滤处理后回用至生产线', maxScore: 10 }
    ]
  },
  {
    id: 'solid_waste',
    name: '固废管理',
    children: [
      { id: 'hazardous_waste', name: '危险废物规范化管理：危废分类贮存、台账记录、联单制度', maxScore: 10 },
      { id: 'general_waste', name: '一般固废资源化利用：离型纸、废革屑等综合利用', maxScore: 10 }
    ]
  },
  {
    id: 'monitoring',
    name: '检测监控要求',
    children: [
      { id: 'online_water', name: '废水在线监测：COD、氨氮、流量在线监测设备正常运行', maxScore: 10 },
      { id: 'online_gas', name: '废气在线监测：VOCs、DMF在线监测设备正常运行', maxScore: 10 },
      { id: 'boundary_monitor', name: '厂界无组织监测：定期开展厂界无组织VOCs监测', maxScore: 10 }
    ]
  }
]

// ============================================================
// 五、基本要求判定项
// ============================================================
export const BASIC_CHECK_ITEMS = [
  { key: 'env_accident', label: '近三年无较大及以上环境事故' },
  { key: 'safety_accident', label: '近三年无较大及以上安全事故' },
  { key: 'quality_accident', label: '近三年无较大及以上质量事故' },
  { key: 'credit_record', label: '未列入国家信用信息严重失信主体相关名录' },
  { key: 'drain_compliance', label: '废水排口设置符合相关规范化建设要求' }
]

// ============================================================
// 六、分级管控措施建议文本
// ============================================================
export const CONTROL_MEASURES = {
  level1: {
    name: '引领级',
    color: 'level-1',
    badge: '🥇',
    measures: [
      {
        category: '重污染天气应急',
        items: [
          '黄色及以上预警期间，企业可自主采取减排措施',
          '持续半小时以上的小到中雨天气，企业可自主采取减排措施'
        ]
      },
      {
        category: '产能与扩建',
        items: [
          '地方政府可据此审批扩大产能',
          '优先给予地方税收优惠政策',
          '优先给予财政补贴支持'
        ]
      },
      {
        category: '监管与服务',
        items: [
          '降低日常监管频次',
          '纳入生态环境执法正面清单',
          '优先推荐申报国家级/省级绿色工厂'
        ]
      }
    ]
  },
  level2: {
    name: '先进级',
    color: 'level-2',
    badge: '🥈',
    measures: [
      {
        category: '重污染天气应急',
        items: [
          '黄色及橙色预警期间，企业停产50%',
          '红色预警期间，企业全面停产',
          '持续半小时以上的小到中雨天气，政企协商，建议企业减产50%'
        ]
      },
      {
        category: '产能与扩建',
        items: [
          '企业保持现有产能，不得扩大产能',
          '加强日常监管，确保达标排放'
        ]
      },
      {
        category: '提标改造',
        items: [
          '鼓励企业持续开展环保设施提标改造',
          '支持申报省级环保专项资金支持'
        ]
      }
    ]
  },
  level3: {
    name: '基础级',
    color: 'level-3',
    badge: '🥉',
    measures: [
      {
        category: '重污染天气应急',
        items: [
          '黄色及橙色预警期间，企业停产50%',
          '红色预警期间，企业全面停产',
          '持续半小时以上的小到中雨天气，政企协商，建议企业停产至雨水天气停止'
        ]
      },
      {
        category: '整改要求',
        items: [
          '连续两年获得三级的企业，应提出整改方案并按期整改',
          '逾期不改将调整缩减产能',
          '限制参与评优评先及政府奖励申报'
        ]
      },
      {
        category: '监管强化',
        items: [
          '增加日常监管频次',
          '纳入重点监管企业名单',
          '定期开展执法监测和专项检查'
        ]
      }
    ]
  }
}

// ============================================================
// 七、Saaty 1-9 标度说明
// ============================================================
export const SAATY_SCALE = [
  { value: 1, description: '同等重要' },
  { value: 3, description: '稍微重要' },
  { value: 5, description: '明显重要' },
  { value: 7, description: '强烈重要' },
  { value: 9, description: '极端重要' },
  { value: 2, description: '介于同等与稍微之间' },
  { value: 4, description: '介于稍微与明显之间' },
  { value: 6, description: '介于明显与强烈之间' },
  { value: 8, description: '介于强烈与极端之间' }
]

// ============================================================
// 八、PSO 算法默认参数
// ============================================================
export const PSO_DEFAULTS = {
  populationSize: 40,
  maxIterations: 200,
  inertiaWeightStart: 0.9,
  inertiaWeightEnd: 0.4,
  cognitiveFactor: 2.0,    // c1
  socialFactor: 2.0,       // c2
  alphaCR: 0.6,            // 适应度函数中CR项的权重
  betaDeviation: 0.4,      // 适应度函数中偏离项的权重
  velocityMax: 2.0,
  positionMin: 1 / 9,
  positionMax: 9,
  targetCR: 0.1
}

// ============================================================
// 九、污染物项目测定方法标准（对应研究报告表3）
// ============================================================
export const MONITORING_STANDARDS = [
  { pollutant: 'DMF（二甲基甲酰胺）', method: 'HJ 1153-2020 固定污染源废气 酰胺类化合物的测定 液相色谱法' },
  { pollutant: 'VOCs', method: 'HJ 734-2014 固定污染源废气 挥发性有机物的测定 固相吸附-热脱附/气相色谱-质谱法' },
  { pollutant: '非甲烷总烃', method: 'HJ 38-2017 固定污染源废气 总烃、甲烷和非甲烷总烃的测定 气相色谱法' },
  { pollutant: 'COD', method: 'HJ 828-2017 水质 化学需氧量的测定 重铬酸盐法' },
  { pollutant: '氨氮', method: 'HJ 535-2009 水质 氨氮的测定 纳氏试剂分光光度法' },
  { pollutant: '废水流量', method: 'HJ/T 92-2002 水污染物排放总量监测技术规范' }
]
