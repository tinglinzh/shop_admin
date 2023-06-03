<template>
  {{ d.num.toFixed(2) }}
</template>
<script setup>
import gasp from "gsap";
import { reactive, watch } from "vue";

const props = defineProps({
  value: {
    type: Number,
    default: 0,
  },
});
const d = reactive({
  num: 0,
});
function AniamateToValue() {
  gasp.to(d, {
    duration: 0.5,
    num: props.value,
  });
}
AniamateToValue();
watch(
  () => props.value,
  () => AniamateToValue()
);
</script>
