import axios from "~/axios";
import { queryParams } from "~/composables/util.js";

// 获取分销员列表
export function getAgentList(page, query = {}) {
  let r = queryParams(query);
  return axios.get(`/admin/agent/${page}${r}`);
}

export function getAgentStatistics() {
  return axios.get("/admin/agent/statistics");
}
// 获取推广订单
export function getAgentOrderList(page, query = {}) {
  let r = queryParams(query);
  return axios.get(`/admin/user_bill/${page}${r}`);
}

// 获取分销设置
export function getDistributionSetting() {
  return axios.get("/admin/distribution_setting/get");
}
// 修改分销设置
export function updateDistributionSetting(data) {
  return axios.post("/admin/distribution_setting/set", data);
}
