/**
 * 合成革企业环境绩效分级评价系统 V1.0
 * 应用主入口文件
 *
 * 本系统基于《合成革企业环境管理与排放水平绩效分级政策建议研究报告》
 * 实现对合成革企业的环保绩效分级评价，包括：
 *   - 企业基本要求判定
 *   - 定量指标计算（标准品折算、单位产品废水/VOCs产生量、DMF排放等）
 *   - 定性指标评分（6个一级指标、15个二级指标）
 *   - AHP层次分析法权重计算
 *   - PSO粒子群优化算法修正
 *   - 群决策融合
 *   - 综合分级结果展示
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/styles/main.css'
import './assets/styles/form.css'
import './assets/styles/table.css'
import './assets/styles/badge.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
