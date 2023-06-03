<template>
  <el-main class="image-main" v-loading="loading">
    <div class="top p-3">
      <el-row :gutter="10">
        <el-col :span="6" :offset="0" v-for="(item, id) in list" :key="id">
          <el-card
            shadow="hover"
            class="relative mb-3"
            :body-style="{ padding: 0 }"
            :class="{ 'border-blue-500': item.checked }"
          >
            <el-image
              :preview-src-list="[item.url]"
              :initial-index="0"
              :src="item.url"
              fit="cover"
              :lazy="true"
              class="h-[150px]"
              style="width: 100%"
            >
            </el-image>
            <div class="image-title">{{ item.name }}</div>
            <div class="flex items-center justify-center p-2">
              <el-checkbox
                v-if="openChoose"
                v-model="item.checked"
                @change="handleChooseChange(item)"
              />

              <el-button
                type="primary"
                size="small"
                text
                @click="handleUpdateName(item)"
                >重命名</el-button
              >
              <el-popconfirm
                width="220"
                confirm-button-text="确认删除"
                cancel-button-text="取消"
                title="是否要删除该图片？"
                @confirm="handleDelete(item.id)"
              >
                <template #reference>
                  <el-button class="!m-0" type="primary" size="small" text
                    >删除</el-button
                  >
                </template>
              </el-popconfirm>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="bottom">
      <el-pagination
        background
        layout="prev,pager, next"
        :total="total"
        :page-size="limit"
        :current-page="currentPage"
        @current-change="getData"
      />
    </div>
  </el-main>
  <el-dialog v-model="dialogTableVisible" title="上传图片">
    <UploadFile
      :data="{ image_class_id: imageClassListId }"
      @success="handleUpdaloadSueecss"
    />
  </el-dialog>
</template>
<script setup>
import { computed, ref } from "vue";
import UploadFile from "~/components/UploadFile.vue";
import { getImageList, updatedImageName, deleteImage } from "~/api/image.js";
import { showPrompt, toast } from "~/composables/util.js";
import { number } from "echarts";
const currentPage = ref(1);
const total = ref(0);
const limit = ref(10);
const list = ref([]);
const loading = ref(false);
const imageClassListId = ref(0);
// 上传图片弹出框
const dialogTableVisible = ref(false);
const openUploadFile = () => (dialogTableVisible.value = true);

function getData(p = null) {
  if (typeof p == "number") {
    currentPage.value = p;
  }

  loading.value = true;
  getImageList(imageClassListId.value, currentPage.value)
    .then((res) => {
      total.value = res.totalCount;
      list.value = res.list.map((o) => {
        o.checked = false;
        return o;
      });
    })
    .finally(() => {
      loading.value = false;
    });
}

// 根据分类id重新加载图片列表
const loadData = (id) => {
  currentPage.value = 1;
  imageClassListId.value = id;
  getData();
};
// 重命名
const handleUpdateName = (item) => {
  showPrompt("重命名", item.name).then(({ value }) => {
    console.log(value);
    loading.value = true;
    updatedImageName(item.id, value)
      .then((res) => {
        toast("修改成功", "success");
        getData();
      })
      .finally(() => {
        loading.value = false;
      });
  });
};

// 删除图片
const handleDelete = (id) => {
  loading.value = true;
  deleteImage([id])
    .then((res) => {
      console.log(res);
      toast("删除成功", "success");
      getData();
    })
    .finally(() => {
      loading.value = false;
    });
};

const props = defineProps({
  openChoose: {
    type: Boolean,
    default: false,
  },
  limit: {
    type: Number,
    default: 1,
  },
});
// 上传图片成功，刷新页面
const handleUpdaloadSueecss = () => getData(1);

// 选中的图片
const emit = defineEmits(["choose"]);
const checkedImage = computed(() => list.value.filter((o) => o.checked));

const handleChooseChange = (item) => {
  if (item.checked && checkedImage.value.length > props.limit) {
    item.checked = false;
    return toast("最多只能选中一张图片", "error");
  }
  emit("choose", checkedImage.value);
};

defineExpose({
  loadData,
  openUploadFile,
});
</script>
<style lang="postcss" scoped>
.image-main {
  position: relative;
}

.image-main .top {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 50px;
  overflow-y: auto;
}

.image-main .bottom {
  position: absolute;
  bottom: 0;
  height: 50px;
  left: 0;
  right: 0;
  @apply flex items-center justify-center;
}

.image-title {
  padding-left: 5px;
  position: absolute;
  top: 130px;
  left: -1px;
  right: -1px;
  @apply text-sm truncate text-gray-100 bg-opacity-50 bg-gray-800;
}
</style>
