<template>
  <FormDialog
    ref="formDialogRef"
    @submit="handleSubmit"
    title="规格选择"
    width="80%"
    style="height: 500px; margin-top: 8vh"
  >
    <el-container style="height: 370px">
      <el-aside width="220px" class="Sku-aside" v-loading="loading">
        <div class="top">
          <div
            class="sku-list"
            :class="{ active: activeId == item.id }"
            v-for="(item, id) in tableData"
            :key="id"
            @click="handleChangeActiveId(item.id)"
          >
            {{ item.name }}
          </div>
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
      <el-main>
        <el-checkbox-group v-model="form.list">
          <el-checkbox
            border
            v-for="(item, id) in list"
            :key="id"
            :label="item"
          >
            {{ item }}
          </el-checkbox>
        </el-checkbox-group>
      </el-main>
    </el-container>
  </FormDialog>
</template>
<script setup>
import FormDialog from "./FormDialog.vue";
import { reactive, ref } from "vue";
import { getSkusList } from "~/api/skus";
import { useInitTable } from "~/composables/useCommon.js";
const formDialogRef = ref(null);

const activeId = ref(0);
const { loading, currentPage, limit, total, tableData, getData } = useInitTable(
  {
    getList: getSkusList,
    onGetListSuccess: (res) => {
      tableData.value = res.list;
      total.value = res.totalCount;

      if (tableData.value.length > 0) {
        handleChangeActiveId(tableData.value[0].id);
      }
    },
  }
);

const callbackFunction = ref(null);
const openChooseSku = (callback = null) => {
  callbackFunction.value = callback;
  getData(1);
  formDialogRef.value.open();
};

const list = ref([]);
const form = reactive({
  name: "",
  list: [],
});
function handleChangeActiveId(id) {
  activeId.value = id;
  list.value = [];
  let item = tableData.value.find((o) => o.id == id);
  if (item) {
    list.value = item.default.split(",");
    form.name = item.name;
  }
}

const handleSubmit = () => {
  if (typeof callbackFunction.value === "function") {
    callbackFunction.value(form);
  }
  formDialogRef.value.close();
};
defineExpose({ openChooseSku });
</script>

<style scoped>
.Sku-aside {
  border-right: 1px solid #eeeeee;
  position: relative;
}

.Sku-aside .top {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 50px;
  overflow-y: auto;
}

.Sku-aside .bottom {
  position: absolute;
  bottom: 0;
  height: 50px;
  left: 0;
  right: 0;
  @apply flex items-center justify-center;
}
.sku-list {
  border-bottom: 1px solid #f4f4f4;
  @apply p-3 text-sm text-gray-600 flex
    items-center cursor-pointer;
}
.sku-list:hover,
.active {
  @apply bg-blue-50;
}
</style>
