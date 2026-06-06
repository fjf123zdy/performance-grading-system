<!--
  合成革企业环境绩效分级评价系统 V1.0
  评价流程步骤指示器组件
-->
<template>
  <div class="step-indicator">
    <template v-for="(step, index) in steps" :key="step.key">
      <div
        class="step-item"
        :class="{
          active: currentStep === index + 1,
          completed: currentStep > index + 1
        }"
        @click="$emit('stepClick', index + 1)"
      >
        <span class="step-number">
          <template v-if="currentStep > index + 1">✓</template>
          <template v-else>{{ index + 1 }}</template>
        </span>
        <span class="step-label">{{ step.label }}</span>
      </div>
      <span v-if="index < steps.length - 1" class="step-divider"></span>
    </template>
  </div>
</template>

<script setup>
defineProps({
  currentStep: {
    type: Number,
    default: 1
  }
})

defineEmits(['stepClick'])

const steps = [
  { key: 'enterprise', label: '选择企业' },
  { key: 'basicCheck', label: '基本判定' },
  { key: 'quantitative', label: '定量指标' },
  { key: 'qualitative', label: '定性指标' },
  { key: 'weight', label: '权重分析' },
  { key: 'decision', label: '群决策' },
  { key: 'result', label: '分级结果' }
]
</script>
