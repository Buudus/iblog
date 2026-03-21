<template>
	<DataView :data="dataAsRecord" :fields="fields" />
</template>

<script name="FriendlyLinkView" lang="ts" setup>
import type { FriendlyLink } from '~/api';
import DataView from '~/components/DataView/index.vue';
import type { ViewField } from '~/components/DataView/index.vue';

interface Props {
	data: FriendlyLink;
}

const props = defineProps<Props>();

const dataAsRecord = computed(() => props.data as any as Record<string, any>);

// 字段配置
const fields: ViewField[] = [
	{ label: 'ID', prop: '_id', type: 'text' },
	{ label: 'Logo', prop: 'icon', type: 'image' },
	{ label: '名称', prop: 'name', type: 'text' },
	{ label: '链接', prop: 'url', type: 'link' },
	{ label: '描述', prop: 'description', type: 'textarea' },
	{ label: '邮箱', prop: 'email', type: 'text' },
	{ label: '备注', prop: 'remark', type: 'textarea' },
	{ label: '状态', prop: 'status', type: 'tag' },
	{ label: '创建时间', prop: 'createdAt', type: 'text' },
	{ label: '更新时间', prop: 'updatedAt', type: 'text' },
];
</script>
