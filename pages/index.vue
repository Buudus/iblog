<template>
	<div class="home-page">
		<!-- 横幅 -->
		<ClientBanner />

		<!-- 主要内容 -->
		<section class="client-page px-1">
			<div class="main-content flex mt-3 relative">
				<!-- 左侧边栏 -->
				<div class="left-content duration-300 w-[260px] lg:block hidden">
					<div class="sticky top-3 space-y-3">
						<!-- 站点作者信息 -->
						<AuthorInfo />
						<!-- 搜索文章 -->
						<SearchArticle @search="onSearch" />
						<!-- 热门文章 -->
						<HotArticle />
					</div>
				</div>

				<!-- 右侧内容区 -->
				<div class="right-content duration-300 lg:pl-3 flex-1">
					<!-- 移动端显示的组件 -->
					<div class="lg:hidden space-y-3 mb-4">
						<AuthorInfo />
						<SearchArticle @search="onSearch" />
					</div>

					<!-- 加载状态 -->
					<div v-if="loading" class="flex items-center justify-center py-20">
						<el-icon class="is-loading text-4xl text-blue-500">
							<Loading />
						</el-icon>
					</div>

					<!-- 文章列表 -->
					<div v-else-if="articles.length > 0" class="articles-grid">
						<ArticleCard
							v-for="article in articles"
							:key="article._id"
							v-scale
							class="mb-3"
							:article="article" />
					</div>

					<!-- 空状态 -->
					<div v-else class="flex flex-col items-center justify-center py-20">
						<el-icon class="text-6xl text-gray-400 mb-4">
							<Document />
						</el-icon>
						<p class="text-gray-500 dark:text-gray-400 text-lg">暂无文章</p>
					</div>
				</div>
			</div>

			<!-- 分页 -->
			<div v-if="total > 0" class="w-full flex items-center justify-center my-6">
				<el-scrollbar>
					<ElsPagination
						:total="total"
						:page-size="pageSize"
						:current-page="currentPage"
						@current-change="handlePageChange" />
				</el-scrollbar>
			</div>
		</section>
	</div>
</template>

<script name="HomePage" lang="ts" setup>
import { useClientArticle } from '~/composables/useClientArticle';

// 使用客户端文章composable
const {
	articles,
	loading,
	total,
	pageSize,
	currentPage,
	loadArticles,
	handleSearch,
	handlePageChange,
	clearSearch,
} = useClientArticle();

// 处理搜索（支持清除搜索）
const onSearch = async (keyword: string): Promise<void> => {
	if (!keyword.trim()) {
		await clearSearch();
	} else {
		await handleSearch(keyword);
	}
};

// 初始化加载文章
const route = useRoute();

// 从 URL 查询参数中读取关键词
if (route.query.keywords && typeof route.query.keywords === 'string') {
	await handleSearch(route.query.keywords);
} else {
	await loadArticles();
}

// 监听路由查询参数变化（用于搜索和筛选）
watch(
	() => route.query.keywords,
	async (keywords) => {
		if (keywords && typeof keywords === 'string') {
			await handleSearch(keywords);
		} else {
			await clearSearch();
		}
	},
	{ immediate: false }
);
</script>
