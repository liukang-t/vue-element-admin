<template>
  <div class="admin-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>操作员管理</span>
        <el-button style="float: right; padding: 3px 0" type="primary" @click="handleAdd">新建</el-button>
      </div>

      <!-- 搜索区域 -->创建日期
      、
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="用户ID">
          <el-input v-model="searchForm.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="用户姓名">
          <el-input v-model="searchForm.name" placeholder="请输入用户姓名" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
          <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table v-loading="loading" :data="tableData" style="width: 100%">
        <el-table-column prop="userId" label="用户ID" width="120" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="gender" label="性别" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.gender === '1' ? '男' : '女' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="avatar" label="头像" width="100">
          <template slot-scope="scope">
            <el-avatar :src="scope.row.avatar" :size="40">
              <img src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png">
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="number" label="编号" width="120" />
        <el-table-column prop="phone" label="手机号" width="150" />
        <el-table-column prop="isSuperAdmin" label="超管" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.isSuperAdmin ? '是' : '否' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === '1' ? 'success' : 'danger'" size="small">
              {{ scope.row.status === '1' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="180" />
        <el-table-column prop="updateTime" label="修改时间" min-width="180" />
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click="handleResetPwd(scope.row)">重置密码</el-button>
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
  name: 'AdminIndex',
  data() {
    return {
      loading: false,
      searchForm: {
        userId: '',
        name: ''
      },
      tableData: [
        {
          id: 1,
          userId: '100002',
          name: 'xxxxx',
          gender: '1',
          avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          number: '1001',
          phone: '13288881111',
          isSuperAdmin: false,
          status: '1',
          createTime: '2023-03-19 18:33:06',
          updateTime: '2025-08-06 09:33:36'
        },
        {
          id: 2,
          userId: '801',
          name: '大森林',
          gender: '1',
          avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          number: 'D0001',
          phone: '13000000001',
          isSuperAdmin: true,
          status: '1',
          createTime: '2020-06-13 00:00:00',
          updateTime: '2023-03-19 18:17:28'
        },
        {
          id: 3,
          userId: '100003',
          name: '张三',
          gender: '1',
          avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          number: '1002',
          phone: '13800138000',
          isSuperAdmin: false,
          status: '1',
          createTime: '2023-04-15 10:20:30',
          updateTime: '2025-07-20 14:25:10'
        },
        {
          id: 4,
          userId: '100004',
          name: '李四',
          gender: '2',
          avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          number: '1003',
          phone: '13900139000',
          isSuperAdmin: false,
          status: '0',
          createTime: '2023-05-10 16:45:20',
          updateTime: '2025-06-15 11:30:45'
        }
      ],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 4
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
        userId: '',
        name: ''
      }
    },
    handleAdd() {
      this.$message.info('新增操作员功能')
    },
    handleEdit(row) {
      this.$message.info(`编辑操作员：${row.name}`)
    },
    handleResetPwd(row) {
      this.$confirm(`确定要重置"${row.name}"的密码吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('密码重置成功')
      }).catch(() => {
        this.$message.info('已取消重置')
      })
    },
    handleDelete(row) {
      this.$confirm(`确定要删除操作员"${row.name}"吗？`, '提示', {
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
.admin-container {
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
