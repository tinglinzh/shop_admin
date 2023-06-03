<template>
  <FormDialog
    style="height: 500px; margin-top: 8vh"
    width="900px"
    ref="formDialogRef"
    title="设置商品规格"
    @submit="handleSubmit()"
  >
    <el-form :model="form" label-width="80px" class="mt-5">
      <el-form-item label="规格类型">
        <el-radio-group v-model="form.sku_type">
          <el-radio :label="0" border>单规格</el-radio>
          <el-radio :label="1" border>多规格</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="form.sku_type == 0">
        <el-form-item label="市场价格">
          <el-input
            v-model="form.sku_value.oprice"
            size="default"
            clearable
            style="width: 40%"
            ><template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="销售价格">
          <el-input
            v-model="form.sku_value.pprice"
            size="default"
            clearable
            style="width: 40%"
            ><template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="成本价格">
          <el-input
            v-model="form.sku_value.cprice"
            size="default"
            clearable
            style="width: 40%"
            ><template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品重量">
          <el-input
            v-model="form.sku_value.weight"
            size="default"
            clearable
            style="width: 40%"
            ><template #append>千克</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品体积">
          <el-input
            v-model="form.sku_value.volume"
            size="default"
            clearable
            style="width: 40%"
            ><template #append>立方米</template>
          </el-input>
        </el-form-item>
      </template>
      <template v-else> <SkuCard /> <SkuTable /></template>
    </el-form>
  </FormDialog>
</template>
<script setup>
import { readGoods, updateGoodsSkus } from "~/api/goods.js";
import { ref, reactive } from "vue";
import FormDialog from "~/components/FormDialog.vue";
import { toast } from "~/composables/util";
import SkuCard from "./components/SkuCard.vue";
import SkuTable from "./components/SkuTable.vue";
import { initSkuCardList, goodsId, skusList } from "~/composables/useSku";

const formDialogRef = ref(null);
const form = reactive({
  sku_type: 0,
  sku_value: {
    oprice: 0,
    pprice: 0,
    cprice: 0,
    weight: 0,
    volume: 0,
  }, //单规格属性（sku_type=0时必填）
});

const emit = defineEmits(["reloadData"]);

const openDialog = (row) => {
  goodsId.value = row.id;
  row.skusLoading = true;
  readGoods(goodsId.value)
    .then((res) => {
      form.sku_value = res.sku_value || {
        oprice: 0,
        pprice: 0,
        cprice: 0,
        weight: 0,
        volume: 0,
      };
      initSkuCardList(res);
      form.sku_type = res.sku_type;
      formDialogRef.value.open();
    })
    .finally(() => {
      row.skusLoading = false;
    });
};

const handleSubmit = () => {
  formDialogRef.value.showLoading();
  let data = {
    stu_type: form.sku_type,
    sku_value: form.sku_value, 
  };
  if (form.sku_type == 1) {
    data.goodsSkus = skusList.value;
  }
  updateGoodsSkus(goodsId.value, data)
    .then((res) => {
      toast("设置商品规格成功", "success");
      emit("reloadData");
    })
    .finally(() => {
      formDialogRef.value.close();
      formDialogRef.value.hideLoading();
    });
};

// 导出方法
defineExpose({ openDialog });
</script>
