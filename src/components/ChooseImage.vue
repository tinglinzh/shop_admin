<template>
  <div v-if="modelValue && preview">
    <el-image
      v-if="typeof modelValue == 'string'"
      :src="modelValue"
      fit="cover"
      class="w-[100px] h-[100px] rounded border mr-2"
    ></el-image>
    <div v-else class="flex flex-wrap">
      <div
        class="relative mx-1 w-[100px] h-[100px]"
        v-for="(url, id) in modelValue"
        :key="id"
      >
        <el-icon
          class="absolute bg-white rounded-1 right-[5px] top-[5px] cursor-pointer"
          style="z-index: 10"
          @click="removeImage(url)"
          ><CloseBold
        /></el-icon>
        <el-image
          :src="url"
          fit="cover"
          class="w-[100px] h-[100px] rounded border mr-2"
        ></el-image>
      </div>
    </div>
  </div>
  <div v-if="preview" class="choose-image-btn" @click="chooseImage">
    <el-icon :size="25"><Plus /></el-icon>
  </div>
  <FormDialog
    width="900px"
    ref="formDialogRef"
    title="选择图片"
    @submit="handleSubmit"
  >
    <el-container class="bg-white rounded" style="height: 70vh">
      <el-header class="image-header">
        <el-button type="primary" size="small" @click="handleOpenCreate">
          新增图片分类
        </el-button>
        <el-button type="warning" size="small" @click="handleOpenUpload">
          上传图片
        </el-button>
      </el-header>
      <el-container>
        <ImageAside ref="ImageAsideRef" @change="handleAsideChange" />
        <ImageMain
          :limit="limit"
          ref="ImageMainRef"
          openChoose
          @choose="handleChoose"
        />
      </el-container> </el-container
  ></FormDialog>
</template>
<script setup>
import ImageAside from "~/components/ImageAside.vue";
import ImageMain from "~/components/ImageMain.vue";
import { ref } from "vue";
import { toast } from "~/composables/util";

const ImageAsideRef = ref(null);
const ImageMainRef = ref(null);
const handleOpenCreate = () => ImageAsideRef.value.handleCreate();
const handleAsideChange = (imageClassListId) => {
  ImageMainRef.value.loadData(imageClassListId);
};

const handleOpenUpload = () => ImageMainRef.value.openUploadFile();

import FormDialog from "~/components/FormDialog.vue";
const formDialogRef = ref(null);

const callbackFunction = ref(null);
const chooseImage = (callback = null) => {
  callbackFunction.value = callback;
  formDialogRef.value.open();
};

const props = defineProps({
  modelValue: [String, Array],
  limit: { type: Number, default: 1 },
  preview: { type: Boolean, default: true },
});
const emit = defineEmits(["update:modelValue"]);

let urls = [];
const handleChoose = (e) => {
  urls = e.map((o) => o.url);
};

const handleSubmit = () => {
  let ImageArray = [];
  if (props.limit == 1) {
    ImageArray = urls[0];
  } else {
    // 上传轮播图时，向将已有图片拿到再加勾选中图片一起放到新数组
    ImageArray = props.preview ? [...props.modelValue, ...urls] : [...urls];
    if (ImageArray.length > props.limit) {
      let limit = props.preview
        ? props.limit - props.modelValue.length
        : props.limit;
      return toast("最多还能选择" + limit + "张", "error");
    }
  }
  if (ImageArray && props.preview) {
    emit("update:modelValue", ImageArray);
  }
  if (!props.preview && typeof callbackFunction.value === "function") {
    callbackFunction.value(ImageArray);
  }
  formDialogRef.value.close();
};

// 轮播图移除图片
const removeImage = (url) =>
  emit(
    "update:modelValue",
    props.modelValue.filter((u) => u != url)
  );
defineExpose({
  chooseImage,
});
</script>
<style scoped>
.el-form-item__content {
  height: 100px;
}
.choose-image-btn {
  @apply w-[100px] h-[100px] ml-1 cursor-pointer hover:(bg-gray-100) rounded border flex justify-center items-center;
}
.image-header {
  border-bottom: 1px solid #eeeeee;
  @apply flex items-center;
}
.formDialog {
  height: 480px;
}
</style>
