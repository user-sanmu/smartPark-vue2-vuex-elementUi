<template>
  <div class="employee-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">员工姓名：</div>
      <el-input
        clearable
        placeholder="请输入内容"
        v-model="params.name"
        class="search-main"
      />
      <el-button @click="resetList">重置</el-button>
      <el-button type="primary" @click="getEmployeeList">查询</el-button>
    </div>
    <div class="create-container">
      <el-button type="primary" @click="openDialog">添加员工</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="employeeList">
        <el-table-column
          type="index"
          label="序号"
          width="120"
          :index="indexMethod"
        />
        <el-table-column label="员工姓名" prop="name" />
        <el-table-column label="登录账号" prop="userName" />
        <el-table-column label="联系方式" prop="phonenumber" />
        <el-table-column label="角色" prop="roleName" />
        <el-table-column label="状态" width="120">
          <template #default="scope">
            {{ scope.row.status === 1 ? '启用' : '未启用' }}
          </template>
        </el-table-column>
        <el-table-column label="添加时间" prop="createTime" />
        <el-table-column label="操作" fixed="right">
          <template #default="scope">
            <el-button size="mini" type="text" @click="editEmployee(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="delEmployee(scope.row.id)"
              >删除</el-button
            >
            <el-button size="mini" type="text" @click="resetPwd(scope.row.id)"
              >重置密码</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[3, 5, 10, 20, 30]"
        layout="total, prev, pager, next, sizes"
        :page-size="params.pageSize"
        :total="total"
        background
      />
    </div>
    <!-- 添加员工 -->
    <el-dialog
      :title="this.addForm.id ? '编辑员工' : '添加员工'"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <template>
        <el-form
          :model="addForm"
          :rules="rules"
          ref="addForm"
          label-width="100px"
        >
          <el-form-item label="员工姓名" prop="name">
            <el-input v-model="addForm.name" />
          </el-form-item>
          <el-form-item label="登录账号" prop="userName">
            <el-input v-model="addForm.userName" />
          </el-form-item>
          <el-form-item label="联系方式" prop="phonenumber">
            <el-input v-model="addForm.phonenumber" />
          </el-form-item>
          <el-form-item label="默认密码" required>
            <el-input v-model="password" disabled />
          </el-form-item>
          <el-form-item label="分配角色" prop="roleId">
            <el-select v-model="addForm.roleId" placeholder="请选择">
              <el-option
                v-for="item in roleList"
                :label="item.roleName"
                :value="item.roleId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="员工状态" prop="status">
            <el-radio-group v-model="addForm.status">
              <el-radio :label="0">禁用</el-radio>
              <el-radio :label="1">启用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button @click="resetForm" plain type="primary">重 置</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  addEmployeeApi,
  delEmployeeApi,
  editEmployeeApi,
  getEmployeeListApi,
  resetPwdApi
} from '@/api/systemEmployee'
import { getRoleListApi } from '@/api/systemRole'

export default {
  name: 'Employee',
  data () {
    return {
      employeeList: [],
      params: {
        name: '',
        page: 1,
        pageSize: 3
      },
      total: 0,
      dialogVisible: false,
      password: '123456',
      addForm: {
        name: '',
        userName: '',
        roleId: null,
        status: 2,
        phonenumber: ''
      },
      rules: {
        name: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
        userName: [
          { required: true, message: '请输入登录账号', trigger: 'blur' }
        ],
        phonenumber: [
          { required: true, message: '请输入联系方式', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        roleId: [
          { required: true, message: '请选择分配角色', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择员工状态', trigger: 'change' }
        ]
      },
      roleList: []
    }
  },
  created () {
    this.getEmployeeList()
  },
  methods: {
    resetPwd (id) {
      this.$confirm('请确认重置密码为123456', '重置密码')
        .then(async () => {
          await resetPwdApi({ id })
          this.$message.success('重置成功')
          this.getEmployeeList()
        })
        .catch(() => this.$message.info('已取消'))
    },
    delEmployee (id) {
      this.$confirm('请确认删除', '删除')
        .then(async () => {
          await delEmployeeApi(id)
          this.$message.success('删除成功')
          this.getEmployeeList()
        })
        .catch(() => this.$message.info('已取消'))
    },
    editEmployee (row) {
      console.log(row)
      const { name, userName, roleId, status, phonenumber, id } = row
      this.addForm = {
        id,
        name,
        userName,
        roleId,
        status,
        phonenumber
      }
      this.openDialog()
    },
    addConfirm () {
      this.$refs.addForm.validate(async flag => {
        if (!flag) return
        if (this.addForm.id) {
          await editEmployeeApi(this.addForm)
          this.$message.success('编辑成功')
        } else {
          await addEmployeeApi(this.addForm)
          this.$message.success('添加成功')
        }
        this.closeDialog()
        this.resetForm()
        this.getEmployeeList()
      })
    },
    resetForm () {
      this.addForm = {
        name: '',
        userName: '',
        roleId: null,
        status: 2,
        phonenumber: ''
      }
      this.$refs.addForm.resetFields()
    },
    async openDialog () {
      this.dialogVisible = true
      const res = await getRoleListApi()
      // console.log(res)
      this.roleList = res.data
    },
    closeDialog () {
      this.dialogVisible = false
      // this.$refs.addForm.clearValidate()
    },
    handleClose () {
      if (this.addForm.id) {
        delete this.addForm.id
        this.resetForm()
      }
      this.closeDialog()
    },
    indexMethod (index) {
      return index + (this.params.page - 1) * this.params.pageSize + 1
    },
    resetList () {
      this.params.name = ''
      this.getEmployeeList()
    },
    handleCurrentChange (val) {
      this.params.page = val
      this.getEmployeeList()
    },
    handleSizeChange (val) {
      this.params.pageSize = val
      this.getEmployeeList()
    },
    async getEmployeeList () {
      const res = await getEmployeeListApi(this.params)
      // console.log(res)
      this.employeeList = res.data.rows
      this.total = res.data.total
    }
  }
}
</script>

<style lang="scss" scoped>
.employee-container {
  padding: 10px;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, 0.9);
  padding-bottom: 20px;

  .search-label {
    width: 100px;
  }

  .search-main {
    width: 220px;
    margin-right: 10px;
  }
}
.create-container {
  margin: 10px 0px;
}
.page-container {
  margin-top: 20px;
  margin-right: 20px;
  text-align: right;
}
.form-container {
  padding: 0px 80px;
}
.el-form {
  margin-left: 50px;
}
.el-input,
.el-select {
  width: 300px;
}
.dialog-footer {
  .el-button {
    margin-right: 10px;
  }
}
</style>
