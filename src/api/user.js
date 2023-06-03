import axios from "../axios";
import { queryParams } from "~/composables/util.js";

// 获取管理员列表
export function getUserList(page, query = {}) {
  let r = queryParams(query);
  return axios.get(`/admin/user/${page}${r}`);
}

// 修改管理员状态
export function updateUserStatus(id, status) {
  return axios.post(`/admin/user/${id}/update_status`, { status });
}

// 删除管理员
export function deleteUser(id) {
  return axios.post(`/admin/user/${id}/delete`);
}

// 修改用户信息
export function updateUserMessage(id, data) {
  return axios.post(`/admin/user/${id}`, data);
}

// 新增用户
export function createUser(data) {
  return axios.post("/admin/user", data);
}
