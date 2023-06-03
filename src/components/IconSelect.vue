<template>
  <div class="flex items-center">
    <el-icon v-if="modelValue" :size="20" class="mr-2">
      <component :is="modelValue"></component>
    </el-icon>
    <el-select
      filterable
      :modelValue="modelValue"
      @change="handleChange"
      placeholder="请选择图标"
    >
      <el-option v-for="item in icons" :key="item" :label="item" :value="item">
        <div class="flex items-center justify-between">
          <el-icon>
            <component :is="item"></component>
          </el-icon>
          <span class="text-gray-500">{{ item }}</span>
        </div>
      </el-option>
    </el-select>
  </div>
</template>
<script setup>
import * as iconList from "@element-plus/icons-vue";
import { ref } from "vue";
const icons = ref(Object.keys(iconList));
defineProps({
  modelValue: String,
});

const emit = defineEmits(["update:modelValue"]);
const handleChange = (icon) => {
  emit("update:modelValue", icon);
};
</script>
<style scoped></style>
