<!--
  合成革企业环境绩效分级评价系统 V1.0
  顶部状态栏组件
-->
<template>
  <header class="app-header">
    <div class="header-left">
      <h1 class="header-title">合成革企业环境绩效分级评价系统</h1>
    </div>
    <div class="header-right">
      <div class="header-info" v-if="currentEnterprise">
        <span class="info-label">当前企业：</span>
        <span class="info-value">{{ currentEnterprise.name }}</span>
      </div>
      <div class="header-info" v-if="evaluationStore.currentStep > 0">
        <span class="info-label">评价进度：</span>
        <span class="info-value">步骤 {{ evaluationStore.currentStep }} / 7</span>
      </div>
      <div class="header-time">{{ currentTime }}</div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useEnterpriseStore } from '@/stores/useEnterpriseStore'
import { useEvaluationStore } from '@/stores/useEvaluationStore'

const enterpriseStore = useEnterpriseStore()
const evaluationStore = useEvaluationStore()

const currentEnterprise = computed(() => enterpriseStore.currentEnterprise)

const currentTime = ref('')
let timer = null

function updateTime() {
  const now = new Date()
  currentTime.value = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  right: 0;
  left: var(--sidebar-width);
  height: var(--header-height);
  background: var(--header-bg);
  box-shadow: var(--header-shadow);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-lg);
  z-index: 90;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-title {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--color-text-primary);
  letter-spacing: 1px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.header-info {
  display: flex;
  align-items: center;
  font-size: var(--font-size-sm);
}

.info-label {
  color: var(--color-text-secondary);
  margin-right: var(--spacing-xs);
}

.info-value {
  color: var(--color-primary);
  font-weight: 500;
}

.header-time {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  font-family: 'SF Mono', Monaco, Consolas, monospace;
}
</style>
