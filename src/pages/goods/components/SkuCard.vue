<template>
  <el-form-item label="规格选项" v-loading="bodyLoading">
    <el-card
      shadow="never"
      class="w-full mb-3"
      v-for="(item, index) in sku_card_list"
      :key="index"
      v-loading="item.loading"
    >
      <template #header>
        <div class="flex items-center">
          <el-input
            v-model="item.text"
            placeholder="规格名称"
            style="width: 200px"
            @change="handleUpdate(item)"
          >
            <template #append>
              <el-icon class="cursor-pointer" @click="handleChooseSku(item)"
                ><More
              /></el-icon>
            </template>
          </el-input>
          <el-button
            class="ml-auto"
            @click="sortCard('up', index)"
            size="small"
            :disabled="index == 0"
          >
            <el-icon><Top /></el-icon>
          </el-button>

          <el-button
            size="small"
            :disabled="index === sku_card_list.length - 1"
            @click="sortCard('down', index)"
          >
            <el-icon><Bottom /></el-icon>
          </el-button>
          <el-popconfirm
            width="220"
            confirm-button-text="确认删除"
            cancel-button-text="取消"
            title="是否要删除该规格选项？"
            @confirm="handleDelete(item)"
          >
            <template #reference>
              <el-button size="small">
                <el-icon><Delete /></el-icon>
              </el-button>
            </template>
          </el-popconfirm>
        </div>
      </template>
      <SkusCardItem :skuCardId="item.id" />
    </el-card>
    <el-button
      type="success"
      size="small"
      @click="addSkuCardEvent"
      :loading="btnLoading"
      >添加规格</el-button
    >
  </el-form-item>
  <ChooseSku ref="ChooseSkuRef" />
</template>
<script setup>
import { ref } from "vue";
import SkusCardItem from "./SkusCardItem.vue";
import {
  sku_card_list,
  sortCard,
  addSkuCardEvent,
  btnLoading,
  handleUpdate,
  handleDelete,
  bodyLoading,
  handleChooseSetGoodsSkusCard,
} from "~/composables/useSku";
import ChooseSku from "~/components/ChooseSku.vue";

const ChooseSkuRef = ref(null);

const handleChooseSku = (item) => {
  ChooseSkuRef.value.openChooseSku((value) => {
    handleChooseSetGoodsSkusCard(item.id, {
      name: value.name,
      value: value.list,
    });
  });
};
</script>
<style>
.el-card__header {
  @apply !p-2 bg-gray-50;
}
</style>
