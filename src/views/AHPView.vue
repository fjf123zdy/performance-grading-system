<!-- 合成革企业环境绩效分级评价系统 V1.0 — AHP 权重计算页 -->
<template>
  <div class="ahp-page">
    <div class="page-header">
      <h2 class="page-title">AHP 层次分析法 — 权重计算</h2>
      <p class="page-subtitle">基于 Saaty 1-9 标度法构造判断矩阵，和积法求解权重，一致性检验（CR < 0.1）</p>
    </div>

    <!-- 专家选择 -->
    <div class="card">
      <h3 class="card-title">选择专家</h3>
      <div class="flex gap-sm flex-wrap">
        <button v-for="exp in expertStore.experts" :key="exp.id"
          class="btn btn-sm"
          :class="selectedExpert === exp.id ? 'btn-primary' : 'btn-outline'"
          @click="selectExpert(exp.id)"
        >
          {{ exp.name }} ({{ exp.affiliation }})
        </button>
      </div>
    </div>

    <!-- AHP 计算结果 -->
    <div v-if="ahpResult" class="card">
      <h3 class="card-title">一级指标权重 (6×6 判断矩阵)</h3>

      <!-- 判断矩阵 -->
      <div class="table-container mb-md">
        <table class="matrix-table">
          <thead>
            <tr><th></th><th v-for="(k, i) in level1Keys" :key="i">{{ i+1 }}</th></tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in ahpResult.level1.matrix" :key="i">
              <th>{{ i+1 }}</th>
              <td v-for="(val, j) in row" :key="j"
                :class="{ diagonal: i === j }">
                {{ val.toFixed(3) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 权重结果 -->
      <h4 class="mb-sm">权重向量</h4>
      <table>
        <thead><tr><th>指标名称</th><th>权重</th><th>百分比</th></tr></thead>
        <tbody>
          <tr v-for="(w, i) in ahpResult.level1.weights" :key="i">
            <td>{{ level1LabelMap[level1Keys[i]] || level1Keys[i] }}</td>
            <td>{{ w.toFixed(4) }}</td>
            <td>
              <div class="weight-bar-container">
                <div class="weight-bar" :style="{ width: (w * 100) + '%' }"></div>
              </div>
              {{ (w * 100).toFixed(2) }}%
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 一致性检验 -->
      <div class="mt-md card" :style="{ background: ahpResult.level1.pass ? '#eafaf1' : '#fdedec' }">
        <strong>一致性检验：</strong>
        λmax = {{ ahpResult.level1.lambdaMax.toFixed(4) }}，
        CI = {{ ahpResult.level1.CI.toFixed(4) }}，
        RI = {{ ahpResult.level1.RI }}，
        CR = {{ ahpResult.level1.CR.toFixed(4) }}
        <span :class="ahpResult.level1.pass ? 'text-success' : 'text-danger'">
          {{ ahpResult.level1.pass ? ' ✓ 通过 (CR < 0.1)' : ' ✗ 不通过 (CR ≥ 0.1，需PSO优化)' }}
        </span>
      </div>
    </div>

    <!-- 操作 -->
    <div class="form-actions" v-if="ahpResult">
      <button class="btn btn-outline" @click="selectExpert('')">重新选择</button>
      <router-link v-if="!ahpResult.level1.pass" to="/pso-optimize" class="btn btn-warning">
        PSO 优化修正 →
      </router-link>
      <router-link to="/group-decision" class="btn btn-primary">群决策融合 →</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useExpertStore } from '@/stores/useExpertStore'
import { analyzeExpertAll } from '@/services/ahpService'
import { level1IndicatorKeys } from '@/services/mockData'
import { QUALITATIVE_INDICATORS } from '@/utils/constants'

const expertStore = useExpertStore()
const selectedExpert = ref('')
const ahpResult = ref(null)

const level1Keys = level1IndicatorKeys
const level1LabelMap = {}
QUALITATIVE_INDICATORS.forEach(item => { level1LabelMap[item.id] = item.name })

function selectExpert(id) {
  selectedExpert.value = id
  if (id) {
    ahpResult.value = analyzeExpertAll(id)
    expertStore.setAHPResult(id, ahpResult.value)
  } else {
    ahpResult.value = null
  }
}
</script>
