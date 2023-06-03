<template>
  <FormDialog
    ref="formDialogRef"
    title="推荐商品"
    confirmText="关联商品"
    @submit="openChooseGoods"
  >
    <el-table :data="tableData" border stripe style="width: 100%">
      <el-table-column prop="goods_id" label="ID" width="60" align="center" />
      <el-table-column label="商品封面" width="180" align="center">
        <template #default="{ row }">
          <el-image
            :src="row.cover"
            fit="fill"
            :lazy="true"
            style="width: 64px"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="name"
        label="商品名称"
        width="180"
      />
      <el-table-column align="center" label="操作">
        <template #default="{ row }">
          <el-popconfirm
            confirm-button-text="是"
            cancel-button-text="否"
            title="是否要删除该关联商品？"
            @confirm="handleDelete(row)"
          >
            <template #reference>
              <el-button :loading="row.loading" type="primary" text size="small"
                >删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <ChooseGoods ref="chooseGoodsRef" />
  </FormDialog>
</template>
<script setup>
import FormDialog from "~/components/FormDialog.vue";
import ChooseGoods from "~/components/ChooseGoods.vue";
import {
  getCategorysGoods,
  deleteCategoryGoods,
  connectCategoryGoods,
} from "~/api/category.js";
import { ref } from "vue";
import { toast } from "~/composables/util";

const formDialogRef = ref(null);
const category_id = ref(0);
const tableData = ref([]);

const open = (item) => {
  category_id.value = item.id;
  item.goodsDialogLoading = true;
  getData()
    .then(() => {
      formDialogRef.value.open();
    })
    .finally(() => {
      item.goodsDialogLoading = false;
    });
};

function getData() {
  return getCategorysGoods(category_id.value).then((res) => {
    tableData.value = res.map((o) => {
      o.loading = false;
      return o;
    });
  });
}

const handleDelete = (row) => {
  deleteCategoryGoods(row.id).then((res) => {
    row.loading = true;
    toast("删除成功", "success");
    getData();
  });
};

const chooseGoodsRef = ref(null);
// 打开选择商品
const openChooseGoods = () => {
  chooseGoodsRef.value.open((goods_ids) => {
    formDialogRef.value.showLoading();
    connectCategoryGoods({
      category_id: category_id.value,
      goods_ids,
    })
      .then((res) => {
        getData();
        toast("关联成功", "success");
      })
      .finally(() => {
        formDialogRef.value.hideLoading();
      });
  });
};
defineExpose({
  open,
});
</script>
