<!-- 合成革企业环境绩效分级评价系统 V1.0 — 群决策融合页 -->
<template>
  <div class="group-decision-page">
    <div class="page-header">
      <h2 class="page-title">群决策融合</h2>
      <p class="page-subtitle">融合多位专家的权重结果，形成最终的评价指标权重</p>
    </div>

    <!-- 专家选择 -->
    <div class="card">
      <h3 class="card-title">参与融合的专家（{{ expertStore.expertCount }} 位）</h3>
      <div class="flex gap-sm flex-wrap">
        <button v-for="exp in expertStore.experts" :key="exp.id"
          class="btn btn-sm"
          :class="expertStore.selectedExpertIds.includes(exp.id) ? 'btn-primary' : 'btn-outline'"
          @click="expertStore.toggleExpert(exp.id)"
        >
          {{ exp.name }}
        </button>
      </div>
    </div>

    <!-- 融合方法选择 -->
    <div class="card">
      <h3 class="card-title">融合方法</h3>
      <div class="flex gap-md">
        <label class="radio-label">
          <input type="radio" v-model="method" value="mean" /> 直接均值法
        </label>
        <label class="radio-label">
          <input type="radio" v-model="method" value="matrix" /> 群决策矩阵法
        </label>
        <label class="radio-label">
          <input type="radio" v-model="method" value="both" /> 两种方法对比
        </label>
      </div>
      <button class="btn btn-primary mt-md" @click="runFusion">执行群决策融合</button>
    </div>

    <!-- 融合结果 -->
    <div v-if="fusionResult" class="card">
      <h3 class="card-title">一级指标融合权重</h3>

      <div v-if="fusionResult.level1.mean" class="mb-lg">
        <h4>直接均值法</h4>
        <table>
          <thead><tr><th>指标</th><th>融合权重</th><th>百分比</th></tr></thead>
          <tbody>
            <tr v-for="(w, i) in fusionResult.level1.mean.weights" :key="'m'+i">
              <td>{{ level1LabelMap[level1Keys[i]] || level1Keys[i] }}</td>
              <td>{{ w.toFixed(4) }}</td>
              <td>
                <div class="weight-bar-container">
                  <div class="weight-bar" :style="{ width: (w*100) + '%' }"></div>
                </div>
                {{ (w * 100).toFixed(2) }}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="fusionResult.level1.matrix">
        <h4>群决策矩阵法 {{ fusionResult.level1.matrix.optimized ? '(已PSO优化)' : '' }}</h4>
        <table>
          <thead><tr><th>指标</th><th>融合权重</th><th>CR</th><th>百分比</th></tr></thead>
          <tbody>
            <tr v-for="(w, i) in fusionResult.level1.matrix.weights" :key="'g'+i">
              <td>{{ level1LabelMap[level1Keys[i]] || level1Keys[i] }}</td>
              <td>{{ w.toFixed(4) }}</td>
              <td :class="(fusionResult.level1.matrix.CR||0) < 0.1 ? 'text-success' : 'text-danger'">
                {{ (fusionResult.level1.matrix.CR || 0).toFixed(4) }}
              </td>
              <td>{{ (w * 100).toFixed(2) }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useExpertStore } from '@/stores/useExpertStore'
import { performGroupDecision } from '@/services/groupDecisionService'
import { level1IndicatorKeys } from '@/services/mockData'
import { QUALITATIVE_INDICATORS } from '@/utils/constants'

const expertStore = useExpertStore()
const method = ref('both')
const fusionResult = ref(null)

const level1Keys = level1IndicatorKeys
const level1LabelMap = {}
QUALITATIVE_INDICATORS.forEach(item => { level1LabelMap[item.id] = item.name })

function runFusion() {
  fusionResult.value = performGroupDecision(expertStore.selectedExpertIds, method.value)
  expertStore.setFusionMethod(method.value)
  expertStore.setFusionResult(fusionResult.value)
}
</script>

<style scoped>
.radio-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
}
</style>
