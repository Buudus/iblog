<template>
	<DataView :data="dataAsRecord" :fields="fields" />
</template>

<script name="SiteInfoView" lang="ts" setup>
import type { SiteInfo } from '~/api';
import DataView from '~/components/DataView/index.vue';
import type { ViewField } from '~/components/DataView/index.vue';

interface Props {
	data: SiteInfo;
}

const props = defineProps<Props>();

// 将 SiteInfo 转换为 Record<string, unknown> 类型
const dataAsRecord = computed(() => props.data as any as Record<string, any>);

// 字段配置
const fields: ViewField[] = [
	{ label: 'ID', prop: '_id', type: 'text' },
	{ label: 'Logo', prop: 'logo', type: 'image' },
	{ label: '标题', prop: 'title', type: 'text' },
	{ label: '域名', prop: 'domain', type: 'text' },
	{ label: '关键词', prop: 'keywords', type: 'text' },
	{ label: '描述', prop: 'description', type: 'text' },
	{ label: '全局样式', prop: 'globalStyle', type: 'text' },
	{ label: '全局脚本', prop: 'globalScript', type: 'text' },
	{ label: '是否启用', prop: 'isUse', type: 'tag' },
	{ label: '创建时间', prop: 'createdAt', type: 'text' },
	{ label: '更新时间', prop: 'updatedAt', type: 'text' },
];
</script>
