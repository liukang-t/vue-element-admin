<template>
  <div class="dashboard-container">
    <div class="welcome-section">
      <el-card class="welcome-card">
        <div class="welcome-content">
          <h1>欢迎使用管理系统</h1>
          <p>这是一个简化版本的管理系统，目前只包含首页功能。</p>
          <el-button type="primary" @click="handleLogout">退出登录</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  methods: {
    handleLogout() {
      this.$store.dispatch('user/logout').then(() => {
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 84px);
}

.welcome-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.welcome-card {
  width: 100%;
  max-width: 600px;
  text-align: center;
}

.welcome-content {
  padding: 40px 20px;

  h1 {
    color: #303133;
    margin-bottom: 20px;
    font-size: 28px;
  }

  p {
    color: #606266;
    margin-bottom: 30px;
    font-size: 16px;
    line-height: 1.6;
  }
}
</style>
