<template>
  <div class="payment-transfer-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>转账订单</span>
      </div>

      <!-- 搜索区域 -->
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="searchForm.startTime"
            type="datetime"
            placeholder="选择开始时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="searchForm.endTime"
            type="datetime"
            placeholder="选择结束时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="订单号">
          <el-input v-model="searchForm.orderNo" placeholder="转账/商户渠道订单号" />
        </el-form-item>
        <el-form-item label="商户号">
          <el-input v-model="searchForm.merchantId" placeholder="请输入商户号" />
        </el-form-item>
        <el-form-item label="应用APPID">
          <el-input v-model="searchForm.appId" placeholder="请输入应用APPID" />
        </el-form-item>
        <el-form-item label="转账状态">
          <el-select v-model="searchForm.transferStatus" placeholder="请选择转账状态">
            <el-option label="全部" value="" />
            <el-option label="转账成功" value="success" />
            <el-option label="转账失败" value="failed" />
            <el-option label="转账中" value="pending" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
          <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table v-loading="loading" :data="tableData" style="width: 100%">
        <el-table-column prop="transferAmount" label="转账金额" width="120">
          <template slot-scope="scope">
            <span>¥{{ scope.row.transferAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="merchantName" label="商户名称" min-width="150" />
        <el-table-column prop="orderNo" label="订单号" min-width="200" />
        <el-table-column prop="receiverAccount" label="收款账号" min-width="180" />
        <el-table-column prop="receiverName" label="收款人姓名" width="120" />
        <el-table-column prop="transferRemark" label="转账备注" min-width="150" />
        <el-table-column prop="transferStatus" label="状态" width="120">
          <template slot-scope="scope">
            <el-tag :type="getTransferStatusTag(scope.row.transferStatus)" size="small">
              {{ getTransferStatusName(scope.row.transferStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建日期" min-width="180" />
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleDetail(scope.row)">详情</el-button>
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

    <!-- 转账订单详情抽屉 -->
    <el-drawer
      title="转账订单详情"
      :visible.sync="detailDrawerVisible"
      direction="rtl"
      size="60%"
      :before-close="handleDetailClose"
      :wrapper-closable="true"
    >
      <div class="detail-drawer-content">
        <div class="detail-section">
          <!-- 基本信息 -->
          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">商户类型</span>
              <span class="detail-value">{{ transferDetail.merchantType }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">转账订单号</span>
              <span class="detail-value highlight-purple">{{ transferDetail.transferOrderNo }}</span>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">商户名称</span>
              <span class="detail-value">{{ transferDetail.merchantName }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">金额</span>
              <span class="detail-value highlight-green">¥{{ transferDetail.amount }}</span>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">收款账号</span>
              <span class="detail-value highlight-green">{{ transferDetail.receiverAccount }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">收款人姓名</span>
              <span class="detail-value">{{ transferDetail.receiverName }}</span>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">转账备注</span>
              <span class="detail-value">{{ transferDetail.transferRemark }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">订单状态</span>
              <el-tag :type="getTransferStatusType(transferDetail.orderStatus)" size="small">
                {{ transferDetail.orderStatus }}
              </el-tag>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">商户号</span>
              <span class="detail-value">{{ transferDetail.merchantId }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">应用APPID</span>
              <span class="detail-value">{{ transferDetail.appId }}</span>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">服务商号</span>
              <span class="detail-value">{{ transferDetail.providerId || '-' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">商户转账单号</span>
              <span class="detail-value">{{ transferDetail.merchantTransferOrderNo }}</span>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">创建时间</span>
              <span class="detail-value">{{ transferDetail.createTime }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">转账成功时间</span>
              <span class="detail-value">{{ transferDetail.transferSuccessTime || '-' }}</span>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">更新时间</span>
              <span class="detail-value">{{ transferDetail.updateTime }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">接口代码</span>
              <span class="detail-value">{{ transferDetail.interfaceCode }}</span>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">货币代码</span>
              <span class="detail-value">{{ transferDetail.currencyCode }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">入账类型</span>
              <span class="detail-value">{{ transferDetail.entryType }}</span>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">客户端IP</span>
              <span class="detail-value">{{ transferDetail.clientIp }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">渠道订单号</span>
              <span class="detail-value">{{ transferDetail.channelOrderNo || '-' }}</span>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item full-width">
              <span class="detail-label">异步通知地址</span>
              <span class="detail-value">{{ transferDetail.notifyUrl || '-' }}</span>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">渠道错误码</span>
              <span class="detail-value">{{ transferDetail.channelErrorCode || '-' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">渠道错误描述</span>
              <span class="detail-value">{{ transferDetail.channelErrorDesc || '-' }}</span>
            </div>
          </div>

          <!-- 扩展参数 -->
          <div class="detail-row">
            <div class="detail-item full-width">
              <span class="detail-label">渠道额外参数</span>
              <el-input
                v-model="transferDetail.channelExtraParams"
                type="textarea"
                :rows="4"
                placeholder="暂无渠道额外参数"
                readonly
              />
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item full-width">
              <span class="detail-label">扩展参数</span>
              <el-input
                v-model="transferDetail.extendParams"
                type="textarea"
                :rows="4"
                placeholder="暂无扩展参数"
                readonly
              />
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'PaymentTransfer',
  data() {
    return {
      loading: false,
      searchForm: {
        startTime: '',
        endTime: '',
        orderNo: '',
        merchantId: '',
        appId: '',
        transferStatus: ''
      },
      tableData: [
        {
          id: 1,
          transferAmount: '1000.00',
          merchantName: '测试商户',
          orderNo: 'T202508160001',
          receiverAccount: '6222021234567890123',
          receiverName: '张三',
          transferRemark: '工资发放',
          transferStatus: 'success',
          createTime: '2025-08-16 09:30:00'
        },
        {
          id: 2,
          transferAmount: '500.00',
          merchantName: '极码云',
          orderNo: 'T202508160002',
          receiverAccount: '6222021234567890124',
          receiverName: '李四',
          transferRemark: '佣金结算',
          transferStatus: 'success',
          createTime: '2025-08-16 10:15:00'
        },
        {
          id: 3,
          transferAmount: '2000.00',
          merchantName: '电商商户',
          orderNo: 'T202508160003',
          receiverAccount: '6222021234567890125',
          receiverName: '王五',
          transferRemark: '货款支付',
          transferStatus: 'pending',
          createTime: '2025-08-16 11:00:00'
        }
      ],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 3
      },
      // 转账订单详情抽屉相关数据
      detailDrawerVisible: false,
      transferDetail: {
        merchantType: '普通商户',
        transferOrderNo: 'T1726894067750563842',
        merchantName: '火锅鸡',
        amount: '0.01',
        receiverAccount: '12242411111',
        receiverName: 'abc',
        transferRemark: '打款',
        orderStatus: '订单生成',
        merchantId: 'M1679219294',
        appId: '655c7664e4b03fd72d40bbe3',
        providerId: '',
        merchantTransferOrderNo: 'M17005585828878108',
        createTime: '2023-11-21 17:23:24',
        transferSuccessTime: '',
        updateTime: '2023-11-21 17:23:24',
        interfaceCode: 'alipay',
        currencyCode: 'CNY',
        entryType: 'ALIPAY_CASH',
        clientIp: '81.70.214.87',
        channelOrderNo: '',
        notifyUrl: '',
        channelErrorCode: '',
        channelErrorDesc: '',
        channelExtraParams: '',
        extendParams: ''
      }
    }
  },
  methods: {
    getTransferStatusTag(status) {
      const tagMap = {
        'success': 'success',
        'failed': 'danger',
        'pending': 'warning'
      }
      return tagMap[status] || 'info'
    },
    getTransferStatusName(status) {
      const nameMap = {
        'success': '转账成功',
        'failed': '转账失败',
        'pending': '转账中'
      }
      return nameMap[status] || '未知'
    },
    handleSearch() {
      this.loading = true
      // 模拟搜索
      setTimeout(() => {
        this.loading = false
      }, 1000)
    },
    handleReset() {
      this.searchForm = {
        startTime: '',
        endTime: '',
        orderNo: '',
        merchantId: '',
        appId: '',
        transferStatus: ''
      }
    },
    handleDetail(row) {
      // 打开转账订单详情抽屉并填充数据
      this.transferDetail = {
        merchantType: '普通商户',
        transferOrderNo: row.orderNo,
        merchantName: row.merchantName,
        amount: row.transferAmount,
        receiverAccount: row.receiverAccount,
        receiverName: row.receiverName,
        transferRemark: row.transferRemark,
        orderStatus: row.transferStatus === 'success' ? '转账成功' : row.transferStatus === 'failed' ? '转账失败' : '转账中',
        merchantId: 'M1679219294',
        appId: '655c7664e4b03fd72d40bbe3',
        providerId: '',
        merchantTransferOrderNo: `M${row.orderNo.slice(-8)}`,
        createTime: row.createTime,
        transferSuccessTime: row.transferStatus === 'success' ? row.createTime : '',
        updateTime: '2023-11-21 17:23:24',
        interfaceCode: 'alipay',
        currencyCode: 'CNY',
        entryType: 'ALIPAY_CASH',
        clientIp: '81.70.214.87',
        channelOrderNo: '',
        notifyUrl: '',
        channelErrorCode: '',
        channelErrorDesc: '',
        channelExtraParams: '',
        extendParams: ''
      }
      this.detailDrawerVisible = true
    },
    // 转账订单详情抽屉相关方法
    handleDetailClose() {
      this.detailDrawerVisible = false
    },
    getTransferStatusType(status) {
      const typeMap = {
        '转账成功': 'success',
        '转账失败': 'danger',
        '转账中': 'warning',
        '订单生成': 'info'
      }
      return typeMap[status] || 'info'
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val
    }
  }
}
</script>

<style lang="scss" scoped>
.payment-transfer-container {
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

// 转账订单详情抽屉样式
.detail-drawer-content {
  padding: 20px;
  height: calc(100vh - 120px);
  overflow-y: auto;
  overflow-x: hidden;
}

.detail-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.detail-row {
  display: flex;
  margin-bottom: 16px;
  align-items: flex-start;

  &:last-child {
    margin-bottom: 0;
  }
}

.detail-item {
  flex: 1;
  display: flex;
  align-items: flex-start;
  padding-right: 20px;

  &.full-width {
    flex: 2;
  }

  &:last-child {
    padding-right: 0;
  }
}

.detail-label {
  min-width: 120px;
  font-size: 14px;
  color: #606266;
  font-weight: 500;
  margin-right: 12px;
  line-height: 1.5;
}

.detail-value {
  flex: 1;
  font-size: 14px;
  color: #303133;
  line-height: 1.5;
  word-break: break-all;

  &.highlight-purple {
    background-color: #f0f2ff;
    color: #6366f1;
    padding: 2px 8px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-weight: 500;
  }

  &.highlight-green {
    background-color: #f0f9ff;
    color: #059669;
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: 600;
  }

  &.highlight-red {
    background-color: #fef2f2;
    color: #dc2626;
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: 600;
  }
}

.el-tag {
  margin: 0;
}
</style>
