<!-- 文章卡片 -->
<template>
	<LyCard class="article-card h-full">
		<div class="article-content w-full h-full flex flex-col">
			<!-- 文章封面 -->
			<div class="cover w-full h-44 overflow-hidden relative group">
				<div
					class="w-full h-full bg-center bg-cover bg-no-repeat duration-500 group-hover:scale-110 transition-transform"
					:style="{
						backgroundImage: `url(${article.cover || '/default-cover.jpg'})`,
					}"></div>
				<!-- 覆盖层 -->
				<div
					class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
				<!-- 分类标签 -->
				<div v-if="categoryName" class="absolute top-3 left-3">
					<NuxtLink :to="categoryLink">
						<span
							class="px-2 py-1 bg-blue-500/90 text-white text-xs rounded-full backdrop-blur-sm font-medium">
							{{ categoryName }}
						</span>
					</NuxtLink>
				</div>
			</div>

			<!-- 文章内容 -->
			<div class="content flex-1 p-5 flex flex-col">
				<!-- 文章标题 -->
				<div class="title mb-3">
					<NuxtLink :to="articleLink">
						<h3
							class="text-lg font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 line-clamp-2">
							{{ article.title || '无标题' }}
						</h3>
					</NuxtLink>
				</div>

				<!-- 文章摘要 -->
				<div class="summary mb-4">
					<p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
						{{ summary }}
					</p>
				</div>

				<!-- 文章元信息 -->
				<div class="meta flex items-center justify-between mb-4 text-xs text-gray-500">
					<div class="flex items-center space-x-4">
						<div class="flex items-center">
							<i class="bi bi-calendar3 mr-1"></i>
							<span>{{ formattedDate }}</span>
						</div>
						<div class="flex items-center">
							<i class="bi bi-eye mr-1"></i>
							<span>{{ formatNumber(views) }}</span>
						</div>
						<div class="flex items-center">
							<i class="bi bi-hand-thumbs-up mr-1"></i>
							<span>{{ formatNumber(likes) }}</span>
						</div>
					</div>
				</div>

				<!-- 文章标签 -->
				<div v-if="article.tags && article.tags.length > 0" class="tags mb-4">
					<div class="flex flex-wrap gap-2">
						<span
							v-for="tag in article.tags"
							:key="tag"
							class="px-3 cursor-pointer py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-300 font-medium">
							{{ tag }}
						</span>
					</div>
				</div>

				<!-- 阅读按钮 -->
				<div class="read-more mt-auto">
					<NuxtLink
						class="inline-flex items-center justify-center w-full py-2.5 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-300 transform hover:shadow-lg"
						:to="articleLink">
						<span>阅读全文</span>
						<i
							class="bi bi-arrow-right ml-2 transition-transform duration-300 group-hover:translate-x-1"></i>
					</NuxtLink>
				</div>
			</div>
		</div>
	</LyCard>
</template>

<script name="ArticleCard" lang="ts" setup>
import type { ClientArticle } from '~/composables/useClientArticle';

interface Props {
	article: ClientArticle;
}

const props = defineProps<Props>();

// 格式化日期
const formattedDate = computed(() => {
	if (!props.article.createdAt) return '';
	const match = props.article.createdAt.match(/(\d{4})年(\d{2})月(\d{2})日/);
	if (match) {
		return `${match[1]}-${match[2]}-${match[3]}`;
	}
	return props.article.createdAt;
});

// 文章浏览量
const views = props.article?.views || 0;
// 文章点赞量
const likes = props.article?.likes || 0;

// 获取文章摘要
const summary = computed(() => {
	if (!props.article.content) return '';
	// 去除HTML标签
	const text = props.article.content
		.replace(/<[^>]*>/g, '')
		.replace(/\s+/g, ' ')
		.trim();
	if (text.length <= 150) return text;
	return text.substring(0, 150) + '...';
});

// 获取分类名称
const categoryName = computed(() => {
	const cat = props.article.category;
	if (!cat) return '';
	if (typeof cat === 'string') return cat;
	return cat.name || '';
});

// 文章链接
const articleLink = computed(() => {
	return `/article/${props.article._id}`;
});

// 分类链接
const categoryLink = computed(() => {
	const cat = props.article.category;
	if (!cat) return '/';
	if (typeof cat === 'string') return `/article/category?primary=${cat}`;
	return `/article/category?primary=${cat._id}`;
});
</script>

<style lang="scss" scoped>
.article-card {
	transition: all 0.3s ease;
	border: 1px solid #e5e7eb;
	background: #ffffff;
}

.article-card:hover {
	box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.dark .article-card {
	border-color: #374151;
	background: #000f1a;
}

.dark .article-card:hover {
	border-color: #60a5fa;
}

.line-clamp-2 {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.line-clamp-3 {
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.cover {
	position: relative;

	&::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 30%;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.3), transparent);
		pointer-events: none;
	}
}
</style>
