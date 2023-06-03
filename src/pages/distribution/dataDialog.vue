<template>
  <FormDialog
    :title="dialogTitle"
    ref="formDialogRef"
    class="dialog"
    style="height: 510px; top: -20px"
  >
    <el-form :model="searchForm" size="small" label-width="80px">
      <el-form-item label="时间选择">
        <el-radio-group v-model="searchForm.type">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="today">今天</el-radio-button>
          <el-radio-button label="yesterday">昨天</el-radio-button>
          <el-radio-button label="last7days">最近7天</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="开始日期">
        <el-date-picker
          v-model="searchForm.starttime"
          type="date"
          placeholder="开始日期"
          style="width: 90%"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="结束日期">
        <el-date-picker
          v-model="searchForm.endtime"
          type="date"
          placeholder="结束日期"
          style="width: 90%"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="用户类型">
        <el-radio-group v-model="searchForm.level">
          <el-radio-button :label="0">全部</el-radio-button>
          <el-radio-button :label="1">一级推广</el-radio-button>
          <el-radio-button :label="2">二级推广</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getData">搜索</el-button
        ><el-button type="primary" @click="resetSearchForm">重置</el-button>
      </el-form-item>
      <el-form-item></el-form-item>
    </el-form>
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <template v-if="type == 'user'">
        <el-table-column label="UID" prop="id" align="center"></el-table-column>
        <el-table-column label="头像" width="65">
          <template #default="{ row }">
            <el-avatar :size="40" :src="row.avatar">
              <img
                src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
              />
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column label="用户信息" prop="username"> </el-table-column>
        <el-table-column label="推广数" prop="share_num" align="center" />
        <el-table-column
          label="推广订单数"
          prop="share_order_num"
          align="center"
        />
        <el-table-column label="绑定时间" prop="create_time" align="center" />
      </template>
      <template v-else>
        <el-table-column
          label="订单号"
          prop="order.no"
          align="center"
        ></el-table-column
        ><el-table-column label="用户|昵称|手机" align="center">
          <template #default="{ row }">
            <div v-if="!row.order.user">该用户已被删除</div>
            <div v-else>
              {{ row.order.user.username }}|{{ row.order.user.nickname }}|{{
                row.order.user.phone
              }}
            </div>
          </template> </el-table-column
        ><el-table-column
          label="时间"
          prop="create_time"
          align="center"
        ></el-table-column
        ><el-table-column
          label="返佣金额"
          prop="commission"
          align="center"
        ></el-table-column>
      </template>
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
  </FormDialog>
</template>
<script setup>
import FormDialog from "~/components/FormDialog.vue";
import { ref, computed } from "vue";
import { getAgentList, getAgentOrderList } from "~/api/distribution";
import { useInitTable } from "~/composables/useCommon.js";
const formDialogRef = ref(null);

const resetSearchForm = () => {
  searchForm.type = "all";
  searchForm.starttime = null;
  searchForm.endtime = null;
  searchForm.level = 0;
};
const open = (id, type) => {
  formDialogRef.value.open();
  searchForm.user_id = id;
  getData();
};
const { searchForm, tableData, total, currentPage, loading, limit, getData } =
  useInitTable({
    searchForm: {
      type: "all",
      starttime: null,
      endtime: null,
      level: 0,
      user_id: 0,
    },
    getList: (() => {
      return props.type === "user" ? getAgentList : getAgentOrderList;
    })(),
    onGetListSuccess: (res) => {
      tableData.value = res.list;
      total.value = res.totalCount;
    },
  });
const props = defineProps({
  type: {
    type: String,
    default: "user",
  },
});

const dialogTitle = computed(() =>
  props.type === "user" ? "推广人列表" : "推广订单列表"
);
defineExpose({
  open,
});
</script>
<style>
</style>