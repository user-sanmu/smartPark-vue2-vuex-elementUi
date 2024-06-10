<template>
  <div class="propety">
    <div class="propety-top">
      企业名称：<el-input
        v-model="params.enterpriseName"
        placeholder="请输入内容"
      />
      缴费时间：<el-date-picker
        v-model="params.date"
        type="daterange"
        range-separator="→"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
      />
      <el-button type="primary" @click="getBillDataList">查询</el-button>
    </div>
    <div class="propety-main">
      <el-button type="primary" @click="openDialog">添加账单</el-button>
      <el-table :data="billData" style="width: 100%">
        <el-table-column type="index" label="序号" align="center" width="100" />
        <el-table-column prop="billNumber" label="账单编号" align="center" />
        <el-table-column
          prop="enterpriseName"
          label="企业名称"
          align="center"
          width="200"
        />
        <el-table-column
          prop="buildingName"
          label="租赁楼宇"
          align="center"
          width="180"
        />
        <el-table-column
          prop="propertyFeePrice"
          label="物业费(元/m²)"
          align="center"
          width="150"
        />
        <el-table-column
          prop="paymentAmount"
          label="账单金额(元)"
          align="center"
          width="150"
        />
        <el-table-column label="缴费时间" align="center" width="250"
          ><template #default="scope"
            >{{ scope.row.startTime }} - {{ scope.row.endTime }}</template
          ></el-table-column
        >
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button type="text" @click="openDrawer(scope.row.id)"
              >查看</el-button
            >
            <el-button type="text" @click="delBill(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 10, 20, 30, 40]"
        :page-size="params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </div>
    <el-drawer
      title="详细信息"
      :visible.sync="drawer"
      :before-close="handleClose"
    >
      <template>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="租户名称">
            {{ billDetailData.enterpriseName }}
          </el-descriptions-item>
          <el-descriptions-item label="租户id">
            {{ billDetailData.enterpriseId }}
          </el-descriptions-item>
          <el-descriptions-item label="账单编号">
            {{ billDetailData.billNumber }}
          </el-descriptions-item>
          <el-descriptions-item label="租赁楼宇">
            {{ billDetailData.buildingName }}
          </el-descriptions-item>
          <el-descriptions-item label="缴费周期">
            {{ billDetailData.startTime }} 至 {{ billDetailData.endTime }}
          </el-descriptions-item>
          <el-descriptions-item label="物业费(元/m²)">
            {{ billDetailData.propertyFeePrice }}
          </el-descriptions-item>
          <el-descriptions-item label="账单金额(元)">
            {{ billDetailData.paymentAmount }}
          </el-descriptions-item>
          <el-descriptions-item label="支付方式">
            <el-tag :type="payStatus">{{
              billDetailData.paymentMethodValue
            }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="缴费时间">
            {{ billDetailData.createTime }}
          </el-descriptions-item>
        </el-descriptions>
      </template>
    </el-drawer>
    <add-bill
      ref="addbill"
      :companyList="companyList"
      :buildingList="buildingList"
    />
  </div>
</template>

<script>
import addBill from '@/views/Workbench/components/addBill'
import { getEnterPriseListApi, getRentBuildingApi } from '@/api/park'
import { delBillApi, getBillDataApi, getBillDetailApi } from '@/api/propety'
export default {
  name: 'propety',
  data () {
    return {
      params: {
        page: 1,
        pageSize: 5,
        enterpriseName: '',
        date: [],
        start: '',
        end: ''
      },
      billData: [],
      total: 0,
      EnterPriseParams: {
        page: 1,
        pageSize: 100
      },
      buildingList: [],
      companyList: [],
      drawer: false,
      billDetailData: {}
    }
  },
  components: {
    addBill
  },
  created () {
    this.getBillDataList()
  },
  methods: {
    delBill (id) {
      this.$confirm('请确认删除', '删除')
        .then(async () => {
          await delBillApi(id)
          this.$message.success('删除成功')
          this.getBillDataList()
        })
        .catch(() => this.$message.info('已取消'))
    },
    async openDrawer (id) {
      this.drawer = true
      const res = await getBillDetailApi(id)
      this.billDetailData = res.data
    },
    handleClose () {
      this.drawer = false
    },
    async openDialog () {
      this.$refs.addbill.dialogVisible = true
      const res1 = await getEnterPriseListApi(this.EnterPriseParams)
      this.companyList = res1.data.rows
      const res2 = await getRentBuildingApi()
      this.buildingList = res2.data
    },
    handleCurrentChange (val) {
      this.params.page = val
      this.getBillDataList()
    },
    handleSizeChange (val) {
      this.params.pageSize = val
      this.getBillDataList()
    },
    async getBillDataList () {
      if (this.params.date instanceof Array) {
        if (this.params.date.length === 2) {
          this.params.start = this.params.date[0]
          this.params.end = this.params.date[1]
        }
      }
      delete this.params.date
      this.params.page = 1
      const res = await getBillDataApi(this.params)
      // console.log(res)
      this.billData = res.data.rows
      this.total = res.data.total
    }
  },
  computed: {
    payStatus () {
      switch (this.billDetailData.paymentMethodValue) {
        case '微信':
          return 'success'
        case '支付宝':
          return 'primary'
        case '现金':
          return 'warning'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.propety {
  .propety-top {
    display: flex;
    align-items: center;
    font-size: 14px;
    border-bottom: 1px solid rgb(237, 237, 237, 0.9);
    padding-bottom: 20px;
    > * {
      margin-right: 20px;
    }
  }
  .propety-main {
    .el-button {
      margin: 20px 0;
    }
    ::v-deep .el-table th {
      background-color: #f4f6f8;
    }
    .el-table {
      .el-button {
        margin: 0 5px;
      }
    }
    .el-pagination {
      text-align: right;
      margin: 20px;
    }
  }
  .el-input {
    width: 250px;
  }
  .el-drawer {
    .el-descriptions {
      margin-left: 10px;
    }
  }
}
</style>
