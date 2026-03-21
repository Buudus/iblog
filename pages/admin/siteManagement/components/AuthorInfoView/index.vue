<template>
	<DataView :data="dataAsRecord" :fields="fields" />
</template>

<script name="AuthorInfoView" lang="ts" setup>
import type { AuthorInfo } from '~/api';
import DataView from '~/components/DataView/index.vue';
import type { ViewField } from '~/components/DataView/index.vue';

interface Props {
	data: AuthorInfo;
}

const props = defineProps<Props>();

// 将 AuthorInfo 转换为 Record<string, unknown> 类型
const dataAsRecord = computed(() => props.data as any as Record<string, any>);

// 字段配置
const fields: ViewField[] = [
	{ label: 'ID', prop: '_id', type: 'text' },
	{ label: '头像', prop: 'avatar', type: 'image' },
	{ label: '名称', prop: 'name', type: 'text' },
	{ label: '签名', prop: 'ps', type: 'text' },
	{ label: '简介', prop: 'biography', type: 'text' },
	{ label: 'QQ', prop: 'qq', type: 'text' },
	{ label: '微信', prop: 'wechat', type: 'text' },
	{ label: '邮箱', prop: 'email', type: 'text' },
	{ label: 'GitHub', prop: 'github', type: 'text' },
	{ label: '微博', prop: 'weibo', type: 'text' },
	{ label: '是否启用', prop: 'isUse', type: 'tag' },
	{ label: '创建时间', prop: 'createdAt', type: 'text' },
	{ label: '更新时间', prop: 'updatedAt', type: 'text' },
];
</script>
