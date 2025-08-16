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
      this.$message.info(`查看转账详情：${row.orderNo}`)
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
</style>
