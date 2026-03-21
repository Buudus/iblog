<template>
	<div class="friendly-link-page">
		<!-- 页面标题 -->
		<PageTitle title="友情链接" />

		<!-- 主要内容 -->
		<section class="mt-5 max-w-[1200px] mx-auto px-1">
			<!-- 加载状态 -->
			<div v-if="loading" class="flex items-center justify-center py-20">
				<el-icon class="is-loading text-4xl text-blue-500">
					<Loading />
				</el-icon>
			</div>

			<!-- 友链列表 -->
			<div
				v-else-if="sortedLinks.length > 0"
				class="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				<FriendlyLinkCard
					v-for="link in sortedLinks"
					:key="link._id || link.url"
					v-scale
					v-bind="link"
					class="transform hover:scale-105 transition-transform duration-300 ease-in-out" />
			</div>

			<!-- 空状态 -->
			<div v-else class="flex flex-col items-center justify-center py-20">
				<el-icon class="text-6xl text-gray-400 mb-4">
					<Link />
				</el-icon>
				<p class="text-gray-500 dark:text-gray-400 text-lg">暂无友链</p>
			</div>

			<!-- 申请友链表单 -->
			<LyCard class="form-section w-full mx-auto mt-5">
				<h2 class="form-title text-center">申请友链</h2>

				<!-- 友链要求提示 -->
				<div
					class="requirements bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-500 p-6 mb-6">
					<h3 class="text-lg font-medium text-blue-800 dark:text-blue-200 mb-4 flex items-center">
						<i class="bi bi-info-circle-fill mr-2" />
						<span>友链要求</span>
					</h3>
					<ul class="space-y-3">
						<li
							v-for="(requirement, index) in linkRequirements"
							:key="index"
							class="flex items-center text-blue-700">
							<i class="bi bi-check2-circle text-lg mr-3" />
							<span>{{ requirement }}</span>
						</li>
					</ul>
				</div>

				<form class="form" @submit.prevent="handleSubmit">
					<!-- 表单字段 -->
					<div v-for="field in formFields" :key="field.name" class="form-group">
						<label :for="field.name" class="form-label">
							{{ field.label }} <span v-if="field.required" class="text-red-500">*</span>
						</label>
						<!-- 验证码特殊处理 -->
						<div v-if="field.name === 'captcha'" class="flex items-center gap-3">
							<input
								:id="field.name"
								v-model="form[field.name]"
								:type="field.type"
								class="form-input dark:bg-[#1f2937] border-2 border-gray-300 dark:border-gray-500 flex-1"
								:placeholder="field.placeholder" />
							<!-- 验证码图片 -->
							<!-- eslint-disable-next-line vue/no-v-html -->
							<div
								class="captcha-container border-2 border-gray-300 dark:border-gray-500 rounded cursor-pointer hover:border-blue-500 transition-colors"
								title="点击刷新验证码"
								@click="refreshCaptcha"
								v-html="captchaSvg" />
						</div>
						<!-- 其他字段 -->
						<input
							v-else
							:id="field.name"
							v-model="form[field.name]"
							:type="field.type"
							class="form-input dark:bg-[#1f2937] border-2 border-gray-300 dark:border-gray-500"
							:placeholder="field.placeholder" />
						<p v-if="v$[field.name]?.$error" class="form-error flex">
							<i class="bi bi-exclamation-circle mr-1" />
							{{ getErrorMessage(field.name) }}
						</p>
					</div>

					<!-- 提交按钮 -->
					<div class="form-actions">
						<button type="button" class="btn-secondary" :disabled="isSubmitting" @click="resetForm">
							重置
						</button>
						<button
							type="submit"
							class="btn-primary flex items-center justify-center"
							:disabled="isSubmitting">
							<el-icon v-if="isSubmitting" class="is-loading mr-2">
								<Loading />
							</el-icon>
							<i v-else class="bi bi-send-fill mr-2" />
							{{ isSubmitting ? '提交中...' : '提交申请' }}
						</button>
					</div>
				</form>
			</LyCard>
		</section>
	</div>
</template>

<script name="FriendlyLinkPage" lang="ts" setup>
import { api } from '~/utils/util.fetch';
import { ElMessage } from 'element-plus';
import { useVuelidate } from '@vuelidate/core';
import { Loading, Link } from '@element-plus/icons-vue';
import { clientFriendlyLinkApi, type FriendlyLink } from '~/api';
import { required, email, url, minLength, maxLength } from '@vuelidate/validators';

// 定义接口
interface FriendlyLinkForm {
	name: string;
	url: string;
	icon: string;
	description: string;
	email: string;
	captcha: string;
}

// 表单字段定义
const formFields = [
	{
		name: 'name',
		label: '站点名称',
		type: 'text',
		required: true,
		placeholder: '请输入您的站点名称',
	},
	{
		name: 'url',
		label: '站点链接',
		type: 'url',
		required: true,
		placeholder: '请输入您的站点链接',
	},
	{
		name: 'icon',
		label: '站点图标',
		type: 'url',
		required: true,
		placeholder: '请输入您的站点图标URL',
	},
	{
		name: 'description',
		label: '站点描述',
		type: 'text',
		required: true,
		placeholder: '请简短描述您的站点',
	},
	{
		name: 'email',
		label: '联系邮箱',
		type: 'email',
		required: true,
		placeholder: '请输入您的联系邮箱',
	},
	{ name: 'captcha', label: '验证码', type: 'text', required: true, placeholder: '请输入验证码' },
] as Array<{
	name: keyof FriendlyLinkForm;
	label: string;
	type: string;
	required: boolean;
	placeholder: string;
}>;

// 表单数据
const form = ref({
	name: '',
	url: '',
	icon: '',
	description: '',
	email: '',
	captcha: '',
});

// 验证规则
const validationRules = {
	name: { required: required, minLength: minLength(2), maxLength: maxLength(50) },
	url: { required: required, url },
	icon: { required: required, url },
	description: { required: required, minLength: minLength(10), maxLength: maxLength(200) },
	email: { required: required, email },
	captcha: { required: required, minLength: minLength(4), maxLength: maxLength(6) },
};

// 修改错误消息的显示逻辑
const v$ = useVuelidate(validationRules, form);

const errorMessages = {
	required: '此字段是必填项',
	minLength: '输入内容太短',
	maxLength: '输入内容太长',
	email: '请输入有效的邮箱地址',
	url: '请输入有效的链接',
};

const getErrorMessage = (fieldName: keyof FriendlyLinkForm): string => {
	const errors = v$.value[fieldName]?.$errors;
	if (!errors || errors.length === 0) return '';
	const errorType = errors[0]?.$validator as keyof typeof errorMessages;
	return errorMessages[errorType] || '输入不合法';
};

// 状态管理
const isSubmitting = ref(false);
const loading = ref<boolean>(false);
const friendlyLinks = ref<FriendlyLink[]>([]);
const captchaSvg = ref<string>('');

// 排序后的友链列表
const sortedLinks = computed(() => {
	return [...friendlyLinks.value].sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
});

// 友链要求
const linkRequirements = [
	'网站内容健康，无违法内容',
	'已添加本站友链',
	'网站已建立至少3个月',
	'网站要有原创内容',
	'确保网站可以正常访问',
] as const;

// 加载友链列表
const loadFriendlyLinks = async (): Promise<void> => {
	loading.value = true;
	try {
		const result = await clientFriendlyLinkApi.getFriendlyLinks();
		if (result.code === 200 && result.data) {
			friendlyLinks.value = result.data || [];
		} else {
			ElMessage.error(result.message || '加载友链失败');
		}
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : '加载友链失败';
		ElMessage.error(errorMessage);
		console.error(errorMessage);
	} finally {
		loading.value = false;
	}
};

// 获取验证码
const loadCaptcha = async (): Promise<void> => {
	try {
		const result = await api.get<{ captcha: string }>('/api/client/captcha/getCaptcha');
		if (result.code === 200 && result.data) {
			captchaSvg.value = result.data.captcha || '';
		}
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : '获取验证码失败';
		ElMessage.error(errorMessage);
		console.error(errorMessage);
	}
};

// 刷新验证码
const refreshCaptcha = async (): Promise<void> => {
	await loadCaptcha();
	form.value.captcha = '';
};

// 提交表单
const handleSubmit = async (): Promise<void> => {
	const isValid = await v$.value.$validate();
	if (!isValid) {
		ElMessage.warning('请检查表单填写是否正确');
		return;
	}

	try {
		isSubmitting.value = true;
		const result = await clientFriendlyLinkApi.apply({
			friendlyLink: {
				name: form.value.name,
				url: form.value.url,
				icon: form.value.icon,
				description: form.value.description,
				email: form.value.email,
				remark: '',
			},
			captcha: form.value.captcha,
		});

		if (result.code === 201 || result.code === 200) {
			ElMessage.success(result.message || '申请已提交！我们会尽快审核');
			resetForm();
		} else {
			ElMessage.error(result.message || '提交失败，请稍后重试');
		}
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : '提交失败，请稍后重试';
		ElMessage.error(errorMessage);
		console.error(errorMessage);
	} finally {
		isSubmitting.value = false;
	}
};

// 重置表单
const resetForm = (): void => {
	form.value = {
		name: '',
		url: '',
		icon: '',
		description: '',
		email: '',
		captcha: '',
	};
	v$.value.$reset();
	refreshCaptcha();
};

// 初始化加载数据（服务端渲染）
await Promise.all([loadFriendlyLinks(), loadCaptcha()]);

const siteInfoStore = useSiteInfoStore();
const pageKeywords = friendlyLinks.value.map((link) => link.name).join(',');
useHead({
	title: `${siteInfoStore.siteInfo.title} - 友链`,
	meta: [{ name: 'keywords', content: pageKeywords }],
});
</script>

<style lang="scss" scoped>
.form-section {
	padding: 2rem;
}

.form-title {
	font-size: 1.75rem;
	font-weight: bold;
	text-align: center;
	color: #1e3a8a;
	margin-bottom: 1.5rem;
}

html.dark {
	.form-title {
		color: #cbd5e1;
	}

	.requirements {
		background: linear-gradient(to right, rgba(21, 94, 117, 0.2), rgba(56, 189, 248, 0.1));
	}
}

.requirements {
	background: linear-gradient(to right, #e0f7fa, #b2ebf2);
	border-radius: 0.75rem;
	padding: 1.5rem;
	margin-bottom: 1.5rem;

	h3 {
		font-size: 1.25rem;
		font-weight: bold;
		color: #00796b;
		margin-bottom: 1rem;

		:deep(html.dark) & {
			color: #38bdf8;
		}
	}

	ul {
		list-style: none;
		padding: 0;

		li {
			display: flex;
			align-items: center;
			font-size: 1rem;

			:deep(html.dark) & {
				color: #94a3b8;
			}

			i {
				margin-right: 0.5rem;
			}
		}
	}
}

.form {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;

	.form-group {
		display: flex;
		flex-direction: column;

		.form-label {
			font-size: 1rem;
			font-weight: 600;
			color: #374151;
			margin-bottom: 0.5rem;
		}

		.form-input {
			padding: 0.75rem;
			border-radius: 0.5rem;
			color: #374151;
			transition: all 0.3s ease;
			outline: none;

			&::placeholder {
				color: #9ca3af;
			}

			&:focus {
				border-color: #2563eb;
				box-shadow: 0 0 0 3px #bfdbfe;
				outline: none;
			}

			&.error {
				border-color: #dc2626;
			}
		}

		.form-error {
			color: #dc2626;
			font-size: 0.875rem;
			margin-top: 0.5rem;
		}
	}
}

.form-actions {
	display: flex;
	justify-content: center;
	gap: 1rem;

	.btn-primary {
		background: linear-gradient(to right, #2563eb, #1d4ed8);
		color: #ffffff;
		padding: 0.75rem 1.5rem;
		border-radius: 0.5rem;
		font-size: 1rem;
		font-weight: 600;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		transition: background 0.3s ease, box-shadow 0.3s ease;
		border: none;
		cursor: pointer;

		&:hover:not(:disabled) {
			background: linear-gradient(to right, #1d4ed8, #1e40af);
			box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
		}

		&:disabled {
			background: #9ca3af;
			cursor: not-allowed;
			opacity: 0.6;
		}
	}

	.btn-secondary {
		background-color: #e5e7eb;
		color: #1f2937;
		padding: 0.75rem 1.5rem;
		border-radius: 0.5rem;
		font-size: 1rem;
		font-weight: 600;
		transition: background-color 0.3s ease;
		border: none;
		cursor: pointer;

		&:hover:not(:disabled) {
			background-color: #d1d5db;
		}

		&:disabled {
			background-color: #d1d5db;
			cursor: not-allowed;
			opacity: 0.6;
		}
	}
}

.captcha-container {
	width: 120px;
	/* 与输入框高度一致：padding上下 + border上下 + line-height */
	height: calc(0.75rem * 2 + 4px + 1.5rem);
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #f9fafb;
	overflow: hidden;
	box-sizing: border-box;

	:deep(svg) {
		width: 100%;
		height: 100%;
	}
}

html.dark .captcha-container {
	background-color: #1f2937;
}
</style>
