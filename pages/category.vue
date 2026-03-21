<template>
	<div class="category-page w-full">
		<!-- 标题 -->
		<PageTitle title="分类 / 标签" />
		<!-- 内容 -->
		<section class="client-page mt-3 mb-5 px-1">
			<div class="main-content flex mt-3 relative">
				<!-- 左侧边栏 -->
				<div class="left-content duration-300 w-[260px] lg:block hidden">
					<div class="sticky top-3 space-y-3">
						<!-- 站点作者信息 -->
						<AuthorInfo />
						<!-- 热门文章 -->
						<HotArticle />
					</div>
				</div>

				<!-- 右侧内容区 -->
				<div class="right-content duration-300 lg:pl-3 flex-1">
					<!-- 移动端显示的组件 -->
					<div class="lg:hidden space-y-3 mb-4">
						<AuthorInfo />
					</div>

					<!-- 分类卡片 -->
					<LyCard class="p-3">
						<h2 class="text-xl font-bold mb-3 text-blue-500 dark:text-blue-300 flex items-center">
							<i class="bi bi-tags-fill mr-1" />
							<span>分类</span>
						</h2>
						<!-- 分类列表 -->
						<CategoryList />
					</LyCard>

					<!-- 标签卡片 -->
					<LyCard class="p-3 mt-3">
						<h2 class="text-xl font-bold mb-3 text-blue-500 dark:text-blue-300 flex items-center">
							<i class="bi bi-layers-fill mr-1" />
							<span>标签</span>
						</h2>

						<!-- 加载状态 -->
						<div v-if="loading" class="flex items-center justify-center py-10">
							<el-icon class="is-loading text-4xl text-blue-500">
								<Loading />
							</el-icon>
						</div>

						<!-- 标签列表 -->
						<div v-else-if="tags.length > 0" class="tags w-full">
							<div class="flex flex-wrap gap-2 justify-center items-start w-full">
								<div
									v-for="(tag, index) in tags"
									:key="tag.name"
									v-scale
									:class="[
										'cursor-pointer rounded-full px-3 py-2 font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center',
										getTagSize(tag.count),
										getTagColor(index),
									]"
									@click="handleTagClick(tag.name)">
									{{ tag.name }}
									<span class="ml-1 text-sm opacity-70">({{ tag.count }})</span>
								</div>
							</div>
						</div>

						<!-- 空状态 -->
						<div v-else class="flex flex-col items-center justify-center py-10">
							<el-icon class="text-6xl text-gray-400 mb-4">
								<Document />
							</el-icon>
							<p class="text-gray-500 dark:text-gray-400 text-lg">暂无标签</p>
						</div>
					</LyCard>
				</div>
			</div>
		</section>
	</div>
</template>

<script name="CategoryPage" lang="ts" setup>
import { ElMessage } from 'element-plus';
import { clientArticleApi, type Tag } from '~/api';
import { Loading, Document } from '@element-plus/icons-vue';

const router = useRouter();
// 标签数据
const tags = ref<Tag[]>([]);
const loading = ref<boolean>(false);

// 标签颜色数组（固定颜色，不随机）
const tagColors = [
	'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
	'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
	'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
	'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
	'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
	'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
	'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
	'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
	'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
	'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
	'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
	'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
	'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200',
	'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
	'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200',
];

// 根据文章数量设置标签字体大小
const getTagSize = (count: number): string => {
	if (count >= 15) return 'text-lg';
	if (count >= 10) return 'text-base';
	if (count >= 5) return 'text-sm';
	return 'text-xs';
};

// 获取标签颜色（固定颜色，不随机）
const getTagColor = (index: number): string => {
	return tagColors[index % tagColors.length];
};

// 处理标签点击
const handleTagClick = (tagName: string): void => {
	// 跳转到首页，使用关键词参数筛选
	router.push({
		path: '/',
		query: {
			keywords: tagName,
		},
	});
};

// 加载标签列表
const loadTags = async (): Promise<void> => {
	loading.value = true;
	try {
		const result = await clientArticleApi.getTags();
		if (result.code === 200 && result.data) {
			// 按文章数量降序排序
			tags.value = (result.data || []).sort((a: Tag, b: Tag) => b.count - a.count);
		} else {
			ElMessage.error(result.message || '加载标签失败');
		}
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : '加载标签失败';
		ElMessage.error(errorMessage);
		console.error(errorMessage);
	} finally {
		loading.value = false;
	}
};

// 初始化加载标签
await loadTags();

const siteInfoStore = useSiteInfoStore();
useHead({
	title: `${siteInfoStore.siteInfo.title} - 分类 / 标签`,
	meta: [{ name: 'keywords', content: `${tags.value.map((t) => t.name).join(',')}` }],
});
</script>

<style lang="scss" scoped>
.tags {
	height: auto;
	min-height: 0;
	max-height: none;
	overflow: visible;
}
</style>
