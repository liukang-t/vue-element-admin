<template>
  <div class="merchant-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>商户管理</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>商户列表</span>
              <el-button style="float: right; padding: 3px 0" type="text" @click="showMerchantTable = !showMerchantTable">
                {{ showMerchantTable ? '隐藏详情' : '查看详情' }}
              </el-button>
            </div>
            <div class="item">
              <span>总商户数：</span>
              <span class="number">128</span>
            </div>
            <div class="item">
              <span>活跃商户：</span>
              <span class="number">96</span>
            </div>
            <div class="item">
              <span>新增商户：</span>
              <span class="number">12</span>
            </div>

            <!-- 商户表格 -->
            <div v-if="showMerchantTable" class="merchant-table">
              <el-table :data="merchantList" style="width: 100%" size="mini">
                <el-table-column prop="merchantId" label="商户号" width="120" />
                <el-table-column prop="merchantName" label="商户名称" />
                <el-table-column prop="status" label="状态" width="80">
                  <template slot-scope="scope">
                    <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
                      {{ scope.row.status === 1 ? '启用' : '停用' }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="openEditDrawer(scope.row)">
                      修改
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>应用列表</span>
              <el-button style="float: right; padding: 3px 0" type="text" @click="showAppTable = !showAppTable">
                {{ showAppTable ? '隐藏详情' : '查看详情' }}
              </el-button>
            </div>
            <div class="item">
              <span>总应用数：</span>
              <span class="number">256</span>
            </div>
            <div class="item">
              <span>活跃应用：</span>
              <span class="number">198</span>
            </div>
            <div class="item">
              <span>新增应用：</span>
              <span class="number">24</span>
            </div>

            <!-- 应用表格 -->
            <div v-if="showAppTable" class="app-table">
              <el-table :data="appList" style="width: 100%" size="mini">
                <el-table-column prop="appId" label="应用ID" width="120" />
                <el-table-column prop="appName" label="应用名称" />
                <el-table-column prop="status" label="状态" width="80">
                  <template slot-scope="scope">
                    <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
                      {{ scope.row.status === 1 ? '启用' : '停用' }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="openEditDrawer(scope.row)">
                      修改
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <!-- 测试按钮 -->
            <div style="margin-top: 20px; text-align: center;">
              <el-button type="primary" @click="openEditDrawer()">
                测试修改应用抽屉
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <!-- 修改应用抽屉 -->
    <el-drawer
      title="修改应用"
      :visible.sync="drawerVisible"
      direction="rtl"
      size="500px"
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
          <el-form-item label="应用名称" prop="appName">
            <el-input
              v-model="editForm.appName"
              placeholder="请输入应用名称"
            />
          </el-form-item>

          <!-- 状态 -->
          <el-form-item label="状态">
            <el-radio-group v-model="editForm.status">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">停用</el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- 私钥 AppSecret -->
          <el-form-item label="私钥 AppSecret">
            <el-input
              v-model="editForm.appSecret"
              type="textarea"
              :rows="4"
              placeholder="请输入私钥 AppSecret"
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
              placeholder="请输入备注信息"
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
  </div>
</template>

<script>
export default {
  name: 'MerchantIndex',
  data() {
    return {
      drawerVisible: false,
      showMerchantTable: false,
      showAppTable: false,
      editForm: {
        appId: '689ffdb2e4b0e42ba622b383',
        merchantId: 'M1679219294',
        appName: '',
        status: 1,
        appSecret: '',
        remark: ''
      },
      rules: {
        appName: [
          { required: true, message: '请输入应用名称', trigger: 'blur' }
        ]
      },
      // 模拟商户数据
      merchantList: [
        {
          merchantId: 'M1679219294',
          merchantName: '测试商户1',
          status: 1
        },
        {
          merchantId: 'M1679219295',
          merchantName: '测试商户2',
          status: 0
        },
        {
          merchantId: 'M1679219296',
          merchantName: '测试商户3',
          status: 1
        }
      ],
      // 模拟应用数据
      appList: [
        {
          appId: '689ffdb2e4b0e42ba622b383',
          appName: '测试应用1',
          merchantId: 'M1679219294',
          status: 1,
          appSecret: 'SjPEdp******9kkhWK',
          remark: '测试应用1的备注'
        },
        {
          appId: '689ffdb2e4b0e42ba622b384',
          appName: '测试应用2',
          merchantId: 'M1679219295',
          status: 0,
          appSecret: 'SjPEdp******9kkhWK',
          remark: '测试应用2的备注'
        },
        {
          appId: '689ffdb2e4b0e42ba622b385',
          appName: '测试应用3',
          merchantId: 'M1679219296',
          status: 1,
          appSecret: 'SjPEdp******9kkhWK',
          remark: '测试应用3的备注'
        }
      ]
    }
  },
  methods: {
    // 打开修改抽屉
    openEditDrawer(row) {
      this.drawerVisible = true
      // 如果有传入数据，则填充表单
      if (row) {
        this.editForm = {
          appId: row.appId || '689ffdb2e4b0e42ba622b383',
          merchantId: row.merchantId || 'M1679219294',
          appName: row.appName || '',
          status: row.status !== undefined ? row.status : 1,
          appSecret: row.appSecret || '',
          remark: row.remark || ''
        }
      }
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
        appId: '689ffdb2e4b0e42ba622b383',
        merchantId: 'M1679219294',
        appName: '',
        status: 1,
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
    }
  }
}
</script>

<style lang="scss" scoped>
.merchant-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 84px);
}

.box-card {
  margin-bottom: 20px;

  .item {
    margin-bottom: 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .number {
      font-size: 20px;
      font-weight: bold;
      color: #409EFF;
    }
  }
}

// 表格样式
.merchant-table,
.app-table {
  margin-top: 15px;
  border-top: 1px solid #ebeef5;
  padding-top: 15px;
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
</style>
