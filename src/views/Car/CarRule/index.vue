<template>
  <div class="rule-container">
    <div class="create-container">
      <el-button type="primary" @click="addFeeRule">增加停车计费规则</el-button>
      <el-button @click="exportExcel">导出Excel</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table :data="ruleList" style="width: 100%">
        <el-table-column type="index" label="序号" :index="indexMethod" />
        <el-table-column label="计费规则编号" prop="ruleNumber" />
        <el-table-column label="计费规则名称" prop="ruleName" />
        <el-table-column label="免费时长(分钟)" prop="freeDuration" />
        <el-table-column label="收费上限(元)" prop="chargeCeiling" />
        <el-table-column label="计费方式">
          <template #default="scope">
            {{ formateChargeType(scope.row.chargeType) }}
          </template>
        </el-table-column>
        <el-table-column label="计费规则" prop="ruleNameView" />
        <el-table-column label="操作" fixed="right" width="120">
          <template #default="scope">
            <el-button size="mini" type="text">编辑</el-button>
            <el-button size="mini" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pager">
        <el-pagination
          layout="sizes, prev, pager, next"
          :total="total"
          background
          :page-sizes="[2, 5, 10, 20]"
          :page-size="params.pageSize"
          @current-change="handleChange"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 弹框 -->
    <addRule :dialogVisible.sync="dialogVisible" />
  </div>
</template>

<script>
import { getRuleListApi } from '@/api/carRule'
import { utils, writeFileXLSX } from 'xlsx'
import addRule from './components/addRule.vue'
export default {
  name: 'Building',
  components: {
    addRule
  },
  data () {
    return {
      ruleList: [],
      params: {
        page: 1,
        pageSize: 2
      },
      total: 0,
      dialogVisible: false
    }
  },
  methods: {
    addFeeRule () {
      this.dialogVisible = true
    },
    formateChargeType (chargeType) {
      const Map = {
        duration: '时长收费',
        turn: '按次收费',
        partition: '分段收费'
      }
      return Map[chargeType]
    },
    async exportExcel () {
      // 创建一个新的工作簿
      const workbook = utils.book_new()
      // 创建一个工作表 要求一个对象数组格式

      const tableHeaderKeys = [
        'ruleNumber',
        'ruleName',
        'freeDuration',
        'chargeCeiling',
        'chargeType',
        'ruleNameView'
      ]
      const res = await getRuleListApi(this.params)
      console.log(res)
      const list = res.data.rows.map(item => {
        const newArr = []
        tableHeaderKeys.forEach(key => {
          newArr[key] = item[key]
        })
        return newArr
      })
      // console.log(list)
      // 表头中文字段value
      const tableHeaderValues = [
        '计费规则编号',
        '计费规则名称',
        '免费时长(分钟)',
        '收费上线(元)',
        '计费方式',
        '计费规则'
      ]
      const worksheet = utils.json_to_sheet(res.data.rows)

      // 把工作表添加到工作簿  Data为工作表名称
      utils.book_append_sheet(workbook, worksheet, 'Data')
      // 改写表头
      utils.sheet_add_aoa(worksheet, [['姓名', '年龄']], { origin: 'A1' })
      // 导出方法进行导出
      writeFileXLSX(workbook, 'SheetJSVueAoO.xlsx')
    },
    indexMethod (index) {
      return index + (this.params.page - 1) * this.params.pageSize + 1
    },
    handleSizeChange (val) {
      this.params.pageSize = val
      this.getRuleList()
    },
    handleChange (val) {
      // console.log(val)
      this.params.page = val
      this.getRuleList()
    },
    async getRuleList () {
      const res = await getRuleListApi(this.params)
      // console.log(res)
      this.ruleList = res.data.rows
      this.total = res.data.total
    }
  },
  created () {
    this.getRuleList()
  },
  watch: {
    'addForm.chargeType' (newVal) {
      // console.log(newVal)
      if (newVal === 'turn') {
        this.$refs.addForm.clearValidate([
          'durationTime',
          'durationPrice',
          'partitionFrameTime',
          'partitionFramePrice',
          'partitionIncreaseTime',
          'partitionIncreasePrice'
        ])
      }
      if (newVal === 'duration') {
        this.$refs.addForm.clearValidate([
          'turnPrice',
          'partitionFrameTime',
          'partitionFramePrice',
          'partitionIncreaseTime',
          'partitionIncreasePrice'
        ])
      }
      if (newVal === 'partition') {
        this.$refs.addForm.clearValidate([
          'durationTime',
          'durationPrice',
          'turnPrice'
        ])
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pager {
  display: flex;
  margin-top: 20px;
  justify-content: flex-end;
}
.rule-container {
  padding: 20px;
  background-color: #fff;
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
  padding: 4px 0px;
  text-align: right;
}
</style>
