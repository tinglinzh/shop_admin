import { ElNotification, ElMessageBox } from "element-plus";
import nProgress from "nprogress";
import { sku_card_list } from "./useSku";
// 消息提示
export function toast(message, type, dangerouslyUseHTMLString = true) {
  ElNotification({
    message,
    type,
    dangerouslyUseHTMLString,
    duration: 2000,
  });
}
export function showModal(content, type, title) {
  return ElMessageBox.confirm(content, title, {
    confirmButtonText: "确定",
    cancelButtonText: "取消 ",
    type,
  });
}

// 弹出输入框
export function showPrompt(tip, value = "") {
  return ElMessageBox.prompt(tip, "", {
    confirmButtonText: "确认",
    cancelButtonText: "取消 ",
    inputValue: value,
  });
}
// 显示全屏loading
export function showFullLoading() {
  nProgress.start();
}
// 隐藏全屏loading
export function hideFullLoading() {
  nProgress.done();
}

// 将query对象转成url参数
export function queryParams(query) {
  let q = [];
  for (const key in query) {
    if (query[key]) {
      q.push(`${key}=${encodeURIComponent(query[key])}`);
    }
  }
  let r = q.join("&");
  r = r ? "?" + r : "";
  //   ?limit=10&keyword=ceshi
  return r;
}

// 上移
export function useArrayMoveUp(arr, index) {
  swapArray(arr, index, index - 1);
}

// 下移
export function useArrayMoveDown(arr, index) {
  swapArray(arr, index, index + 1);
}

function swapArray(arr, index1, index2) {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0];
  return arr;
}

// sku排列算法
export function cartesianProductOf() {
  return Array.prototype.reduce.call(
    arguments,
    function (a, b) {
      var ret = [];
      a.forEach(function (a) {
        b.forEach(function (b) {
          ret.push(a.concat([b]));
        });
      });
      return ret;
    },
    [[]]
  );
} 