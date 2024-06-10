<script>
import { getEnterPriseListApi, getRentBuildingApi } from '@/api/park'
import { getWorkbenchData } from '@/api/workbench'
import addBill from '@/views/Workbench/components/addBill'
import * as echarts from 'echarts'
export default {
  data () {
    return {
      workbenchData: {},
      dialogVisible: false,
      params: {
        page: 1,
        pageSize: 100
      },
      companyList: [],
      buildingList: [],
      pageData: {
        page: 1,
        pageSize: 10
      },
      total: 0,
      loading: false
    }
  },
  created () {
    this.getWorkbenchData()
  },
  components: {
    addBill
  },
  methods: {
    getMyChart () {
      const myChart = echarts.init(this.$refs.echarts)
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          show: true,
          data: ['物业费', '行车收入'],
          right: '0',
          orient: 'vertical'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: this.workbenchData.annualIncomeArray.xmonth.map(
              (item, index) => {
                return (item = `${index + 1}月`)
              }
            ),
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '物业费',
            type: 'bar',
            barWidth: '40%',
            stack: 'total',
            itemStyle: {
              color: '#5876FC'
            },
            data: this.workbenchData.annualIncomeArray.ybuilding
          },
          {
            name: '行车收入',
            type: 'bar',
            stack: 'total',
            barWidth: '40%',
            itemStyle: {
              color: '#CDE4FF'
            },
            data: this.workbenchData.annualIncomeArray.yparking
          }
        ]
      })
    },
    async openDialog () {
      this.$refs.addbill.dialogVisible = true
      const res1 = await getEnterPriseListApi(this.params)
      this.companyList = res1.data.rows
      const res2 = await getRentBuildingApi()
      this.buildingList = res2.data
    },
    async getWorkbenchData () {
      const res = await getWorkbenchData()
      console.log(res)
      this.workbenchData = res.data
      this.$nextTick(() => {
        this.getMyChart()
      })
    },
    handleSizeChange (val) {
      this.pageData.pageSize = val
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 500)
    },
    handleCurrentChange (val) {
      this.pageData.page = val
    }
  }
}
</script>

<template>
  <div class="databoard-container">
    <!-- <svg-icon icon-class="workbench"></svg-icon> -->
    <div class="park-data">
      <h3>园区数据</h3>
      <ul class="data">
        <li>
          <p>年度累计收入</p>
          <p class="number">{{ workbenchData.annualIncome }}</p>
        </li>
        <li>
          <p>入驻企业总数（个）</p>
          <p class="number">{{ workbenchData.enterpriseTotal }}</p>
        </li>
        <li>
          <p>月卡车辆总数（辆）</p>
          <p class="number">{{ workbenchData.monthCardTotal }}</p>
        </li>
        <li>
          <p>一体杆总数（台）</p>
          <p class="number">{{ workbenchData.chargePoleTotal }}</p>
        </li>
      </ul>
    </div>
    <div class="quick-entry">
      <h3>快捷入口</h3>
      <ul>
        <li @click="$router.push('/addCompany')">
          <img src="@/assets/add-enterprise.png" alt="" />
          <p>添加企业</p>
        </li>
        <li @click="$router.push('sys/user')">
          <img src="@/assets/employee-manage.png" alt="" />
          <p>员工管理</p>
        </li>
        <li @click="openDialog">
          <img src="@/assets/add-bill.png" alt="" />
          <p>添加账单</p>
        </li>
        <li>
          <img src="@/assets/data-screen.png" alt="" />
          <p>数据大屏</p>
        </li>
      </ul>
    </div>
    <div class="echarts">
      <h3>年收入统计</h3>
      <div class="echarts-box" ref="echarts"></div>
    </div>
    <div class="equipment-warning">
      <h3>设备警告派单</h3>
      <el-empty description="空空如也"></el-empty>
      <el-button type="primary" round @click="$router.push('/pole/warning')"
        >更多<span class="el-icon-arrow-right"></span
      ></el-button>
    </div>
    <div class="contract">
      <h3>临期合同提醒</h3>
      <el-table :data="[]" style="width: 100%" v-loading="loading">
        <el-table-column type="index" label="序号" width="200" />
        <el-table-column prop="date" label="企业名称" />
        <el-table-column prop="name" label="租赁楼宇" />
        <el-table-column prop="address" label="操作" />
        <template #empty>
          <el-empty description="空空如也"></el-empty>
        </template>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 40]"
        layout="total, sizes, prev, pager, next"
        :total="total"
      >
      </el-pagination>
    </div>
    <add-bill
      ref="addbill"
      :companyList="companyList"
      :buildingList="buildingList"
    />
  </div>
</template>

<style scoped lang="scss">
.databoard-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  ul {
    display: flex;
    justify-content: space-between;
    margin: 0;
    padding: 0;
    li {
      list-style: none;
      .number {
        font-size: 18px;
        font-weight: 600;
        text-align: center;
      }
      img {
        width: 50px;
        height: 50px;
      }
    }
  }
  > * {
    margin-bottom: 20px;
  }
  .park-data,
  .quick-entry,
  .echarts,
  .equipment-warning,
  .contract {
    background-color: #f4f6f8;
    border-radius: 10px;
    padding-left: 10px;
    &.park-data {
      width: 1000px;
      height: 150px;
    }
    &.quick-entry {
      width: 539px;
      height: 150px;
      ul {
        justify-content: space-around;
        li {
          text-align: center;
        }
        li:hover {
          cursor: pointer;
        }
      }
      p {
        margin-top: 5px;
      }
    }
    &.echarts {
      width: 1000px;
      height: 420px;
      .echarts-box {
        width: 980px;
        height: 350px;
      }
    }
    &.equipment-warning {
      width: 539px;
      height: 420px;
      text-align: center;
      h3 {
        text-align: left;
      }
      .el-button {
        width: 300px;
      }
    }
    &.contract {
      width: 1000px;
      height: 380px;
      padding-right: 10px;
      .el-table {
        border-radius: 10px;
      }
      .el-table__empty-block {
        display: none;
      }
      .el-pagination {
        display: flex;
        justify-content: end;
        margin-right: 10px;
        margin-top: 20px;
      }
    }
  }
}
</style>
