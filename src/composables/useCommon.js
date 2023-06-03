import { reactive, ref, computed } from "vue";
import { toast } from "~/composables/util";

// 列表分页 搜索、刷新和获取数据
export function useInitTable(opt = {}) {
  //

  let searchForm = null;
  let resetSearchForm = null;
  if (opt.searchForm) {
    searchForm = reactive({ ...opt.searchForm });
    resetSearchForm = () => {
      for (const key in opt.searchForm) {
        searchForm[key] = opt.searchForm[key];
      }
      getData();
    };
  }

  const tableData = ref([]);
  const loading = ref(false);
  // 分页
  const currentPage = ref(1);
  const total = ref(0);
  const limit = ref(10);

  // 获取数据
  function getData(p = null) {
    if (typeof p == "number") {
      currentPage.value = p;
    }
    loading.value = true;
    opt
      .getList(currentPage.value, searchForm)
      .then((res) => {
        if (opt.onGetListSuccess && typeof opt.onGetListSuccess == "function") {
          opt.onGetListSuccess(res);
        } else {
          tableData.value = res.list;
          total.value = res.totalCount;
        }
      })
      .finally(() => {
        loading.value = false;
      });
  }
  getData();

  // 删除
  const handleDelete = (id) => {
    loading.value = true;
    opt
      .delete(id)
      .then((res) => {
        toast("删除成功", "success");
        getData(currentPage.value);
      })
      .finally(() => {
        loading.value = false;
      });
  };
  //   修改状态
  const updateStatusChange = (status, row) => {
    row.statusLoading = true;
    opt
      .updateStatus(row.id, status)
      .then((res) => {
        toast("修改状态成功", "success");
        row.status = status;
      })
      .finally(() => {
        row.statusLoading = false;
        getData(1);
      });
  };

  // 多选选中ID
  const multiSelectionIds = ref([]);
  const handleSelectionChange = (e) =>
    (multiSelectionIds.value = e.map((o) => o.id));
  const multipleTableRef = ref(null);
  // 批量删除
  const handleMultiDelete = () => {
    loading.value = true;
    opt
      .delete(multiSelectionIds.value)
      .then((res) => {
        toast("删除成功", "success");
        // 清空选中
        if (multipleTableRef.value) {
          multipleTableRef.value.clearSelection();
        }
        getData();
      })
      .finally(() => {
        loading.value = false;
      });
  };
  // 批量修改状态
  const handleMultiStatusChange = (status) => {
    loading.value = true;
    opt
      .updateStatus(multiSelectionIds.value, status)
      .then((res) => {
        toast("修改状态成功", "success");
        // 清空选中
        if (multipleTableRef.value) {
          multipleTableRef.value.clearSelection();
        }
        getData();
      })
      .finally(() => {
        loading.value = false;
      });
  };
  return {
    searchForm,
    resetSearchForm,
    tableData,
    total,
    currentPage,
    loading,
    limit,
    getData,
    handleDelete,
    updateStatusChange,
    handleMultiDelete,
    multipleTableRef,
    handleSelectionChange,
    handleMultiStatusChange,
    multiSelectionIds,
  };
}

// 新增 修改
export function useInitForm(opt = {}) {
  // 表单部分
  const formDialogRef = ref(null);
  const formRef = ref(null);
  const defaultForm = opt.form;
  const form = reactive({});
  const rules = opt.rules || {};
  const FormDialogTitle = computed(() => (listId.value > 0 ? "修改" : "新增"));
  //   ID
  const listId = ref(0);

  // 提交
  const handleSubmit = () => {
    // 调取表单验证方法vaildate
    formRef.value.validate((valid) => {
      if (!valid) return;
      formDialogRef.value.showLoading();

      let body = {};
      if (opt.beforeSubmit && typeof opt.beforeSubmit == "function") {
        body = opt.beforeSubmit({ ...form });
      } else {
        body = form;
      }
      // 判断当前提交操作是新增公告还是修改公告
      const fun = listId.value
        ? opt.updateData(listId.value, body)
        : opt.create(body);

      fun
        .then((res) => {
          toast(FormDialogTitle.value + "成功", "success");
          formDialogRef.value.close();
        })
        .finally(() => {
          formDialogRef.value.hideLoading();
          resetForm();
          listId.value = 0;
          opt.getData(listId.value ? currentPage : 1);
          formDialogRef.value.close();
        });
    });
  };

  // 重置表单
  function resetForm(row = false) {
    if (formRef.value) formRef.value.clearValidate();
    for (const key in defaultForm) {
      form[key] = row[key];
    }
  }
  // 打开弹框
  const handleCreate = () => {
    resetForm(defaultForm);
    formDialogRef.value.open();
  };

  // 修改公告

  const handleAmend = (res) => {
    formDialogRef.value.open();
    for (const key in defaultForm) {
      form[key] = res[key];
    }
    listId.value = res.id;
  };

  // dialog关闭时执行的回调
  const closeDialog = () => {
    resetForm(opt.form);
  };

  return {
    formDialogRef,
    formRef,
    form,
    rules,
    FormDialogTitle,
    handleSubmit,
    handleCreate,
    handleAmend,
    closeDialog,
  };
}
