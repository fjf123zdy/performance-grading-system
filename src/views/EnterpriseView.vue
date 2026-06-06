<!-- 合成革企业环境绩效分级评价系统 V1.0 — 企业管理页 -->
<template>
  <div class="enterprise-page">
    <div class="page-header flex-between">
      <div>
        <h2 class="page-title">企业管理</h2>
        <p class="page-subtitle">管理合成革企业基本信息，选择企业进行绩效分级评价（共 {{ enterpriseStore.enterpriseCount }} 家）</p>
      </div>
      <button class="btn btn-primary" @click="showAddModal = true">+ 新增企业</button>
    </div>

    <!-- 企业卡片网格 -->
    <div class="enterprise-grid grid-2">
      <div v-for="ent in enterpriseStore.enterprises" :key="ent.id"
        class="card enterprise-card"
        :class="{ selected: enterpriseStore.currentEnterpriseId === ent.id }"
        @click="selectEnterprise(ent.id)"
      >
        <div class="card-header flex-between">
          <div>
            <h3 class="card-title">{{ ent.name }}</h3>
            <span class="badge" :class="getStatusBadge(ent)">{{ getStatusText(ent) }}</span>
          </div>
          <button class="btn btn-danger btn-sm"
            @click.stop="confirmDelete(ent)"
            title="删除企业"
          >删除</button>
        </div>
        <div class="ent-info">
          <div class="info-row">
            <span class="info-label">所在地：</span>
            <span>{{ ent.province }} {{ ent.city }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">主要产品：</span>
            <span>{{ ent.mainProducts }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">年产能：</span>
            <span>{{ ent.annualCapacity }} 万米/年</span>
          </div>
          <div class="info-row">
            <span class="info-label">员工人数：</span>
            <span>{{ ent.employeeCount }} 人</span>
          </div>
          <div class="info-row" v-if="ent.establishedYear">
            <span class="info-label">成立年份：</span>
            <span>{{ ent.establishedYear }} 年</span>
          </div>
        </div>
        <div class="card-actions">
          <router-link :to="`/basic-check/${ent.id}`" class="btn btn-primary btn-sm">基本判定</router-link>
          <router-link :to="`/quantitative/${ent.id}`" class="btn btn-outline btn-sm">定量指标</router-link>
          <router-link :to="`/qualitative/${ent.id}`" class="btn btn-outline btn-sm">定性指标</router-link>
          <router-link v-if="evaluationStore.isEvaluationComplete(ent.id)"
            :to="`/grading/${ent.id}`" class="btn btn-success btn-sm">查看结果</router-link>
        </div>
      </div>
    </div>

    <!-- 新增企业弹窗 -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3>新增企业</h3>
          <button class="btn btn-sm btn-outline" @click="showAddModal = false">✕</button>
        </div>
        <div class="modal-body">
          <!-- 基本信息 -->
          <div class="form-section">
            <div class="form-section-title">基本信息</div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label required">企业名称</label>
                <input v-model="form.name" class="form-input" placeholder="如：XX合成革有限公司" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label required">省份</label>
                <input v-model="form.province" class="form-input" placeholder="如：浙江省" />
              </div>
              <div class="form-group">
                <label class="form-label required">城市</label>
                <input v-model="form.city" class="form-input" placeholder="如：温州市" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label required">主要产品</label>
                <input v-model="form.mainProducts" class="form-input" placeholder="如：PU合成革、超细纤维合成革" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label required">年产能（万米/年）</label>
                <input v-model.number="form.annualCapacity" type="number" class="form-input" placeholder="如：500" />
              </div>
              <div class="form-group">
                <label class="form-label required">员工人数</label>
                <input v-model.number="form.employeeCount" type="number" class="form-input" placeholder="如：300" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">成立年份</label>
                <input v-model.number="form.establishedYear" type="number" class="form-input" placeholder="如：2010" />
              </div>
              <div class="form-group">
                <label class="form-label">地址</label>
                <input v-model="form.address" class="form-input" placeholder="详细地址" />
              </div>
            </div>
          </div>

          <!-- 评价数据预览 -->
          <div class="form-section">
            <div class="form-section-title">评价数据（将自动生成默认值，可后续调整）</div>
            <div class="card" style="background:#f0f7fb;border:1px dashed var(--color-primary-light)">
              <p class="text-muted" style="font-size:var(--font-size-sm)">
                ✓ 基本要求判定：默认全部通过<br/>
                ✓ 产品折算数据：根据产能自动生成 2 个代表产品<br/>
                ✓ 排放数据：根据产能按行业平均水平估算<br/>
                ✓ 定性评分：默认为行业平均水平（6-7分）
              </p>
            </div>
          </div>

          <div v-if="formError" class="card" style="background:#fdedec;border:1px solid var(--color-danger)">
            <span class="text-danger">{{ formError }}</span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="showAddModal = false">取消</button>
          <button class="btn btn-primary" @click="addEnterprise" :disabled="!isFormValid">确认新增</button>
        </div>
      </div>
    </div>

    <!-- 删除确认弹窗 -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal modal-sm">
        <div class="modal-header">
          <h3>确认删除</h3>
        </div>
        <div class="modal-body">
          <p>确定要删除企业 <strong>{{ deleteTarget?.name }}</strong> 吗？</p>
          <p class="text-muted mt-sm">此操作将同时删除该企业的所有评价记录，不可恢复。</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="showDeleteModal = false">取消</button>
          <button class="btn btn-danger" @click="deleteEnterprise">确认删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useEnterpriseStore } from '@/stores/useEnterpriseStore'
import { useEvaluationStore } from '@/stores/useEvaluationStore'

const enterpriseStore = useEnterpriseStore()
const evaluationStore = useEvaluationStore()

// ---- 新增企业 ----
const showAddModal = ref(false)
const formError = ref('')
const form = reactive({
  name: '',
  province: '',
  city: '',
  address: '',
  mainProducts: '',
  annualCapacity: 500,
  employeeCount: 200,
  establishedYear: new Date().getFullYear() - 5
})

const isFormValid = computed(() => {
  return form.name.trim() && form.province.trim() && form.city.trim()
    && form.mainProducts.trim() && form.annualCapacity > 0 && form.employeeCount > 0
})

/**
 * 根据产能自动生成模拟产品数据
 */
function generateProducts(capacity) {
  const baseOutput = Math.round(capacity * 0.45)
  const secondaryOutput = capacity - baseOutput
  return [
    {
      name: 'PU合成革',
      thickness: 1.0,
      width: 148,
      actualOutput: baseOutput,
      unit: '万m'
    },
    {
      name: '超细纤维合成革',
      thickness: 0.9,
      width: 142,
      actualOutput: secondaryOutput,
      unit: '万m'
    }
  ]
}

/**
 * 根据产能估算排放数据（行业平均水平）
 */
function generateEmission(capacity) {
  // 按每万米产能估算：废水约12t/万m，VOCs约40kg/万m
  return {
    wastewaterVolume: Math.round(capacity * 12),
    rainwaterCollection: Math.round(capacity * 2.5),
    vocsGeneration: Math.round(capacity * 40),
    dmfConcentration: 18.0,
    unorganizedVOC: 4.5,
    codEmission: 65.0,
    ammoniaNitrogen: 6.0
  }
}

/**
 * 生成默认定性指标评分（行业平均水平 6-7 分）
 */
function generateQualitativeScores() {
  return {
    auto_dosing: 6,
    pipeline_transport: 7,
    enclosed_collection: 6,
    spray_tower: 6,
    distillation: 5,
    unorganized_control: 5,
    closed_pipeline: 6,
    inlet_isolation: 6,
    clear_pool_sunny: 6,
    level_display: 5,
    ultrafiltration: 5,
    hazardous_waste: 7,
    general_waste: 6,
    online_water: 7,
    online_gas: 6,
    boundary_monitor: 5
  }
}

function addEnterprise() {
  formError.value = ''

  if (!isFormValid.value) {
    formError.value = '请填写所有必填字段'
    return
  }

  const capacity = form.annualCapacity || 500

  const newEnterprise = {
    name: form.name.trim(),
    province: form.province.trim(),
    city: form.city.trim(),
    address: form.address.trim() || `${form.province.trim()}${form.city.trim()}工业园区`,
    mainProducts: form.mainProducts.trim(),
    annualCapacity: capacity,
    employeeCount: form.employeeCount || 200,
    establishedYear: form.establishedYear || new Date().getFullYear() - 5,
    // 自动生成评价数据
    basicCheck: {
      env_accident: { pass: true, evidence: '合规证明（自动生成）' },
      safety_accident: { pass: true, evidence: '安全生产标准化证书（自动生成）' },
      quality_accident: { pass: true, evidence: '质量体系认证（自动生成）' },
      credit_record: { pass: true, evidence: '信用记录良好（自动生成）' },
      drain_compliance: { pass: true, evidence: '规范化排污口验收文件（自动生成）' }
    },
    products: generateProducts(capacity),
    emission: generateEmission(capacity),
    qualitativeScores: generateQualitativeScores()
  }

  const newId = enterpriseStore.addEnterprise(newEnterprise)
  enterpriseStore.selectEnterprise(newId)

  // 重置表单
  form.name = ''
  form.province = ''
  form.city = ''
  form.address = ''
  form.mainProducts = ''
  form.annualCapacity = 500
  form.employeeCount = 200
  form.establishedYear = new Date().getFullYear() - 5
  showAddModal.value = false
}

// ---- 删除企业 ----
const showDeleteModal = ref(false)
const deleteTarget = ref(null)

function confirmDelete(ent) {
  deleteTarget.value = ent
  showDeleteModal.value = true
}

function deleteEnterprise() {
  if (deleteTarget.value) {
    // 删除评价记录
    const ev = evaluationStore.getEvaluation(deleteTarget.value.id)
    if (ev) {
      delete evaluationStore.evaluations[deleteTarget.value.id]
    }
    // 删除企业
    enterpriseStore.removeEnterprise(deleteTarget.value.id)
    deleteTarget.value = null
    showDeleteModal.value = false
  }
}

// ---- 其他 ----
function selectEnterprise(id) {
  enterpriseStore.selectEnterprise(id)
}

function getStatusText(ent) {
  if (evaluationStore.isEvaluationComplete(ent.id)) {
    const grade = evaluationStore.getEvaluation(ent.id).finalGrade
    return grade?.name || '已评价'
  }
  return '待评价'
}

function getStatusBadge(ent) {
  if (evaluationStore.isEvaluationComplete(ent.id)) {
    const grade = evaluationStore.getEvaluation(ent.id).finalGrade
    if (grade?.level === 1) return 'badge-success'
    if (grade?.level === 2) return 'badge-info'
    if (grade?.level === 3) return 'badge-warning'
    if (grade?.level === 4) return 'badge-danger'
  }
  return 'badge-info'
}
</script>

<style scoped>
.enterprise-card {
  cursor: pointer;
  transition: all var(--transition-normal);
  border: 2px solid transparent;
}

.enterprise-card:hover {
  border-color: var(--color-primary-light);
}

.enterprise-card.selected {
  border-color: var(--color-primary);
  background: #f0f7fb;
}

.ent-info {
  margin-bottom: var(--spacing-md);
}

.info-row {
  display: flex;
  padding: 4px 0;
  font-size: var(--font-size-sm);
}

.info-label {
  color: var(--color-text-secondary);
  min-width: 80px;
}

.card-actions {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border-light);
}

/* 弹窗 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: var(--color-bg-white);
  border-radius: var(--radius-lg);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 700px;
  max-height: 85vh;
  overflow-y: auto;
}

.modal-sm {
  max-width: 420px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border-light);
}

.modal-header h3 {
  font-size: var(--font-size-lg);
  font-weight: 600;
}

.modal-body {
  padding: var(--spacing-lg);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  border-top: 1px solid var(--color-border-light);
}

.form-section {
  margin-bottom: var(--spacing-lg);
}

.form-section-title {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--color-primary-light);
}
</style>
