<!-- 分类文章页面 -->
<template>
	<div class="category-page">
		<PageTitle :title="categoryTitle">
			<div v-if="error" class="text-red-500 text-lg mt-4">
				{{ error }}
			</div>
		</PageTitle>

		<!-- 主要内容 -->
		<section class="client-page px-1">
			<div class="main-content flex mt-3 relative">
				<!-- 左侧边栏 -->
				<div class="left-content duration-300 w-[260px] lg:block hidden">
					<div class="sticky top-3 space-y-3">
						<!-- 站点作者信息 -->
						<AuthorInfo />
						<!-- 分类列表 -->
						<LyCard>
							<CategoryList />
						</LyCard>
					</div>
				</div>

				<!-- 右侧内容区 -->
				<div class="right-content duration-300 lg:pl-3 flex-1">
					<!-- 移动端显示的组件 -->
					<div class="lg:hidden space-y-3 mb-4">
						<AuthorInfo />
						<LyCard>
							<CategoryList />
						</LyCard>
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
					<div v-else-if="!error" class="flex flex-col items-center justify-center py-20">
						<el-icon class="text-6xl text-gray-400 mb-4">
							<Document />
						</el-icon>
						<p class="text-gray-500 dark:text-gray-400 text-lg">该分类下暂无文章</p>
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

<script name="CategoryPage" lang="ts" setup>
import { useClientArticle, type ClientArticle } from '~/composables/useClientArticle';
import { categoryApi, type CategoryWithChildren } from '~/api';

const route = useRoute();

// 路由参数
const primaryId = computed(() => route.query.primary as string);
const secondaryId = computed(() => route.query.secondary as string);

// 错误和标题
const error = ref<string>('');
const categoryTitle = ref<string>('分类文章');

// 使用客户端文章composable
const {
	articles,
	loading,
	total,
	pageSize,
	currentPage,
	loadArticles,
	handlePageChange,
	setCategoryFilter,
} = useClientArticle();

// 分类列表（用于获取分类名称）
const categories = ref<CategoryWithChildren[]>([]);

// 加载分类列表
const loadCategories = async (): Promise<void> => {
	try {
		const result = await categoryApi.getList();
		// categoryApi.getList() 已经处理了返回格式，直接使用
		if (Array.isArray(result)) {
			categories.value = result;
		} else if (result && typeof result === 'object' && 'data' in result) {
			categories.value = (result as { data: CategoryWithChildren[] }).data;
		} else if (result && typeof result === 'object' && 'code' in result) {
			// 如果是 ApiResponse 格式
			const apiResult = result as { code: number; data: CategoryWithChildren[] };
			if (apiResult.code === 200 && Array.isArray(apiResult.data)) {
				categories.value = apiResult.data;
			}
		}
	} catch (err: unknown) {
		console.error('加载分类列表失败:', err);
	}
};

// 获取分类名称
const getCategoryName = (catId: string): string => {
	const category = categories.value.find((cat) => String(cat._id) === String(catId));
	return category?.name || '';
};

// 获取二级分类名称
const getSubCategoryName = (catId: string, subCatId: string): string => {
	const category = categories.value.find((cat) => String(cat._id) === String(catId));
	if (!category || !category.children) return '';
	const subCategory = category.children.find((sub) => String(sub._id) === String(subCatId));
	return subCategory?.name || '';
};

// 更新分类标题
const updateCategoryTitle = (): void => {
	if (!primaryId.value) {
		categoryTitle.value = '分类文章';
		return;
	}

	const primaryName = getCategoryName(primaryId.value);
	if (!primaryName) {
		categoryTitle.value = '分类文章';
		return;
	}

	if (secondaryId.value) {
		const secondaryName = getSubCategoryName(primaryId.value, secondaryId.value);
		if (secondaryName) {
			categoryTitle.value = `${primaryName} - ${secondaryName}`;
		} else {
			categoryTitle.value = primaryName;
		}
	} else {
		categoryTitle.value = primaryName;
	}
};

// 加载分类数据
const loadCategoryData = async (): Promise<void> => {
	// 验证参数
	if (!primaryId.value && secondaryId.value) {
		error.value = '无效的分类参数：缺少一级分类';
		categoryTitle.value = '分类文章';
		return;
	}

	if (!primaryId.value) {
		error.value = '请选择分类';
		categoryTitle.value = '分类文章';
		return;
	}

	// 清除错误
	error.value = '';

	// 更新分类标题
	updateCategoryTitle();

	// 设置分类筛选并加载文章
	await setCategoryFilter(primaryId.value, secondaryId.value || undefined);
};

// 监听路由参数变化
watch(
	[primaryId, secondaryId],
	async () => {
		await loadCategoryData();
	},
	{ immediate: false }
);

// 监听分类列表变化，更新标题
watch(
	categories,
	() => {
		updateCategoryTitle();
	},
	{ deep: true }
);

// 初始化
onMounted(async () => {
	await loadCategories();
	await loadCategoryData();
});
</script>

<style lang="scss" scoped>
/* 页面元素进场动画 */
@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.animate-fadeIn {
	animation: fadeIn 0.5s ease-out forwards;
	@for $i from 1 through 10 {
		&:nth-child(#{$i}) {
			animation-delay: #{$i * 0.1}s;
		}
	}
}
</style>
