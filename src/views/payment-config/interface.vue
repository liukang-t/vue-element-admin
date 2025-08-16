<template>
  <div class="payment-interface-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>支付接口</span>
      </div>

      <!-- 信息横幅 -->
      <div class="info-banner">
        <div class="banner-content">
          <span>计全科技已开放支付接口购买渠道，官方团队开发、源码提供、下载后直接使用。</span>
          <div class="banner-links">
            <el-link type="primary" @click="handleDownload">接口下载、安装说明。</el-link>
            <el-link type="primary" @click="handleMarket">前往接口市场 ></el-link>
          </div>
        </div>
      </div>

      <!-- 支付接口卡片网格 -->
      <div class="interface-grid">
        <!-- 新建支付接口卡片 -->
        <div class="interface-card new-card" @click="handleAdd">
          <div class="card-content">
            <i class="el-icon-plus new-icon" />
            <div class="new-text">新建支付接口</div>
          </div>
        </div>

        <!-- 现有支付接口卡片 -->
        <div
          v-for="item in interfaceList"
          :key="item.id"
          class="interface-card"
          :class="item.cardColor"
        >
          <div class="card-content">
            <div class="interface-icon">
              <img v-if="item.icon" :src="item.icon" :alt="item.name">
              <i v-else class="el-icon-money" />
            </div>
            <div class="interface-name">{{ item.name }}</div>
            <div class="card-actions">
              <el-button
                type="text"
                size="mini"
                icon="el-icon-edit"
                @click="handleEdit(item)"
              />
              <el-button
                type="text"
                size="mini"
                icon="el-icon-delete"
                style="color: #F56C6C;"
                @click="handleDelete(item)"
              />
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'PaymentInterface',
  data() {
    return {
      interfaceList: [
        {
          id: 1,
          name: '支付宝支付',
          icon: '',
          cardColor: 'card-black'
        },
        {
          id: 2,
          name: '支付宝支付接口',
          icon: '',
          cardColor: 'card-blue'
        },
        {
          id: 3,
          name: 'PayPal支付',
          icon: '',
          cardColor: 'card-blue'
        },
        {
          id: 4,
          name: '拉卡拉支付',
          icon: '',
          cardColor: 'card-blue'
        },
        {
          id: 5,
          name: '云闪付支付',
          icon: '',
          cardColor: 'card-red'
        },
        {
          id: 6,
          name: '富友支付',
          icon: '',
          cardColor: 'card-blue'
        },
        {
          id: 7,
          name: '信联支付',
          icon: '',
          cardColor: 'card-blue'
        },
        {
          id: 8,
          name: '微信88',
          icon: '',
          cardColor: 'card-white'
        },
        {
          id: 9,
          name: '普通商户支付方式',
          icon: '',
          cardColor: 'card-white'
        },
        {
          id: 10,
          name: '微信扫码',
          icon: '',
          cardColor: 'card-white'
        },
        {
          id: 11,
          name: '美团支付',
          icon: '',
          cardColor: 'card-white'
        },
        {
          id: 12,
          name: '支付宝宝',
          icon: '',
          cardColor: 'card-white'
        },
        {
          id: 13,
          name: '测试接口',
          icon: '',
          cardColor: 'card-white'
        },
        {
          id: 14,
          name: '杜-测试22222222',
          icon: '',
          cardColor: 'card-green'
        },
        {
          id: 15,
          name: '我上早八',
          icon: '',
          cardColor: 'card-white'
        },
        {
          id: 16,
          name: 'sy支付宝支付',
          icon: '',
          cardColor: 'card-white'
        }
      ]
    }
  },
  methods: {
    handleAdd() {
      this.$message.info('新建支付接口功能')
    },
    handleEdit(item) {
      this.$message.info(`编辑支付接口：${item.name}`)
    },
    handleDelete(item) {
      this.$confirm(`确定要删除支付接口"${item.name}"吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('删除成功')
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    handleDownload() {
      this.$message.info('接口下载、安装说明')
    },
    handleMarket() {
      this.$message.info('前往接口市场')
    }
  }
}
</script>

<style lang="scss" scoped>
.payment-interface-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 84px);
  width: 100%;

  .el-card {
    width: 100%;
  }
}

.info-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px 20px;
  border-radius: 8px;
  margin-bottom: 24px;

  .banner-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;

    span {
      font-size: 14px;
      line-height: 1.5;
    }

    .banner-links {
      display: flex;
      gap: 16px;

      .el-link {
        color: white;
        font-size: 14px;

        &:hover {
          color: #e6f7ff;
        }
      }
    }
  }
}

.interface-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  padding: 0;
}

.interface-card {
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .card-content {
    text-align: center;
    width: 100%;
  }

  .interface-icon {
    margin-bottom: 12px;
    font-size: 32px;
    color: #666;

    img {
      width: 48px;
      height: 48px;
      object-fit: contain;
    }
  }

  .interface-name {
    font-size: 14px;
    color: #333;
    margin-bottom: 8px;
    word-break: break-word;
  }

  .card-actions {
    position: absolute;
    bottom: 8px;
    right: 8px;
    opacity: 0;
    transition: opacity 0.3s ease;

    .el-button {
      padding: 4px;
      margin-left: 4px;
    }
  }

  &:hover .card-actions {
    opacity: 1;
  }

  // 新建卡片样式
  &.new-card {
    border: 2px dashed #d9d9d9;
    background: #fafafa;
    color: #999;

    .new-icon {
      font-size: 32px;
      margin-bottom: 8px;
    }

    .new-text {
      font-size: 14px;
    }

    &:hover {
      border-color: #409eff;
      color: #409eff;
      background: #f0f9ff;
    }
  }

  // 不同颜色的卡片
  &.card-white {
    background: white;
    border: 1px solid #e8e8e8;
  }

  &.card-blue {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;

    .interface-name {
      color: white;
    }

    .interface-icon {
      color: white;
    }
  }

  &.card-red {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: white;

    .interface-name {
      color: white;
    }

    .interface-icon {
      color: white;
    }
  }

  &.card-green {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    color: white;

    .interface-name {
      color: white;
    }

    .interface-icon {
      color: white;
    }
  }

  &.card-black {
    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
    color: white;

    .interface-name {
      color: white;
    }

    .interface-icon {
      color: white;
    }
  }
}

@media (max-width: 768px) {
  .interface-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }

  .info-banner .banner-content {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
