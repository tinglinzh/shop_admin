<template>
  <el-aside width="200px" class="image-aside" v-loading="loading">
    <div class="top">
      <AsideList
        @edit="handleEdit(item)"
        @delete="handleDelete(item.id)"
        :active="activeId == item.id"
        v-for="(item, id) in list"
        :key="id"
        @click="handChangeActiveId(item.id)"
      >
        {{ item.name }}
      </AsideList>
    </div>
    <div class="bottom">
      <el-pagination
        background
        layout="prev, next"
        :total="total"
        :page-size="limit"
        :current-page="currentPage"
        @current-change="getData"
      />
    </div>
  </el-aside>
  <FormDialog :title="dialogTitle" ref="formDialogRef" @submit="handleSubmit">
    <el-form
      :model="form"
      ref="formRef"
      :rules="rules"
      label-width="80px"
      :inline="false"
    >
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="order">
        <el-input-number v-model="form.order" :min="0" :max="1000" />
      </el-form-item>
    </el-form>
  </FormDialog>
</template>
<script setup>
import { computed, reactive, ref } from "vue";
import AsideList from "./AsideList.vue";
import FormDialog from "./FormDialog.vue";
import {
  getImageClassList,
  updateImageClass,
  createImageClass,
  deleteImageClass,
} from "~/api/image_class.js";
import { toast } from "~/composables/util.js";
// 加载动画
const loading = ref(false);

const list = ref([]);
const activeId = ref(0);

// 分页
const currentPage = ref(1);
const total = ref(0);
const limit = ref(10);
// 获取数据
function getData(p = null) {
  if (typeof p == "number") {
    currentPage.value = p;
  }
  loading.value = true;
  getImageClassList(currentPage.value)
    .then((res) => {
      total.value = res.totalCount;
      list.value = res.list;
      let item = list.value[0];
      if (item) {
        handChangeActiveId(item.id);
      }
    })
    .finally(() => {
      loading.value = false;
    });
}
getData();

const formDialogRef = ref(null);
const editId = ref(0);
const dialogTitle = computed(() => (editId.value ? "修改" : "新增"));
// 定义表单数据
const form = reactive({
  name: "",
  order: 50,
});

const rules = {
  name: [
    {
      required: true,
      message: "图库分类名称不能为空",
      trigger: "blur",
    },
  ],
};
const formRef = ref(null);
// 新增图库分类
const handleCreate = () => {
  editId.value = 0;
  form.name = "";
  form.order = 50;
  formDialogRef.value.open();
};
// 新增图库分类 按钮提交
const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) return;

    formDialogRef.value.showLoading();
    // 判断当前提交是新增还是修改
    const fun = editId.value? updateImageClass(editId.value, form) : createImageClass(form);
    fun
      .then((res) => {
        toast(dialogTitle.value + "成功", "success");
        getData(editId.value ? currentPage.value : 1);
        formDialogRef.value.close();
      })
      .finally(() => {
        formDialogRef.value.hideLoading();
      });
  });
};

// 编辑图库分类
const handleEdit = (item) => {
  editId.value = item.id;
  form.name = item.name;
  form.order = item.order;
  formDialogRef.value.open();
};

// 删除图库分类
const handleDelete = (id) => {
  loading.value = true;
  deleteImageClass(id)
    .then(() => {
      toast("删除成功", "success");
      getData(currentPage);
    })
    .finally(() => {
      loading.value = false;
    });
};

//选中图库分类id
const emit = defineEmits(["change"]);
function handChangeActiveId(id) {
  activeId.value = id;
  emit("change", id);
}

defineExpose({
  handleCreate,
});
</script>
<style scoped>
.image-aside {
  border-right: 1px solid #eeeeee;
  position: relative;
}

.image-aside .top {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 50px;
  overflow-y: auto;
}

.image-aside .bottom {
  position: absolute;
  bottom: 0;
  height: 50px;
  left: 0;
  right: 0;
  @apply flex items-center justify-center;
}

.aside-list {
  border-bottom: 1px solid #f4f4f4;
  @apply flex items-center p-3 text-sm text-gray-600;
}

.aside-list:hover,
.active {
  @apply bg-blue-50;
}
</style>
