<template>
  <el-dialog
    :visible="dialogVisible"
    width="680px"
    title="新增规则"
    @close="closeDialog"
    top="20px"
  >
    <!-- 表单接口 -->
    <div class="form-container">
      <el-form
        ref="addForm"
        :model="addForm"
        :rules="addFormRules"
        label-position="top"
      >
        <el-form-item label="计费规则编号" prop="ruleNumber">
          <el-input v-model="addForm.ruleNumber" />
        </el-form-item>
        <el-form-item label="计费规则名称" prop="ruleName">
          <el-input v-model="addForm.ruleName" />
        </el-form-item>
        <el-form-item label="计费方式" prop="chargeType">
          <el-radio-group v-model="addForm.chargeType" size="small">
            <el-radio label="duration" border>时长收费</el-radio>
            <el-radio label="turn" border>按次收费</el-radio>
            <el-radio label="partition" border>分段收费</el-radio>
          </el-radio-group>
        </el-form-item>
        <div>
          <el-form-item label="免费时长">
            <el-input v-model="addForm.freeDuration" />
          </el-form-item>
          <el-form-item label="收费上限">
            <el-input v-model="addForm.chargeCeiling" />
          </el-form-item>
        </div>
        <el-form-item label="计费规则" required>
          <!-- 按时长收费区域 -->

          <div style="display: flex" v-if="addForm.chargeType === 'duration'">
            每
            <el-form-item prop="durationTime">
              <el-input
                v-model="addForm.durationTime"
                style="width: 100px; margin: 0 20px"
              />
            </el-form-item>
            小时
            <el-form-item prop="durationPrice"
              ><el-input v-model="addForm.durationPrice" style="width: 100px;
              margin: 0 20px"" /></el-form-item
            >
            元
          </div>
          <!-- <el-form-item></el-form-item> -->
          <!-- 按次收费区域 -->
          <div style="display: flex" v-if="addForm.chargeType === 'turn'">
            每次
            <el-form-item prop="turnPrice"
              ><el-input
                v-model="addForm.turnPrice"
                style="width: 100px; margin: 0 20px"
            /></el-form-item>
            元
          </div>
          <!-- 按分段收费区域 -->
          <div class="partition" v-if="addForm.chargeType === 'partition'">
            <div class="item" style="display: flex; margin-bottom: 20px">
              <el-form-item prop="partitionFrameTime">
                <el-input
                  v-model="addForm.partitionFrameTime"
                  style="width: 100px; margin-right: 20px"
                />
              </el-form-item>
              小时内,每小时收
              <el-form-item prop="partitionFramePrice"
                ><el-input
                  v-model="addForm.partitionFramePrice"
                  style="width: 100px; margin: 0 20px"
              /></el-form-item>
              元
            </div>
            <div class="item" style="display: flex">
              每增加
              <el-form-item prop="partitionIncreaseTime"
                ><el-input
                  v-model="addForm.partitionIncreaseTime"
                  style="width: 100px; margin: 0 20px"
              /></el-form-item>
              小时,增加
              <el-form-item prop="partitionIncreasePrice"
                ><el-input
                  v-model="addForm.partitionIncreasePrice"
                  style="width: 100px; margin: 0 20px"
              /></el-form-item>

              元
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button size="mini" @click="closeDialog">取 消</el-button>
      <el-button size="mini" type="primary" @click="addconfirm"
        >确 定</el-button
      >
    </template>
  </el-dialog>
</template>

<script>
import { addRuleApi, editRuleApi } from '@/api/carRule'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      addForm: {
        ruleNumber: '', // 计费规则编号
        ruleName: '', // 计费规则名称
        chargeType: 'duration', // 计费规则类型 duration / turn / partition
        chargeCeiling: null,
        freeDuration: null,
        // 时长计费独有字段
        durationTime: null, // 时长计费单位时间
        durationPrice: null, // 时长计费单位价格
        durationType: 'hour',
        // 按次收费独有字段
        turnPrice: null,
        // 分段计费独有字段
        partitionFrameTime: null, // 段内时间
        partitionFramePrice: null, // 段内费用
        partitionIncreaseTime: null, // 超出时间
        partitionIncreasePrice: null
      },
      addFormRules: {
        ruleNumber: [
          {
            required: true,
            message: '请输入规则编号',
            trigger: 'blur'
          }
        ],
        ruleName: [
          {
            required: true,
            message: '请输入规则名称',
            trigger: 'blur'
          }
        ],
        chargeType: [
          {
            required: true,
            message: '请选择收费类型',
            trigger: 'blur'
          }
        ],
        partitionFrameTime: [
          {
            required: true,
            message: '请选择入段时间',
            trigger: 'blur'
          }
        ],
        partitionFramePrice: [
          {
            required: true,
            message: '请选择入段费用',
            trigger: 'blur'
          }
        ],
        partitionIncreaseTime: [
          {
            required: true,
            message: '请输入超出时间',
            trigger: 'blur'
          }
        ],
        partitionIncreasePrice: [
          {
            required: true,
            message: '请超出金额',
            trigger: 'blur'
          }
        ],
        turnPrice: [
          {
            required: true,
            message: '请输入次数',
            trigger: 'blur'
          }
        ],
        durationPrice: [
          {
            required: true,
            message: '请输入金额',
            trigger: 'blur'
          }
        ],
        durationTime: [
          {
            required: true,
            message: '请输入时间',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    addconfirm () {
      this.$refs.addForm.validate(async flag => {
        if (!flag) return
        if (this.addForm.id) {
          await editRuleApi(this.addForm)
          this.$message.success('编辑成功')
        } else {
          await addRuleApi(this.addForm)
          this.$message.success('添加成功')
        }
        this.closeDialog()
        this.$parent.getRuleList()
      })
    },
    closeDialog () {
      this.$emit('update:dialogVisible', false)
      this.addForm = {
        ruleNumber: '', // 计费规则编号
        ruleName: '', // 计费规则名称
        chargeType: 'duration', // 计费规则类型 duration / turn / partition
        chargeCeiling: null,
        freeDuration: null,
        // 时长计费独有字段
        durationTime: null, // 时长计费单位时间
        durationPrice: null, // 时长计费单位价格
        durationType: 'hour',
        // 按次收费独有字段
        turnPrice: null,
        // 分段计费独有字段
        partitionFrameTime: null, // 段内时间
        partitionFramePrice: null, // 段内费用
        partitionIncreaseTime: null, // 超出时间
        partitionIncreasePrice: null
      }
      this.$refs.addForm.resetFields()
    }
  },
  watch: {
    'addForm.chargeType' (newVal) {
      // console.log(newVal)
      if (newVal === 'turn') {
        this.$refs.addForm.clearValidate([
          'durationTime',
          'durationPrice',
          'partitionFrameTime',
          'partitionFramePrice',
          'partitionIncreaseTime',
          'partitionIncreasePrice'
        ])
      }
      if (newVal === 'duration') {
        this.$refs.addForm.clearValidate([
          'turnPrice',
          'partitionFrameTime',
          'partitionFramePrice',
          'partitionIncreaseTime',
          'partitionIncreasePrice'
        ])
      }
      if (newVal === 'partition') {
        this.$refs.addForm.clearValidate([
          'durationTime',
          'durationPrice',
          'turnPrice'
        ])
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.form-container {
  padding: 0px 80px;
}
</style>
