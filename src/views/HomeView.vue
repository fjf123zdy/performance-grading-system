<!-- 合成革企业环境绩效分级评价系统 V1.0 — 首页 -->
<template>
  <div class="home">
    <div class="hero">
      <h1 class="hero-title">🌿 合成革企业环境绩效分级评价系统</h1>
      <p class="hero-subtitle">基于《合成革企业环境管理与排放水平绩效分级政策建议研究报告》，建立科学量化的企业环保绩效分级评价体系，实现精准治污、差异管控。</p>
      <div class="hero-actions">
        <router-link to="/enterprise" class="btn btn-primary btn-lg">开始评价</router-link>
        <router-link to="/ahp-weight" class="btn btn-outline btn-lg">权重分析</router-link>
      </div>
    </div>

    <div class="feature-grid grid-3">
      <div class="card feature-card">
        <div class="feature-icon">📋</div>
        <h3>企业管理</h3>
        <p>管理合成革企业基本信息，维护5家模拟企业数据</p>
      </div>
      <div class="card feature-card">
        <div class="feature-icon">📊</div>
        <h3>定量指标</h3>
        <p>标准品折算、废水/VOCs产生量、DMF排放浓度等指标计算</p>
      </div>
      <div class="card feature-card">
        <div class="feature-icon">📝</div>
        <h3>定性指标</h3>
        <p>6个一级指标、15个二级指标的综合评分体系</p>
      </div>
      <div class="card feature-card">
        <div class="feature-icon">⚖️</div>
        <h3>AHP 权重</h3>
        <p>层次分析法计算指标权重，判断矩阵一致性检验</p>
      </div>
      <div class="card feature-card">
        <div class="feature-icon">🔧</div>
        <h3>PSO 优化</h3>
        <p>粒子群优化算法修正不一致的专家打分矩阵</p>
      </div>
      <div class="card feature-card">
        <div class="feature-icon">🏆</div>
        <h3>分级结果</h3>
        <p>三级分类（引领级/先进级/基础级）+ 管控措施建议</p>
      </div>
    </div>

    <div class="card quick-start">
      <h3>🚀 快速开始</h3>
      <div class="steps">
        <div class="quick-step"><span class="step-num">1</span> 进入"企业管理"选择一家模拟企业</div>
        <div class="quick-step"><span class="step-num">2</span> 依次完成基本判定 → 定量指标 → 定性评分</div>
        <div class="quick-step"><span class="step-num">3</span> 在 AHP/PSO/群决策 模块确定指标权重</div>
        <div class="quick-step"><span class="step-num">4</span> 查看分级结果与管控措施建议</div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 首页为纯展示页面，无额外逻辑
</script>

<style scoped>
.hero {
  text-align: center;
  padding: var(--spacing-xl) var(--spacing-lg);
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  border-radius: var(--radius-lg);
  color: #ffffff;
  margin-bottom: var(--spacing-xl);
}

.hero-title {
  font-size: var(--font-size-title);
  font-weight: 700;
  margin-bottom: var(--spacing-md);
}

.hero-subtitle {
  font-size: var(--font-size-md);
  opacity: 0.9;
  max-width: 800px;
  margin: 0 auto var(--spacing-lg);
  line-height: 1.8;
}

.hero-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
}

.hero-actions .btn-outline {
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.6);
}

.hero-actions .btn-outline:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

.feature-grid {
  margin-bottom: var(--spacing-xl);
}

.feature-card {
  text-align: center;
  padding: var(--spacing-xl);
  cursor: default;
}

.feature-icon {
  font-size: 36px;
  margin-bottom: var(--spacing-sm);
}

.feature-card h3 {
  font-size: var(--font-size-md);
  margin-bottom: var(--spacing-sm);
  color: var(--color-primary);
}

.feature-card p {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.quick-start {
  padding: var(--spacing-xl);
}

.quick-start h3 {
  margin-bottom: var(--spacing-lg);
  font-size: var(--font-size-lg);
}

.steps {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.quick-step {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  font-size: var(--font-size-base);
  color: var(--color-text-regular);
}

.step-num {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-primary-light);
  color: #ffffff;
  font-weight: 600;
  font-size: var(--font-size-base);
  flex-shrink: 0;
}
</style>
