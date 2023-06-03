<template>
  <el-card shadow="never" class="border-0">
    <el-form :model="form" label-width="120px" v-loading="loading">
      <h5 class="bg-gray-100 rounded p-3 mb-5">基础设置</h5>
      <el-form-item label="分销启用" prop="">
        <div>
          <el-radio-group v-model="form.distribution_open">
            <el-radio :label="1" border>是</el-radio>
            <el-radio :label="0" border>否</el-radio>
          </el-radio-group>
          <small class="text-gray-400 flex mt-1"
            >关闭分销功能后不会再产生新的分销佣金，商城端分销入口会关闭。</small
          >
        </div>
      </el-form-item>
      <el-form-item label="分销海报图">
        <ChooseImage :limit="9" v-model="form.spread_banners"
      /></el-form-item>
      <h5 class="bg-gray-100 rounded p-3 mb-5">返佣设置</h5>
      <el-form-item label="一级返佣比例">
        <div>
          <el-input
            v-model="form.store_first_rebate"
            placeholder="请输入一级返佣比例"
            clearable
            style="width: 30%"
          >
            <template #append>%</template></el-input
          ><small class="text-gray-400 flex mt-1">
            订单交易成功后给上级返佣的比例0 - 100,例:5 = 反订单金额的5%
          </small>
        </div>
      </el-form-item>
      <el-form-item label="二级返佣比例">
        <div>
          <el-input
            v-model="form.store_second_rebate"
            placeholder="请输入二级返佣比例"
            clearable
            style="width: 30%"
          >
            <template #append>%</template></el-input
          ><small class="text-gray-400 flex mt-1">
            订单交易成功后给上级返佣的比例0 - 100,例:5 = 反订单金额的5%
          </small>
        </div>
      </el-form-item>
      <el-form-item label="自购返佣">
        <div>
          <el-radio-group v-model="form.is_self_brokerage">
            <el-radio :label="1" border>是</el-radio>
            <el-radio :label="0" border>否</el-radio>
          </el-radio-group>
          <small class="text-gray-400 flex mt-1">
            是否开启自购返佣（开启：分销员自己购买商品，享受一级返佣，上级享受二级返佣；
            关闭：分销员自己购买商品没有返佣）
          </small>
        </div>
      </el-form-item>
      <h5 class="bg-gray-100 rounded p-3 mb-5">结算设置</h5>
      <el-form-item label="结算时间">
        <div>
          <el-input
            v-model="form.settlement_days"
            clearable
            style="width: 60%"
            type="number"
            ><template #prepend>订单完成后 </template>
            <template #append>天</template></el-input
          ><small class="text-gray-400 flex mt-1">
            预估佣金结算后无法进行回收，请谨慎设置结算天数
          </small>
        </div>
      </el-form-item>
      <el-form-item label="佣金到账方式">
        <div>
          <el-radio-group v-model="form.brokerage_method">
            <el-radio label="hand" border>手动到账</el-radio>
            <el-radio label="wx" border>自动到微信零钱</el-radio>
          </el-radio-group>
          <small class="text-gray-400 flex mt-1">
            佣金到账方式支持线下转账和微信零钱自动转账，手动转账更安全，自动转账更方便</small
          >
        </div></el-form-item
      ><el-form-item
        ><el-button type="primary" size="default" @click="submit"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script setup>
import {
  getDistributionSetting,
  updateDistributionSetting,
} from "~/api/distribution.js";
import ChooseImage from "~/components/ChooseImage.vue";
import { reactive, ref } from "vue";
import { toast } from "~/composables/util";
const loading = ref(false);
const form = reactive({
  distribution_open: 1, //分销启用:0禁用1启用
  store_first_rebate: 10, //一级返佣比例：0~100
  store_second_rebate: 20, //二级返佣比例：0~100
  spread_banners: [
    "http://tangzhe123-com.oss-cn-shenzhen.aliyuncs.com/public/62710076cd93e.png",
  ], //分销海报图
  is_self_brokerage: 1, //自购返佣:0否1是
  settlement_days: 7, //结算时间（单位：天）
  brokerage_method: "hand", //佣金到账方式:hand手动,wx微信
});

// 获取数据
function getData() {
  loading.value = true;
  getDistributionSetting()
    .then((res) => {
      for (const k in form) {
        form[k] = res[k];
      }
    })
    .finally(() => {
      loading.value = false;
    });
}
getData();
const submit = () => {
  loading.value = true;
  updateDistributionSetting(form)
    .then((res) => {
      toast("设置成功", "success");
    })
    .finally(() => {
      loading.value = true;
      getData();
    });
};
</script>
<style scoped>
.el-radio {
  margin-right: 10px !important;
}
.el-checkbox {
  margin-right: 10px !important;
}
:deep(.el-input-group__prepend) {
  padding: 0;
  box-shadow: 0 0 0 0 !important;
}
:deep(.el-input-group__prepend) {
  background: white !important;
}
</style>