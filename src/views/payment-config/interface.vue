<template>
  <div class="payment-interface-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>支付接口</span>
      </div>

      <!-- 信息横幅 -->
      <div class="info-banner">
        <div class="banner-content">
          <span>计全科技已开放支付接口购买渠道，官方团队开发、源码提供、下载后直接使用。</span>
          <div class="banner-links">
            <el-link type="primary" @click="handleDownload">接口下载、安装说明。</el-link>
            <el-link type="primary" @click="handleMarket">前往接口市场 ></el-link>
          </div>
        </div>
      </div>

      <!-- 支付接口卡片网格 -->
      <div class="interface-grid">
        <!-- 新建支付接口卡片 -->
        <div class="interface-card new-card" @click="handleAdd">
          <div class="card-content">
            <i class="el-icon-plus new-icon" />
            <div class="new-text">新建支付接口</div>
          </div>
        </div>

        <!-- 现有支付接口卡片 -->
        <div
          v-for="item in interfaceList"
          :key="item.id"
          class="interface-card"
          :class="item.cardColor"
        >
          <div class="card-content">
            <div class="interface-icon">
              <img v-if="item.icon" :src="item.icon" :alt="item.name">
              <i v-else class="el-icon-money" />
            </div>
            <div class="interface-name">{{ item.name }}</div>
            <div class="card-actions">
              <el-button
                type="text"
                size="mini"
                icon="el-icon-edit"
                @click="handleEdit(item)"
              />
              <el-button
                type="text"
                size="mini"
                icon="el-icon-delete"
                style="color: #F56C6C;"
                @click="handleDelete(item)"
              />
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 新建支付接口抽屉 -->
    <el-drawer
      title="新增支付接口"
      :visible.sync="addDrawerVisible"
      direction="rtl"
      size="60%"
      :before-close="handleAddClose"
      :wrapper-closable="true"
    >
      <div class="add-drawer-content">
        <el-form
          ref="addForm"
          :model="addForm"
          :rules="addRules"
          label-width="200px"
          class="add-form"
        >
          <!-- 基本信息 -->
          <el-form-item label="* 接口代码" prop="interfaceCode">
            <el-input v-model="addForm.interfaceCode" placeholder="请输入" />
          </el-form-item>

          <el-form-item label="* 接口名称" prop="interfaceName">
            <el-input v-model="addForm.interfaceName" placeholder="请输入" />
          </el-form-item>

          <el-form-item label="是否支持普通商户模式">
            <el-radio-group v-model="addForm.supportNormalMerchant">
              <el-radio :label="true">支持</el-radio>
              <el-radio :label="false">不支持</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="是否支持服务商子商户模式">
            <el-radio-group v-model="addForm.supportProviderMerchant">
              <el-radio :label="true">支持</el-radio>
              <el-radio :label="false">不支持</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="支付参数配置页面类型">
            <el-radio-group v-model="addForm.configPageType">
              <el-radio value="auto">根据接口配置定义描述渲染页面</el-radio>
              <el-radio value="custom">自定义页面</el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- 接口配置定义描述 -->
          <el-form-item label="服务商接口配置定义描述">
            <el-input
              v-model="addForm.providerConfigDesc"
              type="textarea"
              :rows="4"
              placeholder="请输入"
            />
          </el-form-item>

          <el-form-item label="特约商户接口配置定义描述">
            <el-input
              v-model="addForm.specialMerchantConfigDesc"
              type="textarea"
              :rows="4"
              placeholder="请输入"
            />
          </el-form-item>

          <el-form-item label="普通商户接口配置定义描述">
            <el-input
              v-model="addForm.normalMerchantConfigDesc"
              type="textarea"
              :rows="4"
              placeholder="请输入"
            />
          </el-form-item>

          <!-- 状态和备注 -->
          <el-form-item label="状态">
            <el-radio-group v-model="addForm.status">
              <el-radio value="enabled">启用</el-radio>
              <el-radio value="disabled">停用</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="备注">
            <el-input v-model="addForm.remark" placeholder="请输入" />
          </el-form-item>

          <!-- 支持的支付方式 -->
          <el-form-item label="支持的支付方式">
            <div class="payment-methods-grid">
              <el-checkbox
                v-for="method in paymentMethods"
                :key="method.id"
                v-model="method.checked"
                class="payment-method-item"
              >
                {{ method.name }}
              </el-checkbox>
            </div>
          </el-form-item>

          <!-- 页面展示配置 -->
          <el-form-item label="页面展示: 卡片icon">
            <el-upload
              class="upload-demo"
              action="#"
              :auto-upload="false"
              :on-change="handleIconChange"
            >
              <el-button size="small" type="primary" icon="el-icon-upload2">点击上传</el-button>
            </el-upload>
          </el-form-item>

          <el-form-item label="页面展示: 卡片背景色">
            <el-input v-model="addForm.cardBackgroundColor" placeholder="请输入" />
          </el-form-item>
        </el-form>

        <!-- 抽屉底部按钮 -->
        <div class="drawer-footer">
          <el-button icon="el-icon-close" @click="handleAddClose">取消</el-button>
          <el-button type="primary" icon="el-icon-check" @click="handleAddSave">保存</el-button>
        </div>
      </div>
    </el-drawer>

    <!-- 编辑支付接口抽屉 -->
    <el-drawer
      title="编辑支付接口"
      :visible.sync="editDrawerVisible"
      direction="rtl"
      size="60%"
      :before-close="handleEditClose"
      :wrapper-closable="true"
    >
      <div class="add-drawer-content">
        <el-form
          ref="editForm"
          :model="editForm"
          :rules="editRules"
          label-width="200px"
          class="add-form"
        >
          <!-- 基本信息 -->
          <el-form-item label="* 接口代码" prop="interfaceCode">
            <el-input v-model="editForm.interfaceCode" placeholder="请输入" />
          </el-form-item>

          <el-form-item label="* 接口名称" prop="interfaceName">
            <el-input v-model="editForm.interfaceName" placeholder="请输入" />
          </el-form-item>

          <el-form-item label="是否支持普通商户模式">
            <el-radio-group v-model="editForm.supportNormalMerchant">
              <el-radio :label="true">支持</el-radio>
              <el-radio :label="false">不支持</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="是否支持服务商子商户模式">
            <el-radio-group v-model="editForm.supportProviderMerchant">
              <el-radio :label="true">支持</el-radio>
              <el-radio :label="false">不支持</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="支付参数配置页面类型">
            <el-radio-group v-model="editForm.configPageType">
              <el-radio value="auto">根据接口配置定义描述渲染页面</el-radio>
              <el-radio value="custom">自定义页面</el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- 接口配置定义描述 -->
          <el-form-item label="服务商接口配置定义描述">
            <el-input
              v-model="editForm.providerConfigDesc"
              type="textarea"
              :rows="4"
              placeholder="请输入"
            />
          </el-form-item>

          <el-form-item label="特约商户接口配置定义描述">
            <el-input
              v-model="editForm.specialMerchantConfigDesc"
              type="textarea"
              :rows="4"
              placeholder="请输入"
            />
          </el-form-item>

          <el-form-item label="普通商户接口配置定义描述">
            <el-input
              v-model="editForm.normalMerchantConfigDesc"
              type="textarea"
              :rows="4"
              placeholder="请输入"
            />
          </el-form-item>

          <!-- 状态和备注 -->
          <el-form-item label="状态">
            <el-radio-group v-model="editForm.status">
              <el-radio value="enabled">启用</el-radio>
              <el-radio value="disabled">停用</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="备注">
            <el-input v-model="editForm.remark" placeholder="请输入" />
          </el-form-item>

          <!-- 支持的支付方式 -->
          <el-form-item label="支持的支付方式">
            <div class="payment-methods-grid">
              <el-checkbox
                v-for="method in editPaymentMethods"
                :key="method.id"
                v-model="method.checked"
                class="payment-method-item"
              >
                {{ method.name }}
              </el-checkbox>
            </div>
          </el-form-item>

          <!-- 页面展示配置 -->
          <el-form-item label="页面展示: 卡片icon">
            <el-upload
              class="upload-demo"
              action="#"
              :auto-upload="false"
              :on-change="handleEditIconChange"
            >
              <el-button size="small" type="primary" icon="el-icon-upload2">点击上传</el-button>
            </el-upload>
          </el-form-item>

          <el-form-item label="页面展示: 卡片背景色">
            <el-input v-model="editForm.cardBackgroundColor" placeholder="请输入" />
          </el-form-item>
        </el-form>

        <!-- 抽屉底部按钮 -->
        <div class="drawer-footer">
          <el-button icon="el-icon-close" @click="handleEditClose">取消</el-button>
          <el-button type="primary" icon="el-icon-check" @click="handleEditSave">保存</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'PaymentInterface',
  data() {
    return {
      interfaceList: [
        {
          id: 1,
          name: '支付宝支付',
          icon: '',
          cardColor: 'card-black'
        },
        {
          id: 2,
          name: '支付宝支付接口',
          icon: '',
          cardColor: 'card-blue'
        },
        {
          id: 3,
          name: 'PayPal支付',
          icon: '',
          cardColor: 'card-blue'
        },
        {
          id: 4,
          name: '拉卡拉支付',
          icon: '',
          cardColor: 'card-blue'
        },
        {
          id: 5,
          name: '云闪付支付',
          icon: '',
          cardColor: 'card-red'
        },
        {
          id: 6,
          name: '富友支付',
          icon: '',
          cardColor: 'card-blue'
        },
        {
          id: 7,
          name: '信联支付',
          icon: '',
          cardColor: 'card-blue'
        },
        {
          id: 8,
          name: '微信88',
          icon: '',
          cardColor: 'card-white'
        },
        {
          id: 9,
          name: '普通商户支付方式',
          icon: '',
          cardColor: 'card-white'
        },
        {
          id: 10,
          name: '微信扫码',
          icon: '',
          cardColor: 'card-white'
        },
        {
          id: 11,
          name: '美团支付',
          icon: '',
          cardColor: 'card-white'
        },
        {
          id: 12,
          name: '支付宝宝',
          icon: '',
          cardColor: 'card-white'
        },
        {
          id: 13,
          name: '测试接口',
          icon: '',
          cardColor: 'card-white'
        },
        {
          id: 14,
          name: '杜-测试22222222',
          icon: '',
          cardColor: 'card-green'
        },
        {
          id: 15,
          name: '我上早八',
          icon: '',
          cardColor: 'card-white'
        },
        {
          id: 16,
          name: 'sy支付宝支付',
          icon: '',
          cardColor: 'card-white'
        }
      ],
      // 新建支付接口抽屉相关数据
      addDrawerVisible: false,
      addForm: {
        interfaceCode: '',
        interfaceName: '',
        supportNormalMerchant: true,
        supportProviderMerchant: true,
        configPageType: 'auto',
        providerConfigDesc: '',
        specialMerchantConfigDesc: '',
        normalMerchantConfigDesc: '',
        status: 'enabled',
        remark: '',
        cardBackgroundColor: ''
      },
      addRules: {
        interfaceCode: [
          { required: true, message: '请输入接口代码', trigger: 'blur' }
        ],
        interfaceName: [
          { required: true, message: '请输入接口名称', trigger: 'blur' }
        ]
      },
      // 编辑支付接口抽屉相关数据
      editDrawerVisible: false,
      editForm: {
        id: null,
        interfaceCode: '',
        interfaceName: '',
        supportNormalMerchant: true,
        supportProviderMerchant: true,
        configPageType: 'auto',
        providerConfigDesc: '',
        specialMerchantConfigDesc: '',
        normalMerchantConfigDesc: '',
        status: 'enabled',
        remark: '',
        cardBackgroundColor: ''
      },
      editRules: {
        interfaceCode: [
          { required: true, message: '请输入接口代码', trigger: 'blur' }
        ],
        interfaceName: [
          { required: true, message: '请输入接口名称', trigger: 'blur' }
        ]
      },
      editPaymentMethods: [],
      paymentMethods: [
        { id: 1, name: '99999mingc', checked: false },
        { id: 2, name: '1', checked: false },
        { id: 3, name: 'zfb', checked: false },
        { id: 4, name: '111', checked: false },
        { id: 5, name: '微信服务商', checked: false },
        { id: 6, name: '1', checked: false },
        { id: 7, name: '1123', checked: false },
        { id: 8, name: '11111222', checked: false },
        { id: 9, name: '2', checked: false },
        { id: 10, name: '2', checked: false },
        { id: 11, name: '22', checked: false },
        { id: 12, name: '云闪付', checked: false },
        { id: 13, name: '云闪付', checked: false },
        { id: 14, name: '微信支付', checked: false },
        { id: 15, name: 'LEO支付', checked: false },
        { id: 16, name: 'hahahah', checked: false },
        { id: 17, name: 'weixin', checked: false },
        { id: 18, name: 'a', checked: false },
        { id: 19, name: '支付宝支付', checked: false },
        { id: 20, name: '支付宝条码', checked: false },
        { id: 21, name: '支付宝测试001', checked: false },
        { id: 22, name: '支付宝App', checked: false },
        { id: 23, name: '支付15415', checked: false },
        { id: 24, name: '支付宝Tofu_168A', checked: false },
        { id: 25, name: '支付宝h5支付', checked: false },
        { id: 26, name: '支付宝生活号', checked: false },
        { id: 27, name: '支付宝小程序', checked: false },
        { id: 28, name: '支付宝PC网站', checked: false },
        { id: 29, name: '支付宝二维码', checked: false },
        { id: 30, name: '支付宝WAP', checked: false },
        { id: 31, name: '安全发', checked: false },
        { id: 32, name: 'boss印度支付', checked: false },
        { id: 33, name: '建行聚合主扫', checked: false },
        { id: 34, name: 'd9pay', checked: false },
        { id: 35, name: 'DAASR支付', checked: false },
        { id: 36, name: 'daodaodao', checked: false },
        { id: 37, name: 'asdasd', checked: false },
        { id: 38, name: '富有', checked: false },
        { id: 39, name: 'GGY付条码', checked: false },
        { id: 40, name: '支付宝咯', checked: false },
        { id: 41, name: 'hahaha', checked: false },
        { id: 42, name: 'hu530钱包支付', checked: false },
        { id: 43, name: '汇付', checked: false },
        { id: 44, name: 'jeepay666', checked: false },
        { id: 45, name: 'jeepay6669999', checked: false },
        { id: 46, name: '美团app', checked: false },
        { id: 47, name: 'PayPal支付', checked: false },
        { id: 48, name: '钱包', checked: false },
        { id: 49, name: '聚合', checked: false },
        { id: 50, name: 'ZFFS-1', checked: false },
        { id: 51, name: '安全发', checked: false },
        { id: 52, name: '商支付测试', checked: false },
        { id: 53, name: '丰付微信公众号支付', checked: false },
        { id: 54, name: 'test', checked: false },
        { id: 55, name: '测试支付方式', checked: false },
        { id: 56, name: 'TEST111', checked: false },
        { id: 57, name: '测试支付', checked: false },
        { id: 58, name: '通联', checked: false },
        { id: 59, name: '银联商务', checked: false },
        { id: 60, name: '银联App支付', checked: false },
        { id: 61, name: '银联二维码(被扫)', checked: false },
        { id: 62, name: '银联二维码(主扫)', checked: false },
        { id: 63, name: 'w2pay', checked: false },
        { id: 64, name: '微信扫码支付', checked: false },
        { id: 65, name: 'wlf', checked: false },
        { id: 66, name: '微信支付', checked: false },
        { id: 67, name: 'wx-code', checked: false },
        { id: 68, name: '微信扫码测试', checked: false },
        { id: 69, name: '微信支付', checked: false },
        { id: 70, name: '微信APP', checked: false },
        { id: 71, name: '微信付款码', checked: false },
        { id: 72, name: '微信H5', checked: false },
        { id: 73, name: '微信公众号', checked: false },
        { id: 74, name: '微信小程序', checked: false },
        { id: 75, name: '微信扫码', checked: false },
        { id: 76, name: '信联支付宝支付', checked: false },
        { id: 77, name: '信用卡', checked: false },
        { id: 78, name: '云闪付条码', checked: false },
        { id: 79, name: '云闪付jsapi', checked: false },
        { id: 80, name: '云闪付小程序', checked: false },
        { id: 81, name: '银盛支付', checked: false },
        { id: 82, name: '支付宝', checked: false },
        { id: 83, name: '支付宝花呗分期', checked: false },
        { id: 84, name: '测试兴业', checked: false }
      ]
    }
  },
  methods: {
    handleAdd() {
      this.addDrawerVisible = true
      this.resetAddForm()
    },
    handleEdit(item) {
      this.editDrawerVisible = true
      this.loadEditData(item)
    },
    handleDelete(item) {
      this.$confirm(`确定要删除支付接口"${item.name}"吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('删除成功')
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    handleDownload() {
      this.$message.info('接口下载、安装说明')
    },
    handleMarket() {
      this.$message.info('前往接口市场')
    },
    // 新建支付接口抽屉相关方法
    handleAddClose() {
      this.addDrawerVisible = false
      this.resetAddForm()
    },
    resetAddForm() {
      this.addForm = {
        interfaceCode: '',
        interfaceName: '',
        supportNormalMerchant: true,
        supportProviderMerchant: true,
        configPageType: 'auto',
        providerConfigDesc: '',
        specialMerchantConfigDesc: '',
        normalMerchantConfigDesc: '',
        status: 'enabled',
        remark: '',
        cardBackgroundColor: ''
      }
      // 重置所有支付方式选择
      this.paymentMethods.forEach(method => {
        method.checked = false
      })
      // 清除表单验证
      this.$nextTick(() => {
        if (this.$refs.addForm) {
          this.$refs.addForm.clearValidate()
        }
      })
    },
    handleAddSave() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          // 获取选中的支付方式
          const selectedMethods = this.paymentMethods.filter(method => method.checked)

          // 构建保存数据
          const saveData = {
            ...this.addForm,
            selectedPaymentMethods: selectedMethods.map(method => method.name)
          }

          console.log('保存数据:', saveData)
          this.$message.success('保存成功')
          this.addDrawerVisible = false
          this.resetAddForm()
        } else {
          this.$message.error('请填写必填项')
        }
      })
    },
    handleIconChange(file) {
      console.log('上传文件:', file)
      this.$message.info('文件上传功能')
    },
    // 编辑支付接口抽屉相关方法
    handleEditClose() {
      this.editDrawerVisible = false
      this.resetEditForm()
    },
    loadEditData(item) {
      // 模拟加载编辑数据
      this.editForm = {
        id: item.id,
        interfaceCode: item.name.toLowerCase().replace(/\s+/g, '_'),
        interfaceName: item.name,
        supportNormalMerchant: true,
        supportProviderMerchant: true,
        configPageType: 'auto',
        providerConfigDesc: `这是${item.name}的服务商接口配置定义描述示例`,
        specialMerchantConfigDesc: `这是${item.name}的特约商户接口配置定义描述示例`,
        normalMerchantConfigDesc: `这是${item.name}的普通商户接口配置定义描述示例`,
        status: 'enabled',
        remark: `${item.name}接口备注信息`,
        cardBackgroundColor: this.getCardColor(item.cardColor)
      }

      // 复制支付方式数据并设置一些默认选中项
      this.editPaymentMethods = this.paymentMethods.map(method => ({
        ...method,
        checked: Math.random() > 0.7 // 随机选中30%的支付方式
      }))
    },
    resetEditForm() {
      this.editForm = {
        id: null,
        interfaceCode: '',
        interfaceName: '',
        supportNormalMerchant: true,
        supportProviderMerchant: true,
        configPageType: 'auto',
        providerConfigDesc: '',
        specialMerchantConfigDesc: '',
        normalMerchantConfigDesc: '',
        status: 'enabled',
        remark: '',
        cardBackgroundColor: ''
      }
      this.editPaymentMethods = []
      // 清除表单验证
      this.$nextTick(() => {
        if (this.$refs.editForm) {
          this.$refs.editForm.clearValidate()
        }
      })
    },
    handleEditSave() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          // 获取选中的支付方式
          const selectedMethods = this.editPaymentMethods.filter(method => method.checked)

          // 构建保存数据
          const saveData = {
            ...this.editForm,
            selectedPaymentMethods: selectedMethods.map(method => method.name)
          }

          console.log('编辑保存数据:', saveData)
          this.$message.success('编辑保存成功')
          this.editDrawerVisible = false
          this.resetEditForm()
        } else {
          this.$message.error('请填写必填项')
        }
      })
    },
    handleEditIconChange(file) {
      console.log('编辑上传文件:', file)
      this.$message.info('编辑文件上传功能')
    },
    getCardColor(cardColor) {
      const colorMap = {
        'card-blue': '#667eea',
        'card-red': '#f093fb',
        'card-green': '#4facfe',
        'card-black': '#2c3e50',
        'card-white': '#ffffff'
      }
      return colorMap[cardColor] || '#ffffff'
    }
  }
}
</script>

<style lang="scss" scoped>
.payment-interface-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 84px);
  width: 100%;

  .el-card {
    width: 100%;
  }
}

.info-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px 20px;
  border-radius: 8px;
  margin-bottom: 24px;

  .banner-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;

    span {
      font-size: 14px;
      line-height: 1.5;
    }

    .banner-links {
      display: flex;
      gap: 16px;

      .el-link {
        color: white;
        font-size: 14px;

        &:hover {
          color: #e6f7ff;
        }
      }
    }
  }
}

.interface-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  padding: 0;
}

.interface-card {
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .card-content {
    text-align: center;
    width: 100%;
  }

  .interface-icon {
    margin-bottom: 12px;
    font-size: 32px;
    color: #666;

    img {
      width: 48px;
      height: 48px;
      object-fit: contain;
    }
  }

  .interface-name {
    font-size: 14px;
    color: #333;
    margin-bottom: 8px;
    word-break: break-word;
  }

  .card-actions {
    position: absolute;
    bottom: 8px;
    right: 8px;
    opacity: 0;
    transition: opacity 0.3s ease;

    .el-button {
      padding: 4px;
      margin-left: 4px;
    }
  }

  &:hover .card-actions {
    opacity: 1;
  }

  // 新建卡片样式
  &.new-card {
    border: 2px dashed #d9d9d9;
    background: #fafafa;
    color: #999;

    .new-icon {
      font-size: 32px;
      margin-bottom: 8px;
    }

    .new-text {
      font-size: 14px;
    }

    &:hover {
      border-color: #409eff;
      color: #409eff;
      background: #f0f9ff;
    }
  }

  // 不同颜色的卡片
  &.card-white {
    background: white;
    border: 1px solid #e8e8e8;
  }

  &.card-blue {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;

    .interface-name {
      color: white;
    }

    .interface-icon {
      color: white;
    }
  }

  &.card-red {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: white;

    .interface-name {
      color: white;
    }

    .interface-icon {
      color: white;
    }
  }

  &.card-green {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    color: white;

    .interface-name {
      color: white;
    }

    .interface-icon {
      color: white;
    }
  }

  &.card-black {
    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
    color: white;

    .interface-name {
      color: white;
    }

    .interface-icon {
      color: white;
    }
  }
}

@media (max-width: 768px) {
  .interface-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }

  .info-banner .banner-content {
    flex-direction: column;
    align-items: flex-start;
  }
}

// 新建支付接口抽屉样式
.add-drawer-content {
  padding: 20px;
  height: calc(100vh - 120px);
  overflow-y: auto;
  overflow-x: hidden;
}

.add-form {
  margin-bottom: 80px;
}

.payment-methods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 16px;
  background-color: #fafafa;
}

.payment-method-item {
  margin: 0;
  padding: 8px 12px;
  border-radius: 4px;
  background-color: white;
  border: 1px solid #e4e7ed;
  transition: all 0.3s ease;

  &:hover {
    border-color: #409eff;
    background-color: #f0f9ff;
  }

  .el-checkbox__label {
    font-size: 13px;
    color: #606266;
  }
}

.drawer-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background-color: white;
  border-top: 1px solid #e4e7ed;
  text-align: right;
  z-index: 10;

  .el-button {
    margin-left: 12px;
  }
}

.upload-demo {
  .el-upload {
    width: 100%;
  }
}
</style>
