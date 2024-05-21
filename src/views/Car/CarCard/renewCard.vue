<template>
  <div class="add-card">
    <header class="add-header">
      <el-page-header content="月卡续费" @back="$router.back()" />
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">车辆信息</div>
        <div class="form">
          <el-form
            label-width="100px"
            :model="carInfoForm"
            :rules="carInfoRules"
            ref="carInfoForm"
          >
            <el-form-item label="车主姓名" prop="personName">
              <el-input v-model="carInfoForm.personName" :disabled="true" />
            </el-form-item>
            <el-form-item label="联系方式" prop="phoneNumber">
              <el-input v-model="carInfoForm.phoneNumber" :disabled="true" />
            </el-form-item>
            <el-form-item label="车辆号码" prop="carNumber">
              <el-input v-model="carInfoForm.carNumber" :disabled="true" />
            </el-form-item>
            <el-form-item label="车辆品牌" prop="carBrand">
              <el-input v-model="carInfoForm.carBrand" :disabled="true" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="form-container">
        <div class="title">月卡缴费</div>
        <div class="form">
          <el-form
            ref="feeInfoForm"
            label-width="100px"
            :model="feeForm"
            :rules="feeFormRules"
          >
            <el-form-item label="有效日期" prop="payTime">
              <el-date-picker
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                v-model="feeForm.payTime"
                format="yyyy/MM/dd"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item label="支付金额" prop="paymentAmount">
              <el-input v-model="feeForm.paymentAmount" />
            </el-form-item>
            <el-form-item label="支付方式" prop="paymentMethod">
              <el-select v-model="feeForm.paymentMethod">
                <el-option
                  v-for="item in payMethodList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button @click="resetForm">重置</el-button>
        <el-button type="primary" @click="confirmRenew">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import { checkCardApi, renewCardApi } from '@/api/card'

export default {
  name: 'addCard',
  data () {
    return {
      carInfoForm: {
        personName: '',
        phoneNumber: '',
        carNumber: '',
        carBrand: ''
      },
      carInfoRules: {
        personName: [
          { required: true, message: '车主名称不可为空', trigger: 'blur' }
        ],
        phoneNumber: [
          { required: true, message: '联系方式不可为空', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
        ],
        carNumber: [
          { required: true, message: '车牌号不可为空', trigger: 'blur' },
          { validator: this.validatorCarNumber, trigger: 'blur' }
        ],
        carBrand: [
          { required: true, message: '车辆品牌不可为空', trigger: 'blur' }
        ]
      },
      feeForm: {
        payTime: '',
        paymentAmount: null,
        paymentMethod: ''
      },
      feeFormRules: {
        paymentAmount: [
          {
            required: true,
            message: '请输入支付金额',
            trigger: 'blur'
          }
        ],
        paymentMethod: [
          {
            required: true,
            message: '请选择支付方式',
            trigger: 'blur'
          }
        ]
      },
      payMethodList: [
        {
          id: 'Alipay',
          name: '支付宝'
        },
        {
          id: 'WeChat',
          name: '微信'
        },
        {
          id: 'Cash',
          name: '线下'
        }
      ]
    }
  },
  created () {
    this.getCardDetail()
  },
  methods: {
    confirmRenew () {
      this.$refs.feeInfoForm.validate(async flag => {
        if (!flag) return
        const requestData = {
          carInfoId: this.id,
          ...this.feeForm,
          cardStartDate: this.feeForm.payTime[0],
          cardEndDate: this.feeForm.payTime[1]
        }
        delete requestData.payTime
        console.log(requestData.cardStartDate, requestData.cardEndDate)
        await renewCardApi(requestData)
        this.$message.success('月卡续费成功')
        setTimeout(() => {
          this.$router.back()
        }, 1500)
      })
    },
    resetForm () {
      this.$refs.feeInfoForm.resetFields()
    },
    async getCardDetail () {
      const { data } = await checkCardApi(this.id)
      console.log(data)
      const { personName, phoneNumber, carNumber, carBrand, carInfoId } = data
      this.carInfoForm = {
        personName,
        phoneNumber,
        carNumber,
        carBrand,
        carInfoId
      }
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
.add-card {
  background-color: #f4f6f8;
  height: 100vh;

  .add-header {
    display: flex;
    align-items: center;
    padding: 0 20px;
    height: 64px;
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
    .preview {
      img {
        width: 100px;
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
