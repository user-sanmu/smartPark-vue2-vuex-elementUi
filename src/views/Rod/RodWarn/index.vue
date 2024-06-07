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
      处置状态：<el-select placeholder="请选择" v-model="params.handleStatus">
        <el-option label="全部" :value="null" />
        <el-option label="未派单" value="0" />
        <el-option label="已派单" value="1" />
        <el-option label="已接单" value="2" />
        <el-option label="已完成" value="3" />
      </el-select>
      <el-button @click="resetRod">重置</el-button>
      <el-button type="primary" @click="searchRod">查询</el-button>
    </div>
    <div class="rod-main">
      <el-table :data="rodWarningList" style="width: 100%">
        <el-table-column
          type="index"
          :index="indexMethod"
          width="100"
          label="序号"
        />
        <el-table-column prop="poleName" label="一体杆名称" />
        <el-table-column prop="poleNumber" label="一体杆编号" />
        <el-table-column prop="errorType" label="故障类型" />
        <el-table-column prop="handleStatus" label="处置状态">
          <template #default="scope">
            {{ statusMap(scope.row.handleStatus) }}
          </template>
        </el-table-column>
        <el-table-column prop="warningTime" label="警告时间"> </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="text" @click="openDrawer(scope.row.id)"
              >详情</el-button
            >
            <el-button
              type="text"
              :disabled="statusMap(scope.row.handleStatus) == 3 ? false : true"
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
    <el-drawer
      title="警告详情"
      :visible.sync="drawer"
      :before-close="handleCloseDrawer"
    >
      <h4>警告详情</h4>
      <el-descriptions border :column="2" class="drawer-label">
        <el-descriptions-item
          label-class-name="label-class"
          label="一体杆名称"
          >{{ rodWarningDetail.poleName }}</el-descriptions-item
        >
        <el-descriptions-item label="警告时间">{{
          rodWarningDetail.warningTime
        }}</el-descriptions-item>
        <el-descriptions-item label="车牌号">{{
          rodWarningDetail.areaName
        }}</el-descriptions-item>
        <el-descriptions-item label="一体杆编号">
          {{ rodWarningDetail.poleNumber }}
        </el-descriptions-item>
        <el-descriptions-item label="故障类型">
          {{ rodWarningDetail.errorType }}
        </el-descriptions-item>
        <el-descriptions-item label="处置状态">
          {{ statusMap(this.rodWarningDetail.handleStatus) }}
        </el-descriptions-item>
      </el-descriptions>
      <h4>警告处理</h4>
      <el-descriptions border :column="2" class="drawer-label">
        <el-descriptions-item label-class-name="label-class" label="处理人">{{
          rodWarningDetail.handleUser
        }}</el-descriptions-item>
        <el-descriptions-item label="联系方式">{{
          rodWarningDetail.phonenumber
        }}</el-descriptions-item>
        <el-descriptions-item label="处理结果">{{
          rodWarningDetail.handleResult
        }}</el-descriptions-item>
        <el-descriptions-item label="完成时间">
          {{ rodWarningDetail.handleTime }}
        </el-descriptions-item>
      </el-descriptions>
    </el-drawer>
  </div>
</template>
<script>
import { getDetailWarningApi, getWarningListApi } from '@/api/rodWarning'

export default {
  name: 'rod-warning',
  data () {
    return {
      params: {
        page: 1,
        pageSize: 5,
        poleName: '',
        poleNumber: '',
        handleStatus: ''
      },
      rodWarningList: [],
      total: null,
      drawer: false,
      rodWarningDetail: {}
    }
  },
  created () {
    this.getWarningRod()
  },
  methods: {
    indexMethod (index) {
      return index + (this.params.page - 1) * this.params.pageSize + 1
    },
    async openDrawer (id) {
      this.drawer = true
      const res = await getDetailWarningApi(id)
      this.rodWarningDetail = res.data
    },
    handleCloseDrawer () {
      this.drawer = false
    },
    resetRod () {
      this.params = {
        page: 1,
        pageSize: 5,
        poleName: '',
        poleNumber: '',
        handleStatus: ''
      }
      this.getWarningRod()
    },
    searchRod () {
      this.params.page = 1
      this.getWarningRod()
    },
    statusMap (status) {
      const Map = {
        0: '未派单',
        1: '已派单',
        2: '已接单',
        3: '已完成'
      }
      return Map[status]
    },
    handleSizeChange (val) {
      this.params.pageSize = val
      this.getWarningRod()
    },
    handleCurrentChange (val) {
      this.params.page = val
      this.getWarningRod()
    },
    async getWarningRod () {
      const res = await getWarningListApi(this.params)
      // console.log(res)
      this.rodWarningList = res.data.rows
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
    .el-button {
      margin-right: 15px;
    }
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
    .el-pagination {
      display: flex;
      justify-content: end;
      margin-top: 20px;
      margin-right: 20px;
    }
  }
  .el-form {
    margin-left: 50px;
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
.drawer-label {
  margin-left: 10px;
}
h4 {
  margin-left: 10px;
  margin-top: 30px;
}
</style>
