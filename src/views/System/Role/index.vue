<template>
  <div class="role-container">
    <div class="left-wrapper">
      <div
        v-for="(item, index) in roleList"
        :key="item.roleId"
        class="role-item"
        :class="{ active: activeIndex === index ? true : false }"
        @click="activeChange(index)"
      >
        <div class="role-info">
          <svg-icon
            :icon-class="activeIndex === index ? 'user-active' : 'user'"
            class="icon"
          />
          {{ item.roleName }}
        </div>
        <div class="more">
          <el-dropdown>
            <span class="el-dropdown-link">
              <svg-icon icon-class="more" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="toEdit(item.roleId)"
                >编辑角色</el-dropdown-item
              >
              <el-dropdown-item @click.native="delRole(item.roleId)"
                >删除</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <el-button
        class="addBtn"
        size="mini"
        @click="$router.push('/sys/addRole')"
        >添加角色</el-button
      >
    </div>
    <div class="right-wrapper">
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane label="功能权限" name="permission">
          <div class="tree-wrapper">
            <div
              v-for="item in permissionList"
              :key="item.id"
              class="tree-item"
            >
              <div class="tree-title">{{ item.title }}</div>
              <el-tree
                ref="tree"
                :data="item.children"
                :props="defaultProps"
                :default-expand-all="true"
                show-checkbox
                node-key="id"
              />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="`成员(${total})`" name="employee">
          <div class="table">
            <el-table :data="tableData">
              <el-table-column
                type="index"
                label="序号"
                width="180"
                :index="indexMethod"
              />
              <el-table-column prop="name" label="员工姓名" />
              <el-table-column prop="userName" label="登录账号" />
            </el-table>
          </div>
          <el-pagination
            layout="total, sizes, prev, pager, next"
            :total="total"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[5, 10, 20, 50]"
            :page-size="params.pageSize"
          >
          </el-pagination>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {
  delRoleApi,
  getAllPermissionListApi,
  getRoleListApi,
  getRoleRelatedApi,
  selectRolePermissionApi
} from '@/api/systemRole'

export default {
  name: 'Role',
  data () {
    return {
      roleList: [],
      activeIndex: 0,
      permissionList: [],
      defaultProps: {
        label: 'title',
        //elementui 2.15.14版本,使用disabled: true无效
        disabled: () => true
      },
      activeName: 'permission',
      params: {
        page: 1,
        pageSize: 5
      },
      tableData: [],
      total: 0
    }
  },
  async created () {
    //三个函数均使用了async和await修饰,执行顺序会按照先进后出的原则
    await this.getRoleList()
    await this.getAllPermissionList()
    this.activeChange(0)
  },

  methods: {
    delRole (id) {
      this.$confirm('请确认删除', '删除')
        .then(async () => {
          await delRoleApi(id)
          this.$message.success('删除成功')
          this.getRoleList()
        })
        .catch()
    },
    toEdit (id) {
      this.$router.push(`/sys/addRole?id=${id}`)
    },
    handleSizeChange (val) {
      this.params.pageSize = val
    },
    handleCurrentChange (val) {
      this.params.page = val
    },
    indexMethod (index) {
      return index + (this.params.page - 1) * this.params.pageSize + 1
    },
    async getRoleRelated (roleId) {
      const res = await getRoleRelatedApi(roleId, this.params)
      // console.log(res)
      this.tableData = res.data.rows
      this.total = res.data.total
    },
    tabClick () {},
    // 给属性控件添加禁用
    addDisabledProp (list) {
      list.forEach(item => {
        item.disabled = true
        if (item.children) {
          //递归调用给children添加禁用
          this.addDisabledProp(item.children)
        }
      })
    },
    async getAllPermissionList () {
      const res = await getAllPermissionListApi()
      // console.log(res)
      this.permissionList = res.data
      // this.addDisabledProp(this.permissionList)
    },
    async activeChange (index) {
      // console.log(index)
      this.activeIndex = index
      const res = await selectRolePermissionApi(this.roleList[index].roleId)
      // console.log(res)
      const perms = res.data.perms
      this.$refs.tree.forEach((item, index) => {
        item.setCheckedKeys(perms[index])
      })
      this.getRoleRelated(this.roleList[index].roleId)
    },
    async getRoleList () {
      const res = await getRoleListApi()
      // console.log(res)
      this.roleList = res.data
    }
  }
}
</script>

<style scoped lang="scss">
.table {
  margin-left: 20px;
}
.el-pagination {
  display: flex;
  justify-content: end;
  margin-right: 20px;
  margin-top: 20px;
}
.role-container {
  display: flex;
  font-size: 14px;
  background-color: #fff;
  padding: 20px;
  .left-wrapper {
    width: 200px;
    border-right: 1px solid #e4e7ec;
    padding: 4px;
    text-align: center;

    .role-item {
      position: relative;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      cursor: pointer;

      &.active {
        background: #edf5ff;
        color: #4770ff;
      }
    }

    .role-info {
      display: flex;
      align-items: center;

      .icon {
        margin-right: 10px;
      }
    }

    .more {
      display: flex;
      align-items: center;
    }
    .addBtn {
      width: 100%;
      margin-top: 20px;
    }
  }

  .right-wrapper {
    flex: 1;

    .tree-wrapper {
      display: flex;
      justify-content: space-between;

      .tree-item {
        flex: 1;
        border-right: 1px solid #e4e7ec;
        padding: 0px 4px;
        text-align: center;
        .tree-title {
          background: #f5f7fa;
          text-align: center;
          padding: 10px 0;
          margin-bottom: 12px;
        }
      }
    }

    ::v-deep .el-tabs__nav-wrap {
      padding-left: 20px;
    }

    .user-wrapper {
      padding: 20px;
    }
  }
}
</style>
