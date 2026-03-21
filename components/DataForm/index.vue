<template>
	<el-form ref="formRef" :model="formData" :rules="rules" :label-width="labelWidth">
		<el-form-item v-for="field in fields" :key="field.prop" :label="field.label" :prop="field.prop">
			<!-- 图片上传字段 -->
			<template v-if="field.type === 'image'">
				<div class="h-[80px]">
					<el-image class="h-full" :src="formData[field.prop]" />
				</div>
				<el-input
					class="mt-2"
					:model-value="formData[field.prop]"
					@update:model-value="(val) => updateField(field.prop, val)"
					:placeholder="field.placeholder || '请输入图片链接，如：http://example.com/image.png'" />
				<div class="mt-2">
					<SingleUpload
						:handleUpload="(file: File) => handleUpload(file, field.uploadField || field.prop)" />
				</div>
			</template>

			<!-- 文本输入框 -->
			<template v-else-if="field.type === 'input'">
				<el-input
					:model-value="formData[field.prop]"
					@update:model-value="(val) => updateField(field.prop, val)"
					:placeholder="field.placeholder"
					:maxlength="field.maxlength"
					:show-word-limit="field.showWordLimit" />
			</template>

			<!-- 多行文本 -->
			<template v-else-if="field.type === 'textarea'">
				<el-input
					:model-value="formData[field.prop]"
					@update:model-value="(val) => updateField(field.prop, val)"
					type="textarea"
					:rows="field.rows || 3"
					:placeholder="field.placeholder"
					:maxlength="field.maxlength"
					:show-word-limit="field.showWordLimit" />
			</template>

			<!-- 单选按钮组 -->
			<template v-else-if="field.type === 'radio'">
				<el-radio-group
					:model-value="formData[field.prop]"
					@update:model-value="(val) => updateField(field.prop, val)">
					<el-radio v-for="option in field.options" :key="option.value" :value="option.value">
						{{ option.label }}
					</el-radio>
				</el-radio-group>
			</template>
		</el-form-item>
	</el-form>
</template>

<script name="DataForm" lang="ts" setup>
import SingleUpload from '~/components/Upload/SingleUpload/index.vue';
import type { FormInstance, FormRules, UploadRawFile } from 'element-plus';

export interface FormField {
	label: string;
	prop: string;
	type: 'input' | 'textarea' | 'image' | 'radio';
	placeholder?: string;
	maxlength?: number;
	showWordLimit?: boolean;
	rows?: number;
	options?: Array<{ label: string; value: string | number }>;
	uploadField?: string; // 图片上传字段名，如果不指定则使用 prop
}

interface Props {
	modelValue: Record<string, any>;
	fields: FormField[];
	rules?: FormRules;
	labelWidth?: string | number;
}

interface Emits {
	(e: 'update:modelValue', value: Record<string, any>): void;
	(e: 'upload', file: File | UploadRawFile, field: string): void;
}

const props = withDefaults(defineProps<Props>(), {
	labelWidth: 'auto',
	rules: () => ({}),
});

const emit = defineEmits<Emits>();

const formRef = useTemplateRef<FormInstance>('formRef');

// 表单数据 - 使用 reactive 来支持双向绑定
const formData = reactive({ ...props.modelValue });

// 监听 props.modelValue 变化，同步到 formData（避免循环更新）
watch(
	() => props.modelValue,
	(newValue) => {
		// 只有当值真正改变时才更新，避免循环
		const hasChanged = Object.keys(newValue).some((key) => formData[key] !== newValue[key]);
		if (hasChanged) {
			Object.assign(formData, newValue);
		}
	},
	{ deep: true, immediate: true }
);

// 更新单个字段的值并 emit
const updateField = (prop: string, value: any) => {
	formData[prop] = value;
	emit('update:modelValue', { ...formData });
};

// 文件上传处理
const handleUpload = (file: File | UploadRawFile, field: string) => {
	emit('upload', file, field);
};

// 暴露方法
defineExpose({
	validate: () => formRef.value?.validate(),
	resetFields: () => formRef.value?.resetFields(),
});
</script>
