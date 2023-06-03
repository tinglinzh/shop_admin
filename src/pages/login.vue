<template>
  <el-row class="login-container">
    <el-col :lg="16" :md="12" class="left">
      <div>
        <div>欢迎光临</div>
        <div>亭林商城后台管理系统</div>
      </div>
    </el-col>
    <el-col :lg="8" :md="12" class="rigth">
      <h2>欢迎回来</h2>
      <div class="rigth_frist_div">
        <span class="line"></span>
        <span>账号密码登录</span>
        <span class="line"></span>
      </div>

      <el-form ref="formRef" :model="form" class="w-[250px]" :rules="rules">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名">
            <template #prefix>
              <el-icon><UserFilled /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            placeholder="请输入密码"
            type="password"
            show-password
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-button
          color="#fcd34d"
          type="primary"
          @click="onSubmit"
          class="w-[250px] mt-3"
          round
          :loading="loading"
          >登录</el-button
        >
      </el-form>
    </el-col>
  </el-row>
</template>
<script setup>
import { ref, reactive, onBeforeMount, onMounted } from "vue";
import { useRouter } from "vue-router";
import { toast } from "~/composables/util";
import { useStore } from "vuex";
const store = useStore();
const router = useRouter();
const form = reactive({
  username: "",
  password: "",
});
const rules = {
  username: [
    {
      required: true,
      message: "用户名不能为空",
      trigger: "blur",
    },
    {
      min: 5,
      max: 10,
      message: "用户名长度必须在6~10个字符之间",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      min: 5,
      max: 16,
      message: "密码长度须为5~16，需包含字母、数字和符号两种以上",
      trigger: "blur",
    },
  ],
};
const formRef = ref(null);
const loading = ref(false);
const onSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) {
      return false;
    }
    loading.value = true;
    store
      .dispatch("login", form)
      .then((res) => {
        toast("登录成功", "success");
        router.push("/");
      })
      .finally(() => {
        loading.value = false;
      });
  });
};
// 监听回车事件
function onKeyUp(e) {
  if (e.key == "Enter") onSubmit();
}
// 添加键盘监听
onMounted(() => {
  document.addEventListener("keyup", onKeyUp);
});
// 移除键盘监听
onBeforeMount(() => {
  document.removeEventListener("keyup", onKeyUp);
});
</script>
<style lang="postcss">
.login-container {
  @apply bg-amber-300 min-h-screen;
}
.login-container .left,
.login-container .rigth {
  @apply flex justify-center items-center;
}
.login-container .rigth {
  @apply bg-amber-50  flex-col;
}
.left > div > div:first-child {
  @apply font-bold text-6xl text-fuchsia-50 mb-4;
}
.left > div > div:last-child {
  @apply font-bold text-1xl text-fuchsia-50;
}
.rigth h2 {
  @apply font-bold text-3xl text-gray-800;
}
.rigth .rigth_frist_div {
  @apply flex items-center justify-center space-x-2 my-5 text-gray-400;
}
.rigth .line {
  @apply h-[1px] w-16 bg-gray-200;
}
</style>
