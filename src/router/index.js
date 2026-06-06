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
    meta: { title: '系统首页' }
  },
  {
    path: '/enterprise',
    name: 'Enterprise',
    component: () => import('@/views/EnterpriseView.vue'),
    meta: { title: '企业管理' }
  },
  {
    path: '/basic-check/:id?',
    name: 'BasicCheck',
    component: () => import('@/views/BasicCheckView.vue'),
    meta: { title: '基本要求判定' }
  },
  {
    path: '/quantitative/:id?',
    name: 'Quantitative',
    component: () => import('@/views/QuantitativeView.vue'),
    meta: { title: '定量指标计算' }
  },
  {
    path: '/qualitative/:id?',
    name: 'Qualitative',
    component: () => import('@/views/QualitativeView.vue'),
    meta: { title: '定性指标评分' }
  },
  {
    path: '/ahp-weight',
    name: 'AHPWeight',
    component: () => import('@/views/AHPView.vue'),
    meta: { title: 'AHP 权重计算' }
  },
  {
    path: '/pso-optimize',
    name: 'PSOOptimize',
    component: () => import('@/views/PSOView.vue'),
    meta: { title: 'PSO 优化' }
  },
  {
    path: '/group-decision',
    name: 'GroupDecision',
    component: () => import('@/views/GroupDecisionView.vue'),
    meta: { title: '群决策融合' }
  },
  {
    path: '/grading/:id?',
    name: 'Grading',
    component: () => import('@/views/GradingView.vue'),
    meta: { title: '分级结果' }
  },
  {
    path: '/report/:id?',
    name: 'Report',
    component: () => import('@/views/ReportView.vue'),
    meta: { title: '综合报告' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 全局路由守卫：更新页面标题
router.beforeEach((to) => {
  const title = to.meta.title
  if (title) {
    document.title = `${title} - 合成革企业环境绩效分级评价系统 V1.0`
  }
})

export default router
