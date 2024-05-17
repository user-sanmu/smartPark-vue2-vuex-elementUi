<template>
  <div class="login_body">
    <div class="bg" />
    <div class="box">
      <div class="title">智慧园区-登录</div>
      <el-form ref="form" :model="loginForm" :rules="rules">
        <el-form-item label="账号" prop="username">
          <el-input v-model="loginForm.username" />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            show-password
            v-model="loginForm.password"
          />
        </el-form-item>

        <el-form-item prop="remember">
          <el-checkbox v-model="checked">记住我</el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="login_btn" @click="handleLogin"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { ZSPCTOKEN_KEY } from '@/constants/KEY'

export default {
  name: 'Login',
  data () {
    return {
      checked: true,
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'change' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'change' }]
      }
    }
  },
  methods: {
    handleLogin () {
      this.$refs.form.validate(async flag => {
        if (!flag) return

        // const res = await loginAPI(this.loginForm)
        // this.$store.commit('user/setToken', res.data.token)
        await this.$store.dispatch('user/loginAction', this.loginForm)
        if (this.checked) {
          localStorage.setItem(ZSPCTOKEN_KEY, JSON.stringify(this.loginForm))
        } else {
          localStorage.removeItem(ZSPCTOKEN_KEY)
        }

        this.$message.success('登录成功')
        setTimeout(() => {
          if (this.$route.query.redirect) {
            this.$router.push(this.$route.query.redirect)
          } else {
            this.$router.push('/')
          }
        }, 1500)
      })
    }
  },
  created () {
    const loginData = localStorage.getItem(ZSPCTOKEN_KEY)
    if (loginData) {
      const { username, password } = JSON.parse(loginData)
      this.loginForm.username = username
      this.loginForm.password = password
    }
  }
}
</script>

<style scoped lang="scss">
.login_body {
  display: flex;
}
.bg {
  width: 60vw;
  height: 100vh;
  background: url('~@/assets/login-bg.svg') no-repeat;
  background-position: right top;
  background-size: cover;
}
.box {
  margin: 200px 10% 0;
  flex: 1;
  .title {
    padding-bottom: 76px;
    font-size: 26px;
    font-weight: 500;
    color: #1e2023;
  }
  ::v-deep() {
    .ant-form-item {
      display: flex;
      margin-bottom: 62px;
      flex-direction: column;
    }
    .ant-form-item-label label {
      font-size: 16px;
      color: #8b929d;
    }
    .ant-input,
    .ant-input-password {
      border-radius: 8px;
    }
  }
}
.login_btn {
  width: 100%;
}
</style>
