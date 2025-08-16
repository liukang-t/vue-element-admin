<template>
  <div class="app-list-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span v-if="!$route.query.merchantName">应用列表</span>
        <span v-else>{{ $route.query.merchantName }} - 应用列表</span>
        <el-button style="float: right; padding: 3px 0" type="primary" @click="handleAdd">新建</el-button>
      </div>

      <!-- 搜索区域 -->
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="商户号">
          <el-input v-model="searchForm.merchantId" placeholder="请输入商户号" />
        </el-form-item>
        <el-form-item label="应用APPID">
          <el-input v-model="searchForm.appId" placeholder="请输入应用APPID" />
        </el-form-item>
        <el-form-item label="应用名称">
          <el-input v-model="searchForm.name" placeholder="请输入应用名称" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态">
            <el-option label="全部" value="" />
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
          <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table v-loading="loading" :data="tableData" style="width: 100%">
        <el-table-column prop="appId" label="应用AppId" min-width="280" />
        <el-table-column prop="name" label="应用名称" min-width="200" />
        <el-table-column prop="merchantId" label="商户号" min-width="180" />
        <el-table-column prop="status" label="状态" width="120">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === '1' ? 'success' : 'danger'" size="small">
              {{ scope.row.status === '1' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建日期" min-width="200" />
        <el-table-column label="操作" width="280">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleEdit(scope.row)">修改</el-button>
            <el-button size="mini" type="text" @click="handleConfig(scope.row)">支付配置</el-button>
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

    <!-- 修改应用抽屉 -->
    <el-drawer
      title="修改应用"
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
          <!-- 应用 AppId -->
          <el-form-item label="应用 AppId">
            <el-input
              v-model="editForm.appId"
              disabled
              placeholder="应用 AppId"
            />
          </el-form-item>

          <!-- 商户号 -->
          <el-form-item label="商户号">
            <el-input
              v-model="editForm.merchantId"
              disabled
              placeholder="商户号"
            />
          </el-form-item>

          <!-- 应用名称 -->
          <el-form-item label="应用名称" prop="name">
            <el-input
              v-model="editForm.name"
              placeholder="请输入应用名称"
            />
          </el-form-item>

          <!-- 状态 -->
          <el-form-item label="状态">
            <el-radio-group v-model="editForm.status">
              <el-radio label="1">启用</el-radio>
              <el-radio label="0">停用</el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- 私钥 AppSecret -->
          <el-form-item label="私钥 AppSecret">
            <el-input
              v-model="editForm.appSecret"
              placeholder="私钥 AppSecret"
              show-password
            />
            <el-button
              type="primary"
              size="small"
              style="margin-top: 8px;"
              @click="generateSecret"
            >
              <i class="el-icon-key" />
              随机生成私钥
            </el-button>
          </el-form-item>

          <!-- 备注 -->
          <el-form-item label="备注">
            <el-input
              v-model="editForm.remark"
              type="textarea"
              :rows="3"
              placeholder="请输入备注"
            />
          </el-form-item>
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

    <!-- 支付配置抽屉 -->
    <el-drawer
      title="支付配置"
      :visible.sync="configDrawerVisible"
      direction="rtl"
      size="75%"
      :before-close="handleConfigClose"
    >
      <div class="config-drawer-content">
        <!-- 固定头部 -->
        <div class="config-drawer-header">
          <!-- 页面切换导航 -->
          <div class="page-nav">
            <div
              class="nav-item"
              :class="{ active: configStep === 1 }"
              @click="goToPage(1)"
            >
              <span class="nav-text">支付参数配置</span>
            </div>
            <div
              class="nav-item"
              :class="{ active: configStep === 2 }"
              @click="goToPage(2)"
            >
              <span class="nav-text">支付通道配置</span>
            </div>
          </div>
        </div>

        <!-- 页面内容区域 -->
        <div class="config-drawer-body">
          <!-- 步骤1：支付参数配置页面 -->
          <div v-if="configStep === 1" class="step-page">
            <div class="page-header">
              <h3>支付参数配置</h3>
              <p>请选择需要配置的支付方式</p>
            </div>

            <div class="payment-methods-grid">
              <div
                v-for="method in paymentMethods"
                :key="method.id"
                class="payment-method-card"
                :class="{ active: method.isActive }"
                @click="handleConfigure(method)"
              >
                <div class="card-header">
                  <img :src="method.icon" :alt="method.name" class="method-icon">
                  <div class="method-name">{{ method.name }}</div>
                </div>
                <div class="card-status">
                  <span class="status-dot" :class="{ active: method.isActive }" />
                  <span class="status-text">{{ method.isActive ? '已开通' : '未开通' }}</span>
                </div>
                <div class="card-actions">
                  <el-button
                    type="primary"
                    size="small"
                    @click.stop="handleConfigure(method)"
                  >
                    填写参数
                  </el-button>
                </div>
              </div>
            </div>
          </div>

          <!-- 步骤2：支付通道配置页面 -->
          <div v-if="configStep === 2" class="step-page">
            <div class="page-header">
              <h3>支付通道配置</h3>
              <p>配置支付通道参数和状态</p>
            </div>

            <!-- 搜索区域 -->
            <div class="search-area">
              <el-form :inline="true" :model="configSearchForm" class="search-form">
                <el-form-item label="支付方式代码">
                  <el-input
                    v-model="configSearchForm.methodCode"
                    placeholder="请输入支付方式代码"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="支付方式名称">
                  <el-input
                    v-model="configSearchForm.methodName"
                    placeholder="请输入支付方式名称"
                    clearable
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="el-icon-search" @click="handleConfigSearch">
                    查询
                  </el-button>
                  <el-button icon="el-icon-refresh" @click="handleConfigReset">
                    重置
                  </el-button>
                </el-form-item>
              </el-form>
            </div>

            <!-- 支付方式表格 -->
            <div class="table-container">
              <el-table v-loading="configLoading" :data="paymentChannels" style="width: 100%">
                <el-table-column prop="methodCode" label="支付方式代码" width="150" />
                <el-table-column prop="methodName" label="支付方式名称" min-width="200" />
                <el-table-column prop="status" label="状态" width="120">
                  <template slot-scope="scope">
                    <span class="status-indicator" :class="{ active: scope.row.status === 'enabled' }">
                      ● {{ scope.row.status === 'enabled' ? '启用' : '禁用' }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      size="small"
                      @click="handleChannelConfig(scope.row)"
                    >
                      配置
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>

              <!-- 分页 -->
              <div class="pagination-container">
                <el-pagination
                  :current-page="configPagination.currentPage"
                  :page-sizes="[10, 20, 50, 100]"
                  :page-size="configPagination.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="configPagination.total"
                  @size-change="handleConfigSizeChange"
                  @current-change="handleConfigCurrentChange"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 固定底部 -->
        <div class="config-drawer-footer">
          <el-button @click="handleConfigClose">
            <i class="el-icon-close" />
            关闭
          </el-button>
          <el-button
            v-if="configStep === 1"
            type="primary"
            @click="nextConfigStep"
          >
            <i class="el-icon-arrow-right" />
            下一步
          </el-button>
          <el-button
            v-if="configStep === 2"
            type="primary"
            @click="prevConfigStep"
          >
            <i class="el-icon-arrow-left" />
            上一步
          </el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'AppList',
  data() {
    return {
      loading: false,
      drawerVisible: false,
      searchForm: {
        merchantId: '',
        appId: '',
        name: '',
        status: ''
      },
      editForm: {
        appId: '',
        merchantId: '',
        name: '',
        status: '1',
        appSecret: '',
        remark: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入应用名称', trigger: 'blur' }
        ]
      },
      tableData: [
        {
          id: 1,
          appId: '689ffdb2e4b0e42ba622b383',
          name: '111',
          merchantId: 'M1679219294',
          status: '1',
          createTime: '2025-08-16 11:40:34'
        },
        {
          id: 2,
          appId: '689ffdb2e4b0e42ba622b384',
          name: '测试应用2',
          merchantId: 'M1679219295',
          status: '1',
          createTime: '2025-08-16 10:30:00'
        },
        {
          id: 3,
          appId: '689ffdb2e4b0e42ba622b385',
          name: '测试应用3',
          merchantId: 'M1679219296',
          status: '0',
          createTime: '2025-08-16 09:20:00'
        },
        {
          id: 4,
          appId: '689ffdb2e4b0e42ba622b386',
          name: '支付应用',
          merchantId: 'M1679219297',
          status: '1',
          createTime: '2025-08-15 16:45:00'
        },
        {
          id: 5,
          appId: '689ffdb2e4b0e42ba622b387',
          name: '电商应用',
          merchantId: 'M1679219298',
          status: '1',
          createTime: '2025-08-15 14:20:00'
        }
      ],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 608
      },
      // 支付配置相关数据
      configDrawerVisible: false,
      configStep: 1,
      configLoading: false,
      configSearchForm: {
        methodCode: '',
        methodName: ''
      },
      configPagination: {
        currentPage: 1,
        pageSize: 10,
        total: 90
      },
      // 支付方式数据
      paymentMethods: [
        {
          id: 1,
          name: '我上早八',
          icon: '/api/placeholder/40/40',
          isActive: false
        },
        {
          id: 2,
          name: '支付宝支付接口',
          icon: '/api/placeholder/40/40',
          isActive: false
        },
        {
          id: 3,
          name: '测试接口',
          icon: '/api/placeholder/40/40',
          isActive: false
        },
        {
          id: 4,
          name: '杜-测试22222222',
          icon: '/api/placeholder/40/40',
          isActive: false
        },
        {
          id: 5,
          name: '富友支付',
          icon: '/api/placeholder/40/40',
          isActive: false
        },
        {
          id: 6,
          name: '拉卡拉支付',
          icon: '/api/placeholder/40/40',
          isActive: false
        },
        {
          id: 7,
          name: 'PayPal支付',
          icon: '/api/placeholder/40/40',
          isActive: false
        },
        {
          id: 8,
          name: 'sy支付宝支付',
          icon: '/api/placeholder/40/40',
          isActive: false
        },
        {
          id: 9,
          name: '云闪付支付',
          icon: '/api/placeholder/40/40',
          isActive: false
        },
        {
          id: 10,
          name: '支付宝支付',
          icon: '/api/placeholder/40/40',
          isActive: false
        },
        {
          id: 11,
          name: '微信88',
          icon: '/api/placeholder/40/40',
          isActive: false
        },
        {
          id: 12,
          name: '微信扫码',
          icon: '/api/placeholder/40/40',
          isActive: false
        }
      ],
      // 支付通道数据
      paymentChannels: [
        {
          id: 1,
          methodCode: '0630',
          methodName: '99999mingc',
          status: 'disabled'
        },
        {
          id: 2,
          methodCode: '1',
          methodName: '1',
          status: 'disabled'
        },
        {
          id: 3,
          methodCode: '100',
          methodName: 'zfb',
          status: 'disabled'
        },
        {
          id: 4,
          methodCode: '11',
          methodName: '111',
          status: 'disabled'
        },
        {
          id: 5,
          methodCode: '1100',
          methodName: '微信服务商',
          status: 'disabled'
        },
        {
          id: 6,
          methodCode: '1111',
          methodName: '测试通道1',
          status: 'disabled'
        },
        {
          id: 7,
          methodCode: '111233',
          methodName: '测试通道2',
          status: 'disabled'
        },
        {
          id: 8,
          methodCode: '12457',
          methodName: '测试通道3',
          status: 'disabled'
        },
        {
          id: 9,
          methodCode: '1333',
          methodName: '测试通道4',
          status: 'disabled'
        },
        {
          id: 10,
          methodCode: '2',
          methodName: '测试通道5',
          status: 'disabled'
        }
      ]
    }
  },
  created() {
    // 检查是否有从商户列表传递过来的商户信息
    if (this.$route.query.merchantId) {
      this.searchForm.merchantId = this.$route.query.merchantId
      // 自动搜索该商户的应用
      this.handleSearch()
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
        appId: '',
        name: '',
        status: ''
      }
    },
    handleAdd() {
      this.$message.info('新增应用功能')
    },
    handleEdit(row) {
      // 打开修改抽屉并填充数据
      this.editForm = {
        appId: row.appId,
        merchantId: row.merchantId,
        name: row.name,
        status: row.status,
        appSecret: 'SjPEdp******9kkhWK', // 模拟私钥数据
        remark: row.remark || ''
      }
      this.drawerVisible = true
    },
    handleConfig(row) {
      // 打开支付配置抽屉
      this.configDrawerVisible = true
      this.configStep = 1
      this.$message.info(`打开支付配置：${row.name}`)
    },
    handleDelete(row) {
      this.$confirm(`确定要删除应用"${row.name}"吗？`, '提示', {
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
        appId: '',
        merchantId: '',
        name: '',
        status: '1',
        appSecret: '',
        remark: ''
      }
    },
    // 随机生成私钥
    generateSecret() {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      let result = ''
      for (let i = 0; i < 32; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      this.editForm.appSecret = result
      this.$message.success('私钥生成成功')
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
    },
    // 支付配置相关方法
    handleConfigClose() {
      this.$confirm('确认关闭支付配置？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.configDrawerVisible = false
        this.configStep = 1
      }).catch(() => {
        // 取消关闭
      })
    },
    goToPage(page) {
      this.configStep = page
    },
    nextConfigStep() {
      this.configStep = 2
    },
    prevConfigStep() {
      this.configStep = 1
    },
    handleConfigure(method) {
      this.$message.info(`配置支付方式：${method.name}`)
    },
    handleConfigSearch() {
      this.configLoading = true
      setTimeout(() => {
        this.configLoading = false
        this.$message.success('搜索完成')
      }, 1000)
    },
    handleConfigReset() {
      this.configSearchForm = {
        methodCode: '',
        methodName: ''
      }
    },
    handleChannelConfig(channel) {
      this.$message.info(`配置支付通道：${channel.methodName}`)
    },
    handleConfigSizeChange(val) {
      this.configPagination.pageSize = val
    },
    handleConfigCurrentChange(val) {
      this.configPagination.currentPage = val
    }
  }
}
</script>

<style lang="scss" scoped>
.app-list-container {
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

   // 支付配置抽屉样式
  .config-drawer-content {
    height: 100%;
    position: relative;
  }

   .config-drawer-header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    padding: 20px 20px 0 20px;
    background: white;
    border-bottom: 1px solid #e4e7ed;
  }

  .config-drawer-body {
    position: absolute;
    top: 80px;
    left: 0;
    right: 0;
    bottom: 60px;
    overflow-y: auto;
    padding: 0;
  }

  // 步骤页面样式
  .step-page {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 30px;
    background: #f8f9fa;

    .page-header {
      margin-bottom: 30px;
      text-align: center;

      h3 {
        font-size: 24px;
        color: #303133;
        margin: 0 0 10px 0;
        font-weight: 600;
      }

      p {
        font-size: 14px;
        color: #909399;
        margin: 0;
      }
    }
  }

   .page-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 30px;
    padding: 20px;
    background: white;
    border-radius: 8px;
    border: 1px solid #e4e7ed;

    .nav-item {
      display: flex;
      align-items: center;
      margin: 0 15px;
      cursor: pointer;
      transition: all 0.3s;
      padding: 12px 24px;
      border-radius: 6px;
      border: 1px solid transparent;

      &:hover {
        background-color: #f5f7fa;
        border-color: #e4e7ed;
      }

      .nav-text {
        color: #909399;
        font-size: 16px;
        font-weight: 500;
        transition: all 0.3s;
      }

      &.active {
        background-color: #409eff;
        border-color: #409eff;

        .nav-text {
          color: white;
          font-weight: 600;
        }

        &:hover {
          background-color: #66b1ff;
        }
      }
    }
  }

 .step-content {
   flex: 1;
   overflow-y: auto;
 }

   // 支付方式网格
  .payment-methods-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    flex: 1;
    padding: 0;
  }

 .payment-method-card {
   border: 1px solid #e4e7ed;
   border-radius: 12px;
   padding: 20px;
   text-align: center;
   transition: all 0.3s;
   cursor: pointer;
   min-height: 160px;
   display: flex;
   flex-direction: column;
   justify-content: space-between;
   background: white;
   position: relative;

   &:hover {
     box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
     transform: translateY(-4px);
     border-color: #409eff;
   }

   &:active {
     transform: translateY(-2px);
   }

   .card-header {
     margin-bottom: 12px;

     .method-icon {
       width: 48px;
       height: 48px;
       border-radius: 8px;
       margin-bottom: 12px;
       object-fit: cover;
     }

     .method-name {
       font-size: 14px;
       color: #303133;
       font-weight: 600;
       line-height: 1.3;
     }
   }

   .card-status {
     margin-bottom: 12px;

     .status-dot {
       display: inline-block;
       width: 6px;
       height: 6px;
       border-radius: 50%;
       background-color: #f56c6c;
       margin-right: 4px;

       &.active {
         background-color: #67c23a;
       }
     }

     .status-text {
       font-size: 12px;
       color: #909399;
       font-weight: 500;
     }
   }

   .card-actions {
     .el-button {
       width: 100%;
       font-size: 13px;
       padding: 8px 16px;
       height: 32px;
       line-height: 16px;
       border-radius: 6px;
       font-weight: 500;
     }
   }
 }

   // 支付通道配置内容
  .channel-config-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

 // 搜索区域
 .search-area {
   margin-bottom: 20px;
   padding: 20px;
   background: #f8f9fa;
   border-radius: 6px;
   border: 1px solid #e4e7ed;

   .search-form {
     .el-form-item {
       margin-bottom: 0;
       margin-right: 15px;
     }
   }
 }

 // 表格容器
 .table-container {
   flex: 1;
   display: flex;
   flex-direction: column;
   background: white;
   border-radius: 6px;
   border: 1px solid #e4e7ed;
   overflow: hidden;

   .el-table {
     flex: 1;
   }

   .status-indicator {
     color: #f56c6c;
     font-size: 12px;

     &.active {
       color: #67c23a;
     }
   }

   .pagination-container {
     padding: 15px 20px;
     background: #f8f9fa;
     border-top: 1px solid #e4e7ed;
     text-align: right;
   }
 }

   // 配置抽屉底部按钮
  .config-drawer-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10;
    padding: 20px;
    text-align: right;
    border-top: 1px solid #e4e7ed;
    background: white;

    .el-button {
      margin-left: 10px;
    }
  }
</style>

