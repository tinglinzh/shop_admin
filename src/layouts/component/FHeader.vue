<template>
  <div class="f-header">
    <span class="logo">
      <el-icon class="mr-1">
        <Paperclip />
      </el-icon>
      亭林商城</span>
    <el-icon class="icon-btn" @click="$store.commit('handleAsideWidth')">
      <Fold v-if="$store.state.asideWidth == '250px'" />
      <Expand v-else />
    </el-icon>
    <el-tooltip effect="dark" content="刷新" placement="bottom">
      <el-icon class="icon-btn" @click="handleRefresh">
        <Refresh />
      </el-icon>
    </el-tooltip>
    <div class="ml-auto flex items-center">
      <el-tooltip effect="dark" content="全屏" placement="bottom">
        <el-icon class="icon-btn" @click="toggle">
          <FullScreen v-if="!isFullscreen" />
          <Aim v-else />
        </el-icon>
      </el-tooltip>
      <el-dropdown class="dropdown" @command="handleCommand">
        <span class="flex items-center text-light-50">
          <el-avatar class="mr-2" :size="25" :src="$store.state.user.avatar" />
          {{ $store.state.user.username }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="rePassword">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
  <form-dialog ref="formDialogRef" title="修改密码" destroyOnClose @submit="onSubmit">
    <el-form ref="formRef" :rules="rules" :model="form" label-width="80px" size="default">
      <el-form-item prop="oldpassword" label="旧密码">
        <el-input v-model="form.oldpassword" placeholder="请输入旧密码"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="新密码">
        <el-input type="password" v-model="form.password" placeholder="请输入密码" show-password></el-input>
      </el-form-item>
      <el-form-item prop="repassword" label="确认密码">
        <el-input type="password" v-model="form.repassword" placeholder="请输入确认密码" show-password></el-input>
      </el-form-item>
    </el-form>
  </form-dialog>
</template>
<script setup>
import FormDialog from "~/components/FormDialog.vue";
import { useFullscreen } from "@vueuse/core";
import { useRepassword, useLogout } from "~/composables/useManager";
const {
  isFullscreen, //是否全屏状态
  toggle, //切换全屏
} = useFullscreen();
const { handleLogout } = useLogout();
const { formDialogRef, form, rules, formRef, onSubmit, openRepasswordform } =
  useRepassword();

// 选择修改密码或退出登录
const handleCommand = (c) => {
  switch (c) {
    case "logout":
      handleLogout();
      break;
    case "rePassword":
      openRepasswordform();
      break;
  }
};
// 退出登录

// 刷新
const handleRefresh = () => {
  location.reload();
};
</script>
<style scoped lang="postcss">
.f-header {
  z-index: 1000;
  @apply flex items-center bg-indigo-500 text-light-50 fixed top-0 right-0 left-0;
  height: 64px;
}

.logo {
  width: 250px;
  @apply flex justify-center items-center text-xl font-thin;
}

.icon-btn {
  @apply flex justify-center items-center;
  width: 42px;
  height: 64px;
  cursor: pointer;
}

.icon-btn:hover {
  @apply bg-indigo-600;
}

.f-header .dropdown {
  height: 64px;
  cursor: pointer;
  @apply flex justify-center items-center mx-5;
}
</style>
