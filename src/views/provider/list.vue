<template>
  <div class="provider-list-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>服务商列表</span>
        <el-button style="float: right; padding: 3px 0" type="primary" @click="handleAdd">新建</el-button>
      </div>

      <!-- 搜索区域 -->
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="服务商名称">
          <el-input v-model="searchForm.name" placeholder="请输入服务商名称" />
        </el-form-item>
        <el-form-item label="服务商号">
          <el-input v-model="searchForm.providerId" placeholder="请输入服务商号" />
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
        <el-table-column prop="name" label="服务商名称" min-width="200" />
        <el-table-column prop="providerId" label="服务商号" min-width="180" />
        <el-table-column prop="status" label="服务商状态" width="120">
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

    <!-- 修改服务商抽屉 -->
    <el-drawer
      title="修改服务商"
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
          <!-- 服务商名称 -->
          <el-form-item label="服务商名称" prop="name">
            <el-input
              v-model="editForm.name"
              placeholder="请输入服务商名称"
            />
          </el-form-item>

          <!-- 服务商简称 -->
          <el-form-item label="服务商简称" prop="shortName">
            <el-input
              v-model="editForm.shortName"
              placeholder="请输入服务商简称"
            />
          </el-form-item>

          <!-- 联系人姓名 -->
          <el-form-item label="联系人姓名">
            <el-input
              v-model="editForm.contactName"
              placeholder="请输入联系人姓名"
            />
          </el-form-item>

          <!-- 联系人手机号 -->
          <el-form-item label="联系人手机号">
            <el-input
              v-model="editForm.contactPhone"
              placeholder="请输入联系人手机号"
            />
          </el-form-item>

          <!-- 联系人邮箱 -->
          <el-form-item label="联系人邮箱">
            <el-input
              v-model="editForm.contactEmail"
              placeholder="请输入联系人邮箱"
            />
          </el-form-item>

          <!-- 状态 -->
          <el-form-item label="状态">
            <el-radio-group v-model="editForm.status">
              <el-radio label="1">启用</el-radio>
              <el-radio label="0">禁用</el-radio>
            </el-radio-group>
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
      title="支付参数列表"
      :visible.sync="configDrawerVisible"
      direction="rtl"
      size="75%"
      :before-close="handleConfigClose"
    >
      <div class="config-drawer-content">
        <!-- 内容区域 -->
        <div class="config-drawer-body">
          <div class="step-page">
            <div class="page-header">
              <h3>支付参数配置</h3>
              <p>请选择需要配置的支付方式</p>
            </div>

            <div class="payment-methods-grid">
              <div
                v-for="method in paymentMethods"
                :key="method.id"
                class="payment-method-card"
                @click="handleConfigure(method)"
              >
                <div class="method-icon">
                  <img :src="method.icon" :alt="method.name">
                </div>
                <div class="method-name">{{ method.name }}</div>
                <div class="method-status">
                  <span class="status-dot" :class="method.status" />
                  <span class="status-text">{{ method.statusText }}</span>
                </div>
                <div class="method-action">
                  <span class="action-text">填写参数 ></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'ProviderList',
  data() {
    return {
      loading: false,
      drawerVisible: false,
      searchForm: {
        name: '',
        providerId: '',
        status: ''
      },
      editForm: {
        name: '',
        shortName: '',
        contactName: '',
        contactPhone: '',
        contactEmail: '',
        status: '1',
        remark: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入服务商名称', trigger: 'blur' }
        ],
        shortName: [
          { required: true, message: '请输入服务商简称', trigger: 'blur' }
        ]
      },
      tableData: [
        {
          id: 1,
          name: '极码云服务商',
          providerId: 'P001',
          status: '1',
          createTime: '2025-08-15 10:30:00'
        },
        {
          id: 2,
          name: '测试服务商',
          providerId: 'P002',
          status: '1',
          createTime: '2025-08-14 15:20:00'
        },
        {
          id: 3,
          name: '支付服务商',
          providerId: 'P003',
          status: '0',
          createTime: '2025-08-13 09:45:00'
        },
        {
          id: 4,
          name: '电商服务商',
          providerId: 'P004',
          status: '1',
          createTime: '2025-08-12 14:15:00'
        },
        {
          id: 5,
          name: '金融服务商',
          providerId: 'P005',
          status: '1',
          createTime: '2025-08-11 11:30:00'
        }
      ],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 5
      },
      // 支付配置抽屉相关数据
      configDrawerVisible: false,
      paymentMethods: [
        {
          id: 1,
          name: '我上早八',
          icon: 'https://via.placeholder.com/48x48/4CAF50/FFFFFF?text=1',
          status: 'disabled',
          statusText: '未开通'
        },
        {
          id: 2,
          name: '测试接口',
          icon: 'https://via.placeholder.com/48x48/2196F3/FFFFFF?text=2',
          status: 'disabled',
          statusText: '未开通'
        },
        {
          id: 3,
          name: '杜-测试22222222',
          icon: 'https://via.placeholder.com/48x48/FF9800/FFFFFF?text=3',
          status: 'disabled',
          statusText: '未开通'
        },
        {
          id: 4,
          name: '富友支付',
          icon: 'https://via.placeholder.com/48x48/9C27B0/FFFFFF?text=4',
          status: 'disabled',
          statusText: '未开通'
        },
        {
          id: 5,
          name: '拉卡拉支付',
          icon: 'https://via.placeholder.com/48x48/607D8B/FFFFFF?text=5',
          status: 'disabled',
          statusText: '未开通'
        },
        {
          id: 6,
          name: 'PayPal支付',
          icon: 'https://via.placeholder.com/48x48/3F51B5/FFFFFF?text=6',
          status: 'disabled',
          statusText: '未开通'
        },
        {
          id: 7,
          name: '云闪付支付',
          icon: 'https://via.placeholder.com/48x48/E91E63/FFFFFF?text=7',
          status: 'disabled',
          statusText: '未开通'
        },
        {
          id: 8,
          name: '微信88',
          icon: 'https://via.placeholder.com/48x48/4CAF50/FFFFFF?text=8',
          status: 'disabled',
          statusText: '未开通'
        },
        {
          id: 9,
          name: '信联支付',
          icon: 'https://via.placeholder.com/48x48/00BCD4/FFFFFF?text=9',
          status: 'disabled',
          statusText: '未开通'
        },
        {
          id: 10,
          name: '支付宝宝',
          icon: 'https://via.placeholder.com/48x48/FF5722/FFFFFF?text=10',
          status: 'disabled',
          statusText: '未开通'
        }
      ]
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
        name: '',
        providerId: '',
        status: ''
      }
    },
    handleAdd() {
      this.$message.info('新增服务商功能')
    },
    handleEdit(row) {
      // 打开修改抽屉并填充数据
      this.editForm = {
        name: row.name,
        shortName: row.shortName || '123', // 模拟数据
        contactName: row.contactName || '服务商名称', // 模拟数据
        contactPhone: row.contactPhone || '13388888888', // 模拟数据
        contactEmail: row.contactEmail || '',
        status: row.status,
        remark: row.remark || ''
      }
      this.drawerVisible = true
    },
    handleConfig(row) {
      // 打开支付配置抽屉
      this.configDrawerVisible = true
      this.$message.info(`支付配置：${row.name}`)
    },
    handleDelete(row) {
      this.$confirm(`确定要删除服务商"${row.name}"吗？`, '提示', {
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
        name: '',
        shortName: '',
        contactName: '',
        contactPhone: '',
        contactEmail: '',
        status: '1',
        remark: ''
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
    },
    // 支付配置抽屉相关方法
    handleConfigClose() {
      this.$confirm('确认关闭？未保存的数据将会丢失', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.configDrawerVisible = false
      }).catch(() => {
        // 取消关闭
      })
    },
    handleConfigure(method) {
      this.$message.info(`配置支付方式：${method.name}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.provider-list-container {
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
    display: flex;
    flex-direction: column;
  }

  .config-drawer-body {
    flex: 1;
    overflow-y: auto;
    padding: 0;
  }

   .step-page {
    padding: 20px;
  }

  .page-header {
    margin-bottom: 20px;

    h3 {
      margin: 0 0 8px 0;
      font-size: 18px;
      font-weight: 600;
      color: #303133;
    }

    p {
      margin: 0;
      color: #909399;
      font-size: 14px;
    }
  }

  .payment-methods-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  .payment-method-card {
    background: white;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    padding: 20px;
    min-height: 160px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      border-color: #409eff;
    }

    .method-icon {
      text-align: center;
      margin-bottom: 12px;

      img {
        width: 48px;
        height: 48px;
        border-radius: 8px;
      }
    }

    .method-name {
      text-align: center;
      font-size: 14px;
      font-weight: 500;
      color: #303133;
      margin-bottom: 8px;
    }

    .method-status {
      text-align: center;
      margin-bottom: 12px;

      .status-dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-right: 6px;

        &.disabled {
          background-color: #f56c6c;
        }
      }

      .status-text {
        font-size: 12px;
        color: #909399;
      }
    }

    .method-action {
      text-align: center;

      .action-text {
        color: #409eff;
        font-size: 12px;
        font-weight: 500;
      }
    }
  }
 </style>
