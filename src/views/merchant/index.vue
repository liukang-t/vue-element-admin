<template>
  <div class="merchant-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>商户管理</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>商户列表</span>
              <el-button style="float: right; padding: 3px 0" type="text">查看详情</el-button>
            </div>
            <div class="item">
              <span>总商户数：</span>
              <span class="number">128</span>
            </div>
            <div class="item">
              <span>活跃商户：</span>
              <span class="number">96</span>
            </div>
            <div class="item">
              <span>新增商户：</span>
              <span class="number">12</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>应用列表</span>
              <el-button style="float: right; padding: 3px 0" type="text">查看详情</el-button>
            </div>
            <div class="item">
              <span>总应用数：</span>
              <span class="number">256</span>
            </div>
            <div class="item">
              <span>活跃应用：</span>
              <span class="number">198</span>
            </div>
            <div class="item">
              <span>新增应用：</span>
              <span class="number">24</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'MerchantIndex',
  data() {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
.merchant-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 84px);
}

.box-card {
  margin-bottom: 20px;

  .item {
    margin-bottom: 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .number {
      font-size: 20px;
      font-weight: bold;
      color: #409EFF;
    }
  }
}
</style>
