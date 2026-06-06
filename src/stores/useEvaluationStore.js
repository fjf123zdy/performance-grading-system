/**
 * 合成革企业环境绩效分级评价系统 V1.0
 * 评价流程状态管理 — Pinia Store
 */
import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'

export const useEvaluationStore = defineStore('evaluation', () => {
  // ---- 状态 ----
  const currentStep = ref(1)
  const evaluations = reactive({})

  // ---- 计算属性 ----
  const totalSteps = computed(() => 7)

  const progressPercent = computed(() => {
    return Math.round((currentStep.value / totalSteps.value) * 100)
  })

  // ---- 操作方法 ----

  /**
   * 设置当前步骤
   * @param {number} step - 步骤编号（1-7）
   */
  function setStep(step) {
    if (step >= 1 && step <= totalSteps.value) {
      currentStep.value = step
    }
  }

  /**
   * 下一步
   */
  function nextStep() {
    if (currentStep.value < totalSteps.value) {
      currentStep.value++
    }
  }

  /**
   * 上一步
   */
  function prevStep() {
    if (currentStep.value > 1) {
      currentStep.value--
    }
  }

  /**
   * 设置企业的基本判定结果
   * @param {string} enterpriseId - 企业ID
   * @param {Object} result - 判定结果
   */
  function setBasicCheck(enterpriseId, result) {
    if (!evaluations[enterpriseId]) {
      evaluations[enterpriseId] = {}
    }
    evaluations[enterpriseId].basicCheck = result
  }

  /**
   * 设置企业的定量计算结果
   * @param {string} enterpriseId - 企业ID
   * @param {Object} result - 计算结果
   */
  function setQuantitative(enterpriseId, result) {
    if (!evaluations[enterpriseId]) {
      evaluations[enterpriseId] = {}
    }
    evaluations[enterpriseId].quantitative = result
  }

  /**
   * 设置企业的定性评分结果
   * @param {string} enterpriseId - 企业ID
   * @param {Object} result - 评分结果
   */
  function setQualitative(enterpriseId, result) {
    if (!evaluations[enterpriseId]) {
      evaluations[enterpriseId] = {}
    }
    evaluations[enterpriseId].qualitative = result
  }

  /**
   * 设置企业的最终分级结果
   * @param {string} enterpriseId - 企业ID
   * @param {Object} grade - 分级结果
   */
  function setGrade(enterpriseId, grade) {
    if (!evaluations[enterpriseId]) {
      evaluations[enterpriseId] = {}
    }
    evaluations[enterpriseId].finalGrade = grade
  }

  /**
   * 获取企业的评价结果
   * @param {string} enterpriseId - 企业ID
   * @returns {Object|null}
   */
  function getEvaluation(enterpriseId) {
    return evaluations[enterpriseId] || null
  }

  /**
   * 获取企业评价是否完成
   * @param {string} enterpriseId - 企业ID
   * @returns {boolean}
   */
  function isEvaluationComplete(enterpriseId) {
    const ev = evaluations[enterpriseId]
    return !!(ev && ev.finalGrade)
  }

  /**
   * 重置评价流程
   */
  function reset() {
    currentStep.value = 1
    // 保留评价数据，仅重置步骤
  }

  return {
    currentStep,
    evaluations,
    totalSteps,
    progressPercent,
    setStep,
    nextStep,
    prevStep,
    setBasicCheck,
    setQuantitative,
    setQualitative,
    setGrade,
    getEvaluation,
    isEvaluationComplete,
    reset
  }
})
