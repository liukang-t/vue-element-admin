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
      this.$message.info(`查看退款详情：${row.refundOrderNo}`)
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
</style>
