import axios from "~/axios";

// 获取分类列表
export function getCategorysList() {
  return axios.get("admin/category");
}

// 增加分类
export function createCategory(data) {
  return axios.post("/admin/category", data);
}

// 修改分类
export function updateCategory(id, data) {
  return axios.post("/admin/category/" + id, data);
}

// 删除商品分类
export function deleteCategory(id) {
  return axios.post(`/admin/category/${id}/delete`);
}

// 修改商品分类状态
export function updateCategoryStatus(id, status) {
  return axios.post(`/admin/category/${id}/update_status`, { status });
}

// 获取分类关联产品列表
export function getCategorysGoods(id) {
  return axios.get(`/admin/app_category_item/list?category_id=${id}`);
}

// 删除关联商品
export function deleteCategoryGoods(id) {
  return axios.post(`/admin/app_category_item/${id}/delete`);
}

// 关联商品
export function connectCategoryGoods(data) {
  return axios.post(`/admin/app_category_item`, data);
}
