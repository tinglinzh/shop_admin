<template>
  <el-card shadow="never" class="border-0">
    <!-- 搜索 -->
    <search :model="searchForm" @search="getData" @reset="resetSearchForm">
      <searchItem>
        <el-input
          v-model="searchForm.title"
          placeholder="请输入商品标题"
          clearable
        ></el-input>
      </searchItem>
    </search>
    <!-- 新增 | 刷新 -->
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column type="expand">
        <template #default="{ row }">
          <div class="flex pl-18">
            <el-avatar
              class="mr-3"
              :size="50"
              :src="row.user.avatar"
              fit="fill"
            ></el-avatar>
            <div class="flex-1">
              <h6 class="flex items-center">
                {{ row.user.username || row.user.nickname }}
                <small class="text-gray-400">{{ row.review_time }}</small>
                <el-button
                  size="small"
                  class="ml-auto"
                  @click="openTexarea(row)"
                  v-if="!row.textareaEdit && !row.extra"
                  >回复</el-button
                >
              </h6>
              {{ row.review.data }}
              <div class="py-2">
                <el-image
                  v-for="(item, id) in row.review.image"
                  :src="item"
                  :key="id"
                  fit="fill"
                  :lazy="true"
                  style="width: 100px; height: 100px"
                  class="rounded"
                ></el-image>
              </div>
              <div v-if="row.textareaEdit">
                <el-input
                  type="textarea"
                  v-model="textarea"
                  :rows="2"
                  label="textarea"
                  placeholder="请输入回复内容"
                >
                </el-input>
                <div class="py-2">
                  <el-button size="small" @click="row.textareaEdit = false"
                    >取消</el-button
                  >
                  <el-button
                    type="primary"
                    class="ml-2"
                    size="small"
                    @click="review(row)"
                    >回复</el-button
                  >
                </div>
              </div>
              <template v-else>
                <div
                  v-for="(item, id) in row.extra"
                  :key="id"
                  class="mt-3 bg-gray-100 p-3 rounded"
                >
                  <h6 class="flex font-bold">
                    客服
                    <el-button
                      @click="openTexarea(row, item.data)"
                      type="info"
                      size="small"
                      class="ml-auto"
                      >修改</el-button
                    >
                  </h6>
                  <p>{{ item.data }}</p>
                </div>
              </template>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="ID" width="70" align="center" prop="id">
      </el-table-column>
      <el-table-column label="商品" width="250">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-image
              :src="row.goods_item ? row.goods_item.cover : ''"
              fit="fill"
              :lazy="true"
              style="width: 50px; height: 50px"
              class="rounded"
            ></el-image>

            <div class="ml-3">
              <h6>{{ row.goods_item?.title ?? "商品已被删除" }}</h6>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="评价信息" width="200">
        <template #default="{ row }">
          <div>
            <p>用户：{{ row.user.username || row.user.nickname }}</p>
            <p>
              <el-rate
                v-model="row.rating"
                disabled
                show-score
                text-color="#ff9900"
              />
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="评价时间"
        width="180"
        align="enter"
        prop="review_time"
      >
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template #default="{ row }">
          <el-switch
            :loading="row.statusLoading"
            :model-value="row.status"
            :active-value="1"
            :inactive-value="0"
            :disabled="row.super == 1"
            @change="updateStatusChange($event, row)"
          >
          </el-switch>
        </template>
      </el-table-column>
    </el-table>
    <div class="flex items-center justify-center mt-5">
      <el-pagination
        background
        layout="prev, pager,next"
        :total="total"
        :page-size="limit"
        :current-page="currentPage"
        @current-change="getData"
      />
    </div>
  </el-card>
</template>
<script setup>
import {
  getGoodsCommentList,
  replyGoodsComment,
  updateGoodsCommentStatus,
} from "~/api/goods_comment";
import { ref } from "vue";
import { useInitTable } from "~/composables/useCommon.js";
import search from "~/components/search.vue";
import searchItem from "~/components/searchItem.vue";
import { toast } from "~/composables/util";
const roles = ref([]);

const {
  searchForm,
  resetSearchForm,
  tableData,
  total,
  currentPage,
  loading,
  limit,
  getData,
  handleDelete,
  updateStatusChange,
} = useInitTable({
  searchForm: {
    title: "",
  },
  getList: getGoodsCommentList,
  updateStatus: updateGoodsCommentStatus,
  onGetListSuccess: (res) => {
    tableData.value = res.list.map((o) => {
      o.statusLoading = false;
      o.textareaEdit = false;
      return o;
    });
    total.value = res.totalCount;
    roles.value = res.roles;
  },
});
const textarea = ref("");
const openTexarea = (row, data = "") => {
  textarea.value = data;
  row.textareaEdit = true;
};
const review = (row) => {
  if (textarea.value == "") {
    return toast("评论不能为空", "error");
  }
  replyGoodsComment(row.id, textarea.value).then((res) => {
    row.textareaEdit = false;
    toast("回复成功", "success");
    getData();
  });
};
</script>
<style scoped></style>
