/**
 * 合成革企业环境绩效分级评价系统 V1.0
 * 企业管理状态 — Pinia Store
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockEnterprises } from '@/services/mockData'

export const useEnterpriseStore = defineStore('enterprise', () => {
  // ---- 状态 ----
  const enterprises = ref([...mockEnterprises])
  const currentEnterpriseId = ref(null)

  // ---- 计算属性 ----
  const currentEnterprise = computed(() => {
    if (!currentEnterpriseId.value) return null
    return enterprises.value.find(e => e.id === currentEnterpriseId.value) || null
  })

  const enterpriseCount = computed(() => enterprises.value.length)

  // ---- 操作方法 ----

  /**
   * 选择当前操作的企业
   * @param {string} id - 企业ID
   */
  function selectEnterprise(id) {
    currentEnterpriseId.value = id
  }

  /**
   * 取消选择
   */
  function clearSelection() {
    currentEnterpriseId.value = null
  }

  /**
   * 根据ID获取企业
   * @param {string} id - 企业ID
   * @returns {Object|null}
   */
  function getEnterpriseById(id) {
    return enterprises.value.find(e => e.id === id) || null
  }

  /**
   * 添加企业
   * @param {Object} enterprise - 企业数据
   */
  function addEnterprise(enterprise) {
    const newId = `ENT${String(enterprises.value.length + 1).padStart(3, '0')}`
    enterprises.value.push({ ...enterprise, id: newId })
    return newId
  }

  /**
   * 更新企业数据
   * @param {string} id - 企业ID
   * @param {Object} data - 更新的数据
   */
  function updateEnterprise(id, data) {
    const index = enterprises.value.findIndex(e => e.id === id)
    if (index !== -1) {
      enterprises.value[index] = { ...enterprises.value[index], ...data }
    }
  }

  /**
   * 删除企业
   * @param {string} id - 企业ID
   */
  function removeEnterprise(id) {
    const index = enterprises.value.findIndex(e => e.id === id)
    if (index !== -1) {
      enterprises.value.splice(index, 1)
    }
    if (currentEnterpriseId.value === id) {
      currentEnterpriseId.value = null
    }
  }

  return {
    enterprises,
    currentEnterpriseId,
    currentEnterprise,
    enterpriseCount,
    selectEnterprise,
    clearSelection,
    getEnterpriseById,
    addEnterprise,
    updateEnterprise,
    removeEnterprise
  }
})
