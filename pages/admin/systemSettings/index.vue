<template>
	<div class="admin-system-settings w-full space-y-6">
		<header class="page-header">
			<div>
				<h1>系统设置</h1>
				<p>自定义后台工作区的视觉与交互偏好，所有配置仅存储在当前浏览器。</p>
			</div>
			<el-button type="primary" @click="handleReset">
				<template #icon>
					<i class="bi bi-gear-fill" />
				</template>
				恢复默认
			</el-button>
		</header>

		<section class="settings-grid">
			<div class="setting-block">
				<header class="block-header">
					<h3>界面外观</h3>
					<p>控制后台整体主题和布局风格</p>
				</header>
				<div class="setting-item">
					<div>
						<p class="label">主题模式</p>
						<p class="desc">深色模式在夜间更柔和，浅色模式在白天更清爽</p>
					</div>
					<el-switch v-model="isDarkMode" active-text="深色" inactive-text="浅色" inline-prompt />
				</div>
				<div class="setting-item column">
					<div>
						<p class="label">主题颜色</p>
						<p class="desc">用于按钮、标签等强调元素的基础配色</p>
					</div>
					<div class="accent-picker">
						<el-color-picker v-model="accentColor" :show-alpha="false" :predefine="accentPresets" />
						<div class="accent-presets">
							<button
								v-for="(color, index) in accentPresets"
								:key="`accent-color-${index}`"
								type="button"
								class="preset-dot"
								:style="{ backgroundColor: color }"
								:aria-label="`选择主题颜色 ${index + 1}`"
								@click="setAccentColor(color)">
								<span v-if="accentColor === color" class="bi bi-check2 text-white" />
							</button>
						</div>
					</div>
				</div>
			</div>

			<div class="setting-block">
				<header class="block-header">
					<h3>交互体验</h3>
					<p>优化后台页面的滚动与交互细节</p>
				</header>
				<div class="setting-item">
					<div>
						<p class="label">固定顶部导航</p>
						<p class="desc">开启后，滚动页面时导航栏将保持可见</p>
					</div>
					<el-switch v-model="fixedHeader" inline-prompt active-text="开启" inactive-text="关闭" />
				</div>
				<div class="setting-item">
					<div>
						<p class="label">降低动画</p>
						<p class="desc">适合对动画敏感的用户，降低大部分过渡效果</p>
					</div>
					<el-switch v-model="reduceMotion" inline-prompt active-text="开启" inactive-text="关闭" />
				</div>
			</div>

			<div class="setting-block">
				<header class="block-header">
					<h3>安全防伪</h3>
					<p>为后台页面添加水印，防止内容泄露</p>
				</header>
				<div class="setting-item column">
					<div class="watermark-toggle">
						<p class="label">页面水印</p>
						<el-switch
							v-model="watermarkEnabled"
							inline-prompt
							active-text="开启"
							inactive-text="关闭" />
					</div>
					<el-input
						v-model="watermarkText"
						:disabled="!watermarkEnabled"
						placeholder="请输入水印文案（最多 20 个字符）"
						maxlength="20"
						show-word-limit />
				</div>
			</div>
		</section>
	</div>
</template>

<script name="SystemSettings" lang="ts" setup>
const themeStore = useThemeStore();
const { preferences, updatePreference, resetPreferences, defaultPreferences } =
	useAdminPreferences();

const fixedHeader = computed<boolean>({
	get: () => preferences.value.fixedHeader,
	set: (value: boolean) => updatePreference('fixedHeader', value),
});

const reduceMotion = computed<boolean>({
	get: () => preferences.value.reduceMotion,
	set: (value: boolean) => updatePreference('reduceMotion', value),
});

const accentColor = computed<string>({
	get: () => preferences.value.accentColor,
	set: (value: string) => updatePreference('accentColor', value || defaultPreferences.accentColor),
});

const watermarkEnabled = computed<boolean>({
	get: () => preferences.value.watermarkEnabled,
	set: (value: boolean) => updatePreference('watermarkEnabled', value),
});

const watermarkText = computed<string>({
	get: () => preferences.value.watermarkText,
	set: (value: string) =>
		updatePreference('watermarkText', value || defaultPreferences.watermarkText),
});

const isDarkMode = computed({
	get: () => themeStore.currentTheme === 'dark',
	set: (value: boolean) => {
		if (value !== (themeStore.currentTheme === 'dark')) {
			themeStore.toggleTheme();
		}
	},
});

const accentPresets = ['#0ea5e9', '#2563eb', '#f97316', '#16a34a', '#9333ea', '#f43f5e'];

const setAccentColor = (color: string) => {
	updatePreference('accentColor', color);
};

const handleReset = () => {
	resetPreferences();
};
</script>

<style lang="scss" scoped>
.admin-system-settings {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	padding: 1.5rem;
	background: var(--admin-bg-color);
	border-radius: 1.25rem;
	min-height: calc(100vh - 140px);
	color: var(--admin-text-color);
}

.page-header {
	gap: 1rem;
	display: flex;
	padding: 1.5rem;
	align-items: center;
	border-bottom: 1px solid var(--admin-border-color);
	justify-content: space-between;
	background-color: var(--admin-card-bg);
	border-radius: 1rem;

	h1 {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 0.4rem;
	}

	p {
		color: var(--admin-muted-text-color);
		max-width: 640px;
	}
}

.settings-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
	gap: 1.5rem;
}

.setting-block {
	gap: 1.25rem;
	display: flex;
	border-radius: 1rem;
	flex-direction: column;
	padding: 1.25rem 1.5rem;
	background: var(--admin-card-bg);
	border: 1px solid var(--admin-border-color);
}

.block-header {
	border-left: 4px solid var(--admin-accent-color, #0ea5e9);
	padding-left: 0.75rem;
	margin-bottom: 0.25rem;

	h3 {
		font-size: 1.1rem;
		margin-bottom: 0.25rem;
	}

	p {
		color: var(--admin-muted-text-color);
		font-size: 0.9rem;
	}
}

.setting-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	padding: 0.75rem 0;
	border-bottom: 1px dashed var(--admin-border-color);

	&:last-child {
		border-bottom: none;
	}

	&.column {
		flex-direction: column;
		align-items: flex-start;
	}
}

.label {
	font-weight: 600;
	color: var(--admin-text-color);
}

.desc {
	color: var(--admin-muted-text-color);
	font-size: 0.88rem;
	margin-top: 0.2rem;
}

.accent-picker {
	display: flex;
	gap: 1rem;
	align-items: center;
	flex-wrap: wrap;
	width: 100%;
}

.accent-presets {
	display: flex;
	gap: 0.5rem;
	flex-wrap: wrap;
}

.preset-dot {
	width: 2.2rem;
	height: 2.2rem;
	border-radius: 50%;
	border: 2px solid rgba(255, 255, 255, 0.45);
	box-shadow: 0 10px 20px rgba(15, 23, 42, 0.2);
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: transform 0.2s ease, box-shadow 0.2s ease;

	&:hover {
		transform: translateY(-4px);
		box-shadow: 0 16px 25px rgba(15, 23, 42, 0.25);
	}

	span {
		font-size: 1rem;
	}
}

.watermark-toggle {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
}

@media (max-width: 1024px) {
	.settings-grid {
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
	}
}

@media (max-width: 768px) {
	.admin-system-settings {
		padding: 1rem;
	}

	.page-header {
		flex-direction: column;
		align-items: flex-start;
	}

	.setting-item {
		flex-direction: column;
		align-items: flex-start;
	}
}
</style>
