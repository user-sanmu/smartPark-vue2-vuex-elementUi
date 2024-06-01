<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">楼宇名称：</div>
      <el-input
        placeholder="请输入内容"
        v-model="searchBuilding"
        class="search-main"
      />
      <el-button type="primary" @click="sBuildingMethod">查询</el-button>
      <el-button @click="resetBuilding">重置</el-button>
    </div>
    <div class="create-container">
      <el-button type="primary" @click="openDialog">添加楼宇</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table :data="buildingData" style="width: 100%">
        <el-table-column type="index" :index="indexMethod" label="序号" />
        <el-table-column label="楼宇名称" width="180" prop="name" />
        <el-table-column label="层数" prop="floors" />
        <el-table-column label="在管面积(m²)" prop="area" width="120" />
        <el-table-column
          label="物业费(元/m²)"
          prop="propertyFeePrice"
          width="120"
        />
        <el-table-column label="状态" prop="status">
          <template #default="scope">
            {{ formatStatus(scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              size="mini"
              type="text"
              @click="editBuilding(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="delBuilding(scope.row.id)"
              :disabled="scope.row.status ? true : false"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table-page">
      <el-pagination
        class="page"
        background
        layout="total, sizes, prev, pager, next"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="params.pageSize"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
    <el-dialog
      :title="id ? '编辑楼宇' : '添加楼宇'"
      :visible.sync="dialogVisible"
      width="500px"
      @close="handleClose"
    >
      <el-form
        ref="form"
        :model="BuildingForm"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item label="楼宇名称" prop="name">
          <el-input v-model="BuildingForm.name"> </el-input>
        </el-form-item>
        <el-form-item label="楼宇层数" prop="floors">
          <el-input v-model="BuildingForm.floors"></el-input>
        </el-form-item>
        <el-form-item label="在管面积" prop="area">
          <el-input v-model="BuildingForm.area">
            <template slot="append">m²</template>
          </el-input>
        </el-form-item>
        <el-form-item label="物业费" prop="propertyFeePrice">
          <el-input v-model="BuildingForm.propertyFeePrice">
            <template slot="append">元 / m²</template>
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeDialog">取 消</el-button>
        <el-button @click="resetForm">重 置</el-button>
        <el-button type="primary" @click="addForm">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  addBuildingApi,
  delBuildingApi,
  editBuildingApi,
  getBuildingListApi,
  getBuildingdetail
} from '@/api/building'

export default {
  name: 'Building',
  data () {
    return {
      searchBuilding: '',
      params: {
        page: 1,
        pageSize: 3
      },
      total: null,
      buildingData: [],
      dialogVisible: false,
      BuildingForm: {
        name: '',
        floors: null,
        area: null,
        propertyFeePrice: null
      },
      id: null,
      rules: {
        name: [{ required: true, message: '请输入楼宇名称', trigger: 'blur' }],
        floors: [
          { required: true, message: '请输入楼宇层数', trigger: 'blur' }
        ],
        area: [{ required: true, message: '请输入楼宇面积', trigger: 'blur' }],
        propertyFeePrice: [
          { required: true, message: '请输入楼宇物业费', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getBuildingList()
  },
  methods: {
    delBuilding (id) {
      this.$confirm('请确认删除操作', '删除')
        .then(async () => {
          await delBuildingApi(id)
          // console.log(res)
          this.$message.success('删除成功')
          this.getBuildingList()
        })
        .catch(() => this.$message.info('已取消'))
    },
    async editBuilding (id) {
      this.openDialog()
      this.id = id
      await getBuildingdetail(id)
      // console.log(res)
      const { area, floors, name, propertyFeePrice } = res.data
      this.BuildingForm = { area, floors, name, propertyFeePrice }
    },
    resetForm () {
      this.$refs.form.resetFields()
    },
    addForm () {
      this.$refs.form.validate(async flag => {
        if (!flag) return
        // console.log('success')
        if (!this.id) {
          await addBuildingApi(this.BuildingForm)
          // console.log(res)
          this.$message.success('添加成功')
        } else {
          console.log(111)
          this.BuildingForm.id = this.id
          await editBuildingApi(this.BuildingForm)
          // console.log(res)
          this.$message.success('编辑成功')
          delete this.BuildingForm.id
          this.resetForm()
        }
        this.closeDialog()
        this.resetForm()
        this.getBuildingList()
      })
    },
    handleClose () {
      this.closeDialog()
      this.id = null
    },
    closeDialog () {
      this.dialogVisible = false
      this.$refs.form.clearValidate()
      if (this.id) {
        this.resetForm()
      }
    },
    openDialog () {
      this.dialogVisible = true
    },
    formatStatus (status) {
      return status ? '租赁中' : '空置中'
    },
    resetBuilding () {
      this.params.page = 1
      this.params.pageSize = 3
      this.searchBuilding = this.params.name = ''
      this.getBuildingList()
    },
    sBuildingMethod () {
      this.params.name = this.searchBuilding
      this.params.page = 1
      this.getBuildingList()
    },
    handleCurrentChange (val) {
      this.params.page = val
      this.getBuildingList()
    },
    handleSizeChange (val) {
      this.params.pageSize = val
      this.getBuildingList()
    },
    indexMethod (index) {
      return index + (this.params.page - 1) * this.params.pageSize + 1
    },
    async getBuildingList () {
      const res = await getBuildingListApi(this.params)
      // console.log(res)
      this.buildingData = res.data.rows
      this.total = res.data.total
    }
  }
}
</script>

<style lang="scss" scoped>
.department-container {
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
.el-dialog {
  border-radius: 10px;
  .el-input {
    width: 350px;
    margin: 10px 0;
  }
}
.create-container {
  margin: 15px 0;
}
.table-page {
  display: flex;
  justify-content: end;
  .page {
    margin-top: 20px;
    margin-right: 20px;
  }
}
</style>
