<template>
  <div class="f_menu" :style="{ width: $store.state.asideWidth }">
    <el-menu
      :default-active="defaultActive"
      :unique-opened="true"
      :collapse-transition="false"
      :collapse="isCollapse"
      class="border-0"
      @select="handleSelect"
    >
      <template v-for="(item, index) in asideMenu" :key="index">
        <el-sub-menu
          v-if="item.child && item.child.length > 0"
          :index="item.name"
        >
          <template #title>
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <span>{{ item.name }}</span>
          </template>
          <el-menu-item
            v-for="(child, id) in item.child"
            :key="id"
            :index="child.frontpath"
          >
            <el-icon> <component :is="child.icon"></component> </el-icon>
            <span>{{ child.name }}</span></el-menu-item
          >
        </el-sub-menu>
        <el-menu-item v-else :index="item.frontpath">
          <el-icon> <component :is="item.icon"></component> </el-icon>
          <span>{{ item.name }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter, useRoute, onBeforeRouteUpdate } from "vue-router";
import { useStore } from "vuex";
const router = useRouter();
const store = useStore();
const route = useRoute();
// 是否折叠
const isCollapse = computed(() => !(store.state.asideWidth == "250px"));
// 显示默认路径
const defaultActive = ref(route.path);

// 监听路由变化
onBeforeRouteUpdate((to, from) => {
  defaultActive.value = to.path;
});
const asideMenu = computed(() => store.state.menus);
const handleSelect = (e) => {
  router.push(e);
};
</script>

<style scoped lang="postcss">
.f_menu {
  transition: all 0.2s;
  top: 64px;
  bottom: 0;
  left: 0;
  overflow-y: auto;
  overflow-x: hidden;
  @apply shadow-md fixed bg-light-50;
}
.f_menu::-webkit-scrollbar {
  width: 0;
}
</style>
