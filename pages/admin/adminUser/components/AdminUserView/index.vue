<template>
	<DataView :data="dataAsRecord" :fields="fields" />
</template>

<script name="AdminUserView" lang="ts" setup>
import type { AdminUser } from '~/api';
import DataView from '~/components/DataView/index.vue';
import type { ViewField } from '~/components/DataView/index.vue';

interface Props {
	data: AdminUser;
}

const props = defineProps<Props>();

// 将 AdminUser 转换为 Record<string, unknown> 类型
const dataAsRecord = computed(() => props.data as any as Record<string, any>);

// 字段配置
const fields: ViewField[] = [
	{ label: 'ID', prop: '_id', type: 'text' },
	{ label: '用户名', prop: 'username', type: 'text' },
	{ label: '昵称', prop: 'nickname', type: 'text' },
	{ label: '头像', prop: 'avatar', type: 'image' },
	{ label: '角色', prop: 'role', type: 'tag' },
	{ label: '创建时间', prop: 'createdAt', type: 'text' },
	{ label: '更新时间', prop: 'updatedAt', type: 'text' },
];
</script>
