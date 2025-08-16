<template>
  <div class="payment-method-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>支付方式</span>
      </div>

      <!-- 搜索区域 -->
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="支付方式代码">
          <el-input v-model="searchForm.code" placeholder="请输入支付方式代码" />
        </el-form-item>
        <el-form-item label="支付方式名称">
          <el-input v-model="searchForm.name" placeholder="请输入支付方式名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
          <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 新建按钮 -->
      <div class="action-bar">
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新建</el-button>
      </div>

      <!-- 表格 -->
      <el-table v-loading="loading" :data="tableData" style="width: 100%">
        <el-table-column prop="code" label="支付方式代码" width="150" />
        <el-table-column prop="name" label="支付方式名称" min-width="200" />
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleEdit(scope.row)">修改</el-button>
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
  </div>
</template>

<script>
export default {
  name: 'PaymentMethod',
  data() {
    return {
      loading: false,
      searchForm: {
        code: '',
        name: ''
      },
      tableData: [
        {
          id: 1,
          code: '0630',
          name: '99999mingc'
        },
        {
          id: 2,
          code: '1',
          name: '1'
        },
        {
          id: 3,
          code: '100',
          name: 'zfb'
        },
        {
          id: 4,
          code: '11',
          name: '111'
        },
        {
          id: 5,
          code: '1100',
          name: '微信服务商'
        },
        {
          id: 6,
          code: '1111',
          name: '1'
        },
        {
          id: 7,
          code: '111233',
          name: '1123'
        },
        {
          id: 8,
          code: '12457',
          name: '11111222'
        },
        {
          id: 9,
          code: '1333',
          name: '2'
        },
        {
          id: 10,
          code: '2',
          name: '2'
        }
      ],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 90
      }
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
        code: '',
        name: ''
      }
    },
    handleAdd() {
      this.$message.info('新建支付方式功能')
    },
    handleEdit(row) {
      this.$message.info(`修改支付方式：${row.name}`)
    },
    handleDelete(row) {
      this.$confirm(`确定要删除支付方式"${row.name}"吗？`, '提示', {
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
    }
  }
}
</script>

<style lang="scss" scoped>
.payment-method-container {
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

.action-bar {
  margin-bottom: 20px;
}
</style>
