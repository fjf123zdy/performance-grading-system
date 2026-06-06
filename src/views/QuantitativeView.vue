<!-- 合成革企业环境绩效分级评价系统 V1.0 — 定量指标计算页 -->
<template>
  <div class="quantitative-page">
    <div class="page-header">
      <h2 class="page-title">定量指标计算</h2>
      <p class="page-subtitle">标准品折算 → 单位产品废水/VOCs产生量 → DMF排放浓度 → 非封闭区VOC检测</p>
    </div>

    <div v-if="!enterprise" class="card text-center">
      <p class="text-muted">请先在"企业管理"中选择一家企业</p>
      <router-link to="/enterprise" class="btn btn-primary mt-md">前往企业管理</router-link>
    </div>

    <template v-else>
      <!-- 产品折算 -->
      <div class="card">
        <h3 class="card-title">1. 标准品产量折算</h3>
        <p class="text-muted mb-md">基准：厚度 1.0mm，幅宽 136-156cm，折算系数 1.0</p>
        <table>
          <thead>
            <tr><th>产品名称</th><th>厚度(mm)</th><th>幅宽(cm)</th><th>实际产量(万m)</th><th>折算系数</th><th>标准品产量(万m)</th></tr>
          </thead>
          <tbody>
            <tr v-for="(p, i) in quantitativeResult?.standardOutput?.detail || []" :key="i">
              <td>{{ p.name }}</td>
              <td class="text-center">{{ enterprise.products[i]?.thickness }}</td>
              <td class="text-center">{{ enterprise.products[i]?.width }}</td>
              <td class="text-center">{{ p.productOutput }}</td>
              <td class="text-center">{{ p.coefficient.toFixed(3) }}</td>
              <td class="text-center"><strong>{{ p.standardOutput.toFixed(2) }}</strong></td>
            </tr>
            <tr style="background:#f0f7fb;font-weight:700">
              <td colspan="5" class="text-right">标准品总产量 Qbz：</td>
              <td class="text-center">{{ quantitativeResult?.standardOutput?.value?.toFixed(2) }} 万m</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 指标计算 -->
      <div class="card" v-if="quantitativeResult">
        <h3 class="card-title">2. 定量指标计算与分级</h3>
        <table>
          <thead>
            <tr><th>指标名称</th><th>计算值</th><th>一级阈值</th><th>二级阈值</th><th>三级阈值</th><th>判定</th></tr>
          </thead>
          <tbody>
            <tr v-for="r in quantitativeMetrics" :key="r.key">
              <td>{{ r.label }}</td>
              <td class="text-center"><strong>{{ r.value.toFixed(2) }} {{ r.unit }}</strong></td>
              <td class="text-center">≤{{ r.threshold.level1.max }}</td>
              <td class="text-center">≤{{ r.threshold.level2.max }}</td>
              <td class="text-center">≤{{ r.threshold.level3.max }}</td>
              <td class="text-center">
                <span class="badge" :class="r.levelClass">{{ r.levelLabel }}</span>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="mt-md flex-center" style="gap:var(--spacing-lg)">
          <div class="text-center">
            <div class="text-muted">综合定量等级</div>
            <div style="font-size:var(--font-size-xxl);font-weight:700" :class="`text-${quantitativeResult.overallLevel <= 2 ? 'success' : 'warning'}`">
              {{ quantitativeResult.overallLabel }}
            </div>
          </div>
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
import { performQuantitativeAnalysis } from '@/services/quantitativeService'

const route = useRoute()
const enterpriseStore = useEnterpriseStore()
const evaluationStore = useEvaluationStore()

const enterprise = computed(() => {
  const id = route.params.id || enterpriseStore.currentEnterpriseId
  return id ? enterpriseStore.getEnterpriseById(id) : null
})

const quantitativeResult = ref(null)

const quantitativeMetrics = computed(() => {
  if (!quantitativeResult.value) return []
  const r = quantitativeResult.value
  return [
    { key: 'wastewater', label: '单位产品废水产生量', value: r.wastewaterPerUnit.value,
      unit: r.wastewaterPerUnit.unit, threshold: r.wastewaterPerUnit.threshold,
      levelLabel: r.wastewaterPerUnit.level.label,
      levelClass: getLevelBadgeClass(r.wastewaterPerUnit.level.level) },
    { key: 'vocs', label: '单位产品VOCs产生量', value: r.vocsPerUnit.value,
      unit: r.vocsPerUnit.unit, threshold: r.vocsPerUnit.threshold,
      levelLabel: r.vocsPerUnit.level.label,
      levelClass: getLevelBadgeClass(r.vocsPerUnit.level.level) },
    { key: 'dmf', label: '有组织排放DMF浓度', value: r.dmfConcentration.value,
      unit: r.dmfConcentration.unit, threshold: r.dmfConcentration.threshold,
      levelLabel: r.dmfConcentration.level.label,
      levelClass: getLevelBadgeClass(r.dmfConcentration.level.level) },
    { key: 'voc', label: '非封闭区域VOC检测值', value: r.unorganizedVOC.value,
      unit: r.unorganizedVOC.unit, threshold: r.unorganizedVOC.threshold,
      levelLabel: r.unorganizedVOC.level.label,
      levelClass: getLevelBadgeClass(r.unorganizedVOC.level.level) }
  ]
})

function getLevelBadgeClass(level) {
  if (level === 1) return 'badge-success'
  if (level === 2) return 'badge-info'
  if (level === 3) return 'badge-warning'
  return 'badge-danger'
}

onMounted(() => {
  if (enterprise.value) {
    quantitativeResult.value = performQuantitativeAnalysis(
      enterprise.value.emission,
      enterprise.value.products
    )
    evaluationStore.setQuantitative(enterprise.value.id, quantitativeResult.value)
  }
})
</script>
