<template>
	<div class="leave-message-page">
		<!-- 标题 -->
		<PageTitle title="留言" />
		<div class="w-full h-3" />
		<!-- 留言表单 -->
		<section class="client-page px-1 space-y-4">
			<LyCard>
				<form class="form" @submit.prevent="onSubmit">
					<div class="form-group">
						<label for="content" class="form-label">留言内容</label>
						<textarea
							id="content"
							v-model.trim="form.content"
							class="form-input"
							rows="4"
							placeholder="请分享您的想法、建议或交流内容..." />
						<p v-if="errors.content" class="form-error">{{ errors.content }}</p>
					</div>
					<div class="form-group">
						<label for="concat" class="form-label">联系方式</label>
						<input
							id="concat"
							v-model.trim="form.concat"
							type="text"
							class="form-input"
							placeholder="请输入常用邮箱、QQ 或其他联系方式" />
						<p v-if="errors.concat" class="form-error">{{ errors.concat }}</p>
					</div>
					<div class="form-group">
						<label for="captcha" class="form-label">验证码</label>
						<div class="captcha-wrapper">
							<input
								id="captcha"
								v-model.trim="form.captcha"
								type="text"
								class="form-input"
								placeholder="请输入验证码"
								maxlength="6" />
							<!-- 验证码区域 -->
							<div
								class="captcha-display"
								:title="captchaSvg ? '点击刷新验证码' : '加载验证码中...'"
								@click="refreshCaptcha">
								<!-- eslint-disable-next-line vue/no-v-html -->
								<div v-if="captchaSvg" v-html="captchaSvg" />
								<span v-else>加载中...</span>
							</div>
						</div>
						<p class="captcha-hint">点击验证码可刷新</p>
						<p v-if="errors.captcha" class="form-error">{{ errors.captcha }}</p>
					</div>
					<div class="form-actions">
						<button type="button" class="btn-secondary" :disabled="submitting" @click="resetForm">
							清空
						</button>
						<button type="submit" class="btn-primary" :disabled="submitting">
							{{ submitting ? '提交中...' : '提交留言' }}
						</button>
					</div>
				</form>
			</LyCard>
		</section>
	</div>
</template>

<script name="LeaveMessage" lang="ts" setup>
import { ElMessage } from 'element-plus';
import { clientLeaveMessageApi } from '~/api';
import { api } from '~/utils/util.fetch';

const submitting = ref(false);
const captchaSvg = ref('');

const form = reactive({
	content: '',
	concat: '',
	captcha: '',
});
const errors = reactive({
	content: '',
	concat: '',
	captcha: '',
});

const validateForm = () => {
	errors.content = form.content.length < 5 ? '留言内容至少 5 个字符' : '';
	errors.concat = form.concat.length < 3 ? '联系方式至少 3 个字符' : '';
	errors.captcha = form.captcha.length < 4 ? '请输入有效验证码' : '';

	return !errors.content && !errors.concat && !errors.captcha;
};

const loadCaptcha = async () => {
	try {
		const result = await api.get<{ captcha: string }>('/api/client/captcha/getCaptcha', {
			showLoading: false,
		});
		if (result.code === 200 && result.data?.captcha) {
			captchaSvg.value = result.data.captcha;
		} else {
			throw new Error(result.message || '获取验证码失败');
		}
	} catch (error) {
		const message = error instanceof Error ? error.message : '获取验证码失败';
		ElMessage.error(message);
		captchaSvg.value = '';
	}
};

const resetErrors = () => {
	errors.content = '';
	errors.concat = '';
	errors.captcha = '';
};

const refreshCaptcha = async () => {
	form.captcha = '';
	await loadCaptcha();
};

const resetForm = async () => {
	form.content = '';
	form.concat = '';
	form.captcha = '';
	resetErrors();
	await loadCaptcha();
};

const onSubmit = async () => {
	if (!validateForm()) {
		ElMessage.warning('请先检查表单填写是否完整');
		return;
	}

	try {
		submitting.value = true;
		const result = await clientLeaveMessageApi.submit({
			content: form.content,
			concat: form.concat,
			captcha: form.captcha,
		});

		if (result.code === 200 || result.code === 201) {
			ElMessage.success(result.message || '留言提交成功');
			await resetForm();
		} else {
			throw new Error(result.message || '留言提交失败');
		}
	} catch (error) {
		const message = error instanceof Error ? error.message : '留言提交失败';
		ElMessage.error(message);
		await loadCaptcha();
	} finally {
		submitting.value = false;
	}
};

onMounted(async () => {
	await loadCaptcha();
});

const siteInfoStore = useSiteInfoStore();
useHead({
	title: `${siteInfoStore.siteInfo.title} - 留言`,
});
</script>

<style lang="scss" scoped>
.leave-message-page {
	.client-page {
		.form {
			padding: 2rem;
			border-radius: 0.75rem;
			display: flex;
			flex-direction: column;
			gap: 1.75rem;

			.form-group {
				display: flex;
				flex-direction: column;

				.form-label {
					font-weight: bold;
					color: #374151;
					margin-bottom: 0.5rem;
				}

				.form-input {
					border: 2px solid #d1d5db;
					border-radius: 0.5rem;
					padding: 0.75rem;
					transition: border-color 0.3s ease;

					&:focus {
						border-color: #2563eb;
						box-shadow: 0 0 0 3px #bfdbfe;
					}
				}

				.captcha-wrapper {
					display: flex;
					gap: 1rem;
					align-items: center;

					.form-input {
						width: 200px;
						flex-shrink: 0;
					}

					.captcha-display {
						min-width: 150px;
						min-height: 48px;
						display: flex;
						align-items: center;
						justify-content: center;
						padding: 0.25rem 0.5rem;
						border: 2px solid #d1d5db;
						border-radius: 0.5rem;
						cursor: pointer;
						transition: border-color 0.3s ease;

						&:hover {
							border-color: #2563eb;
						}

						:deep(svg) {
							width: 100%;
							height: 100%;
						}
					}
				}

				.captcha-hint {
					font-size: 0.875rem;
					color: #6b7280;
					margin-top: 0.25rem;
				}

				.form-error {
					color: #dc2626;
					font-size: 0.875rem;
					margin-top: 0.5rem;
				}
			}

			.form-actions {
				display: flex;
				justify-content: flex-end;
				gap: 1rem;

				.btn-primary {
					background: linear-gradient(to right, #2563eb, #1d4ed8);
					color: #ffffff;
					padding: 0.75rem 1.5rem;
					border-radius: 0.5rem;
					font-weight: bold;
					transition: background 0.3s ease;

					&:hover {
						background: linear-gradient(to right, #1d4ed8, #1e40af);
					}

					&:disabled {
						background: #d1d5db;
						cursor: not-allowed;
					}
				}

				.btn-secondary {
					background: transparent;
					border: 2px solid #d1d5db;
					color: #1f2937;
					padding: 0.75rem 1.5rem;
					border-radius: 0.5rem;
					font-weight: bold;
					transition: all 0.3s ease;

					&:hover {
						border-color: #2563eb;
						color: #2563eb;
					}

					&:disabled {
						border-color: #e5e7eb;
						color: #9ca3af;
						cursor: not-allowed;
					}
				}
			}
		}
	}

	.guideline-card {
		h2 {
			font-size: 1.25rem;
			font-weight: 600;
			margin-bottom: 1rem;
			color: #1f2937;
		}

		ul {
			list-style: disc;
			padding-left: 1.5rem;
			color: #4b5563;
			line-height: 1.6;
		}
	}
}
</style>
