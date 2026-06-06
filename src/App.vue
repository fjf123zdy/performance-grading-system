<!--
  合成革企业环境绩效分级评价系统 V1.0
  根组件 — 全局布局框架
  布局结构：左侧边栏导航 + 右侧（顶部状态栏 + 主内容区）
-->
<template>
  <div class="app-container">
    <AppSidebar />
    <div class="main-content">
      <AppHeader />
      <div class="page-container">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
</script>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  margin-left: var(--sidebar-width);
  padding-top: var(--header-height);
  min-height: 100vh;
  background: var(--color-bg);
}

.page-container {
  padding: var(--spacing-lg);
  max-width: 1400px;
  margin: 0 auto;
}
</style>
