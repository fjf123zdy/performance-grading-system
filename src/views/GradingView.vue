<!-- 合成革企业环境绩效分级评价系统 V1.0 — 分级结果页 -->
<template>
  <div class="grading-page">
    <div class="page-header">
      <h2 class="page-title">分级结果</h2>
      <p class="page-subtitle">综合基本判定、定量指标、定性评分及专家权重，确定企业最终环保绩效等级</p>
    </div>

    <div v-if="!enterprise" class="card text-center">
      <p class="text-muted">请先选择企业</p>
      <router-link to="/enterprise" class="btn btn-primary mt-md">前往企业管理</router-link>
    </div>

    <template v-else>
      <!-- 等级徽章 -->
      <div class="card" v-if="gradeResult">
        <div class="flex-center" style="flex-direction:column;gap:var(--spacing-md)">
          <div class="grade-badge" :class="gradeResult.finalGrade.color">
            <span class="grade-icon">{{ gradeResult.finalGrade.badge }}</span>
            <span class="grade-label">{{ gradeResult.finalGrade.name }}</span>
            <span class="grade-name">{{ gradeResult.finalGrade.description }}</span>
          </div>
          <h2>{{ gradeResult.enterpriseName }}</h2>
        </div>
      </div>

      <!-- 详细评价 -->
      <div v-if="gradeResult" class="grid-2">
        <!-- 基本判定 -->
        <div class="card">
          <h3 class="card-title">✅ 基本要求判定</h3>
          <div :class="gradeResult.basicCheck.overallPass ? 'text-success' : 'text-danger'" style="font-size:var(--font-size-lg);font-weight:600">
            {{ gradeResult.basicCheck.overallPass ? '✓ 通过' : '✗ 不通过' }}
          </div>
          <ul class="mt-sm">
            <li v-for="c in gradeResult.basicCheck.criteria" :key="c.key"
              :class="c.pass ? 'text-success' : 'text-danger'">
              {{ c.pass ? '✓' : '✗' }} {{ c.label }}
            </li>
          </ul>
        </div>

        <!-- 定量指标 -->
        <div class="card">
          <h3 class="card-title">📊 定量指标</h3>
          <div style="font-size:var(--font-size-lg);font-weight:600" :class="`text-${gradeResult.quantitative.overallLevel <= 2 ? 'success' : 'warning'}`">
            {{ gradeResult.quantitative.overallLabel }}
          </div>
          <table class="mt-sm">
            <thead><tr><th>指标</th><th>值</th><th>等级</th></tr></thead>
            <tbody>
              <tr><td>单位产品废水产生量</td><td>{{ gradeResult.quantitative.wastewaterPerUnit.value.toFixed(2) }} t/万m</td><td>{{ gradeResult.gradeDetails.quantitativeBreakdown.wastewater }}级</td></tr>
              <tr><td>单位产品VOCs产生量</td><td>{{ gradeResult.quantitative.vocsPerUnit.value.toFixed(2) }} kg/万m</td><td>{{ gradeResult.gradeDetails.quantitativeBreakdown.vocs }}级</td></tr>
              <tr><td>DMF排放浓度</td><td>{{ gradeResult.quantitative.dmfConcentration.value.toFixed(1) }} mg/m³</td><td>{{ gradeResult.gradeDetails.quantitativeBreakdown.dmf }}级</td></tr>
              <tr><td>非封闭区域VOC</td><td>{{ gradeResult.quantitative.unorganizedVOC.value.toFixed(1) }} mg/m³</td><td>{{ gradeResult.gradeDetails.quantitativeBreakdown.unorganizedVOC }}级</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 管控措施 -->
      <div class="card" v-if="measures && gradeResult.finalGrade.level <= 3">
        <h3 class="card-title">📋 分级管控措施 — {{ gradeResult.finalGrade.name }}</h3>
        <div v-for="(cat, i) in measures.measures" :key="i" class="mb-md">
          <h4>{{ cat.category }}</h4>
          <ul style="padding-left:20px">
            <li v-for="(item, j) in cat.items" :key="j">{{ item }}</li>
          </ul>
        </div>
      </div>

      <div class="form-actions">
        <router-link :to="`/report/${enterprise.id}`" class="btn btn-primary">查看综合报告 →</router-link>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useEnterpriseStore } from '@/stores/useEnterpriseStore'
import { useEvaluationStore } from '@/stores/useEvaluationStore'
import { performGrading, getControlMeasures } from '@/services/gradingService'

const route = useRoute()
const enterpriseStore = useEnterpriseStore()
const evaluationStore = useEvaluationStore()

const gradeResult = ref(null)
const measures = ref(null)

const enterprise = computed(() => {
  const id = route.params.id || enterpriseStore.currentEnterpriseId
  return id ? enterpriseStore.getEnterpriseById(id) : null
})

onMounted(() => {
  if (enterprise.value) {
    gradeResult.value = performGrading(enterprise.value, null)
    evaluationStore.setGrade(enterprise.value.id, gradeResult.value)
    if (gradeResult.value.finalGrade.level <= 3) {
      measures.value = getControlMeasures(gradeResult.value.finalGrade.level)
    }
  }
})
</script>
