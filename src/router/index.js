/**
 * 合成革企业环境绩效分级评价系统 V1.0
 * 路由配置文件
 * 使用 Hash 模式，支持 file:// 协议直接打开（构建后）
 */
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: '系统首页', step: 0 }
  },
  {
    path: '/enterprise',
    name: 'Enterprise',
    component: () => import('@/views/EnterpriseView.vue'),
    meta: { title: '企业管理', step: 1 }
  },
  {
    path: '/basic-check/:id?',
    name: 'BasicCheck',
    component: () => import('@/views/BasicCheckView.vue'),
    meta: { title: '基本要求判定', step: 2 }
  },
  {
    path: '/quantitative/:id?',
    name: 'Quantitative',
    component: () => import('@/views/QuantitativeView.vue'),
    meta: { title: '定量指标计算', step: 3 }
  },
  {
    path: '/qualitative/:id?',
    name: 'Qualitative',
    component: () => import('@/views/QualitativeView.vue'),
    meta: { title: '定性指标评分', step: 4 }
  },
  {
    path: '/ahp-weight',
    name: 'AHPWeight',
    component: () => import('@/views/AHPView.vue'),
    meta: { title: 'AHP 权重计算', step: 5 }
  },
  {
    path: '/pso-optimize',
    name: 'PSOOptimize',
    component: () => import('@/views/PSOView.vue'),
    meta: { title: 'PSO 优化', step: 5 }
  },
  {
    path: '/group-decision',
    name: 'GroupDecision',
    component: () => import('@/views/GroupDecisionView.vue'),
    meta: { title: '群决策融合', step: 6 }
  },
  {
    path: '/grading/:id?',
    name: 'Grading',
    component: () => import('@/views/GradingView.vue'),
    meta: { title: '分级结果', step: 7 }
  },
  {
    path: '/report/:id?',
    name: 'Report',
    component: () => import('@/views/ReportView.vue'),
    meta: { title: '综合报告', step: 7 }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 全局路由守卫：更新页面标题和评价进度
router.beforeEach((to) => {
  const title = to.meta.title
  if (title) {
    document.title = `${title} - 合成革企业环境绩效分级评价系统 V1.0`
  }
})

// 导航完成后更新评价步骤进度
router.afterEach((to) => {
  const step = to.meta.step
  if (typeof step === 'number' && step > 0) {
    // 延迟导入 store，避免循环依赖
    import('@/stores/useEvaluationStore').then(module => {
      const store = module.useEvaluationStore()
      store.setStep(step)
    })
  }
})

export default router
