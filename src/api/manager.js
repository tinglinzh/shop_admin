import axios from "../axios";
import { queryParams } from "~/composables/util.js";

export function login(username, password) {
  return axios.post("/admin/login", {
    username,
    password,
  });
}
export function getinfo() {
  return axios.post("/admin/getinfo");
}
export function logout() {
  return axios.post("/admin/logout");
}
export function updatepassword(data) {
  return axios.post("/admin/updatepassword", data);
}
// 获取管理员列表
export function getManagerList(page, query = {}) {
  let r = queryParams(query);
  return axios.get(`/admin/manager/${page}${r}`);
}

// 修改管理员状态
export function updateManagerStatus(id, status) {
  return axios.post(`/admin/manager/${id}/update_status`, { status });
}

// 删除管理员
export function deleteManager(id) {
  return axios.post(`/admin/manager/${id}/delete`);
}

// 修改管理员信息
export function updateManagerMessage(id, data) {
  return axios.post(`/admin/manager/${id}`, data);
}

// 新增管理员
export function createManager(data) {
  return axios.post("/admin/manager", data);
}
