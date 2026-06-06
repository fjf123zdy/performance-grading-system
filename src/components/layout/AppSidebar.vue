<!--
  合成革企业环境绩效分级评价系统 V1.0
  左侧边栏导航组件
-->
<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="sidebar-logo">
        <span class="logo-icon">🌿</span>
        <span class="logo-text">绩效分级评价</span>
      </div>
      <div class="sidebar-version">V1.0</div>
    </div>

    <nav class="sidebar-nav">
      <div class="nav-section">
        <div class="nav-section-title">企业评价</div>
        <router-link to="/enterprise" class="nav-item" active-class="nav-item-active">
          <span class="nav-icon">📋</span>
          <span>企业管理</span>
        </router-link>
        <router-link to="/basic-check" class="nav-item" active-class="nav-item-active">
          <span class="nav-icon">✅</span>
          <span>基本要求判定</span>
        </router-link>
        <router-link to="/quantitative" class="nav-item" active-class="nav-item-active">
          <span class="nav-icon">📊</span>
          <span>定量指标计算</span>
        </router-link>
        <router-link to="/qualitative" class="nav-item" active-class="nav-item-active">
          <span class="nav-icon">📝</span>
          <span>定性指标评分</span>
        </router-link>
      </div>

      <div class="nav-section">
        <div class="nav-section-title">权重分析</div>
        <router-link to="/ahp-weight" class="nav-item" active-class="nav-item-active">
          <span class="nav-icon">⚖️</span>
          <span>AHP 权重计算</span>
        </router-link>
        <router-link to="/pso-optimize" class="nav-item" active-class="nav-item-active">
          <span class="nav-icon">🔧</span>
          <span>PSO 优化</span>
        </router-link>
        <router-link to="/group-decision" class="nav-item" active-class="nav-item-active">
          <span class="nav-icon">👥</span>
          <span>群决策融合</span>
        </router-link>
      </div>

      <div class="nav-section">
        <div class="nav-section-title">评价结果</div>
        <router-link to="/grading" class="nav-item" active-class="nav-item-active">
          <span class="nav-icon">🏆</span>
          <span>分级结果</span>
        </router-link>
        <router-link to="/report" class="nav-item" active-class="nav-item-active">
          <span class="nav-icon">📄</span>
          <span>综合报告</span>
        </router-link>
      </div>
    </nav>

    <div class="sidebar-footer">
      <router-link to="/" class="nav-item" active-class="nav-item-active">
        <span class="nav-icon">🏠</span>
        <span>系统首页</span>
      </router-link>
    </div>
  </aside>
</template>

<script setup>
// 侧边栏为纯展示组件，无需额外逻辑
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: var(--sidebar-width);
  height: 100vh;
  background: var(--sidebar-bg);
  display: flex;
  flex-direction: column;
  z-index: 100;
  overflow-y: auto;
}

.sidebar-header {
  padding: var(--spacing-lg) var(--spacing-md);
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.sidebar-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.logo-icon {
  font-size: 24px;
}

.logo-text {
  color: #ffffff;
  font-size: var(--font-size-md);
  font-weight: 600;
  letter-spacing: 1px;
}

.sidebar-version {
  color: rgba(255, 255, 255, 0.4);
  font-size: var(--font-size-xs);
  margin-top: var(--spacing-xs);
}

.sidebar-nav {
  flex: 1;
  padding: var(--spacing-md) 0;
  overflow-y: auto;
}

.nav-section {
  margin-bottom: var(--spacing-sm);
}

.nav-section-title {
  padding: var(--spacing-sm) var(--spacing-lg);
  color: rgba(255, 255, 255, 0.35);
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 10px var(--spacing-lg);
  color: var(--sidebar-text);
  font-size: var(--font-size-base);
  transition: all var(--transition-fast);
  border-left: 3px solid transparent;
  text-decoration: none;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
}

.nav-item-active {
  background: rgba(64, 158, 255, 0.15);
  color: var(--sidebar-active);
  border-left-color: var(--sidebar-active);
  font-weight: 500;
}

.nav-icon {
  margin-right: var(--spacing-sm);
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.sidebar-footer {
  padding: var(--spacing-sm) 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
</style>
