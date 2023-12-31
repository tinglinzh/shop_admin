import { ref, nextTick, computed } from "vue";
import {
  createGoodsSkusCard,
  updateGoodsSkusCard,
  deleteGoodsSkusCard,
  sortGoodsSkusCard,
  createGoodsSkusCardValue,
  updateGoodsSkusCardValue,
  deleteGoodsSkusCardValue,
  chooseAndSetGoodsSkusCard,
} from "~/api/goods";
import {
  useArrayMoveUp,
  useArrayMoveDown,
  cartesianProductOf,
} from "~/composables/util";

// 当前商品Id
export const goodsId = ref(0);

// 规格选项列表
export const sku_card_list = ref([]);

export const skusList = ref([]);
// 初始化规格选项列表
export function initSkuCardList(d) {
  sku_card_list.value = d.goodsSkusCard.map((item) => {
    item.text = item.name;
    item.loading = false;
    item.goodsSkusCardValue.map((v) => {
      v.text = v.value || "属性值 ";
      return v;
    });
    return item;
  });
  skusList.value = d.goodsSkus;
}

// 添加规格选项
export const btnLoading = ref(false);
export function addSkuCardEvent() {
  btnLoading.value = true;
  createGoodsSkusCard({
    goods_id: goodsId.value, //商品ID
    name: "规格名称", //规格名称
    order: 50, //排序
    type: 0, //规格类型 0文字})
  })
    .then((res) => {
      sku_card_list.value.push({
        ...res,
        text: res.name,
        loading: false,
        goodsSkusCardValue: [],
      });
    })
    .finally(() => {
      btnLoading.value = false;
    });
}

// 修改规格选项
export function handleUpdate(item) {
  item.loading = true;
  updateGoodsSkusCard(item.id, {
    goods_id: item.goods_id,
    name: item.text,
    order: item.order,
    type: 0,
  })
    .then((res) => {
      item.name = item.text;
    })
    .catch(() => {
      item.text = item.name;
    })
    .finally(() => {
      item.loading = false;
    });
}

// 删除商品规格选项
export function handleDelete(item) {
  item.loading = true;
  deleteGoodsSkusCard(item.id).then((res) => {
    const i = sku_card_list.value.findIndex((o) => o.id == item.id);
    if (i != -1) {
      sku_card_list.value.splice(i, 1);
    }
    getTableData();
  });
}

// 排序规格选项
export const bodyLoading = ref(false);
export function sortCard(action, index) {
  let oList = JSON.parse(JSON.stringify(sku_card_list.value));
  let func = action == "up" ? useArrayMoveUp : useArrayMoveDown;
  func(oList, index);

  let sortData = oList.map((o, i) => {
    return {
      id: o.id,
      order: i + 1,
    };
  });
  bodyLoading.value = true;
  sortGoodsSkusCard({
    sortdata: sortData,
  })
    .then((res) => {
      func(sku_card_list.value, index);
      getTableData();
    })
    .finally(() => {
      bodyLoading.value = false;
    });
}

// 选择设置规格
export function handleChooseSetGoodsSkusCard(id, data) {
  let item = sku_card_list.value.find((o) => o.id == id);
  item.loading = true;
  chooseAndSetGoodsSkusCard(id, data)
    .then((res) => {
      item.name = item.text = res.goods_skus_card.name;
      item.goodsSkusCardValue = res.goods_skus_card_value.map((o) => {
        o.text = o.value || "属性值";
        return o;
      });
      getTableData();
    })
    .finally(() => {
      item.loading = false;
    });
}

// 初始化规格的值
export function initSkusCardItem(id) {
  const item = sku_card_list.value.find((o) => o.id == id);
  const loading = ref(false);
  const inputValue = ref("");
  const inputVisible = ref(false);
  const InputRef = ref();

  const handleClose = (tag) => {
    loading.value = true;
    deleteGoodsSkusCardValue(tag.id)
      .then((res) => {
        let i = item.goodsSkusCardValue.findIndex((o) => o.id === tag.id);
        if (i != -1) {
          item.goodsSkusCardValue.splice(i, 1);
        }
        getTableData();
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const showInput = () => {
    inputVisible.value = true;
    nextTick(() => {
      InputRef.value.input.focus();
    });
  };

  const handleInputConfirm = () => {
    if (!inputValue.value) {
      inputVisible.value = false;
      return;
    }
    loading.value = true;
    createGoodsSkusCardValue({
      goods_skus_card_id: id, //规格ID
      name: item.name, //规格名称
      order: 50, //排序
      value: inputValue.value, //规格选项名称
    })
      .then((res) => {
        item.goodsSkusCardValue.push({
          ...res,
          text: res.value,
        });
        getTableData();
      })
      .finally(() => {
        inputVisible.value = false;
        inputValue.value = "";
        loading.value = false;
      });
  };

  const handleChange = (value, tag) => {
    loading.value = true;
    updateGoodsSkusCardValue(tag.id, {
      goods_skus_card_id: id, //规格ID
      name: item.name, //规格名称
      order: tag.order, //排序
      value: value,
    })
      .then((res) => {
        tag.value = value;
        getTableData();
      })
      .catch((err) => {
        tag.text = tag.value;
      })
      .finally(() => {
        loading.value = false;
      });
  };
  return {
    item,
    inputValue,
    inputVisible,
    InputRef,
    handleClose,
    showInput,
    handleInputConfirm,
    loading,
    handleChange,
  };
}

// 初始化表格
export function initSkuTable() {
  const skusLabels = computed(() =>
    sku_card_list.value.filter((v) => v.goodsSkusCardValue.length > 0)
  );
  // 获取表头
  const tableThs = computed(() => {
    let length = skusLabels.value.length;
    return [
      {
        name: "商品规格",
        colspan: length,
        rowspan: length > 0 ? 1 : 2,
        width: "",
      },
      {
        name: "销售价",
        width: "100",
        rowspan: 2,
      },
      {
        width: "100",
        rowspan: 2,
        name: "市场价",
      },
      {
        width: "100",
        rowspan: 2,
        name: "成本价",
      },
      {
        width: "100",
        rowspan: 2,
        name: "库存",
      },
      {
        width: "100",
        rowspan: 2,
        name: "体积",
      },
      {
        rowspan: 2,
        width: "100",
        name: "重量",
      },
      {
        width: "100",
        name: "编码",
        rowspan: 2,
      },
    ];
  });
  return {
    skusLabels,
    tableThs,
    skusList,
  };
}

// 获取表格数据
function getTableData() {
  setTimeout(() => {
    if (sku_card_list.value.length === 0) return [];

    let list = [];
    sku_card_list.value.forEach((o) => {
      if (o.goodsSkusCardValue && o.goodsSkusCardValue.length > 0) {
        list.push(o.goodsSkusCardValue);
      }
    });
    if (list.length == 0) {
      return [];
    }
    let arr = cartesianProductOf(...list);

    // 获取之前的规格列表，将规格ID排序之后转化成字符串
    let beforeSkuList = JSON.parse(JSON.stringify(skusList.value)).map((o) => {
      if (!Array.isArray(o.skus)) {
        o.skus = Object.keys(o.skus).map((k) => o.skus[k]);
      }
      o.skusId = o.skus
        .sort((a, b) => a.id - b.id)
        .map((s) => s.id)
        .join(",");
      return o;
    });

    skusList.value = [];
    skusList.value = arr.map((skus) => {
      let o = getBeforeSkuItem(JSON.parse(JSON.stringify(skus)), beforeSkuList);
      return {
        code: o?.code || "",
        cprice: o?.cprice || "0.00",
        goods_id: goodsId.value,
        image: o?.image || "",
        oprice: o?.oprice || "0.00",
        pprice: o?.pprice || "0.00",
        skus,
        stock: o?.stock || 0,
        volume: o?.volume || 0,
        weigth: o?.weigth || 0,
      };
    });
  }, 200);
}

function getBeforeSkuItem(skus, beforeSkuList) {
  let skusId = skus
    .sort((a, b) => a.id - b.id)
    .map((s) => s.id)
    .join(",");
  return beforeSkuList.find((o) => {
    if (skus.length > o.skus.length) {
      return skusId.indexOf(o.skusId) != -1;
    }
    return o.skusId.indexOf(skusId) != -1;
  }); 
}
