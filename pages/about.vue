<template>
	<div class="about-page">
		<!-- 页面标题 -->
		<PageTitle title="关于" />

		<!-- 主要内容 -->
		<section class="client-page px-1 mt-5 max-w-[1200px] mx-auto">
			<!-- 内容区域 -->
			<div class="mt-5">
				<!-- 作者简介卡片 -->
				<LyCard class="mb-5">
					<div class="p-6">
						<h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
							<i class="bi bi-person-vcard mr-2 text-emerald-500" />
							<span>作者简介</span>
						</h2>
						<p
							class="text-gray-700 dark:text-gray-300 leading-8 whitespace-pre-line"
							v-html="biographyText"></p>
					</div>
				</LyCard>

				<!-- 技术栈卡片 -->
				<LyCard class="tech-section">
					<div class="tech-content p-6">
						<h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
							<i class="bi bi-code-slash mr-2 text-blue-500" />
							<span>技术栈</span>
						</h2>
						<div class="tech-stack grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
							<div
								v-for="tech in techStack"
								:key="tech.name"
								class="tech-item flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg hover:shadow-lg transition-all duration-300">
								<div class="tech-icon text-4xl mb-2">{{ tech.icon }}</div>
								<div class="tech-name text-sm font-semibold text-gray-700 dark:text-gray-300">
									{{ tech.name }}
								</div>
							</div>
						</div>
					</div>
				</LyCard>
			</div>
		</section>
	</div>
</template>

<script name="AboutPage" lang="ts" setup>
const authorInfoStore = useAuthorInfoStore();
const biographyText = computed(
	() => authorInfoStore.authorInfo.biography?.trim() || '作者暂未填写简介内容。',
);

// 技术栈数据
const techStack = [
	{ name: 'Vue 3', icon: '⚡' },
	{ name: 'Nuxt 3', icon: '🚀' },
	{ name: 'TypeScript', icon: '📘' },
	{ name: 'MongoDB', icon: '🍃' },
	{ name: 'Element Plus', icon: '🎨' },
	{ name: 'Tailwind CSS', icon: '💨' },
	{ name: 'Pinia', icon: '🍍' },
	{ name: 'Node.js', icon: '🟢' },
];

const siteInfoStore = useSiteInfoStore();
useHead({
	title: `${siteInfoStore.siteInfo.title} - 关于`,
	meta: [{ name: 'description', content: authorInfoStore.authorInfo.biography }],
});
</script>

<style lang="scss" scoped>
.tech-section {
	transition: all 0.3s ease;

	&:hover {
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.1),
			0 4px 6px -2px rgba(0, 0, 0, 0.05);
	}

	.tech-item {
		cursor: default;
		transition: transform 0.3s ease;

		&:hover {
			transform: translateY(-4px);
		}
	}
}
</style>
