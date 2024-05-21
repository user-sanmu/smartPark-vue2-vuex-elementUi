<template>
  <div class="card-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">车牌号码：</span>
      <el-input
        v-model="params.carNumber"
        clearable
        placeholder="请输入内容"
        class="search-main"
      />
      <span class="search-label">车主姓名：</span>
      <el-input
        v-model="params.personName"
        clearable
        placeholder="请输入内容"
        class="search-main"
      />
      <span class="search-label">状态：</span>
      <el-select v-model="params.cardStatus">
        <el-option
          v-for="item in statusList"
          :key="item.value"
          :label="item.text"
          :value="item.value"
        />
      </el-select>
      <el-button type="primary" class="search-btn" @click="search"
        >查询</el-button
      >
    </div>
    <!-- 新增删除操作区域 -->
    <div class="create-container">
      <el-button type="primary" @click="$router.push('/Car/addCard')"
        >添加月卡</el-button
      >
      <el-button @click="batchDelCard">批量删除</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table
        style="width: 100%"
        :data="list"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" :index="indexMethod" />
        <el-table-column label="车主名称" prop="personName" />
        <el-table-column label="联系方式" prop="phoneNumber" />
        <el-table-column label="车牌号码" prop="carNumber" />
        <el-table-column label="车辆品牌" prop="carBrand" />
        <el-table-column label="剩余有效天数" prop="totalEffectiveDate" />
        <el-table-column
          label="状态"
          prop="cardStatus"
          :formatter="formatter"
        />
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="scope">
            <el-button size="mini" type="text" @click="renewCard(scope.row.id)"
              >续费</el-button
            >
            <el-button size="mini" type="text" @click="checkCard(scope.row.id)"
              >查看</el-button
            >
            <el-button size="mini" type="text" @click="editCard(scope.row.id)"
              >编辑</el-button
            >
            <el-button size="mini" type="text" @click="delCard(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-drawer title="月卡详情" :visible.sync="drawer" :direction="direction">
        <el-descriptions
          title="用户信息"
          border
          :column="2"
          class="drawer-label"
        >
          <el-descriptions-item label-class-name="label-class" label="姓名">{{
            this.checkCardList.personName
          }}</el-descriptions-item>
          <el-descriptions-item label="联系方式">{{
            this.checkCardList.phoneNumber
          }}</el-descriptions-item>
          <el-descriptions-item label="车牌号">{{
            this.checkCardList.carNumber
          }}</el-descriptions-item>
          <el-descriptions-item label="车辆品牌">
            {{ this.checkCardList.carBrand }}
          </el-descriptions-item>
        </el-descriptions>
        <h4>月卡缴费记录</h4>
        <el-descriptions
          class="card-record drawer-label"
          border
          :column="1"
          v-for="item in checkCardList.rechargeList"
          :key="item.rechargeId"
        >
          <el-descriptions-item label="办理人">{{
            item.createUser
          }}</el-descriptions-item>
          <el-descriptions-item label="办理时间">{{
            item.createTime
          }}</el-descriptions-item>
          <el-descriptions-item label="有效时间"
            >{{ item.cardStartDate }} 至
            {{ item.cardEndDate }}</el-descriptions-item
          >
          <el-descriptions-item label="支付方式">
            {{ item.paymentMethod }}
          </el-descriptions-item>
          <el-descriptions-item label="实付金额"
            >{{ item.paymentAmount }} 元</el-descriptions-item
          >
        </el-descriptions>
      </el-drawer>
    </div>
    <div class="page-container">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.page"
        :page-sizes="[3, 5, 7, 10]"
        :page-size="params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </div>
    <!-- 添加楼宇 -->
    <el-dialog title="添加楼宇" width="580px">
      <!-- 表单接口 -->
      <div class="form-container">
        <!-- <el-form ref="addForm" :model="addForm" :rules="addFormRules">
          <el-form-item label="楼宇名称" prop="name">
            <el-input v-model="addForm.name" />
          </el-form-item>
          <el-form-item label="楼宇层数" prop="floors">
            <el-input v-model="addForm.floors" />
          </el-form-item>
          <el-form-item label="在管面积" prop="area">
            <el-input v-model="addForm.area" />
          </el-form-item>
          <el-form-item label="物业费" prop="propertyFeePrice">
            <el-input v-model="addForm.propertyFeePrice" />
          </el-form-item>
        </el-form> -->
      </div>
      <template #footer>
        <el-button size="mini">取 消</el-button>
        <el-button size="mini" type="primary">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { checkCardApi, delCardApi, getCardListApi } from '@/api/card'
export default {
  data () {
    return {
      params: {
        page: 1,
        pageSize: 3,
        carNumber: '',
        personName: '',
        cardStatus: null
      },
      list: [],
      total: null,
      statusList: [
        { text: '全部', value: null },
        { text: '可用', value: '0' },
        { text: '已过期', value: '1' }
      ],
      selectionVal: [],
      drawer: false,
      direction: 'rtl',
      checkCardList: []
    }
  },
  created () {
    this.getCardList()
  },
  methods: {
    async getCardList () {
      const res = await getCardListApi(this.params)
      this.list = res.data.rows
      this.total = res.data.total
      // console.log(res)
    },
    formatter (row, column, cellValue, index) {
      // if (cellValue) {
      //   return '不可用'
      // } else {
      //   return '可用'
      // }
      const status = {
        0: '可用',
        1: '不可用'
      }
      return status[cellValue]
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.params.pageSize = val
      this.getCardList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.params.page = val
      this.getCardList()
    },
    indexMethod (index) {
      return index + (this.params.page - 1) * this.params.pageSize + 1
    },
    search () {
      this.params.page = 1
      this.getCardList()
    },
    editCard (id) {
      // console.log(id)
      this.$router.push({
        path: '/Car/addCard',
        query: {
          id
        }
      })
    },
    delCard (id) {
      this.$confirm('请确认删除', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await delCardApi(id)
          this.$message.success('删除成功')
          if (this.list.length === 1 && this.params.page > 1) {
            this.params.page--
          }
          this.getCardList()
        })
        .catch(() => this.$message.info('已取消'))
    },
    handleSelectionChange (val) {
      console.log(val)
      this.selectionVal = val
    },
    batchDelCard () {
      if (!this.selectionVal.length) {
        this.$message.warning('请先选择要删除的数据')
        return
      }
      const ids = this.selectionVal.map(item => item.id)
      this.$confirm('请确认删除', '')
        .then(async () => {
          await delCardApi(ids.join(','))
          this.$message.success('删除成功')
          // if (this.list.length === 1 && this.params.page > 1) {
          //   this.params.page--
          // }
          this.getCardList()
        })
        .catch(() => {})
    },
    async checkCard (id) {
      this.drawer = true
      const { data } = await checkCardApi(id)
      console.log(data)
      this.checkCardList = data
    },
    renewCard (id) {
      this.$router.push({
        path: '/Car/renewCard',
        query: {
          id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.card-container {
  padding: 20px;
  background-color: #fff;
  h4 {
    margin-left: 10px;
    margin-top: 30px;
  }
}

.drawer-label {
  margin-left: 10px;
}

.card-record {
  margin-top: 40px;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, 0.9);
  padding-bottom: 20px;
  .search-main {
    width: 220px;
    margin-right: 10px;
  }
  .search-btn {
    margin-left: 20px;
  }
}
.create-container {
  margin: 10px 0px;
}
.page-container {
  padding: 4px 0px;
  text-align: right;
}
.form-container {
  padding: 0px 80px;
}
</style>
