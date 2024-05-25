<template>
  <div class="add-enterprise">
    <header class="add-header">
      <div class="left">
        <span class="arrow" @click="$router.back()"
          ><i class="el-icon-arrow-left" />返回</span
        >
        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <span>{{ id ? '编辑企业' : '添加企业' }}</span>
      </div>
      <div class="right">黑马程序员</div>
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">企业信息</div>
        <div class="form">
          <el-form
            ref="ruleForm"
            label-width="100px"
            :model="addForm"
            :rules="rules"
          >
            <el-form-item label="企业名称" prop="name">
              <el-input v-model="addForm.name" />
            </el-form-item>
            <el-form-item label="法人" prop="legalPerson">
              <el-input v-model="addForm.legalPerson" />
            </el-form-item>
            <el-form-item label="注册地址" prop="registeredAddress">
              <el-input v-model="addForm.registeredAddress" />
            </el-form-item>
            <el-form-item label="所在行业" prop="industryCode">
              <el-select v-model="addForm.industryCode">
                <el-option
                  v-for="item in list"
                  :key="item.industryCode"
                  :label="item.industryName"
                  :value="item.industryCode"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="企业联系人" prop="contact">
              <el-input v-model="addForm.contact" />
            </el-form-item>
            <el-form-item label="联系电话" prop="contactNumber">
              <el-input v-model="addForm.contactNumber" />
            </el-form-item>
            <el-form-item label="营业执照" prop="businessLicenseId">
              <el-upload
                action="#"
                multiple
                :limit="3"
                :before-upload="beforeUpload"
                :http-request="uploadImg"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">
                  只能上传jpg/png/jpeg文件，且不超过5M
                </div>
              </el-upload>
              <img v-if="this.id" :src="addForm.businessLicenseUrl" alt="" />
            </el-form-item>
          </el-form>
        </div>
      </div>
    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button @click="resetForm">重置</el-button>
        <el-button type="primary" @click="confAdd">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import { uploadFile } from '@/api/common'
import {
  addCompanyApi,
  checkCompanyApi,
  editCompanyApi,
  getIndustryListApi
} from '@/api/park'

export default {
  data () {
    return {
      addForm: {
        name: '', // 企业名称
        legalPerson: '', // 法人
        registeredAddress: '', // 注册地址
        industryCode: '', // 所在行业
        contact: '', // 企业联系人
        contactNumber: '', // 联系人电话
        businessLicenseUrl: '', // 营业执照url
        businessLicenseId: '' // 营业执照id
      },
      list: [],
      rules: {
        name: [{ required: true, message: '企业名称为必填', trigger: 'blur' }],
        legalPerson: [
          { required: true, message: '法人为必填', trigger: 'blur' }
        ],
        registeredAddress: [
          { required: true, message: '注册地址为必填', trigger: 'blur' }
        ],
        industryCode: [
          { required: true, message: '所在行业为必填', trigger: 'change' }
        ],
        contact: [
          { required: true, message: '企业联系人为必填', trigger: 'blur' }
        ],
        contactNumber: [
          { required: true, message: '企业联系人电话为必填', trigger: 'blur' },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '手机号格式不正确',
            trigger: 'blur'
          }
        ],
        businessLicenseId: [
          { required: true, message: '请上传营业执照', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async renderCompany () {
      const res = await checkCompanyApi(this.id)
      console.log(res)
      // const {}
      this.addForm = res.data
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
    },
    confAdd () {
      this.$refs.ruleForm.validate(async flag => {
        if (!flag) return

        if (this.id) {
          delete this.addForm.businessLicenseName
          delete this.addForm.industryName
          delete this.addForm.rent
          await editCompanyApi(this.addForm)
          this.$message.success('编辑成功')
        } else {
          await addCompanyApi(this.addForm)
          this.$message.success('添加成功')
        }
        setTimeout(() => {
          this.$router.back()
        }, 1500)
      })
    },
    beforeUpload (file) {
      console.log(file)
      const imageType = ['image/jpeg', 'image/jpg', 'image/png']
      if (!imageType.includes(file.type)) {
        this.$message.warning('图片格式不正确')
        return false
      }
      if (file.size / 1024 / 1024 > 5) {
        this.$message.warning('文件大小超过限制')
        return false
      }
    },
    async uploadImg ({ file }) {
      // console.log(file)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 1)
      const res = await uploadFile(formData)
      // console.log(res)
      this.addForm.businessLicenseId = res.data.id
      this.addForm.businessLicenseUrl = res.data.url
      this.$refs.ruleForm.validateField('businessLicenseId')
    },
    async getIndustryList () {
      const res = await getIndustryListApi()
      // console.log(res)
      this.list = res.data
    }
  },
  created () {
    this.getIndustryList()
    if (this.id) {
      this.renderCompany()
    }
  },
  computed: {
    id () {
      return this.$route.query.id
    }
  }
}
</script>

<style scoped lang="scss">
.add-enterprise {
  background-color: #f4f6f8;
  height: 100vh;

  .add-header {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    height: 64px;
    line-height: 64px;
    font-size: 15px;
    font-weight: 400;
    background-color: #fff;

    .left {
      span {
        margin-right: 4px;
      }
      .arrow {
        cursor: pointer;
      }
    }

    .right {
      text-align: right;
    }
  }

  .add-main {
    background: #f4f6f8;
    padding: 20px 130px;

    .form-container {
      background-color: #fff;
      .title {
        height: 60px;
        line-height: 60px;
        padding-left: 20px;
      }
      .form {
        margin-bottom: 20px;
        padding: 20px 65px 24px;
        .el-form {
          display: flex;
          flex-wrap: wrap;
          .el-form-item {
            width: 50%;
          }
        }
      }
    }
  }

  .add-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 24px 50px;
    color: #000000d9;
    font-size: 14px;
    background: #fff;
    text-align: center;
  }
}
</style>
