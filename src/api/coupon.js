import axios from "~/axios";

// 获取公告
export function getCouponList(page) {
  return axios.get(`/admin/coupon/${page}`);
}
// 新增公告
export function createCoupon(data) {
  return axios.post("/admin/coupon", data);
}
// 删除公告
export function deleteCoupon(id) {
  return axios.post(`/admin/coupon/${id}/delete`);
}
// 修改公告
export function updateCoupon(id, data) {
  return axios.post(`/admin/coupon/${id}`, data);
}

export function updateCouponStatus(id) {
  return axios.post(`/admin/coupon/${id}/update_status`, { status: 0 });
}
