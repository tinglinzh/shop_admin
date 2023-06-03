import axios from "~/axios";

// 获取公告
export function getNoticeList(page) {
  return axios.get(`/admin/notice/${page}`);
}
// 新增公告
export function increaseNotice(title, content) {
  return axios.post("/admin/notice", title, content);
}
// 删除公告
export function deleteNotice(id) {
  return axios.post(`/admin/notice/${id}/delete`);
}
// 修改公告
export function amendNotice(id, data) {
  return axios.post(`/admin/notice/${id}`, data);
}
