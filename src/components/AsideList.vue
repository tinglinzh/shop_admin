<template >
    <div>
        <div class="aside-list" :class="{ 'active': active }">
            <span class="truncate">
                <slot />
            </span>
            <el-button @click.stop="$emit('edit')" text type="primary" size="small" class="ml-auto px1">
                <el-icon :size="12">
                    <Edit />
                </el-icon>
            </el-button>
            <el-popconfirm width="220" confirm-button-text="确认删除" cancel-button-text="取消" title="是否要删除该分类？"
                @confirm.stop="$emit('delete')">
                <template #reference>
                    <el-button class="px-1" text @click.native.stop type="primary" size="small">
                        <el-icon :size="12">
                            <Close />
                        </el-icon>
                    </el-button>
                </template>
            </el-popconfirm>
        </div>
    </div>
</template>
<script setup>
defineProps({
    active: {
        type: Boolean,
        default: false
    },
})
defineEmits(["edit", "delete"])
</script>
<style  scoped>
.aside-list {
    border-bottom: 1px solid #f4f4f4;
    @apply flex items-center p-3 text-sm text-gray-600;
}

.aside-list:hover,
.active {
    @apply bg-blue-50;
}
</style>