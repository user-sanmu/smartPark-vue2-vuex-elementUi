<template>
  <div>
    <div class="car-pay">
      车牌号码：<el-input v-model="params.carNumber" placeholder="请输入内容" />
      缴纳状态：
      <el-select v-model="params.paymentStatus" placeholder="请选择">
        <el-option label="全部" :value="null"> </el-option>
        <el-option label="未缴纳" value="0"> </el-option>
        <el-option label="已缴纳" value="1"> </el-option>
      </el-select>
      <el-button @click="reset">重置</el-button>
      <el-button type="primary" @click="getCarPayList()">查询</el-button>
    </div>
    <el-table :data="carPayData" style="width: 100%">
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column prop="carNumber" label="车牌号" width="180" />
      <el-table-column
        prop="chargeType"
        label="收费类型"
        :formatter="formatter"
      >
      </el-table-column>
      <el-table-column prop="parkingTime" label="停车时长"> </el-table-column>
      <el-table-column prop="actualCharge" label="停车费用(元)" />
      <el-table-column
        prop="paymentStatus"
        label="缴纳状态"
        :formatter="formatter"
      />
      <el-table-column
        prop="paymentMethod"
        label="缴费方式"
        :formatter="formatter"
      >
      </el-table-column>
      <el-table-column prop="paymentTime" label="缴费时间"> </el-table-column>
    </el-table>
    <el-pagination
      layout="total, sizes, prev, pager, next"
      :total="total"
      :page-sizes="[5, 10, 20, 40]"
      :page-size="params.pageSize"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
    />
  </div>
</template>
<script>
import { getCarPayListApi } from '@/api/carPay'

export default {
  data () {
    return {
      params: {
        page: 1,
        pageSize: 5,
        carNumber: null,
        paymentStatus: null
      },
      carPayData: [],
      total: null
    }
  },
  created () {
    this.getCarPayList()
  },
  methods: {
    handleCurrentChange (val) {
      this.params.page = val
      this.getCarPayList()
    },
    handleSizeChange (val) {
      this.params.pageSize = val
      this.getCarPayList()
    },
    reset () {
      this.params = {
        page: 1,
        pageSize: 10,
        carNumber: null,
        paymentStatus: null
      }
      this.getCarPayList()
    },
    formatter (row, column, cellValue, index) {
      const map = {
        card: '月卡',
        temp: '临时停车',
        Alipay: '支付宝',
        WeChat: '微信',
        Cash: '现金',
        null: '--',
        0: '未缴纳',
        1: '已缴纳'
      }
      // console.log(cellValue)
      return map[cellValue]
    },
    async getCarPayList () {
      const res = await getCarPayListApi(this.params)
      // console.log(res)
      this.carPayData = res.data.rows
      this.total = res.data.total
    }
  }
}
</script>
<style lang="scss" scoped>
.car-pay {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, 0.9);
  padding-bottom: 20px;
  font-size: 14px;
  .el-input {
    width: 220px;
    margin-left: 10px;
    margin-right: 30px;
    border-radius: 10px;
  }
  .el-select {
    margin-right: 30px;
  }
}
.el-pagination {
  display: flex;
  justify-content: end;
  margin-top: 20px;
  margin-right: 20px;
}
</style>
