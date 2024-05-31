<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">企业名称：</div>
      <el-input
        clearable
        placeholder="请输入内容"
        v-model="params.name"
        class="search-main"
      />
      <el-button type="primary" @click="searchCompany">查询</el-button>
      <el-button @click="clearSearch">重置</el-button>
    </div>
    <div class="create-container">
      <el-button type="primary" @click="$router.push('/addCompany')"
        >添加企业</el-button
      >
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="list" @expand-change="expandChange">
        <el-table-column type="expand">
          <template #default="scope">
            <el-table :data="scope.row.rentList">
              <el-table-column
                label="租赁楼宇"
                width="320"
                prop="buildingName"
              />
              <el-table-column label="租赁起始 / 结束时间" prop="startTime">
                <template #default="rentObj">
                  {{ rentObj.row.startTime }} / {{ rentObj.row.endTime }}
                </template>
              </el-table-column>
              <el-table-column label="合同状态" prop="status">
                <template #default="rentObj">
                  <el-tag :type="formatInfoType(rentObj.row.status)">
                    {{ formatStatus(rentObj.row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180">
                <template #default="rentObj">
                  <el-button
                    size="mini"
                    type="text"
                    @click="rentingOut(rentObj.row.id)"
                    :disabled="rentObj.row.status === 3 ? true : false"
                    >退租</el-button
                  >
                  <el-button
                    size="mini"
                    type="text"
                    :disabled="rentObj.row.status !== 3 ? true : false"
                    @click="delRent(rentObj.row.id)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" :index="indexMethod" />
        <el-table-column label="企业名称" width="320" prop="name" />
        <el-table-column label="联系人" prop="contact" />
        <el-table-column label="联系电话" prop="contactNumber" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="mini" type="text" @click="addRent(scope.row.id)"
              >添加合同</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="checkCompany(scope.row.id)"
              >查看</el-button
            >
            <el-button size="mini" type="text" @click="toEdit(scope.row.id)"
              >编辑</el-button
            >
            <el-button size="mini" type="text" @click="delCompany(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="params.pageSize"
        @current-change="handleChange"
      >
      </el-pagination>
    </div>
    <el-dialog
      title="添加合同"
      :visible="rentDialogVisible"
      width="580px"
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <!-- 表单区域 -->
      <div class="form-container">
        <el-form
          ref="addForm"
          :model="rentForm"
          :rules="rentRules"
          label-position="top"
        >
          <el-form-item label="租赁楼宇" prop="buildingId">
            <el-select v-model="rentForm.buildingId" placeholder="请选择">
              <el-option
                v-for="item in rentBuildingList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="租赁起止日期" prop="rentTime">
            <el-date-picker
              v-model="rentForm.rentTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="租赁合同" prop="contractId">
            <el-upload
              ref="upload"
              action="#"
              :http-request="httpRequest"
              :before-upload="beforeUpload"
              :limit="1"
              :on-exceed="onExceed"
              :on-remove="onRemove"
            >
              <el-button size="small" type="primary" plain
                >上传合同文件</el-button
              >
              <div slot="tip" class="el-upload__tip">
                支持扩展名：.doc .docx .pdf, 文件大小不超过5M
              </div>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button size="mini" @click="closeDialog">取 消</el-button>
        <el-button size="mini" type="primary" @click="addConfirm"
          >确 定</el-button
        >
      </template>
    </el-dialog>
    <el-drawer
      title="查看企业"
      :visible.sync="drawer"
      :direction="direction"
      :destroy-on-close="true"
    >
      <el-descriptions title="企业信息" border :column="2" class="drawer-label">
        <el-descriptions-item label="法人">{{
          this.checkCompanyList.legalPerson
        }}</el-descriptions-item>
        <el-descriptions-item label="所在行业">{{
          this.checkCompanyList.industryName
        }}</el-descriptions-item>
        <el-descriptions-item label="企业联系人">{{
          this.checkCompanyList.contact
        }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{
          this.checkCompanyList.contactNumber
        }}</el-descriptions-item>
        <el-descriptions-item label="营业执照" contentClassName="rentImg">
          <el-image
            style="width: 200px"
            :src="checkCompanyList.businessLicenseUrl"
            :preview-src-list="srcList"
          ></el-image>
        </el-descriptions-item>
      </el-descriptions>
      <h4>租赁记录</h4>
      <el-descriptions
        class="rent-label"
        border
        :column="1"
        v-for="item in checkCompanyList.rent"
        :key="item.id"
      >
        <el-descriptions-item label="序号">{{ item.id }}</el-descriptions-item>
        <el-descriptions-item label="合同状态"
          ><el-tag size="small" :type="formatInfoType(item.status)">{{
            formatStatus(item.status)
          }}</el-tag></el-descriptions-item
        >
        <el-descriptions-item label="合同开始 / 结束时间"
          >{{ item.startTime }} / {{ item.endTime }}</el-descriptions-item
        >
        <el-descriptions-item label="租赁合同"
          ><el-link
            :href="`${previewURL}${item.contractUrl}`"
            type="primary"
            :underline="false"
            target="_blank"
            >{{ item.contractName }}</el-link
          ></el-descriptions-item
        >
        <el-descriptions-item label="录入时间">{{
          item.createTime
        }}</el-descriptions-item>
        <el-descriptions-item label="操作"
          ><el-link :href="item.contractUrl" type="primary" :underline="false"
            >下载合同</el-link
          ></el-descriptions-item
        >
      </el-descriptions>
    </el-drawer>
  </div>
</template>
<script>
import { uploadFile } from '@/api/common'
import {
  addRentApi,
  checkCompanyApi,
  delCompanyApi,
  delRentApi,
  getEnterPriseListApi,
  getEnterRentApi,
  getRentBuildingApi,
  rentingOutApi
} from '@/api/park'

export default {
  data () {
    return {
      params: {
        name: '',
        page: 1,
        pageSize: 10
      },
      list: [],
      total: 0,
      rentDialogVisible: false,
      rentForm: {
        buildingId: null,
        startTime: '',
        endTime: '',
        contractUrl: '',
        contractId: null,
        type: 0,
        enterpriseId: null,
        rentTime: []
      },
      rentRules: {
        buildingId: [
          { required: true, message: '请选择楼宇', trigger: 'change' }
        ],
        rentTime: [
          { required: true, message: '请选择租赁日期', trigger: 'change' }
        ],
        contractId: [{ required: true, message: '请上传合同文件' }]
      },
      rentBuildingList: [],
      drawer: false,
      direction: 'rtl',
      checkCompanyList: {},
      srcList: [],
      previewURL: 'https://view.officeapps.live.com/op/view.aspx?src='
    }
  },
  methods: {
    delRent (id) {
      this.$confirm('请确认删除租赁合同').then(async () => {
        await delRentApi(id)
        this.$message.success('删除成功')
        this.getCompanyList()
      })
    },

    rentingOut (id) {
      // console.log(id)
      this.$confirm('请确认退租请求', '')
        .then(async () => {
          await rentingOutApi(id)
          this.$message.success('退租成功')
          this.getCompanyList()
        })
        .catch()
    },
    async checkCompany (id) {
      this.drawer = true
      const res = await checkCompanyApi(id)
      console.log(res)
      this.checkCompanyList = res.data
      this.srcList[0] = res.data.businessLicenseUrl
      this.srcList[1] = res.data.businessLicenseUrl
    },
    formatInfoType (status) {
      const MAP = {
        0: 'warning',
        1: 'success',
        2: 'info',
        3: 'danger'
      }
      // return 格式化之后的中文显示
      return MAP[status]
    },
    formatStatus (status) {
      const Map = {
        0: '待生效',
        1: '生效中',
        2: '已到期',
        3: '已退租'
      }
      return Map[status]
    },
    async expandChange (row, expandedRows) {
      // console.log(row, expandedRows)
      if (!expandedRows.find(item => item.id === row.id)) return
      const res = await getEnterRentApi(row.id)
      // console.log(res)
      row.rentList = res.data
    },
    onRemove () {
      this.rentForm.contractId = ''
      this.rentForm.contractUrl = ''
      this.$refs.addForm.validateField('contractId')
    },
    addConfirm () {
      this.$refs.addForm.validate(async flag => {
        if (!flag) return
        this.rentForm.startTime = this.rentForm.rentTime[0]
        this.rentForm.endTime = this.rentForm.rentTime[1]
        delete this.rentForm.rentTime
        const res = await addRentApi(this.rentForm)
        // console.log(res)
        this.$message.success('添加合同成功')
        this.closeDialog()
        this.getCompanyList()
      })
    },
    onExceed () {
      this.$message.warning('超出数量限制')
    },
    beforeUpload (file) {
      const fileType = [
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'application/pdf'
      ]
      if (fileType.includes(file.type) && file.size / 1024 / 1027 < 5) {
        return true
      } else {
        this.$message.warning('上传文件不符合要求')
        return false
      }
    },
    async httpRequest ({ file }) {
      // console.log(file)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 2)
      const res = await uploadFile(formData)
      // console.log(res)
      this.rentForm.contractId = res.data.id
      this.rentForm.contractUrl = res.data.url
      this.$refs.addForm.validateField('contractId')
    },
    closeDialog () {
      this.rentDialogVisible = false
      this.$refs.addForm.resetFields()
      this.$refs.upload.clearFiles()
    },
    async addRent (id) {
      this.rentDialogVisible = true
      this.rentForm.enterpriseId = id
      const res = await getRentBuildingApi()
      // console.log(res)
      this.rentBuildingList = res.data
    },
    delCompany (id) {
      this.$confirm('请确认删除', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await delCompanyApi(id)
        this.$message.success('删除成功')
        if (this.list.length === 1 && this.params.page > 1) {
          this.params.page--
        }
        this.getCompanyList()
      })
    },
    toEdit (id) {
      // console.log(id)
      this.$router.push({
        path: '/addCompany',
        query: {
          id
        }
      })
    },
    clearSearch () {
      this.params.name = ''
      this.params.page = 1
      this.getCompanyList()
    },
    searchCompany () {
      this.page = 1
      this.getCompanyList()
    },
    indexMethod (index) {
      return index + (this.params.page - 1) * this.params.pageSize + 1
    },
    handleChange (val) {
      // console.log(val)
      this.params.page = val
      this.getCompanyList()
    },
    async getCompanyList () {
      const res = await getEnterPriseListApi(this.params)
      // console.log(res)
      this.list = res.data.rows.map(item => {
        return {
          ...item,
          rentList: []
        }
      })
      this.total = res.data.total
    }
  },
  created () {
    this.getCompanyList()
  }
}
</script>

<style lang="scss" scoped>
.drawer-label {
  margin-left: 10px;
  margin-bottom: 100px;
}
.rent-label {
  margin-bottom: 50px;
}

h4 {
  margin-left: 10px;
}

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
