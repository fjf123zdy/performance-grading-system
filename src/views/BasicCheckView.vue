<!-- 合成革企业环境绩效分级评价系统 V1.0 — 基本要求判定页 -->
<template>
  <div class="basic-check-page">
    <div class="page-header">
      <h2 class="page-title">基本要求判定</h2>
      <p class="page-subtitle">对企业参评基本资格进行一票否决制审查</p>
    </div>

    <div v-if="!enterprise" class="card text-center">
      <p class="text-muted">请先在"企业管理"中选择一家企业</p>
      <router-link to="/enterprise" class="btn btn-primary mt-md">前往企业管理</router-link>
    </div>

    <template v-else>
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">{{ enterprise.name }} — 基本要求审查</h3>
          <span :class="result ? (result.overallPass ? 'badge badge-success' : 'badge badge-danger') : ''">
            {{ result ? (result.overallPass ? '✓ 通过' : '✗ 不通过') : '待审查' }}
          </span>
        </div>

        <table v-if="result">
          <thead>
            <tr><th>审查项目</th><th>判定结果</th><th>佐证材料</th></tr>
          </thead>
          <tbody>
            <tr v-for="item in result.criteria" :key="item.key">
              <td>{{ item.label }}</td>
              <td>
                <span :class="item.pass ? 'text-success' : 'text-danger'">
                  {{ item.pass ? '✓ 通过' : '✗ 不通过' }}
                </span>
              </td>
              <td class="text-muted">{{ item.evidence }}</td>
            </tr>
          </tbody>
        </table>

        <div v-if="result && !result.overallPass" class="mt-md">
          <div class="card" style="background:#fdedec;border:1px solid var(--color-danger)">
            <strong class="text-danger">⚠ 不通过项目：</strong>
            <ul style="margin-top:8px;padding-left:20px">
              <li v-for="item in result.failedItems" :key="item" class="text-danger">{{ item }}</li>
            </ul>
            <p class="text-muted mt-sm">该企业不具备参与绩效分级评价的基本资格。</p>
          </div>
        </div>

        <div v-if="result && result.overallPass" class="mt-md">
          <div class="card" style="background:#eafaf1;border:1px solid var(--color-success)">
            <strong class="text-success">✓ 基本要求审查通过</strong>
            <p class="text-muted mt-sm">该企业具备参与绩效分级评价的基本资格，可继续后续评价流程。</p>
          </div>
        </div>

        <div class="form-actions">
          <button class="btn btn-primary" @click="runCheck">执行审查</button>
          <router-link v-if="result?.overallPass" :to="`/quantitative/${enterprise.id}`" class="btn btn-outline">
            下一步：定量指标 →
          </router-link>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useEnterpriseStore } from '@/stores/useEnterpriseStore'
import { useEvaluationStore } from '@/stores/useEvaluationStore'
import { performBasicCheck } from '@/services/basicCheckService'

const route = useRoute()
const enterpriseStore = useEnterpriseStore()
const evaluationStore = useEvaluationStore()

const enterprise = computed(() => {
  const id = route.params.id || enterpriseStore.currentEnterpriseId
  return id ? enterpriseStore.getEnterpriseById(id) : null
})

const result = ref(null)

function runCheck() {
  if (!enterprise.value) return
  result.value = performBasicCheck(enterprise.value.basicCheck)
  evaluationStore.setBasicCheck(enterprise.value.id, result.value)
}

onMounted(() => {
  if (enterprise.value) {
    runCheck()
  }
})
</script>
