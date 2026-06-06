<!-- 合成革企业环境绩效分级评价系统 V1.0 — PSO 优化页 -->
<template>
  <div class="pso-page">
    <div class="page-header">
      <h2 class="page-title">PSO 粒子群优化 — 矩阵修正</h2>
      <p class="page-subtitle">对不一致的判断矩阵（CR ≥ 0.1）使用粒子群优化算法进行最小修改修正</p>
    </div>

    <!-- PSO 参数 -->
    <div class="card">
      <h3 class="card-title">PSO 参数配置</h3>
      <div class="grid-3">
        <div class="form-group">
          <label class="form-label">种群规模</label>
          <input type="number" v-model.number="psoParams.populationSize" class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">最大迭代次数</label>
          <input type="number" v-model.number="psoParams.maxIterations" class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">α (CR权重)</label>
          <input type="number" v-model.number="psoParams.alphaCR" step="0.1" min="0" max="1" class="form-input" />
        </div>
      </div>
    </div>

    <!-- 运行 PSO -->
    <div class="card">
      <h3 class="card-title">优化 EXP004 专家的矩阵（该矩阵CR不满足一致性）</h3>
      <button class="btn btn-warning" @click="runPSO" :disabled="running">
        {{ running ? '优化中...' : '运行 PSO 优化' }}
      </button>

      <div v-if="psoResult" class="mt-md">
        <div class="grid-2">
          <div class="card" :style="{background: '#fdedec'}">
            <strong>原始 CR：</strong>{{ psoResult.originalCR.toFixed(4) }}
            <span class="badge badge-danger ml-sm">不通过</span>
          </div>
          <div class="card" :style="{background: psoResult.optimizedCR < 0.1 ? '#eafaf1' : '#fdedec'}">
            <strong>优化后 CR：</strong>{{ psoResult.optimizedCR.toFixed(4) }}
            <span :class="psoResult.optimizedCR < 0.1 ? 'badge badge-success' : 'badge badge-danger'">
              {{ psoResult.optimizedCR < 0.1 ? '通过' : '不通过' }}
            </span>
          </div>
        </div>

        <h4 class="mt-md">优化后的权重向量</h4>
        <table>
          <thead><tr><th>指标</th><th>优化后权重</th><th>百分比</th></tr></thead>
          <tbody>
            <tr v-for="(w, i) in psoResult.optimizedWeights" :key="i">
              <td>指标 {{ i+1 }}</td>
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

        <div class="text-muted mt-sm">
          迭代次数：{{ psoResult.iterations }}，最终适应度：{{ psoResult.gBestFitness.toFixed(6) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { PSO_DEFAULTS } from '@/utils/constants'
import { analyzeMatrix, getExpertMatrices } from '@/services/ahpService'
import { optimizeMatrix } from '@/services/psoService'
import { useExpertStore } from '@/stores/useExpertStore'

const expertStore = useExpertStore()
const psoParams = reactive({ ...PSO_DEFAULTS })
const psoResult = ref(null)
const running = ref(false)

function runPSO() {
  const matrices = getExpertMatrices('EXP004')
  if (!matrices) return

  running.value = true
  // 使用 setTimeout 让 UI 有时间更新
  setTimeout(() => {
    psoResult.value = optimizeMatrix(matrices.level1, psoParams, (iter, fitness) => {
      // 进度回调（简化版本，可在控制台查看）
      if (iter % 20 === 0) {
        console.log(`PSO 迭代 ${iter}: 最优适应度 = ${fitness.toFixed(6)}`)
      }
    })
    expertStore.setPSOResult('EXP004', psoResult.value)
    running.value = false
  }, 100)
}
</script>
