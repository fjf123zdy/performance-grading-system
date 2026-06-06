<!-- 合成革企业环境绩效分级评价系统 V1.0 — 综合报告页 -->
<template>
  <div class="report-page">
    <div class="page-header">
      <h2 class="page-title">综合报告</h2>
      <p class="page-subtitle">合成革企业环境绩效分级评价完整报告</p>
    </div>

    <div v-if="!enterprise" class="card text-center">
      <p class="text-muted">请先选择企业</p>
      <router-link to="/enterprise" class="btn btn-primary mt-md">前往企业管理</router-link>
    </div>

    <template v-else>
      <div class="card">
        <h3 class="card-title">📄 {{ enterprise.name }} — 环境绩效分级评价报告</h3>
        <p class="text-muted">报告生成时间：{{ reportTime }}</p>
        <hr style="margin:var(--spacing-md) 0" />

        <!-- 企业基本信息 -->
        <h4>一、企业基本信息</h4>
        <div class="grid-2 mt-sm">
          <div><span class="text-muted">企业名称：</span>{{ enterprise.name }}</div>
          <div><span class="text-muted">所在地：</span>{{ enterprise.province }} {{ enterprise.city }}</div>
          <div><span class="text-muted">主要产品：</span>{{ enterprise.mainProducts }}</div>
          <div><span class="text-muted">年产能：</span>{{ enterprise.annualCapacity }} 万米/年</div>
          <div><span class="text-muted">员工人数：</span>{{ enterprise.employeeCount }} 人</div>
          <div><span class="text-muted">成立年份：</span>{{ enterprise.establishedYear }} 年</div>
        </div>

        <hr style="margin:var(--spacing-md) 0" />

        <!-- 评价结果 -->
        <h4>二、评价结果</h4>
        <div class="flex-center mt-sm mb-md" style="gap:var(--spacing-lg)">
          <div class="grade-badge" :class="gradeResult.finalGrade.color"
            style="width:120px;height:120px">
            <span class="grade-icon" style="font-size:20px">{{ gradeResult.finalGrade.badge }}</span>
            <span class="grade-label" style="font-size:var(--font-size-lg)">{{ gradeResult.finalGrade.name }}</span>
          </div>
          <div>
            <p><strong>综合评价等级：</strong>{{ gradeResult.finalGrade.label }}</p>
            <p><strong>定量指标等级：</strong>{{ gradeResult.quantitative.overallLabel }}</p>
            <p v-if="gradeResult.qualitative"><strong>定性评分：</strong>{{ gradeResult.qualitative.percentage.toFixed(1) }}%</p>
          </div>
        </div>

        <hr style="margin:var(--spacing-md) 0" />

        <!-- 定量指标详情 -->
        <h4>三、定量指标详情</h4>
        <table class="mt-sm">
          <thead><tr><th>指标</th><th>计算值</th><th>一级阈值</th><th>二级阈值</th><th>三级阈值</th><th>判定</th></tr></thead>
          <tbody>
            <tr>
              <td>单位产品废水产生量</td>
              <td>{{ gradeResult.quantitative.wastewaterPerUnit.value.toFixed(2) }} t/万m</td>
              <td>≤15</td><td>≤25</td><td>≤40</td>
              <td><span class="badge" :class="'badge-' + (gradeResult.gradeDetails.quantitativeBreakdown.wastewater <= 1 ? 'success' : gradeResult.gradeDetails.quantitativeBreakdown.wastewater <= 2 ? 'info' : 'warning')">{{ gradeResult.gradeDetails.quantitativeBreakdown.wastewater }}级</span></td>
            </tr>
            <tr>
              <td>单位产品VOCs产生量</td>
              <td>{{ gradeResult.quantitative.vocsPerUnit.value.toFixed(2) }} kg/万m</td>
              <td>≤30</td><td>≤60</td><td>≤100</td>
              <td><span class="badge" :class="'badge-' + (gradeResult.gradeDetails.quantitativeBreakdown.vocs <= 1 ? 'success' : gradeResult.gradeDetails.quantitativeBreakdown.vocs <= 2 ? 'info' : 'warning')">{{ gradeResult.gradeDetails.quantitativeBreakdown.vocs }}级</span></td>
            </tr>
            <tr>
              <td>有组织排放DMF浓度</td>
              <td>{{ gradeResult.quantitative.dmfConcentration.value.toFixed(1) }} mg/m³</td>
              <td>≤10</td><td>≤20</td><td>≤30</td>
              <td><span class="badge" :class="'badge-' + (gradeResult.gradeDetails.quantitativeBreakdown.dmf <= 1 ? 'success' : gradeResult.gradeDetails.quantitativeBreakdown.dmf <= 2 ? 'info' : 'warning')">{{ gradeResult.gradeDetails.quantitativeBreakdown.dmf }}级</span></td>
            </tr>
            <tr>
              <td>非封闭区域VOC检测值</td>
              <td>{{ gradeResult.quantitative.unorganizedVOC.value.toFixed(1) }} mg/m³</td>
              <td>≤2</td><td>≤5</td><td>≤10</td>
              <td><span class="badge" :class="'badge-' + (gradeResult.gradeDetails.quantitativeBreakdown.unorganizedVOC <= 1 ? 'success' : gradeResult.gradeDetails.quantitativeBreakdown.unorganizedVOC <= 2 ? 'info' : 'warning')">{{ gradeResult.gradeDetails.quantitativeBreakdown.unorganizedVOC }}级</span></td>
            </tr>
          </tbody>
        </table>

        <hr style="margin:var(--spacing-md) 0" />

        <!-- 管控建议 -->
        <h4>四、管控措施建议</h4>
        <div v-if="measures" class="mt-sm">
          <div v-for="(cat, i) in measures.measures" :key="i" class="mb-sm">
            <strong>{{ cat.category }}：</strong>
            <ul style="padding-left:20px">
              <li v-for="(item, j) in cat.items" :key="j">{{ item }}</li>
            </ul>
          </div>
        </div>

        <hr style="margin:var(--spacing-md) 0" />

        <div class="text-center text-muted" style="font-size:var(--font-size-xs)">
          本报告由「合成革企业环境绩效分级评价系统 V1.0」自动生成<br/>
          评价依据：《合成革企业环境管理与排放水平绩效分级政策建议研究报告》（中国环境科学研究院，2025年12月）
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
import { performGrading, getControlMeasures } from '@/services/gradingService'
import { formatDate } from '@/utils/formatters'

const route = useRoute()
const enterpriseStore = useEnterpriseStore()
const evaluationStore = useEvaluationStore()

const gradeResult = ref(null)
const measures = ref(null)
const reportTime = ref('')

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
    reportTime.value = formatDate(new Date())
  }
})
</script>
