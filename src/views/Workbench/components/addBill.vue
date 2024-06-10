<template>
  <div>
    <el-dialog
      title="添加账单"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <template>
        <el-form
          ref="addForm"
          :rules="rules"
          :model="addForm"
          label-width="80px"
        >
          <el-form-item label="选择租户" prop="enterpriseId">
            <el-select v-model="addForm.enterpriseId" placeholder="请选择租户">
              <el-option
                v-for="item in companyList"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="租赁楼宇" prop="buildingId">
            <el-select
              v-model="addForm.buildingId"
              placeholder="请选择租赁楼宇"
              @change="computeFees"
            >
              <el-option
                v-for="item in buildingList"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="缴费周期" prop="timeArr">
            <el-date-picker
              v-model="addForm.timeArr"
              type="daterange"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd"
              @change="computeFees"
              class="date"
            />
          </el-form-item>
          <el-form-item label="支付金额" prop="paymentAmount">
            <el-input
              v-model="addForm.paymentAmount"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="支付方式" prop="paymentMethod">
            <el-select
              v-model="addForm.paymentMethod"
              placeholder="请选择缴费方式"
            >
              <el-option label="微信" value="1"></el-option>
              <el-option label="支付宝" value="2"></el-option>
              <el-option label="现金" value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button @click="resetForm">重 置</el-button>
        <el-button type="primary" @click="addconfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addBillApi, computeFeesApi } from '@/api/workbench'
export default {
  name: 'add-bill',
  props: {
    companyList: Array,
    buildingList: Array
  },
  data () {
    return {
      dialogVisible: false,
      addForm: {
        enterpriseId: '',
        buildingId: '',
        startTime: '',
        endTime: '',
        timeArr: [],
        paymentAmount: '',
        paymentMethod: ''
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      computeForm: {},
      rules: {
        enterpriseId: [
          { required: true, message: '请选择租户', trigger: 'change' }
        ],
        buildingId: [
          { required: true, message: '请选择租赁楼宇', trigger: 'change' }
        ],
        timeArr: [
          {
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }
        ],
        paymentAmount: [
          { required: true, message: '请填写支付金额', trigger: 'blur' }
        ],
        paymentMethod: [
          { required: true, message: '请选择支付方式', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    resetForm () {
      this.$refs.addForm.resetFields()
      this.addForm.timeArr = []
    },
    async computeFees () {
      if (this.addForm.timeArr.length !== 2) return
      if (!this.addForm.buildingId) return
      this.computeForm.startTime = this.addForm.timeArr[0]
      this.computeForm.endTime = this.addForm.timeArr[1]
      this.computeForm.buildingId = this.addForm.buildingId
      const res = await computeFeesApi(this.computeForm)
      // console.log(res)
      this.addForm.paymentAmount = res.data
    },
    addconfirm () {
      this.$refs.addForm.validate(async flag => {
        if (!flag) return
        this.addForm.startTime = this.addForm.timeArr[0]
        this.addForm.endTime = this.addForm.timeArr[1]
        delete this.addForm.timeArr
        await addBillApi(this.addForm)
        this.$message.success('添加成功')
        this.resetForm()
        this.closeDialog()
      })
    },
    handleClose () {
      this.closeDialog()
      this.$refs.addForm.clearValidate()
    },
    closeDialog () {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form {
  margin-left: 50px;
  .el-select,
  .date,
  .el-input {
    width: 310px;
  }
  .el-form-item {
    margin: 35px 0;
  }
}
</style>
