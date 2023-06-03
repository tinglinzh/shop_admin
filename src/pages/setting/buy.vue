<template>
  <div v-loading="loading" class="bg-white p-4 rounded">
    <el-form :model="form" label-width="120px">
      <el-tabs v-model="activeName">
        <el-tab-pane class="mt-3" label="支付设置" name="frist">
          <el-table :data="tableData" border stripe>
            <el-table-column label="支付方式" align="left">
              <template #default="{ row }">
                <div class="flex items-center">
                  <el-image
                    :src="row.src"
                    fit="fill"
                    :lazy="true"
                    style="width: 40px; height: 40px"
                    class="rounded mr-2"
                  ></el-image>
                  <div>
                    <h6>{{ row.name }}</h6>
                    <small class="flex text-gray-500 mt-1">{{
                      row.desc
                    }}</small>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" align="center">
              <template #default="{ row }">
                <el-button
                  type="primary"
                  size="small"
                  @click="openSetting(row.key)"
                  >配置</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="购物设置" name="second">
          <el-form-item label="未支付订单">
            <div>
              <el-input
                v-model="form.close_order_minute"
                placeholder="Bucket"
                type="number"
                ><template #append> 分钟后自动关闭 </template></el-input
              >
              <small class="flex text-gray-500 mt-1"
                >订单下单未付款，n分钟后自动关闭，设置0不自动关闭</small
              >
            </div>
          </el-form-item>

          <el-form-item label="已发货订单">
            <div>
              <el-input
                v-model="form.auto_received_day"
                placeholder="ACCESS_KEY"
                type="number"
                ><template #append>天后自动确认收货 </template></el-input
              >
              <small class="flex text-gray-500 mt-1"
                >如果在期间未确认收货，系统自动完成收货，设置0不自动收货</small
              >
            </div>
          </el-form-item>
          <el-form-item label="已完成订单">
            <div>
              <el-input
                v-model="form.after_sale_day"
                placeholder="SECRET_KEY"
                type="number"
              >
                <template #append>天内允许申请售后 </template></el-input
              >
              <small class="flex text-gray-500 mt-1">
                订单完成后，用户在n天内可以发起售后申请，设置0不允许申请售后
              </small>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="default" @click="handleSubmit"
              >保存</el-button
            >
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <FormDialog title="配置" ref="formDialogRef" @submit="handleSubmit">
      <el-form v-if="dialogType == 'alipay '" :model="form" label-width="120px">
        <el-form-item label="app_id">
          <el-input v-model="form.alipay.app_id" style="width: 90%"> </el-input>
        </el-form-item>
        <el-form-item label="公钥">
          <el-input
            type="textarea"
            rows="4"
            v-model="form.alipay.ali_public_key"
            style="width: 90%"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="秘钥">
          <el-input v-model="form.alipay.private_key" style="width: 90%">
          </el-input>
        </el-form-item> </el-form
      ><el-form v-else :model="form" label-width="120px">
        <el-form-item label="公众号 APPID">
          <el-input v-model="form.wxpay.app_id" style="width: 90%"> </el-input>
        </el-form-item>
        <el-form-item label="小程序 APPID">
          <el-input v-model="form.wxpay.miniapp_id" style="width: 90%">
          </el-input>
        </el-form-item>
        <el-form-item label="小程序 secret">
          <el-input v-model="form.wxpay.secret" style="width: 90%"> </el-input>
        </el-form-item>
        <el-form-item label="appid">
          <el-input v-model="form.wxpay.appid" style="width: 90%"> </el-input>
        </el-form-item>
        <el-form-item label="商户号">
          <el-input v-model="form.wxpay.mch_id" style="width: 90%"> </el-input>
        </el-form-item>
        <el-form-item label="API密钥">
          <el-input v-model="form.wxpay.key" style="width: 90%"> </el-input>
        </el-form-item>
        <el-form-item label="cert_client">
          <el-upload
            :action="uploadAction"
            accept=".pem"
            :headers="{ token }"
            :limit="1"
            :on-success="uploadClientSuccess"
          >
            <el-button type="primary" size="small">点击上传</el-button>

            <template #tip>
              <p class="text-rose-500">
                {{
                  form.wxpay.cert_client ? form.wxpay.cert_client : "还未配置"
                }}
              </p>
              <div class="el-upload__tip">例如：apiclient_cert.pem</div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="cert_key">
          <el-upload
            :action="uploadAction"
            accept=".pem"
            :headers="{ token }"
            :limit="1"
            :on-success="uploadKeySuccess"
          >
            <el-button type="primary" size="small">点击上传</el-button>

            <template #tip>
              <p class="text-rose-500">
                {{ form.wxpay.cert_key ? form.wxpay.cert_key : "还未配置" }}
              </p>
              <div class="el-upload__tip">例如：apiclient_key.pem</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
    </FormDialog>
  </div>
</template>
<script setup>
import { reactive, ref } from "vue";
import { getSysconfig, uploadAction, setSysconfig } from "~/api/sysconfig";
import { toast } from "~/composables/util";
import { getToken } from "~/composables/auth";
import FormDialog from "~/components/FormDialog.vue";

const token = getToken();
const activeName = ref("frist");
const tableData = [
  {
    name: "支付宝支付",
    desc: "该系统支持即时到账接口",
    src: "/alipay.png",
    key: "alipay ",
  },
  {
    name: "微信支付",
    desc: "该系统支持微信网页支付和扫码支付",
    src: "/wepay.png",
    key: "wepay ",
  },
];
const loading = ref(false);
const form = reactive({
  close_order_minute: 0, //未支付订单自动关闭时间：分钟，0不自动关闭
  auto_received_day: 0, //已发货订单自动确认时间：天，0不自动收货
  after_sale_day: 0, //已完成订单允许申请售后：天
  alipay: {
    app_id: "",
    ali_public_key: "",
    private_key: "",
  }, //支付宝支付配置 { app_id:"", ali_public_key:"", private_key:""}
  wxpay: {
    app_id: "",
    miniapp_id: "",
    secret: "",
    appid: "",
    mch_id: "",
    key: "",
    cert_client: "",
    cert_key: "",
  }, //微信支付配置 { app_id:'', // 公众号 APPID miniapp_id:'', // 小程序 APPID secret:"", // 小程序secret appid:'', // appid mch_id:'', // 商户号 key:'', // API 密钥 cert_client:'', cert_key:'' }
});
function getData() {
  loading.value = true;
  getSysconfig()
    .then((res) => {
      for (const k in form) {
        form[k] = res[k];
      }
    })
    .finally(() => {
      loading.value = false;
    });
}
getData();
const dialogType = ref("wepay");
const formDialogRef = ref(null);
const openSetting = (key) => {
  dialogType.value = key;
  formDialogRef.value.open();
};

const handleSubmit = () => {
  loading.value = true;
  setSysconfig({ ...form })
    .then((res) => {
      toast("修改成功", "success");
      getData();
    })
    .finally(() => {
      loading.value = false;
    });
};

// 上传文件
function uploadClientSuccess(response, uploadFile, uploadFiles) {
  form.wxpay.cert_client = response.data;
}
function uploadKeySuccess(response, uploadFile, uploadFiles) {
  form.wxpay.cert_key = response.data;
}
</script>
