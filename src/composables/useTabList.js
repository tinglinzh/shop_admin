import { router } from "~/router";
import { ref } from "vue";
import { useRoute, onBeforeRouteUpdate } from "vue-router";
import { useCookies } from "@vueuse/integrations/useCookies";

export function useTabList() {
  const route = useRoute();
  const cookie = useCookies();

  const activeTab = ref(route.path);
  const tabList = ref([
    {
      title: "后台首页",
      path: "/",
    },
  ]);
  // 添加标签导航
  function addTab(tab) {
    let noTab = tabList.value.findIndex((t) => t.path == tab.path) == -1;
    if (noTab) {
      tabList.value.push(tab);
    }
    cookie.set("tabList", tabList.value);
  }

  // 初始化标签导航栏列表
  function initTabList() {
    let tbs = cookie.get("tabList");
    if (tbs) {
      tabList.value = tbs;
    }
  }
  initTabList();
  onBeforeRouteUpdate((to, from) => {
    activeTab.value = to.path;
    addTab({
      title: to.meta.title,
      path: to.path,
    });
  });
  const changeTab = (t) => {
    activeTab.value = t;
    router.push(t);
  };

  const removeTab = (targetName) => {
    let tabs = tabList.value;
    let activeTabName = activeTab.value;
    if (activeTabName == targetName) {
      tabs.forEach((tab, index) => {
        if (tab.path == targetName) {
          const nextTab = tabs[index + 1] || tabs[index - 1];
          if (nextTab) {
            activeTabName = nextTab.path;
          }
        }
      });
    }
    activeTab.value = activeTabName;
    tabList.value = tabList.value.filter((tab) => tab.path != targetName);
    cookie.set("tabList", tabList.value);
  };
  // 下拉按钮监听
  const handleClose = (c) => {
    //  clearAll 清除所有标签，只留下首页
    if (c == "clearAll") {
      // 切换到首页
      activeTab.value = "/";
      tabList.value = [
        {
          title: "后台首页",
          path: "/",
        },
      ];
    }
    // clearOther 清除其他标签导航，只留下当前显示的和后台主页
    else if (c == "clearOther") {
      tabList.value = tabList.value.filter(
        (tab) => tab.path == "/" || tab.path == activeTab.value
      );
    }
    cookie.set("tabList", tabList.value);
  };
  return {
    activeTab,
    tabList,
    changeTab,
    removeTab,
    handleClose,
  };
}
