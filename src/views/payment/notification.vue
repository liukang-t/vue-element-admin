<template>
  <div class="payment-notification-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>商户通知</span>
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
        <el-form-item label="订单ID">
          <el-input v-model="searchForm.orderId" placeholder="请输入订单ID" />
        </el-form-item>
        <el-form-item label="商户订单号">
          <el-input v-model="searchForm.merchantOrderNo" placeholder="请输入商户订单号" />
        </el-form-item>
        <el-form-item label="商户号">
          <el-input v-model="searchForm.merchantId" placeholder="请输入商户号" />
        </el-form-item>
        <el-form-item label="服务商号">
          <el-input v-model="searchForm.providerId" placeholder="请输入服务商号" />
        </el-form-item>
        <el-form-item label="应用APPID">
          <el-input v-model="searchForm.appId" placeholder="请输入应用APPID" />
        </el-form-item>
        <el-form-item label="通知状态">
          <el-select v-model="searchForm.notifyStatus" placeholder="请选择通知状态">
            <el-option label="全部" value="" />
            <el-option label="通知成功" value="success" />
            <el-option label="通知失败" value="failed" />
            <el-option label="通知中" value="pending" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单类型">
          <el-select v-model="searchForm.orderType" placeholder="请选择订单类型">
            <el-option label="全部" value="" />
            <el-option label="支付订单" value="pay" />
            <el-option label="退款订单" value="refund" />
            <el-option label="转账订单" value="transfer" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
          <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table v-loading="loading" :data="tableData" style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="orderId" label="订单ID" min-width="150" />
        <el-table-column prop="merchantOrderNo" label="商户订单号" min-width="200" />
        <el-table-column prop="notifyStatus" label="通知状态" width="120">
          <template slot-scope="scope">
            <el-tag :type="getNotifyStatusTag(scope.row.notifyStatus)" size="small">
              {{ getNotifyStatusName(scope.row.notifyStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="orderType" label="订单类型" width="120">
          <template slot-scope="scope">
            <el-tag :type="getOrderTypeTag(scope.row.orderType)" size="small">
              {{ getOrderTypeName(scope.row.orderType) }}
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

    <!-- 商户通知详情抽屉 -->
    <el-drawer
      title="商户通知详情"
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
              <span class="detail-label">订单ID</span>
              <span class="detail-value highlight-purple">{{ notificationDetail.orderId }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">商户订单号</span>
              <span class="detail-value">{{ notificationDetail.merchantOrderNo }}</span>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">服务商号</span>
              <span class="detail-value">{{ notificationDetail.providerId || '-' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">商户号</span>
              <span class="detail-value">{{ notificationDetail.merchantId }}</span>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">应用APPID</span>
              <span class="detail-value">{{ notificationDetail.appId }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">订单类型</span>
              <el-tag :type="getOrderTypeTag(notificationDetail.orderType)" size="small">
                {{ notificationDetail.orderType }}
              </el-tag>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">通知状态</span>
              <el-tag :type="getNotifyStatusTag(notificationDetail.notifyStatus)" size="small">
                {{ notificationDetail.notifyStatus }}
              </el-tag>
            </div>
            <div class="detail-item">
              <span class="detail-label">通知次数</span>
              <span class="detail-value">{{ notificationDetail.notifyCount }}</span>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">最后通知时间</span>
              <span class="detail-value">{{ notificationDetail.lastNotifyTime }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">创建时间</span>
              <span class="detail-value">{{ notificationDetail.createTime }}</span>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">更新时间</span>
              <span class="detail-value">{{ notificationDetail.updateTime }}</span>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item full-width">
              <span class="detail-label">通知地址</span>
              <el-input
                v-model="notificationDetail.notifyUrl"
                type="textarea"
                :rows="4"
                placeholder="暂无通知地址"
                readonly
              />
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item full-width">
              <span class="detail-label">响应结果</span>
              <el-input
                v-model="notificationDetail.responseResult"
                type="textarea"
                :rows="4"
                placeholder="暂无响应结果"
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
  name: 'PaymentNotification',
  data() {
    return {
      loading: false,
      searchForm: {
        startTime: '',
        endTime: '',
        orderId: '',
        merchantOrderNo: '',
        merchantId: '',
        providerId: '',
        appId: '',
        notifyStatus: '',
        orderType: ''
      },
      tableData: [
        {
          id: 1,
          orderId: 'N202508160001',
          merchantOrderNo: 'M202508160001',
          notifyStatus: 'success',
          orderType: 'pay',
          createTime: '2025-08-16 10:30:00'
        },
        {
          id: 2,
          orderId: 'N202508160002',
          merchantOrderNo: 'M202508160002',
          notifyStatus: 'success',
          orderType: 'refund',
          createTime: '2025-08-16 11:15:00'
        },
        {
          id: 3,
          orderId: 'N202508160003',
          merchantOrderNo: 'M202508160003',
          notifyStatus: 'failed',
          orderType: 'transfer',
          createTime: '2025-08-16 12:00:00'
        },
        {
          id: 4,
          orderId: 'N202508160004',
          merchantOrderNo: 'M202508160004',
          notifyStatus: 'pending',
          orderType: 'pay',
          createTime: '2025-08-16 13:45:00'
        }
      ],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 4
      },
      // 商户通知详情抽屉相关数据
      detailDrawerVisible: false,
      notificationDetail: {
        orderId: 'P1725429856956608513',
        merchantOrderNo: 'M17002094594758373',
        providerId: '',
        merchantId: 'M1679219294',
        appId: '6416da5ee4b00bed884be286',
        orderType: '支付',
        notifyStatus: '通知成功',
        notifyCount: '1',
        lastNotifyTime: '2023-11-17 16:25:10',
        createTime: '2023-11-17 16:25:10',
        updateTime: '2023-11-17 16:25:10',
        notifyUrl: 'http://mch.d.jeepay.vip/api/anon/paytestNotify/payOrder?ifCode=plspay&amount=1&payOrderId=P1725429856956608513&mchOrderNo=M17002094594758373&subject=%E6%8E%A5%E5%8F%A3%E8%B0%83%E8%AF%95%5BM1679219294%E5%95%86%E6%88%B7%E8%81%94%E8%B0%83%5D&wayCode=ALI_BAR&sign=B606DA55456240B372630BBDCF77DC2F&reqTime=17002',
        responseResult: 'SUCCESS'
      }
    }
  },
  methods: {
    getNotifyStatusTag(status) {
      const tagMap = {
        'success': 'success',
        'failed': 'danger',
        'pending': 'warning'
      }
      return tagMap[status] || 'info'
    },
    getNotifyStatusName(status) {
      const nameMap = {
        'success': '通知成功',
        'failed': '通知失败',
        'pending': '通知中'
      }
      return nameMap[status] || '未知'
    },
    getOrderTypeTag(type) {
      const tagMap = {
        'pay': 'primary',
        'refund': 'warning',
        'transfer': 'success'
      }
      return tagMap[type] || 'info'
    },
    getOrderTypeName(type) {
      const nameMap = {
        'pay': '支付订单',
        'refund': '退款订单',
        'transfer': '转账订单'
      }
      return nameMap[type] || '未知'
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
        orderId: '',
        merchantOrderNo: '',
        merchantId: '',
        providerId: '',
        appId: '',
        notifyStatus: '',
        orderType: ''
      }
    },
    handleDetail(row) {
      // 打开商户通知详情抽屉并填充数据
      this.notificationDetail = {
        orderId: row.orderId,
        merchantOrderNo: row.merchantOrderNo,
        providerId: '',
        merchantId: 'M1679219294',
        appId: '6416da5ee4b00bed884be286',
        orderType: row.orderType === 'pay' ? '支付' : row.orderType === 'refund' ? '退款' : '转账',
        notifyStatus: row.notifyStatus === 'success' ? '通知成功' : row.notifyStatus === 'failed' ? '通知失败' : '通知中',
        notifyCount: '1',
        lastNotifyTime: row.createTime,
        createTime: row.createTime,
        updateTime: row.createTime,
        notifyUrl: 'http://mch.d.jeepay.vip/api/anon/paytestNotify/payOrder?ifCode=plspay&amount=1&payOrderId=P1725429856956608513&mchOrderNo=M17002094594758373&subject=%E6%8E%A5%E5%8F%A3%E8%B0%83%E8%AF%95%5BM1679219294%E5%95%86%E6%88%B7%E8%81%94%E8%B0%83%5D&wayCode=ALI_BAR&sign=B606DA55456240B372630BBDCF77DC2F&reqTime=17002',
        responseResult: row.notifyStatus === 'success' ? 'SUCCESS' : 'FAILED'
      }
      this.detailDrawerVisible = true
    },
    // 商户通知详情抽屉相关方法
    handleDetailClose() {
      this.detailDrawerVisible = false
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
.payment-notification-container {
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

// 商户通知详情抽屉样式
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
