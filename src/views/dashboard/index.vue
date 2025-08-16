<template>
  <div class="dashboard-container">
    <!-- 统计卡片区域 -->
    <div class="stats-grid">
      <!-- 今日交易金额 -->
      <el-card class="stat-card">
        <div class="stat-header">
          <span class="stat-title">今日交易金额</span>
          <i class="el-icon-question stat-info" />
        </div>
        <div class="stat-value">¥ 0.00</div>
        <div class="stat-subtitle">共0笔</div>
        <div class="stat-details">
          <div class="detail-item">昨日交易金额: ¥0.00</div>
          <div class="detail-item">近七天交易金额: ¥0</div>
        </div>
      </el-card>

      <!-- 交易总金额 -->
      <el-card class="stat-card">
        <div class="stat-header">
          <span class="stat-title">交易总金额</span>
          <i class="el-icon-question stat-info" />
        </div>
        <div class="stat-value">¥ 1109.94</div>
      </el-card>

      <!-- 服务商数量 -->
      <el-card class="stat-card">
        <div class="stat-header">
          <span class="stat-title">服务商数量</span>
          <i class="el-icon-question stat-info" />
        </div>
        <div class="stat-value">79</div>
      </el-card>

      <!-- 交易总笔数 -->
      <el-card class="stat-card">
        <div class="stat-header">
          <span class="stat-title">交易总笔数</span>
          <i class="el-icon-question stat-info" />
        </div>
        <div class="stat-value">5 笔</div>
      </el-card>

      <!-- 商户数量 -->
      <el-card class="stat-card">
        <div class="stat-header">
          <span class="stat-title">商户数量</span>
          <i class="el-icon-question stat-info" />
        </div>
        <div class="stat-value">250</div>
      </el-card>

      <!-- 用户信息/快速开始 -->
      <el-card class="stat-card user-card">
        <div class="user-info">
          <el-avatar :size="60" class="user-avatar">
            <img src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" alt="用户头像">
          </el-avatar>
          <div class="user-details">
            <div class="user-greeting">下午好, xxxxx</div>
            <div class="user-role">操作员</div>
          </div>
          <i class="el-icon-more-vertical more-icon" />
        </div>
        <div class="quick-start">
          <div class="quick-title">快速开始</div>
          <div class="quick-links">
            <el-button type="text" @click="goToMerchantList">商户列表</el-button>
            <el-button type="text" @click="goToPaymentOrder">支付订单</el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 图表区域 -->
    <div class="charts-container">
      <!-- 交易统计 -->
      <el-card class="chart-card">
        <div class="chart-header">
          <div class="chart-title">
            <span>交易统计</span>
            <div class="chart-legend">
              <div class="legend-item">
                <span class="legend-color orange" />
                <span>收款</span>
              </div>
              <div class="legend-item">
                <span class="legend-color red" />
                <span>退款</span>
              </div>
            </div>
          </div>
          <el-select v-model="timeRange" size="small" style="width: 120px;">
            <el-option label="最近七天" value="7" />
            <el-option label="最近三十天" value="30" />
            <el-option label="最近三个月" value="90" />
          </el-select>
        </div>
        <div class="chart-content">
          <div class="chart-placeholder">
            <div class="chart-axis">
              <div class="y-axis">
                <span>单位 (元)</span>
              </div>
              <div class="x-axis">
                <span>08-10</span>
                <span>08-11</span>
                <span>08-12</span>
                <span>08-13</span>
                <span>08-14</span>
                <span>08-15</span>
                <span>08-16</span>
              </div>
            </div>
            <div class="chart-grid">
              <!-- 这里可以集成真实的图表库，如 ECharts -->
              <div class="empty-chart">
                <i class="el-icon-data-line" />
                <p>暂无交易数据</p>
              </div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 支付方式 -->
      <el-card class="chart-card">
        <div class="chart-header">
          <span class="chart-title">支付方式</span>
          <el-select v-model="paymentTimeRange" size="small" style="width: 120px;">
            <el-option label="最近七天" value="7" />
            <el-option label="最近三十天" value="30" />
            <el-option label="最近三个月" value="90" />
          </el-select>
        </div>
        <div class="chart-content">
          <div class="empty-data">
            <i class="el-icon-folder" />
            <p>暂无数据</p>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      timeRange: '7',
      paymentTimeRange: '7'
    }
  },
  methods: {
    goToMerchantList() {
      this.$router.push('/merchant/list')
    },
    goToPaymentOrder() {
      this.$router.push('/payment/order')
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .stat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .stat-title {
      font-size: 14px;
      color: #666;
      font-weight: 500;
    }

    .stat-info {
      color: #999;
      cursor: pointer;
      font-size: 16px;

      &:hover {
        color: #409eff;
      }
    }
  }

  .stat-value {
    font-size: 28px;
    font-weight: bold;
    color: #333;
    margin-bottom: 8px;
  }

  .stat-subtitle {
    font-size: 12px;
    color: #999;
    margin-bottom: 12px;
  }

  .stat-details {
    border-top: 1px solid #f0f0f0;
    padding-top: 12px;

    .detail-item {
      font-size: 12px;
      color: #666;
      margin-bottom: 4px;
    }
  }

  // 用户卡片特殊样式
  &.user-card {
    .user-info {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      .user-avatar {
        margin-right: 12px;
      }

      .user-details {
        flex: 1;

        .user-greeting {
          font-size: 16px;
          font-weight: 500;
          color: #333;
          margin-bottom: 4px;
        }

        .user-role {
          font-size: 12px;
          color: #999;
        }
      }

      .more-icon {
        color: #999;
        cursor: pointer;
        font-size: 18px;

        &:hover {
          color: #409eff;
        }
      }
    }

    .quick-start {
      .quick-title {
        font-size: 14px;
        color: #666;
        margin-bottom: 12px;
        font-weight: 500;
      }

      .quick-links {
        display: flex;
        gap: 12px;

        .el-button {
          padding: 8px 16px;
          border: 1px solid #e8e8e8;
          border-radius: 4px;
          color: #666;
          background: #fafafa;

          &:hover {
            color: #409eff;
            border-color: #409eff;
            background: #f0f9ff;
          }
        }
      }
    }
  }
}

.charts-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.chart-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .chart-title {
      display: flex;
      align-items: center;
      gap: 16px;
      font-size: 16px;
      font-weight: 500;
      color: #333;

      .chart-legend {
        display: flex;
        gap: 16px;

        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #666;

          .legend-color {
            width: 12px;
            height: 12px;
            border-radius: 2px;

            &.orange {
              background-color: #ff9500;
            }

            &.red {
              background-color: #ff3b30;
            }
          }
        }
      }
    }
  }

  .chart-content {
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;

    .chart-placeholder {
      width: 100%;
      height: 100%;
      position: relative;

      .chart-axis {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;

        .y-axis {
          position: absolute;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          writing-mode: vertical-rl;
          text-orientation: mixed;
          font-size: 12px;
          color: #999;
        }

        .x-axis {
          position: absolute;
          bottom: 20px;
          left: 60px;
          right: 20px;
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #999;
        }
      }

      .chart-grid {
        position: absolute;
        top: 40px;
        left: 60px;
        right: 20px;
        bottom: 40px;
        border: 1px solid #f0f0f0;
        background: repeating-linear-gradient(
          0deg,
          transparent,
          transparent 29px,
          #f0f0f0 29px,
          #f0f0f0 30px
        ),
        repeating-linear-gradient(
          90deg,
          transparent,
          transparent 49px,
          #f0f0f0 49px,
          #f0f0f0 50px
        );

        .empty-chart {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #999;

          i {
            font-size: 48px;
            margin-bottom: 12px;
          }

          p {
            font-size: 14px;
            margin: 0;
          }
        }
      }
    }

    .empty-data {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #999;

      i {
        font-size: 48px;
        margin-bottom: 12px;
      }

      p {
        font-size: 14px;
        margin: 0;
      }
    }
  }
}

@media (max-width: 1200px) {
  .charts-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .chart-card .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
