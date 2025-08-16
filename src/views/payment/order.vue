<template>
  <div class="payment-order-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>支付订单</span>
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
          <el-input v-model="searchForm.orderNo" placeholder="支付/商户/渠道订单号" />
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
        <el-form-item label="支付方式">
          <el-select v-model="searchForm.payType" placeholder="请选择支付方式">
            <el-option label="全部" value="" />
            <el-option label="微信支付" value="wechat" />
            <el-option label="支付宝" value="alipay" />
            <el-option label="银行卡" value="bank" />
          </el-select>
        </el-form-item>
        <el-form-item label="支付状态">
          <el-select v-model="searchForm.payStatus" placeholder="请选择支付状态">
            <el-option label="全部" value="" />
            <el-option label="支付成功" value="success" />
            <el-option label="支付失败" value="failed" />
            <el-option label="待支付" value="pending" />
          </el-select>
        </el-form-item>
        <el-form-item label="回调状态">
          <el-select v-model="searchForm.callbackStatus" placeholder="请选择回调状态">
            <el-option label="全部" value="" />
            <el-option label="成功" value="success" />
            <el-option label="失败" value="failed" />
            <el-option label="未回调" value="pending" />
          </el-select>
        </el-form-item>
        <el-form-item label="分账状态">
          <el-select v-model="searchForm.splitStatus" placeholder="请选择分账状态">
            <el-option label="全部" value="" />
            <el-option label="已分账" value="success" />
            <el-option label="未分账" value="pending" />
            <el-option label="分账失败" value="failed" />
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
        <el-table-column prop="fee" label="手续费" width="100">
          <template slot-scope="scope">
            <span>¥{{ scope.row.fee }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="merchantName" label="商户名称" min-width="150" />
        <el-table-column prop="orderNo" label="订单号" min-width="200" />
        <el-table-column prop="payType" label="支付方式" width="120">
          <template slot-scope="scope">
            <el-tag :type="getPayTypeTag(scope.row.payType)" size="small">
              {{ getPayTypeName(scope.row.payType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="payStatus" label="支付状态" width="120">
          <template slot-scope="scope">
            <el-tag :type="getPayStatusTag(scope.row.payStatus)" size="small">
              {{ getPayStatusName(scope.row.payStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="callbackStatus" label="回调状态" width="120">
          <template slot-scope="scope">
            <el-tag :type="getCallbackStatusTag(scope.row.callbackStatus)" size="small">
              {{ getCallbackStatusName(scope.row.callbackStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="splitStatus" label="分账状态" width="120">
          <template slot-scope="scope">
            <el-tag :type="getSplitStatusTag(scope.row.splitStatus)" size="small">
              {{ getSplitStatusName(scope.row.splitStatus) }}
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

    <!-- 订单详情抽屉 -->
    <el-drawer
      title="订单详情"
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
              <span class="detail-value">{{ orderDetail.systemType }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">支付订单号</span>
              <span class="detail-value highlight-purple">{{ orderDetail.payOrderNo }}</span>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">商户订单号</span>
              <span class="detail-value">{{ orderDetail.merchantOrderNo }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">支付金额</span>
              <span class="detail-value highlight-green">¥{{ orderDetail.payAmount }}</span>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">商家费率</span>
              <span class="detail-value">{{ orderDetail.merchantRate }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">回调状态</span>
              <el-tag :type="getCallbackStatusType(orderDetail.callbackStatus)" size="small">
                {{ orderDetail.callbackStatus }}
              </el-tag>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">支付错误码</span>
              <span class="detail-value">{{ orderDetail.payErrorCode || '-' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">订单失效时间</span>
              <span class="detail-value">{{ orderDetail.expireTime }}</span>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">创建时间</span>
              <span class="detail-value">{{ orderDetail.createTime }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">服务商号</span>
              <span class="detail-value">{{ orderDetail.providerId || '-' }}</span>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">商户号</span>
              <span class="detail-value">{{ orderDetail.merchantId }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">商户名称</span>
              <span class="detail-value">{{ orderDetail.merchantName }}</span>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">手续费</span>
              <span class="detail-value highlight-red">¥{{ orderDetail.fee }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">订单状态</span>
              <el-tag :type="getOrderStatusType(orderDetail.orderStatus)" size="small">
                {{ orderDetail.orderStatus }}
              </el-tag>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">应用APPID</span>
              <span class="detail-value">{{ orderDetail.appId }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">支付错误描述</span>
              <span class="detail-value">{{ orderDetail.payErrorDesc || '-' }}</span>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">支付成功时间</span>
              <span class="detail-value">{{ orderDetail.paySuccessTime || '-' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">更新时间</span>
              <span class="detail-value">{{ orderDetail.updateTime }}</span>
            </div>
          </div>

          <!-- 商品信息 -->
          <div class="detail-row">
            <div class="detail-item full-width">
              <span class="detail-label">商品标题</span>
              <span class="detail-value">{{ orderDetail.productTitle }}</span>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item full-width">
              <span class="detail-label">商品描述</span>
              <span class="detail-value">{{ orderDetail.productDesc }}</span>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">接口代码</span>
              <span class="detail-value">{{ orderDetail.interfaceCode }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">货币代码</span>
              <span class="detail-value">{{ orderDetail.currencyCode }}</span>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">支付方式</span>
              <span class="detail-value">{{ orderDetail.payMethod }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">客户端IP</span>
              <span class="detail-value">{{ orderDetail.clientIp }}</span>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">用户标识</span>
              <span class="detail-value">{{ orderDetail.userId || '-' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">渠道订单号</span>
              <span class="detail-value">{{ orderDetail.channelOrderNo || '-' }}</span>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item full-width">
              <span class="detail-label">异步通知地址</span>
              <span class="detail-value">{{ orderDetail.notifyUrl }}</span>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item full-width">
              <span class="detail-label">页面跳转地址</span>
              <span class="detail-value">{{ orderDetail.returnUrl || '-' }}</span>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">退款状态</span>
              <el-tag :type="getRefundStatusType(orderDetail.refundStatus)" size="small">
                {{ orderDetail.refundStatus }}
              </el-tag>
            </div>
            <div class="detail-item">
              <span class="detail-label">退款次数</span>
              <span class="detail-value">{{ orderDetail.refundCount }}</span>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">退款总额</span>
              <span class="detail-value">{{ orderDetail.refundAmount || '-' }}</span>
            </div>
          </div>

          <!-- 分账信息 -->
          <div class="detail-row">
            <div class="detail-item full-width">
              <span class="detail-label">订单分账模式</span>
              <span class="detail-value">{{ orderDetail.splitMode }}</span>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">分账状态</span>
              <el-tag :type="getSplitStatusType(orderDetail.splitStatus)" size="small">
                {{ orderDetail.splitStatus }}
              </el-tag>
            </div>
            <div class="detail-item">
              <span class="detail-label">最新分账发起时间</span>
              <span class="detail-value">{{ orderDetail.splitTime || '-' }}</span>
            </div>
          </div>

          <!-- 扩展参数 -->
          <div class="detail-row">
            <div class="detail-item full-width">
              <span class="detail-label">扩展参数</span>
              <el-input
                v-model="orderDetail.extendParams"
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
  name: 'PaymentOrder',
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
        payType: '',
        payStatus: '',
        callbackStatus: '',
        splitStatus: ''
      },
      tableData: [
        {
          id: 1,
          payAmount: '100.00',
          refundAmount: '0.00',
          fee: '0.60',
          merchantName: '测试商户',
          orderNo: 'P202508160001',
          payType: 'wechat',
          payStatus: 'success',
          callbackStatus: 'success',
          splitStatus: 'success',
          createTime: '2025-08-16 10:30:00'
        },
        {
          id: 2,
          payAmount: '200.00',
          refundAmount: '50.00',
          fee: '1.20',
          merchantName: '极码云',
          orderNo: 'P202508160002',
          payType: 'alipay',
          payStatus: 'success',
          callbackStatus: 'success',
          splitStatus: 'pending',
          createTime: '2025-08-16 11:15:00'
        },
        {
          id: 3,
          payAmount: '500.00',
          refundAmount: '0.00',
          fee: '3.00',
          merchantName: '电商商户',
          orderNo: 'P202508160003',
          payType: 'bank',
          payStatus: 'pending',
          callbackStatus: 'pending',
          splitStatus: 'pending',
          createTime: '2025-08-16 12:00:00'
        }
      ],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 3
      },
      // 订单详情抽屉相关数据
      detailDrawerVisible: false,
      orderDetail: {
        systemType: '普通商户',
        payOrderNo: 'P1727164086451466241',
        merchantOrderNo: 'M17006229569887821',
        payAmount: '0.01',
        merchantRate: '0.00%',
        callbackStatus: '未发送',
        payErrorCode: '',
        expireTime: '2023-11-22 13:16:22',
        createTime: '2023-11-22 11:16:22',
        providerId: '',
        merchantId: 'M1679219294',
        merchantName: '火锅鸡',
        fee: '0',
        orderStatus: '订单关闭',
        appId: '655435ade4b03fd72d40bbe1',
        payErrorDesc: '',
        paySuccessTime: '',
        updateTime: '2023-11-22 15:08:00',
        productTitle: '接口调试[M1679219294商户联调]',
        productDesc: '接口调试[M1679219294商户联调]',
        interfaceCode: 'alipay',
        currencyCode: 'CNY',
        payMethod: 'ALI_PC',
        clientIp: '150.242.169.14',
        userId: '',
        channelOrderNo: '',
        notifyUrl: 'http://mch.d.jeepay.vip/api/anon/paytestNotify/payOrder',
        returnUrl: '',
        refundStatus: '未发起',
        refundCount: '0',
        refundAmount: '',
        splitMode: '该笔订单不允许分账',
        splitStatus: '未发生分账',
        splitTime: '',
        extendParams: ''
      }
    }
  },
  methods: {
    getPayTypeTag(type) {
      const tagMap = {
        'wechat': 'success',
        'alipay': 'primary',
        'bank': 'warning'
      }
      return tagMap[type] || 'info'
    },
    getPayTypeName(type) {
      const nameMap = {
        'wechat': '微信支付',
        'alipay': '支付宝',
        'bank': '银行卡'
      }
      return nameMap[type] || '未知'
    },
    getPayStatusTag(status) {
      const tagMap = {
        'success': 'success',
        'failed': 'danger',
        'pending': 'warning'
      }
      return tagMap[status] || 'info'
    },
    getPayStatusName(status) {
      const nameMap = {
        'success': '支付成功',
        'failed': '支付失败',
        'pending': '待支付'
      }
      return nameMap[status] || '未知'
    },
    getCallbackStatusTag(status) {
      const tagMap = {
        'success': 'success',
        'failed': 'danger',
        'pending': 'warning'
      }
      return tagMap[status] || 'info'
    },
    getCallbackStatusName(status) {
      const nameMap = {
        'success': '成功',
        'failed': '失败',
        'pending': '未回调'
      }
      return nameMap[status] || '未知'
    },
    getSplitStatusTag(status) {
      const tagMap = {
        'success': 'success',
        'failed': 'danger',
        'pending': 'warning'
      }
      return tagMap[status] || 'info'
    },
    getSplitStatusName(status) {
      const nameMap = {
        'success': '已分账',
        'failed': '分账失败',
        'pending': '未分账'
      }
      return nameMap[status] || '未知'
    },
    getCallbackStatusType(status) {
      const typeMap = {
        '成功': 'success',
        '失败': 'danger',
        '未发送': 'warning'
      }
      return typeMap[status] || 'info'
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
        payType: '',
        payStatus: '',
        callbackStatus: '',
        splitStatus: ''
      }
    },
    handleDetail(row) {
      // 打开订单详情抽屉并填充数据
      this.orderDetail = {
        systemType: '普通商户',
        payOrderNo: row.orderNo,
        merchantOrderNo: `M${row.orderNo.slice(-8)}`,
        payAmount: row.payAmount,
        merchantRate: '0.00%',
        callbackStatus: row.callbackStatus === 'success' ? '成功' : row.callbackStatus === 'failed' ? '失败' : '未发送',
        payErrorCode: '',
        expireTime: '2023-11-22 13:16:22',
        createTime: row.createTime,
        providerId: '',
        merchantId: 'M1679219294',
        merchantName: row.merchantName,
        fee: row.fee,
        orderStatus: row.payStatus === 'success' ? '支付成功' : row.payStatus === 'failed' ? '支付失败' : '待支付',
        appId: '655435ade4b03fd72d40bbe1',
        payErrorDesc: '',
        paySuccessTime: row.payStatus === 'success' ? row.createTime : '',
        updateTime: '2023-11-22 15:08:00',
        productTitle: `接口调试[${row.merchantName}商户联调]`,
        productDesc: `接口调试[${row.merchantName}商户联调]`,
        interfaceCode: row.payType === 'wechat' ? 'wechat' : row.payType === 'alipay' ? 'alipay' : 'bank',
        currencyCode: 'CNY',
        payMethod: row.payType === 'wechat' ? 'WECHAT_PC' : row.payType === 'alipay' ? 'ALI_PC' : 'BANK_PC',
        clientIp: '150.242.169.14',
        userId: '',
        channelOrderNo: '',
        notifyUrl: 'http://mch.d.jeepay.vip/api/anon/paytestNotify/payOrder',
        returnUrl: '',
        refundStatus: row.refundAmount > 0 ? '已退款' : '未发起',
        refundCount: row.refundAmount > 0 ? '1' : '0',
        refundAmount: row.refundAmount > 0 ? row.refundAmount : '',
        splitMode: '该笔订单不允许分账',
        splitStatus: row.splitStatus === 'success' ? '已分账' : row.splitStatus === 'failed' ? '分账失败' : '未发生分账',
        splitTime: '',
        extendParams: ''
      }
      this.detailDrawerVisible = true
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val
    },
    // 订单详情抽屉相关方法
    handleDetailClose() {
      this.detailDrawerVisible = false
    },
    getOrderStatusType(status) {
      const typeMap = {
        '支付成功': 'success',
        '支付失败': 'danger',
        '待支付': 'warning',
        '订单关闭': 'info'
      }
      return typeMap[status] || 'info'
    },
    getRefundStatusType(status) {
      const typeMap = {
        '已退款': 'success',
        '退款失败': 'danger',
        '未发起': 'warning'
      }
      return typeMap[status] || 'info'
    },
    getSplitStatusType(status) {
      const typeMap = {
        '已分账': 'success',
        '分账失败': 'danger',
        '未发生分账': 'info'
      }
      return typeMap[status] || 'info'
    }
  }
}
</script>

<style lang="scss" scoped>
.payment-order-container {
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

 // 订单详情抽屉样式
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
