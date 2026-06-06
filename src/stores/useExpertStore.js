/**
 * 合成革企业环境绩效分级评价系统 V1.0
 * 专家打分状态管理 — Pinia Store
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getExperts } from '@/services/ahpService'
import { mockExperts } from '@/services/mockData'

export const useExpertStore = defineStore('expert', () => {
  // ---- 状态 ----
  const experts = ref(getExperts())
  const selectedExpertIds = ref(['EXP001', 'EXP002', 'EXP003', 'EXP005'])
  const ahpResults = ref({})
  const psoResults = ref({})
  const fusionResult = ref(null)
  const fusionMethod = ref('both')  // 'mean' | 'matrix' | 'both'

  // ---- 计算属性 ----
  const selectedExperts = computed(() => {
    return experts.value.filter(e => selectedExpertIds.value.includes(e.id))
  })

  const expertCount = computed(() => selectedExpertIds.value.length)

  // ---- 操作方法 ----

  /**
   * 切换专家选中状态
   * @param {string} expertId - 专家ID
   */
  function toggleExpert(expertId) {
    const index = selectedExpertIds.value.indexOf(expertId)
    if (index > -1) {
      if (selectedExpertIds.value.length > 2) {
        selectedExpertIds.value.splice(index, 1)
      }
    } else {
      selectedExpertIds.value.push(expertId)
    }
  }

  /**
   * 设置 AHP 分析结果
   * @param {string} expertId - 专家ID
   * @param {Object} result - AHP分析结果
   */
  function setAHPResult(expertId, result) {
    ahpResults.value[expertId] = result
  }

  /**
   * 设置 PSO 优化结果
   * @param {string} expertId - 专家ID
   * @param {Object} result - PSO优化结果
   */
  function setPSOResult(expertId, result) {
    psoResults.value[expertId] = result
  }

  /**
   * 设置群决策融合结果
   * @param {Object} result - 融合结果
   */
  function setFusionResult(result) {
    fusionResult.value = result
  }

  /**
   * 设置权重融合方法
   * @param {string} method - 'mean' | 'matrix' | 'both'
   */
  function setFusionMethod(method) {
    fusionMethod.value = method
  }

  /**
   * 获取专家原始矩阵
   * @param {string} expertId - 专家ID
   * @returns {Object|null}
   */
  function getExpertRawMatrices(expertId) {
    const expert = mockExperts.find(e => e.id === expertId)
    return expert ? expert.matrices : null
  }

  return {
    experts,
    selectedExpertIds,
    ahpResults,
    psoResults,
    fusionResult,
    fusionMethod,
    selectedExperts,
    expertCount,
    toggleExpert,
    setAHPResult,
    setPSOResult,
    setFusionResult,
    setFusionMethod,
    getExpertRawMatrices
  }
})
