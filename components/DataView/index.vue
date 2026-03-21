<template>
	<el-form :model="props.data" :label-width="props.labelWidth">
		<el-form-item v-for="field in props.fields" :key="field.prop" :label="field.label">
			<template v-if="field.type === 'image'">
				<el-image class="h-[80px]" :src="getStringValue(props.data[field.prop])" />
			</template>
			<template v-else-if="field.type === 'link'">
				<div class="w-full truncate">
					<a :href="getStringValue(props.data[field.prop])" target="_blank" rel="noopener">{{
						props.data[field.prop] || '-'
					}}</a>
				</div>
			</template>
			<template v-else-if="field.type === 'textarea'">
				<div class="w-full whitespace-pre-wrap break-words">
					{{ props.data[field.prop] || '-' }}
				</div>
			</template>
			<template v-else-if="field.type === 'tag'">
				<el-tag>{{ props.data[field.prop] || '-' }}</el-tag>
			</template>
			<template v-else>
				<div class="w-full truncate">{{ props.data[field.prop] || '-' }}</div>
			</template>
		</el-form-item>
	</el-form>
</template>

<script name="DataView" lang="ts" setup>
export interface ViewField {
	label: string;
	prop: string;
	type?: 'text' | 'image' | 'link' | 'textarea' | 'tag';
}

interface Props {
	data: Record<string, unknown>;
	fields: ViewField[];
	labelWidth?: string | number;
}

const props = withDefaults(defineProps<Props>(), {
	labelWidth: '100',
});

// 安全获取字符串值的辅助函数
const getStringValue = (value: unknown): string | undefined => {
	if (value === null || value === undefined) {
		return undefined;
	}
	return String(value);
};
</script>
