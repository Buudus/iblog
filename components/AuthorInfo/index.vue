<!-- 客户端作者信息组件 -->
<template>
	<LyCard class="author-card">
		<div class="author-info w-full">
			<div class="w-full h-full flex flex-col items-center justify-center p-2">
				<!-- 头像/昵称 -->
				<div
					class="author w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 pt-6 pb-4 rounded-lg mb-2">
					<!-- 头像 -->
					<div class="avatar-container relative mb-3">
						<div
							class="avatar w-20 h-20 rounded-full overflow-hidden shadow-lg border-4 border-white dark:border-gray-700 duration-300 hover:scale-110 transition-transform">
							<img class="w-full h-full object-cover" :src="autuorInfo.avatar" alt="avatar" />
						</div>
					</div>

					<!-- 昵称 -->
					<div class="nickname mb-2">
						<h3 class="font-bold text-xl text-gray-800 dark:text-gray-200">
							{{ autuorInfo.name }}
						</h3>
					</div>

					<!-- 个性签名 -->
					<div class="signature mb-3">
						<p class="text-gray-600 dark:text-gray-400 text-sm text-center leading-relaxed">
							{{ autuorInfo.ps }}
						</p>
					</div>
				</div>

				<!-- 关注按钮 -->
				<div class="follow w-full mb-2">
					<NuxtLink :to="autuorInfo.github" target="blank">
						<button
							class="w-full cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-300 hover:shadow-lg">
							<i class="bi bi-github mr-2"></i>
							<span>Follow Me</span>
						</button>
					</NuxtLink>
				</div>

				<!-- 站点信息 -->
				<div class="site-info w-full mb-3">
					<div class="grid grid-cols-3 gap-4">
						<div class="stat-item text-center">
							<div class="stat-number text-xl font-bold text-blue-600 dark:text-blue-400">
								{{ statsDisplay.article }}
							</div>
							<div class="stat-label text-xs text-gray-500 dark:text-gray-400 mt-1">文章</div>
						</div>
						<div class="stat-item text-center">
							<div class="stat-number text-xl font-bold text-green-600 dark:text-green-400">
								{{ statsDisplay.category }}
							</div>
							<div class="stat-label text-xs text-gray-500 dark:text-gray-400 mt-1">分类</div>
						</div>
						<div class="stat-item text-center">
							<div class="stat-number text-xl font-bold text-purple-600 dark:text-purple-400">
								{{ statsDisplay.visit }}
							</div>
							<div class="stat-label text-xs text-gray-500 dark:text-gray-400 mt-1">访问</div>
						</div>
					</div>
				</div>

				<!-- 站点运行时间 -->
				<div class="runtime w-full">
					<div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-center">
						<p class="text-gray-600 dark:text-gray-300 text-xs font-medium">站点已运行</p>
						<p class="text-blue-600 dark:text-blue-400 text-sm font-bold mt-1">{{ runTime }}</p>
					</div>
				</div>
			</div>
		</div>
	</LyCard>
</template>

<script lang="ts">
export default defineComponent({
	name: 'AuthorInfo',
	setup() {
		const authorInfoStore = useAuthorInfoStore();
		const { formatted: statsDisplay, fetchStats } = useClientStats();

		// 作者信息
		const autuorInfo = computed(() => authorInfoStore.authorInfo);

		onMounted(() => {
			void fetchStats();
		});
		onServerPrefetch(() => fetchStats());

		// 站点运行时间
		const runTime = ref<string>('');
		const dayCount = getDaysElapsedSince('2004-04-17');
		runTime.value = `${convertDaysToYearsMonthsDays(dayCount).years}年
		${convertDaysToYearsMonthsDays(dayCount).months}个月
		${convertDaysToYearsMonthsDays(dayCount).days}天`;

		return { runTime, autuorInfo, statsDisplay };
	},
});
</script>

<style lang="scss" scoped>
.author-card {
	transition: all 0.3s ease;
}

.author-card:hover {
	box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.stat-item {
	transition: transform 0.3s ease;
}

.stat-item:hover {
	transform: scale(1.1);
}

.social-link {
	width: 2.5rem;
	height: 2.5rem;
	border-radius: 50%;
	background-color: #f3f4f6;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #4b5563;
	transition: all 0.3s ease;
}

.social-link:hover {
	background-color: #dbeafe;
	color: #2563eb;
	transform: scale(1.1);
}

.dark .social-link {
	background-color: #374151;
	color: #9ca3af;
}

.dark .social-link:hover {
	background-color: #1e3a8a;
	color: #60a5fa;
}

.avatar-container {
	&::before {
		content: '';
		position: absolute;
		top: -2px;
		left: -2px;
		right: -2px;
		bottom: -2px;
		background: linear-gradient(45deg, #667eea, #764ba2, #f093fb, #f5576c);
		border-radius: 50%;
		z-index: -1;
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	&:hover::before {
		opacity: 1;
	}
}
</style>
