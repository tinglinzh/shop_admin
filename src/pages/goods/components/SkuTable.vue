<template>
  <el-form-item label="规格设置">
    <table class="border">
      <thead>
        <tr>
          <th
            class="border"
            v-for="(th, thi) in tableThs"
            :width="th.width"
            :rowspan="th.rowspan"
            :colspan="th.colspan"
            :key="thi"
          >
            {{ th.name }}
          </th>
        </tr>
        <tr>
          <th class="border" v-for="(th, thi) in skusLabels" :key="thi">
            {{ th.name }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, id) in skusList" :key="id">
          <td
            width="100"
            class="border text-center"
            v-for="(sku, skI) in item.skus"
            :key="skI"
          >
            {{ sku.value }}
          </td>
          <td class="border">
            <el-input
              v-model="item.pprice"
              size="small"
              type="number"
            ></el-input>
          </td>
          <td class="border">
            <el-input
              v-model="item.oprice"
              size="small"
              type="number"
            ></el-input>
          </td>
          <td class="border">
            <el-input
              v-model="item.cprice"
              size="small"
              type="number"
            ></el-input>
          </td>
          <td class="border">
            <el-input
              v-model="item.stock"
              size="small"
              type="number"
            ></el-input>
          </td>
          <td class="border">
            <el-input
              v-model="item.volume"
              size="small"
              type="number"
            ></el-input>
          </td>
          <td class="border">
            <el-input
              v-model="item.weight"
              size="small"
              type="number"
            ></el-input>
          </td>
          <td class="border">
            <el-input v-model="item.code" size="small" type="number"></el-input>
          </td>
        </tr>
      </tbody>
    </table>
  </el-form-item>
</template>
<script setup>
import { initSkuTable } from "~/composables/useSku.js";
const { skusLabels, tableThs, skusList } = initSkuTable();
console.log(skusList.value);
</script>
