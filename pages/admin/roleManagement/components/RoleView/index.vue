<template>
	<DataView :data="dataAsRecord" :fields="viewFields" />
</template>

<script name="RoleView" lang="ts" setup>
import type { AdminRole } from '~/api';
import DataView from '~/components/DataView/index.vue';
import type { ViewField } from '~/components/DataView/index.vue';

const props = defineProps<{
	data: AdminRole;
}>();

const viewFields: ViewField[] = [
	{ label: '权限名称', prop: 'name', type: 'tag' },
	{ label: '描述', prop: 'description', type: 'textarea' },
	{ label: '创建时间', prop: 'createdAt', type: 'text' },
	{ label: '更新时间', prop: 'updatedAt', type: 'text' },
];

const dataAsRecord = computed(() => (props.data || {}) as Record<string, unknown>);
</script>
