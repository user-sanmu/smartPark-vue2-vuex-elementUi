<template>
  <div class="addRole">
    <header class="add-header">
      <div class="left">
        <span class="arrow" @click="$router.back()"
          ><i class="el-icon-arrow-left" />返回</span
        >
        <span class="grey">|</span>
        <span>{{ id ? '编辑角色' : '添加角色' }}</span>
      </div>
      <div class="right">黑马程序员</div>
    </header>
    <div class="main">
      <aside>
        <el-steps direction="vertical" :active="step">
          <el-step title="角色信息"></el-step>
          <el-step title="权限信息"></el-step>
          <el-step title="检查并完成"></el-step>
        </el-steps>
      </aside>
      <main>
        <div class="form-container" v-show="step === 1">
          <div class="title">角色信息</div>
          <div class="form">
            <el-form
              class="form-box"
              ref="roleForm"
              :model="roleForm"
              :rules="roleRules"
            >
              <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="roleForm.roleName" />
              </el-form-item>
              <el-form-item label="角色描述" prop="remark">
                <el-input
                  v-model="roleForm.remark"
                  type="textarea"
                  autosize
                  style="width: 300px"
                />
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="form-container" v-show="step === 2">
          <div class="title">权限配置</div>
          <div class="form">
            <div class="tree-wrapper">
              <div v-for="item in roleList" :key="item.id" class="tree-item">
                <div class="tree-title">{{ item.title }}</div>
                <el-tree
                  ref="tree"
                  :data="item.children"
                  :default-expand-all="true"
                  :props="defaultProps"
                  show-checkbox
                  check-strictly
                  node-key="id"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="form-container" v-show="step === 3">
          <div class="title">检查并完成</div>
          <div class="addForm">
            <div class="text">
              <p><span>角色名称: </span>{{ roleForm.roleName }}</p>
              <p><span>角色描述: </span>{{ roleForm.remark }}</p>
            </div>
            <div class="tree-wrapper">
              <div v-for="item in roleList" :key="item.id" class="tree-item">
                <div class="tree-title">{{ item.title }}</div>
                <el-tree
                  ref="checkTree"
                  :data="item.children"
                  :props="checkDefaultProps"
                  :default-expand-all="true"
                  show-checkbox
                  check-strictly
                  node-key="id"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    <footer>
      <el-button @click="prev" :disabled="step <= 1 ? true : false"
        >上一步</el-button
      >
      <el-button type="info" @click="resetForm" v-show="step <= 2"
        >重置</el-button
      >
      <el-button type="primary" @click="next">{{ nextText }}</el-button>
    </footer>
  </div>
</template>

<script>
import {
  addRoleApi,
  getAllPermissionListApi,
  selectRolePermissionApi,
  editRolePermissionApi
} from '@/api/systemRole'

export default {
  data () {
    return {
      step: 1,
      nextText: '下一步',
      roleForm: {
        roleName: '',
        remark: '',
        perms: []
      },
      roleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      roleList: [],
      defaultProps: {
        label: 'title'
      },
      checkDefaultProps: {
        label: 'title',
        disabled: () => true
      }
    }
  },
  created () {
    this.getRoleList()
    if (this.id) {
      this.getRoleDetail()
    }
  },
  computed: {
    id () {
      return this.$route.query.id
    }
  },
  methods: {
    async getRoleDetail () {
      const res = await selectRolePermissionApi(this.id)
      this.roleForm = res.data
      this.$refs.tree.forEach((item, index) => {
        item.setCheckedKeys(this.roleForm.perms[index])
      })
    },
    setCheckedKeys () {
      // this.$refs.checkTree.setCheckedKeys(this.roleForm.perms)
      const checkTreeList = this.$refs.checkTree
      // console.log(this.$refs.checkTree)
      checkTreeList.forEach((item, index) =>
        item.setCheckedKeys(this.roleForm.perms[index])
      )
    },
    async getRoleList () {
      // const res = await getRoleListApi()
      const res = await getAllPermissionListApi()
      console.log(res)
      this.roleList = res.data
    },
    resetForm () {
      if (this.step === 1) {
        this.$refs.roleForm.resetFields()
      } else if (this.step === 2) {
        // this.$refs.checkTree.setCheckedKeys([])
        console.log(11)
        this.$refs.tree.forEach(item => item.setCheckedKeys([]))
      }
    },
    next () {
      this.$refs.roleForm.validate(async flag => {
        if (!flag) return
        if (this.step === 2) {
          const treeList = this.$refs.tree
          this.roleForm.perms = []
          treeList.forEach(item => {
            // console.log(item.getCheckedKeys())
            this.roleForm.perms.push(item.getCheckedKeys())
          })
          // console.log(this.roleForm.perms)
          if (!this.roleForm.perms.flat().length) {
            this.$message.error('至少选择一项')
            return
          }
          this.setCheckedKeys()
        }
        if (this.step >= 3) {
          if (this.id) {
            delete this.roleForm.userTotal
            await editRolePermissionApi(this.roleForm)
            this.$message.success('编辑成功')
            this.$router.back()
          } else {
            this.$confirm('请确认添加角色', '')
              .then(async () => {
                await addRoleApi(this.roleForm)
                this.$message.success('添加成功')
                this.$router.back()
              })
              .catch(() => this.$message.info('已取消'))
          }
          return
        }
        this.step++
      })
    },
    prev () {
      this.step--
    }
  },
  watch: {
    step (newVal) {
      if (newVal >= 3) {
        this.nextText = '完成'
      } else {
        this.nextText = '下一步'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.addRole {
  position: relative;
  min-width: 100vh;
  min-height: 100vh;
  height: 1100px;
  background-color: #f4f6f8;
  .add-header {
    display: flex;
    justify-content: space-between;
    height: 65px;
    line-height: 65px;
    background-color: #fff;
    padding: 0 50px;
    .left {
      .arrow:hover {
        cursor: pointer;
      }
      .grey {
        color: #dce5ef;
        margin: 0 10px;
      }
    }
  }
  .main {
    display: flex;
    aside {
      margin-left: 50px;
      margin-top: 40px;
      height: 300px;
      width: 300px;
    }
    main {
      width: 100%;
      .form-container {
        position: absolute;
        top: 90px;
        left: 50%;
        transform: translateX(-50%);
        width: 920px;
        background-color: #fff;
        border-radius: 10px;
        margin-bottom: 100px;
        .title {
          width: 120px;
          margin: 20px 0;
          padding: 0 10px;
          border-left: 2px solid #4770ff;
        }
        .form {
          width: 100%;
          display: flex;
          justify-content: center;
          margin-top: 50px;
          .form-box {
            width: 400px;
            .el-form-item {
              display: flex;
              justify-content: end;
            }
            .el-input {
              width: 300px;
            }
          }
        }
        .addForm {
          .text {
            margin-left: 100px;
            p {
              span {
                color: #909399;
                font-size: 14px;
              }
            }
          }
        }
      }
      .tree-wrapper {
        display: flex;
        flex-wrap: wrap;
        margin-left: 100px;
        .tree-title {
          width: 200px;
          height: 45px;
          margin-top: 10px;
          margin-bottom: 10px;
          margin-left: 25px;
          line-height: 45px;
          border-radius: 5px;
          background-color: #f5f7fa;
        }
        .tree-item {
          width: 250px;
          height: 400px;
          text-align: center;
          border-right: 2px solid #e4e7ec;
          border-bottom: 2px solid #e4e7ec;
        }
        .tree-item:nth-child(3) {
          border-right: 0;
        }
        .tree-item:nth-child(n + 4) {
          border-bottom: 0;
        }
      }
    }
  }
  footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 65px;
    line-height: 65px;
    background-color: #fff;
    text-align: center;
    .el-button {
      margin-right: 20px;
    }
  }
}
</style>
