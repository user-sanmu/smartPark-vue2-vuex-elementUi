<template>
  <div class="rod">
    <div class="rod-top">
      一体杆名称：<el-input
        placeholder="请输入内容"
        v-model="params.poleName"
      />
      一体杆编号：<el-input
        placeholder="请输入内容"
        v-model="params.poleNumber"
      />
      运行状态：<el-select placeholder="请选择" v-model="params.poleStatus">
        <el-option label="全部" :value="null"> </el-option>
        <el-option label="正常" value="1"> </el-option>
        <el-option label="异常" value="0"> </el-option>
      </el-select>
      <el-button @click="resetRod">重置</el-button>
      <el-button type="primary" @click="searchRod">查询</el-button>
    </div>
    <div class="rod-main">
      <div class="btn">
        <el-button type="primary" @click="openDialog">添加一体杆</el-button>
        <el-button @click="delRods">批量删除</el-button>
      </div>
      <el-table
        :data="rodList"
        style="width: 100%"
        ref="table"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" width="100" label="序号" />
        <el-table-column prop="poleName" label="一体杆名称" />
        <el-table-column prop="poleNumber" label="一体杆编号" />
        <el-table-column prop="poleIp" label="一体杆IP" />
        <el-table-column prop="areaName" label="安装区域" />
        <el-table-column prop="poleType" label="一体杆类型">
          <template #default="scope">{{
            statusMap(scope.row.poleType)
          }}</template>
        </el-table-column>
        <el-table-column prop="poleStatus" label="运行状态">
          <template #default="scope">
            {{ statusMap(scope.row.poleStatus) }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="text" @click="editRod(scope.row)">编辑</el-button>
            <el-button type="text" @click="delRod(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 10, 20, 40]"
        :page-size="100"
        layout="total, sizes, prev, pager, next"
        :total="total"
        background
      >
      </el-pagination>
    </div>
    <el-dialog
      :title="rodForm.id ? '编辑一体杆' : '添加一体杆'"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <template>
        <div class="form">
          <el-form
            :model="rodForm"
            :rules="rules"
            ref="rodForm"
            label-width="100px"
            label-position="left"
          >
            <el-form-item label="一体杆名称" prop="poleName">
              <el-input v-model="rodForm.poleName" />
            </el-form-item>
            <el-form-item label="一体杆编号" prop="poleNumber">
              <el-input v-model="rodForm.poleNumber" />
            </el-form-item>
            <el-form-item label="一体杆IP" prop="poleIp">
              <el-input v-model="rodForm.poleIp" />
            </el-form-item>
            <el-form-item label="关联区域" prop="areaId">
              <el-select placeholder="请选择" v-model="rodForm.areaId">
                <el-option
                  v-for="item in areaDropList"
                  :key="item.areaId"
                  :label="item.areaName"
                  :value="item.areaId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="一体杆类型" prop="poleType">
              <el-select placeholder="请选择" v-model="rodForm.poleType">
                <el-option label="入口" value="entrance"> </el-option>
                <el-option label="出口" value="export"> </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button @click="resetForm">重 置</el-button>
        <el-button type="primary" @click="addRod">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  addRodApi,
  delRodApi,
  editRodApi,
  getAndSearchRodApi,
  getAreaDropListApi
} from '@/api/rodManage'

export default {
  name: 'rod-manage',
  data () {
    return {
      params: {
        page: 1,
        pageSize: 5,
        poleName: '',
        poleNumber: '',
        poleStatus: ''
      },
      rodList: [],
      total: null,
      dialogVisible: false,
      rodForm: {
        poleName: '',
        poleNumber: '',
        poleIp: '',
        areaId: '',
        poleType: ''
      },
      rules: {
        poleName: [
          { required: true, message: '请输入一体杆名称', trigger: 'blur' }
        ],
        poleNumber: [
          { required: true, message: '请输入一体杆编号', trigger: 'blur' }
        ],
        poleIp: [
          { required: true, message: '请输入一体杆IP', trigger: 'blur' }
        ],
        areaId: [
          { required: true, message: '请选择关联区域', trigger: 'change' }
        ],
        poleType: [
          { required: true, message: '请选择一体杆类型', trigger: 'change' }
        ]
      },
      areaDropList: [],
      checkArr: []
    }
  },
  created () {
    this.getAndSearchRod()
  },
  methods: {
    delRod (id) {
      this.$confirm('请确认删除一体杆', '')
        .then(async () => {
          await delRodApi(id)
          this.$message.success('删除成功')
          this.getAndSearchRod()
        })
        .catch(() => this.$message.info('已取消'))
    },
    delRods () {
      this.$confirm('请确认删除所选一体杆', '')
        .then(async () => {
          // console.log(this.checkArr.join(','))
          await delRodApi(this.checkArr.join(','))
          this.$message.success('删除成功')
          this.getAndSearchRod()
        })
        .catch(() => this.$message.info('已取消'))
    },
    handleSelectionChange (val) {
      console.log(val)
      this.checkArr = []
      val.forEach(item => (this.checkArr[this.checkArr.length] = item.id))
    },
    editRod (row) {
      console.log(row)
      const { id, areaId, poleIp, poleName, poleNumber, poleType } = row
      this.rodForm = {
        id,
        areaId,
        poleIp,
        poleName,
        poleNumber,
        poleType
      }
      this.openDialog()
    },
    addRod () {
      this.$refs.rodForm.validate(async flag => {
        if (!flag) return
        if (this.rodForm.id) {
          await editRodApi(this.rodForm)
          this.$message.success('编辑成功')
        } else {
          await addRodApi(this.rodForm)
          this.$message.success('添加成功')
        }
        this.closeDialog()
        this.getAndSearchRod()
      })
    },
    resetForm () {
      this.$refs.rodForm.resetFields()
    },
    async openDialog () {
      this.dialogVisible = true
      const res = await getAreaDropListApi()
      // console.log(res)
      this.areaDropList = res.data
    },
    closeDialog () {
      this.dialogVisible = false
      if (this.rodForm.id) {
        delete this.rodForm.id
      }
      this.resetForm()
    },
    handleClose () {
      this.dialogVisible = false
      delete this.rodForm.id
    },
    resetRod () {
      this.params = {
        page: 1,
        pageSize: 5,
        poleName: '',
        poleNumber: '',
        poleStatus: ''
      }
      this.getAndSearchRod()
    },
    searchRod () {
      this.params.page = 1
      this.getAndSearchRod()
    },
    statusMap (status) {
      const Map = {
        entrance: '入口',
        export: '出口',
        0: '异常',
        1: '正常'
      }
      return Map[status]
    },
    handleSizeChange (val) {
      this.params.pageSize = val
      this.getAndSearchRod()
    },
    handleCurrentChange (val) {
      this.params.page = val
      this.getAndSearchRod()
    },
    async getAndSearchRod () {
      const res = await getAndSearchRodApi(this.params)
      // console.log(res)
      this.rodList = res.data.rows
      this.total = res.data.total
    }
  }
}
</script>
<style lang="scss" scoped>
.rod {
  .rod-top {
    display: flex;
    align-items: center;
    font-size: 14px;
    border-bottom: 1px solid rgb(237, 237, 237, 0.9);
    padding-bottom: 20px;
  }
  .el-input {
    width: 250px;
    margin-right: 20px;
  }
  .el-select {
    margin-right: 20px;
  }
  .rod-main {
    margin-top: 20px;
    .btn {
      margin-bottom: 20px;
      .el-button {
        margin-right: 15px;
      }
    }
    .el-pagination {
      display: flex;
      justify-content: end;
      margin-top: 20px;
      margin-right: 20px;
    }
  }
}
.form {
  margin-left: 50px;
}
.dialog-footer {
  .el-button {
    margin-right: 10px;
  }
}
</style>
