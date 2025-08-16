<template>
  <div class="provider-list-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>服务商列表</span>
        <el-button style="float: right; padding: 3px 0" type="primary" @click="handleAdd">+ 新建</el-button>
      </div>

      <!-- 搜索区域 -->
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="服务商名称">
          <el-input v-model="searchForm.name" placeholder="请输入服务商名称" />
        </el-form-item>
        <el-form-item label="服务商号">
          <el-input v-model="searchForm.providerId" placeholder="请输入服务商号" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态">
            <el-option label="全部" value="" />
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
          <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table v-loading="loading" :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="服务商名称" min-width="200" />
        <el-table-column prop="providerId" label="服务商号" min-width="180" />
        <el-table-column prop="status" label="服务商状态" width="120">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === '1' ? 'success' : 'danger'" size="small">
              {{ scope.row.status === '1' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建日期" min-width="200" />
        <el-table-column label="操作" width="280">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleEdit(scope.row)">修改</el-button>
            <el-button size="mini" type="text" @click="handleConfig(scope.row)">支付配置</el-button>
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
  name: 'ProviderList',
  data() {
    return {
      loading: false,
      searchForm: {
        name: '',
        providerId: '',
        status: ''
      },
      tableData: [
        {
          id: 1,
          name: '极码云服务商',
          providerId: 'P001',
          status: '1',
          createTime: '2025-08-15 10:30:00'
        },
        {
          id: 2,
          name: '测试服务商',
          providerId: 'P002',
          status: '1',
          createTime: '2025-08-14 15:20:00'
        },
        {
          id: 3,
          name: '支付服务商',
          providerId: 'P003',
          status: '0',
          createTime: '2025-08-13 09:45:00'
        },
        {
          id: 4,
          name: '电商服务商',
          providerId: 'P004',
          status: '1',
          createTime: '2025-08-12 14:15:00'
        },
        {
          id: 5,
          name: '金融服务商',
          providerId: 'P005',
          status: '1',
          createTime: '2025-08-11 11:30:00'
        }
      ],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 5
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
        name: '',
        providerId: '',
        status: ''
      }
    },
    handleAdd() {
      this.$message.info('新增服务商功能')
    },
    handleEdit(row) {
      this.$message.info(`修改服务商：${row.name}`)
    },
    handleConfig(row) {
      this.$message.info(`支付配置：${row.name}`)
    },
    handleDelete(row) {
      this.$confirm(`确定要删除服务商"${row.name}"吗？`, '提示', {
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
.provider-list-container {
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
