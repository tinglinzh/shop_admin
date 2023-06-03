<template>
  <el-dialog
    v-model="showDialog"
    :title="title"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    @close="close"
    class="dialogPad"
  >
    <div class="formDialog">
      <div class="body">
        <slot></slot>
      </div>
    </div>
    <div class="actions hideactions">
      <el-button type="default" @click="close">取消</el-button>
      <el-button type="primary" @click="submit" :loading="loading">{{
        confirmText
      }}</el-button>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref } from "vue";
const showDialog = ref(false);

const props = defineProps({
  title: String,
  size: {
    type: String,
  },
  confirmText: {
    type: String,
    default: "确认",
  },
});
const loading = ref(false);
const showLoading = () => (loading.value = true);
const hideLoading = () => (loading.value = false);

// 打开
const open = () => {
  showDialog.value = true;
};
// 关闭
const close = () => {
  showDialog.value = false;
  done();
};
// 确认，提交
const emit = defineEmits(["submit", "done"]);
const submit = () => emit("submit");

// 关闭dialog时执行的回调函数
const done = () => emit("done");
// 向父组件暴露以下方法
defineExpose({
  open,
  close,
  showLoading,
  hideLoading,
});
</script>
<style lang="postcss" >
.dialogPad {
  height: 450px;
}
.el-dialog__body {
  padding-top: 5px;
  height: calc(100% - 60px);
}
.formDialog {
  width: 100%;
  position: relative;
  @apply flex flex-col;
  height: 100%;
}
.formDialog .body {
  flex: 1;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 32px;
  overflow-y: auto;
}
.actions {
  position: absolute;

  bottom: 20px;
  height: 35px;
  right: 20px;
  @apply mt-auto flex items-center ml-2;
}
</style>
