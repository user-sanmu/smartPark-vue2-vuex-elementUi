<template>
  <div>
    <el-dialog
      title="添加区域"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <div class="form">
        <el-form
          ref="form"
          label-position="top"
          :model="addForm"
          label-width="80px"
          :rules="rules"
        >
          <el-form-item label="区域名称" prop="areaName">
            <el-input v-model="addForm.areaName"></el-input>
          </el-form-item>
          <el-form-item label="车位数(个)" prop="spaceNumber">
            <el-input v-model="addForm.spaceNumber"></el-input>
          </el-form-item>
          <el-form-item label="面积(㎡)" prop="areaProportion">
            <el-input v-model="addForm.areaProportion"></el-input>
          </el-form-item>
          <el-form-item label="关联计费规则" prop="ruleId">
            <el-select v-model="addForm.ruleId" placeholder="请选择计费规则">
              <el-option
                :label="item.ruleName"
                :value="item.ruleId"
                v-for="item in ruleDropList"
                :key="item.ruleId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              type="textarea"
              autosize
              placeholder="请输入内容"
              v-model="addForm.remark"
            >
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="closeDialog">取 消</el-button>
        <el-button @click="resetForm">重 置</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { addCarAreaApi, editCarAreaApi } from '@/api/cardArea'

export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    ruleDropList: {
      type: Array,
      default: []
    },
    getCarAreaList: {
      type: Function
    }
  },
  data () {
    return {
      addForm: {
        id: null,
        areaName: '',
        spaceNumber: null,
        areaProportion: null,
        ruleId: null,
        remark: ''
      },
      rules: {
        areaName: [
          { required: true, message: '请输入区域名称', trigger: 'blur' }
        ],
        spaceNumber: [
          { required: true, message: '请输入车位个数', trigger: 'blur' }
        ],
        areaProportion: [
          { required: true, message: '请输入区域面积', trigger: 'blur' }
        ],
        ruleId: [
          { required: true, message: '请选择计费规则', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    resetForm () {
      this.$refs.form.resetFields()
    },
    addConfirm () {
      this.$refs.form.validate(async flag => {
        if (!flag) return
        if (this.addForm.id) {
          console.log(111)
          await editCarAreaApi(this.addForm)
          this.$message.success('编辑成功')
        } else {
          delete this.addForm.id
          await addCarAreaApi(this.addForm)
          this.$message.success('添加成功')
        }
        this.closeDialog()
        this.getCarAreaList()
      })
    },
    handleClose () {
      if (this.addForm.id) {
        this.closeDialog()
      } else {
        this.$parent.dialogVisible = false
        this.$refs.form.clearValidate()
      }
    },
    closeDialog () {
      this.$parent.dialogVisible = false
      this.resetForm()
    }
  }
}
</script>

<style lang="scss" scoped>
// .el-dialog {
//   position: absolute;
//   top: 20px;
// }
.el-form {
  width: 500px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  .el-form-item {
    width: 400px;
  }
}
</style>
