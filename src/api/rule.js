import axios from "~/axios";

// 获取权限菜单
export function getRuleList() {
  return axios.get("/admin/rule/1");
}

// 增加菜单权限
export function createRule(data) {
  return axios.post("/admin/rule", data);
}

// 修改菜单权限
export function updateRule(id, data) {
  return axios.post("/admin/rule/" + id, data);
}

// 删除菜单权限
export function deleteRule(id) {
  return axios.post(`/admin/rule/${id}/delete`);
}

// 修改菜单权限状态
export function updateRuleStatus(id, status) {
  return axios.post(`/admin/rule/${id}/update_status`, { status });
}
