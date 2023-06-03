<template>
  <div>
    <el-tabs v-model="searchForm.tab" @tab-change="getData">
      <el-tab-pane
        :label="item.name"
        :name="item.key"
        v-for="(item, id) in tabbars"
        :key="id"
      ></el-tab-pane>
    </el-tabs>

    <el-card shadow="never" class="border-0">
      <!-- 搜索 -->
      <search :model="searchForm" @search="getData" @reset="resetSearchForm">
        <searchItem label="订单编号">
          <el-input
            v-model="searchForm.no"
            placeholder="请输入订单编号"
            clearable
          ></el-input>
        </searchItem>
        <template #show>
          <searchItem label="收货人">
            <el-input
              v-model="searchForm.name"
              placeholder="请输入收货人姓名"
              clearable
            ></el-input>
          </searchItem>
          <searchItem label="手机号">
            <el-input
              v-model="searchForm.phone"
              placeholder="请输入手机号码"
              clearable
            ></el-input>
          </searchItem>
          <searchItem label="开始时间">
            <el-date-picker
              v-model="searchForm.starttime"
              type="date"
              placeholder="开始日期"
              style="width: 90%"
              value-format="YYYY-MM-DD"
            />
          </searchItem>
          <searchItem label="结束时间">
            <el-date-picker
              v-model="searchForm.endtime"
              type="date"
              placeholder="结束日期"
              style="width: 90%"
              value-format="YYYY-MM-DD"
            />
          </searchItem>
        </template>
      </search>

      <!-- 新增 | 刷新 -->
      <ListHeader
        layout="refresh,downLoad"
        @downLoad="handleExportExcel"
        @refresh="getData"
      >
        <el-button type="danger" @click="handleMultiDelete" size="small">
          批量删除
        </el-button>
      </ListHeader>

      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        v-loading="loading"
        ref="multipleTableRef"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="商品" width="300">
          <template #default="{ row }">
            <div class="flex text-sm">
              <div class="flex-1">
                <p>订单号:</p>
                <small> {{ row.no }}</small>
              </div>
              <div>
                <p>下单时间:</p>
                <small>{{ row.create_time }}</small>
              </div>
            </div>
            <div
              class="flex py-2"
              v-for="(item, id) in row.order_items"
              :key="id"
            >
              <el-image
                :src="item.goods_item ? item.goods_item.cover : ''"
                fit="fill"
                :lazy="true"
                style="width: 30px; height: 30px"
              ></el-image>
              <p class="text-blue-500 ml-2">
                {{ item.goods_item ? item.goods_item.title : "商品已被删除" }}
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="实付款"
          prop="total_price"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column align="center" label="买家" width="150">
          <template #default="{ row }">
            <p>{{ row.user.username || row.user.nickname }}</p>
            <small>(用户ID:{{ row.user.id }})</small>
          </template>
        </el-table-column>
        <el-table-column label="交易状态">
          <template #default="{ row }">
            <div>
              付款状态:
              <el-tag
                v-if="row.payment_method == 'wechat'"
                type="success"
                size="small"
                >微信支付</el-tag
              >
              <el-tag v-else-if="row.payment_method == 'alipay'" size="small"
                >支付宝支付</el-tag
              >
              <el-tag v-else type="info" size="small">未支付</el-tag>
            </div>
            <div>
              发货状态:
              <el-tag :type="row.ship_data ? 'success' : 'info'" size="small">{{
                row.ship_data ? "已发货" : "未发货"
              }}</el-tag>
            </div>
            <div>
              收货状态:
              <el-tag
                :type="row.ship_status == 'received' ? 'success' : 'info'"
                size="small"
                >{{
                  row.ship_status == "received" ? "已收货" : "未收货"
                }}</el-tag
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="{ row }">
            <el-button
              @click="openInfoModal(row)"
              class="px-1"
              type="primary"
              size="small"
              text
              >订单详情</el-button
            >
            <el-button
              v-if="searchForm.tab == 'noship'"
              class="px-1"
              type="primary"
              size="small"
              text
              >订单发货</el-button
            >
            <el-button
              class="px-1"
              v-if="searchForm.tab == 'refunding'"
              type="primary"
              size="small"
              text
              @click="handleRefund(row.id, 1)"
              >同意退款</el-button
            >
            <el-button
              class="px-1"
              v-if="searchForm.tab == 'refunding'"
              type="primary"
              size="small"
              text
              @click="handleRefund(row.id, 0)"
              >拒绝退款</el-button
            ></template
          >
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
    <FormDialog
      title="导出订单"
      @submit="exportData"
      :loading="loading"
      ref="formDialogRef"
    >
      <el-form class="mt-5" :model="form" label-width="80px">
        <el-form-item label="订单类型">
          <el-select
            v-model="form.tab"
            value-key=""
            placeholder="请选择订单类型"
          >
            <el-option
              v-for="(item, id) in tabbars"
              :key="id"
              :label="item.name"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="form.time"
            type="daterange"
            range-separator="至"
            start-placeholder="起始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-form>
    </FormDialog>
    <InfoModal ref="infoModal" :info="info" />
  </div>
</template>
<script setup>
import {
  getOrderList,
  exportOrder,
  refundOrder,
  deleteOrder,
} from "~/api/order";
import ListHeader from "~/components/ListHeader.vue";
import { reactive, ref } from "vue";
import FormDialog from "~/components/FormDialog.vue";
import InfoModal from "./InfoModal.vue";
import { useInitTable } from "~/composables/useCommon.js";
import search from "~/components/search.vue";
import searchItem from "~/components/searchItem.vue";

import { showModal, showPrompt, toast } from "~/composables/util";

const tabbars = [
  {
    key: "all",
    name: "全部",
  },
  {
    key: "nopay",
    name: "待支付",
  },
  {
    key: "noship",
    name: "待发货",
  },
  {
    key: "shiped",
    name: "待收货",
  },
  {
    key: "received",
    name: "已收货",
  },
  {
    key: "finish",
    name: "已完成",
  },
  {
    key: "closed",
    name: "已关闭",
  },
  {
    key: "refunding",
    name: "退款中",
  },
];

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
  multipleTableRef,
  handleSelectionChange,
  handleMultiDelete,
  multiSelectionIds,
} = useInitTable({
  searchForm: {
    no: "",
    tab: "all",
    starttime: "",
    endtime: "",
    name: "",
    phone: "",
  },
  getList: getOrderList,
  delete: deleteOrder,
  onGetListSuccess: (res) => {
    tableData.value = res.list.map((o) => {
      o.bannersLoading = false;
      o.contentLoading = false;
      o.skusLoading = false;
      return o;
    });
    total.value = res.totalCount;
  },
});

const formDialogRef = ref(null);
const form = reactive({
  tab: null,
  time: "",
});

const handleExportExcel = () => {
  formDialogRef.value.open();
};
const exportData = () => {
  if (!form.tab) return toast("订单类型不能为空", "error");
  loading.value = true;
  let starttime = null;
  let endtime = null;
  if (form.time && Array.isArray(form.time)) {
    starttime = form.time[0];
    endtime = form.time[1];
  }
  exportOrder({
    tab: form.tab,
    starttime,
    endtime,
  })
    .then((res) => {
      let url = window.URL.createObjectURL(new Blob([res]));
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      let filname = new Date().getTime() + ".xlsx";
      link.setAttribute("download", filname);
      document.body.appendChild(link);
      link.click();
    })
    .finally(() => {
      loading.value = false;
      formDialogRef.value.close();
    });
};

const infoModal = ref(null);
const info = ref(null);
const openInfoModal = (row) => {
  row.order_items = row.order_items.map((o) => {
    if (o.skus_type == 1 && o.goods_skus) {
      let s = [];
      for (const k in o.goods_skus.skus) {
        s.push(o.goods_skus.skus[k].value);
      }
      o.sku = s.join(",");
    }
    return o;
  });
  info.value = row;
  infoModal.value.open();
};
// 同意/拒绝退款
const handleRefund = (id, agree) => {
  agree
    ? showModal("是否同意该订单退款？")
    : showPrompt("请输入拒绝的理由:").then(({ value }) => {
        let data = { agree };
        if (!agree) {
          data.disagree_reason = value;
        }
        refundOrder(id, data).then((res) => {
          getData();
          toast("操作成功", "success");
        });
      });
};
</script>
<style scoped></style>
