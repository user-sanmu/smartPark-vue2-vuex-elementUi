<template>
  <div>
    <div class="card-area">
      <el-button type="primary" @click="openDialog">添加区域</el-button>
    </div>
    <div class="table">
      <el-table :data="areaData" style="width: 100%">
        <el-table-column type="index" :index="indexMethod" width="50">
        </el-table-column>
        <el-table-column prop="areaName" label="区域名称" width="180">
        </el-table-column>
        <el-table-column prop="spaceNumber" label="车位数(个)" width="180">
        </el-table-column>
        <el-table-column prop="areaProportion" label="面积(㎡)">
        </el-table-column>
        <el-table-column prop="ruleName" label="计费规则"> </el-table-column>
        <el-table-column prop="remark" label="备注"> </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="text" @click="editCarArea(scope.row)"
              >编辑</el-button
            >
            <el-button type="text" @click="delCarArea(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      class="carArea-page"
      layout="total, sizes, prev, pager, next"
      :total="total"
      background
      :page-sizes="[5, 10, 20, 50]"
      :page-size="this.params.pageSize"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
    <addDialog
      ref="dialog"
      :dialogVisible="dialogVisible"
      :ruleDropList="ruleDropList"
      :getCarAreaList="getCarAreaList"
    ></addDialog>
  </div>
</template>
<script>
import {
  delCarAreaApi,
  getCarAreaListApi,
  getCarAreaSelectApi
} from '@/api/cardArea'
import addDialog from './components/addDialog.vue'

export default {
  components: {
    addDialog
  },
  data () {
    return {
      areaData: [],
      params: {
        page: 1,
        pageSize: 5
      },
      total: null,
      dialogVisible: false,
      ruleDropList: [],
      dialogData: {}
    }
  },
  created () {
    this.getCarAreaList()
  },
  methods: {
    indexMethod (index) {
      return index + (this.params.page - 1) * this.params.pageSize + 1
    },
    delCarArea (id) {
      this.$confirm('确认删除', '')
        .then(async () => {
          await delCarAreaApi(id)
          this.$message.success('删除成功')
          this.getCarAreaList()
        })
        .catch(() => this.$message.info('已取消'))
    },
    editCarArea (row) {
      this.dialogVisible = true
      const { areaName, areaProportion, id, remark, ruleId, spaceNumber } = row
      this.$refs.dialog.addForm = {
        areaName,
        areaProportion,
        id,
        remark,
        ruleId,
        spaceNumber
      }
      this.openDialog()
    },
    async openDialog () {
      this.dialogVisible = true
      const res = await getCarAreaSelectApi()
      // console.log(res)
      this.ruleDropList = res.data
    },
    handleSizeChange (val) {
      this.params.pageSize = val
      this.getCarAreaList()
    },
    handleCurrentChange (val) {
      this.params.page = val
      this.getCarAreaList()
    },
    async getCarAreaList () {
      const res = await getCarAreaListApi(this.params)
      // console.log(res)
      this.areaData = res.data.rows
      this.total = res.data.total
    }
  }
}
</script>
<style lang="scss" scoped>
.card-area {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, 0.9);
  padding-bottom: 20px;
}
.carArea-page {
  display: flex;
  justify-content: end;
  margin-top: 20px;
  margin-right: 20px;
}
</style>
