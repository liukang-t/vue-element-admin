<template>
  <div class="payment-refund-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>退款订单</span>
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
          <el-input v-model="searchForm.orderNo" placeholder="支付/退款订单号" />
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
        <el-form-item label="退款状态">
          <el-select v-model="searchForm.refundStatus" placeholder="请选择退款状态">
            <el-option label="全部" value="" />
            <el-option label="退款成功" value="success" />
            <el-option label="退款失败" value="failed" />
            <el-option label="退款中" value="pending" />
          </el-select>
        </el-form-item>
        <el-form-item label="商户类型">
          <el-select v-model="searchForm.merchantType" placeholder="请选择商户类型">
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
        <el-table-column prop="payAmount" label="支付金额" width="120">
          <template slot-scope="scope">
            <span>¥{{ scope.row.payAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="refundAmount" label="退款金额" width="120">
          <template slot-scope="scope">
            <span>¥{{ scope.row.refundAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="refundOrderNo" label="退款订单号" min-width="200" />
        <el-table-column prop="payOrderNo" label="支付订单号" min-width="200" />
        <el-table-column prop="refundStatus" label="状态" width="120">
          <template slot-scope="scope">
            <el-tag :type="getRefundStatusTag(scope.row.refundStatus)" size="small">
              {{ getRefundStatusName(scope.row.refundStatus) }}
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

    <!-- 退款订单详情抽屉 -->
    <el-drawer
      title="退款订单详情"
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
              <span class="detail-label">所属系统</span>
              <span class="detail-value">{{ refundDetail.systemType }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">退款订单号</span>
              <span class="detail-value highlight-purple">{{ refundDetail.refundOrderNo }}</span>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">支付订单号</span>
              <span class="detail-value">{{ refundDetail.payOrderNo }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">支付金额</span>
              <span class="detail-value highlight-green">¥{{ refundDetail.payAmount }}</span>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">退款金额</span>
              <span class="detail-value highlight-red">¥{{ refundDetail.refundAmount }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">退款状态</span>
              <el-tag :type="getRefundStatusType(refundDetail.refundStatus)" size="small">
                {{ refundDetail.refundStatus }}
              </el-tag>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">商户号</span>
              <span class="detail-value">{{ refundDetail.merchantId }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">商户名称</span>
              <span class="detail-value">{{ refundDetail.merchantName }}</span>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">服务商号</span>
              <span class="detail-value">{{ refundDetail.providerId || '-' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">应用APPID</span>
              <span class="detail-value">{{ refundDetail.appId }}</span>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">创建时间</span>
              <span class="detail-value">{{ refundDetail.createTime }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">退款成功时间</span>
              <span class="detail-value">{{ refundDetail.refundSuccessTime || '-' }}</span>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">更新时间</span>
              <span class="detail-value">{{ refundDetail.updateTime }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">接口代码</span>
              <span class="detail-value">{{ refundDetail.interfaceCode }}</span>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">货币代码</span>
              <span class="detail-value">{{ refundDetail.currencyCode }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">方式代码</span>
              <span class="detail-value">{{ refundDetail.wayCode }}</span>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">客户端IP</span>
              <span class="detail-value">{{ refundDetail.clientIp }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">渠道订单号</span>
              <span class="detail-value">{{ refundDetail.channelOrderNo || '-' }}</span>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item full-width">
              <span class="detail-label">异步通知地址</span>
              <span class="detail-value">{{ refundDetail.notifyUrl || '-' }}</span>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">渠道错误码</span>
              <span class="detail-value">{{ refundDetail.channelErrorCode || '-' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">渠道错误描述</span>
              <span class="detail-value">{{ refundDetail.channelErrorDesc || '-' }}</span>
            </div>
          </div>

          <!-- 扩展参数 -->
          <div class="detail-row">
            <div class="detail-item full-width">
              <span class="detail-label">渠道额外参数</span>
              <el-input
                v-model="refundDetail.channelExtraParams"
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
                v-model="refundDetail.extendParams"
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
  name: 'PaymentRefund',
  data() {
    return {
      loading: false,
      searchForm: {
        startTime: '',
        endTime: '',
        orderNo: '',
        merchantId: '',
        providerId: '',
        appId: '',
        refundStatus: '',
        merchantType: ''
      },
      tableData: [
        {
          id: 1,
          payAmount: '100.00',
          refundAmount: '50.00',
          refundOrderNo: 'R202508160001',
          payOrderNo: 'P202508160001',
          refundStatus: 'success',
          createTime: '2025-08-16 14:30:00'
        },
        {
          id: 2,
          payAmount: '200.00',
          refundAmount: '200.00',
          refundOrderNo: 'R202508160002',
          payOrderNo: 'P202508160002',
          refundStatus: 'success',
          createTime: '2025-08-16 15:15:00'
        },
        {
          id: 3,
          payAmount: '500.00',
          refundAmount: '100.00',
          refundOrderNo: 'R202508160003',
          payOrderNo: 'P202508160003',
          refundStatus: 'pending',
          createTime: '2025-08-16 16:00:00'
        }
      ],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 3
      },
      // 退款订单详情抽屉相关数据
      detailDrawerVisible: false,
      refundDetail: {
        systemType: '普通商户',
        refundOrderNo: 'R1725430221110276097',
        payOrderNo: 'P1725429856956608513',
        payAmount: '0.01',
        refundAmount: '0.01',
        refundStatus: '退款成功',
        merchantId: 'M1679219294',
        merchantName: '火锅鸡',
        providerId: '',
        appId: '6416da5ee4b00bed884be286',
        createTime: '2023-11-17 16:26:36',
        refundSuccessTime: '2023-11-17 16:26:38',
        updateTime: '2023-11-17 16:26:37',
        interfaceCode: 'plspay',
        currencyCode: 'CNY',
        wayCode: 'ALI_BAR',
        clientIp: '81.70.214.87',
        channelOrderNo: 'R1725430221332049921',
        notifyUrl: '',
        channelErrorCode: '',
        channelErrorDesc: '',
        channelExtraParams: '',
        extendParams: ''
      }
    }
  },
  methods: {
    getRefundStatusTag(status) {
      const tagMap = {
        'success': 'success',
        'failed': 'danger',
        'pending': 'warning'
      }
      return tagMap[status] || 'info'
    },
    getRefundStatusName(status) {
      const nameMap = {
        'success': '退款成功',
        'failed': '退款失败',
        'pending': '退款中'
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
        providerId: '',
        appId: '',
        refundStatus: '',
        merchantType: ''
      }
    },
    handleDetail(row) {
      // 打开退款订单详情抽屉并填充数据
      this.refundDetail = {
        systemType: '普通商户',
        refundOrderNo: row.refundOrderNo,
        payOrderNo: row.payOrderNo,
        payAmount: row.payAmount,
        refundAmount: row.refundAmount,
        refundStatus: row.refundStatus === 'success' ? '退款成功' : row.refundStatus === 'failed' ? '退款失败' : '退款中',
        merchantId: 'M1679219294',
        merchantName: '测试商户',
        providerId: '',
        appId: '6416da5ee4b00bed884be286',
        createTime: row.createTime,
        refundSuccessTime: row.refundStatus === 'success' ? row.createTime : '',
        updateTime: '2023-11-17 16:26:37',
        interfaceCode: 'plspay',
        currencyCode: 'CNY',
        wayCode: 'ALI_BAR',
        clientIp: '81.70.214.87',
        channelOrderNo: 'R1725430221332049921',
        notifyUrl: '',
        channelErrorCode: '',
        channelErrorDesc: '',
        channelExtraParams: '',
        extendParams: ''
      }
      this.detailDrawerVisible = true
    },
    // 退款订单详情抽屉相关方法
    handleDetailClose() {
      this.detailDrawerVisible = false
    },
    getRefundStatusType(status) {
      const typeMap = {
        '退款成功': 'success',
        '退款失败': 'danger',
        '退款中': 'warning'
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
.payment-refund-container {
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

// 退款订单详情抽屉样式
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
