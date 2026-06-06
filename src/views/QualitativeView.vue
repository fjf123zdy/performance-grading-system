<!-- 合成革企业环境绩效分级评价系统 V1.0 — 定性指标评分页 -->
<template>
  <div class="qualitative-page">
    <div class="page-header">
      <h2 class="page-title">定性指标评分</h2>
      <p class="page-subtitle">6个一级指标、15个二级指标，每项 0-10 分</p>
    </div>

    <div v-if="!enterprise" class="card text-center">
      <p class="text-muted">请先选择企业</p>
      <router-link to="/enterprise" class="btn btn-primary mt-md">前往企业管理</router-link>
    </div>

    <template v-else>
      <div class="card" v-for="first in indicators" :key="first.id">
        <h3 class="card-title">{{ first.name }}</h3>
        <table>
          <thead>
            <tr><th>二级指标</th><th style="width:100px">得分 (0-10)</th><th>得分等级</th></tr>
          </thead>
          <tbody>
            <tr v-for="child in first.children" :key="child.id">
              <td>{{ child.name }}</td>
              <td class="text-center">
                <strong>{{ scores[child.id] ?? '-' }}</strong>
              </td>
              <td class="text-center">
                <span class="badge" :class="getScoreClass(scores[child.id])">
                  {{ getScoreLabel(scores[child.id]) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 评分汇总 -->
      <div class="card" v-if="qualResult">
        <h3 class="card-title">评分汇总</h3>
        <div class="grid-2">
          <div>
            <div class="text-muted">总分</div>
            <div style="font-size:var(--font-size-xxl);font-weight:700;color:var(--color-primary)">
              {{ qualResult.totalScore.toFixed(2) }} / 10
            </div>
          </div>
          <div>
            <div class="text-muted">百分制</div>
            <div style="font-size:var(--font-size-xxl);font-weight:700" :class="qualResult.level.color">
              {{ qualResult.percentage.toFixed(1) }}%
            </div>
          </div>
        </div>
        <div class="mt-md">
          <span class="badge" :class="`badge-${qualResult.level.color === 'level-1' ? 'success' : qualResult.level.color === 'level-2' ? 'info' : 'warning'}`">
            {{ qualResult.level.label }}
          </span>
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
import { getIndicatorSystem, performQualitativeAnalysis } from '@/services/qualitativeService'

const route = useRoute()
const enterpriseStore = useEnterpriseStore()
const evaluationStore = useEvaluationStore()

const indicators = getIndicatorSystem()
const qualResult = ref(null)

const enterprise = computed(() => {
  const id = route.params.id || enterpriseStore.currentEnterpriseId
  return id ? enterpriseStore.getEnterpriseById(id) : null
})

const scores = computed(() => enterprise.value?.qualitativeScores || {})

function getScoreClass(score) {
  if (score >= 8) return 'badge-success'
  if (score >= 6) return 'badge-info'
  if (score >= 4) return 'badge-warning'
  return 'badge-danger'
}

function getScoreLabel(score) {
  if (score >= 8) return '优秀'
  if (score >= 6) return '良好'
  if (score >= 4) return '一般'
  return '较差'
}

onMounted(() => {
  if (enterprise.value?.qualitativeScores) {
    qualResult.value = performQualitativeAnalysis(enterprise.value.qualitativeScores, null)
    evaluationStore.setQualitative(enterprise.value.id, qualResult.value)
  }
})
</script>
