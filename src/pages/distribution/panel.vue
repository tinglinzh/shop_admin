<template>
  <el-row :gutter="20" class="mb-5">
    <template v-if="loading">
      <el-col :span="6" v-for="i in 4" :key="i">
        <el-skeleton style="width: 100%" animated loading>
          <template #template>
            <el-card shadow="hover" class="border-0">
              <template #header>
                <div class="flex justify-between">
                  <el-skeleton-item variant="text" style="width: 50%" />
                  <el-skeleton-item variant="text" style="width: 10%" />
                </div>
              </template>
            </el-card>
          </template>
        </el-skeleton>
      </el-col>
    </template>
    <el-col :span="6" :offset="0" v-for="(item, id) in list" :key="id">
      <el-card shadow="never" class="border-0">
        <div class="flex items-center">
          <el-icon
            :size="20"
            :class="item.color"
            class="text-white w-[40px] h-[40px] rounded-full"
          >
            <User v-if="id == 0" />
            <ShoppingTrolley v-if="id == 1" />
            <PriceTag v-if="id == 2" />
            <Timer v-if="id == 3" />
          </el-icon>
          <div class="ml-2">
            <h2 class="text-lg font-bold">{{ item.value }}</h2>
            <small class="text-xs text-gray-400">{{ item.label }}</small>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>
<script setup>
import { ref } from "vue";
import { getAgentStatistics } from "~/api/distribution.js";

const list = ref([]);
const loading = ref(false);
getAgentStatistics()
  .then((res) => {
    loading.value = true;
    list.value = res.panels;

  })
  .finally(() => {
    loading.value = false;
  });
</script>