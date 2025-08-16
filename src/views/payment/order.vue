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
      this.$message.info(`查看订单详情：${row.orderNo}`)
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
</style>
