<template>
	<DataView :data="dataAsRecord" :fields="fields" />
</template>

<script name="LeaveMessageView" lang="ts" setup>
import type { LeaveMessage } from '~/api';
import DataView from '~/components/DataView/index.vue';
import type { ViewField } from '~/components/DataView/index.vue';

interface Props {
	data: LeaveMessage;
}

const props = defineProps<Props>();

// 将 LeaveMessage 转换为 Record<string, unknown> 类型
const dataAsRecord = computed(() => props.data as unknown as Record<string, unknown>);

// 字段配置
const fields: ViewField[] = [
	{ label: 'ID', prop: '_id', type: 'text' },
	{ label: '联系人', prop: 'concat', type: 'text' },
	{ label: '留言内容', prop: 'content', type: 'textarea' },
	{ label: 'IP地址', prop: 'ip', type: 'text' },
	{ label: 'User-Agent', prop: 'userAgent', type: 'textarea' },
	{ label: '创建时间', prop: 'createdAt', type: 'text' },
	{ label: '更新时间', prop: 'updatedAt', type: 'text' },
];
</script>
