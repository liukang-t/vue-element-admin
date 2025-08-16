<template>
  <div class="merchant-list-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>商户列表</span>
        <el-button style="float: right; padding: 3px 0" type="primary" @click="handleAdd">新建</el-button>
      </div>

      <!-- 搜索区域 -->
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="商户号">
          <el-input v-model="searchForm.merchantId" placeholder="请输入商户号" />
        </el-form-item>
        <el-form-item label="服务商号">
          <el-input v-model="searchForm.providerId" placeholder="请输入服务商号" />
        </el-form-item>
        <el-form-item label="商户名称">
          <el-input v-model="searchForm.name" placeholder="请输入商户名称" />
        </el-form-item>
        <el-form-item label="商户状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态">
            <el-option label="全部" value="" />
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="商户类型">
          <el-select v-model="searchForm.type" placeholder="请选择类型">
            <el-option label="全部" value="" />
            <el-option label="普通商户" value="normal" />
            <el-option label="特约商户" value="special" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
          <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table v-loading="loading" :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="商户名称" min-width="250" />
        <el-table-column prop="merchantId" label="商户号" min-width="180" />
        <el-table-column prop="providerId" label="服务商号" min-width="200" />
        <el-table-column prop="status" label="状态" width="120">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === '1' ? 'success' : 'danger'" size="small">
              {{ scope.row.status === '1' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="商户类型" width="140">
          <template slot-scope="scope">
            <el-tag :type="scope.row.type === 'normal' ? 'success' : 'warning'" size="small">
              {{ scope.row.type === 'normal' ? '普通商户' : '特约商户' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建日期" min-width="200" />
        <el-table-column label="操作" width="280">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleEdit(scope.row)">修改</el-button>
            <el-button size="mini" type="text" @click="handleConfig(scope.row)">应用配置</el-button>
            <el-button size="mini" type="text" style="color: #F56C6C;" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        :current-page="pagination.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        style="margin-top: 20px; text-align: right;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>

    <!-- 修改商户抽屉 -->
    <el-drawer
      title="修改商户"
      :visible.sync="drawerVisible"
      direction="rtl"
      size="40%"
      :before-close="handleClose"
    >
      <div class="drawer-content">
        <el-form
          ref="editForm"
          :model="editForm"
          :rules="rules"
          label-width="120px"
          class="edit-form"
        >
          <!-- 基本信息 - 两列布局 -->
          <el-row :gutter="20">
            <el-col :span="12">
              <!-- 商户名称 -->
              <el-form-item label="商户名称" prop="name">
                <el-input
                  v-model="editForm.name"
                  placeholder="请输入商户名称"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <!-- 登录名 -->
              <el-form-item label="登录名" prop="loginName">
                <el-input
                  v-model="editForm.loginName"
                  placeholder="请输入登录名"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <!-- 商户简称 -->
              <el-form-item label="商户简称" prop="shortName">
                <el-input
                  v-model="editForm.shortName"
                  placeholder="请输入商户简称"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <!-- 联系人姓名 -->
              <el-form-item label="联系人姓名" prop="contactName">
                <el-input
                  v-model="editForm.contactName"
                  placeholder="请输入联系人姓名"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <!-- 联系人邮箱 -->
              <el-form-item label="联系人邮箱">
                <el-input
                  v-model="editForm.contactEmail"
                  placeholder="请输入联系人邮箱"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <!-- 联系人手机号 -->
              <el-form-item label="联系人手机号" prop="contactPhone">
                <el-input
                  v-model="editForm.contactPhone"
                  placeholder="请输入联系人手机号"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 商户类型和状态 - 两列布局 -->
          <el-row :gutter="20">
            <el-col :span="12">
              <!-- 商户类型 -->
              <el-form-item label="商户类型" prop="type">
                <el-radio-group v-model="editForm.type">
                  <el-radio value="normal">普通商户</el-radio>
                  <el-radio value="special">特约商户</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <!-- 状态 -->
              <el-form-item label="状态">
                <el-radio-group v-model="editForm.status">
                  <el-radio label="1">启用</el-radio>
                  <el-radio label="0">禁用</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 备注 - 全宽 -->
          <el-form-item label="备注">
            <el-input
              v-model="editForm.remark"
              type="textarea"
              :rows="3"
              placeholder="请输入备注"
            />
          </el-form-item>

          <!-- 账户安全分隔线 -->
          <div class="security-section">
            <div class="security-label">账户安全</div>
          </div>

          <!-- 重置密码 - 全宽 -->
          <el-form-item label="重置密码">
            <el-checkbox v-model="editForm.resetPassword">重置密码</el-checkbox>
            <el-checkbox v-model="editForm.restoreDefaultPassword">恢复默认密码</el-checkbox>
          </el-form-item>

          <!-- 密码字段 - 两列布局 -->
          <el-row v-if="editForm.resetPassword" :gutter="20">
            <el-col :span="12">
              <!-- 新密码 -->
              <el-form-item label="新密码" prop="newPassword">
                <el-input
                  v-model="editForm.newPassword"
                  type="password"
                  placeholder="请输入新密码"
                  show-password
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <!-- 确认新密码 -->
              <el-form-item label="确认新密码" prop="confirmPassword">
                <el-input
                  v-model="editForm.confirmPassword"
                  type="password"
                  placeholder="请确认新密码"
                  show-password
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <!-- 底部按钮 -->
        <div class="drawer-footer">
          <el-button @click="handleClose">
            <i class="el-icon-close" />
            取消
          </el-button>
          <el-button type="primary" @click="handleSave">
            <i class="el-icon-check" />
            保存
          </el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'MerchantList',
  data() {
    return {
      loading: false,
      drawerVisible: false,
      searchForm: {
        merchantId: '',
        providerId: '',
        name: '',
        status: '',
        type: ''
      },
      editForm: {
        merchantId: '',
        name: '',
        loginName: '',
        shortName: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        type: 'normal',
        status: '1',
        remark: '',
        resetPassword: false,
        restoreDefaultPassword: false,
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入商户名称', trigger: 'blur' }
        ],
        loginName: [
          { required: true, message: '请输入登录名', trigger: 'blur' }
        ],
        shortName: [
          { required: true, message: '请输入商户简称', trigger: 'blur' }
        ],
        contactName: [
          { required: true, message: '请输入联系人姓名', trigger: 'blur' }
        ],
        contactPhone: [
          { required: true, message: '请输入联系人手机号', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择商户类型', trigger: 'change' }
        ]
      },

      tableData: [
        {
          id: 1,
          name: '测试',
          merchantId: 'M1755242304',
          providerId: '',
          status: '1',
          type: 'normal',
          createTime: '2025-08-15 15:18:24',
          loginName: 'f435444',
          shortName: '额2',
          contactName: '123',
          contactEmail: '',
          contactPhone: '18132087654',
          remark: '测试商户'
        },
        {
          id: 2,
          name: '极码云',
          merchantId: 'M1755242305',
          providerId: 'P001',
          status: '1',
          type: 'special',
          createTime: '2025-08-15 14:30:00',
          loginName: 'jima001',
          shortName: '极码',
          contactName: '李四',
          contactEmail: 'jima@example.com',
          contactPhone: '13800138001',
          remark: '特约商户'
        },
        {
          id: 3,
          name: '测试商户2',
          merchantId: 'M1755242306',
          providerId: '',
          status: '0',
          type: 'normal',
          createTime: '2025-08-15 13:45:00',
          loginName: 'test002',
          shortName: '测试2',
          contactName: '王五',
          contactEmail: 'test2@example.com',
          contactPhone: '13800138002',
          remark: '禁用商户'
        }
      ],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 250
      }
    }
  },
  methods: {
    handleSearch() {
      this.loading = true
      // 模拟搜索
      setTimeout(() => {
        this.loading = false
      }, 1000)
    },
    handleReset() {
      this.searchForm = {
        merchantId: '',
        providerId: '',
        name: '',
        status: '',
        type: ''
      }
    },
    handleAdd() {
      this.$message.info('新增商户功能')
    },
    handleEdit(row) {
      // 打开修改抽屉并填充数据
      this.editForm = {
        merchantId: row.merchantId,
        name: row.name,
        loginName: row.loginName || '',
        shortName: row.shortName || '',
        contactName: row.contactName || '',
        contactEmail: row.contactEmail || '',
        contactPhone: row.contactPhone || '',
        type: row.type,
        status: row.status,
        remark: row.remark || '',
        resetPassword: false,
        restoreDefaultPassword: false,
        newPassword: '',
        confirmPassword: ''
      }
      this.drawerVisible = true
    },
    handleConfig(row) {
      // 跳转到应用列表页面
      this.$router.push({
        path: '/merchant/app',
        query: {
          merchantId: row.merchantId,
          merchantName: row.name
        }
      })
    },
    handleDelete(row) {
      this.$confirm(`确定要删除商户"${row.name}"吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('删除成功')
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val
    },
    // 关闭抽屉
    handleClose() {
      this.$confirm('确认关闭？未保存的数据将会丢失', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.drawerVisible = false
        this.resetForm()
      }).catch(() => {
        // 取消关闭
      })
    },
    // 重置表单
    resetForm() {
      this.$refs.editForm.resetFields()
      this.editForm = {
        merchantId: '',
        name: '',
        loginName: '',
        shortName: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        type: 'normal',
        status: '1',
        remark: '',
        resetPassword: false,
        restoreDefaultPassword: false,
        newPassword: '',
        confirmPassword: ''
      }
    },
    // 保存
    handleSave() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          // 这里添加保存逻辑
          console.log('保存的数据:', this.editForm)
          this.$message.success('保存成功')
          this.drawerVisible = false
          this.resetForm()
        } else {
          this.$message.error('请检查表单信息')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.merchant-list-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 84px);
  width: 100%;

  .el-card {
    width: 100%;

    .el-table {
      width: 100%;

      .el-table__body-wrapper {
        overflow-x: auto;
      }
    }
  }
}

.demo-form-inline {
  margin-bottom: 20px;
}

// 抽屉样式
.drawer-content {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.edit-form {
  flex: 1;
  overflow-y: auto;
}

.drawer-footer {
  padding-top: 20px;
  text-align: right;
  border-top: 1px solid #e4e7ed;

  .el-button {
    margin-left: 10px;
  }
}

// 表单项样式优化
.el-form-item {
  margin-bottom: 20px;
}

.el-input.is-disabled .el-input__inner {
  background-color: #f5f7fa;
  color: #909399;
}

  // 修改商户抽屉样式
  .edit-form {
    .el-form-item {
      margin-bottom: 20px;
    }

    .el-row {
      margin-bottom: 0;
    }
  }

  .security-section {
    margin: 20px 0;
    border-top: 1px solid #e4e7ed;
    padding-top: 15px;

    .security-label {
      background-color: #f56c6c;
      color: white;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      display: inline-block;
    }
  }
</style>
