<!-- 阅读文章页 -->
<template>
	<div class="article-preview-page">
		<!-- 加载状态 -->
		<div v-if="loading" class="flex items-center justify-center min-h-screen">
			<el-icon class="is-loading text-4xl text-blue-500">
				<Loading />
			</el-icon>
		</div>

		<!-- 错误状态 -->
		<div v-else-if="error" class="flex flex-col items-center justify-center min-h-screen">
			<el-icon class="text-6xl text-gray-400 mb-4">
				<Warning />
			</el-icon>
			<p class="text-gray-500 dark:text-gray-400 text-lg">{{ error }}</p>
			<el-button type="primary" class="mt-4" @click="router.push('/')">返回首页</el-button>
		</div>

		<!-- 文章信息 -->
		<template v-else-if="article">
			<!-- 文章封面 -->
			<div
				class="article-cover bg-no-repeat bg-cover bg-center dark:brightness-85 w-full h-80 shadow-lg overflow-hidden"
				:style="{
					backgroundImage: `url(${article.cover || '/background.png'})`,
				}">
				<div class="mask absolute backdrop-blur-2xl w-full h-80"></div>
				<!-- 动态背景粒子 -->
				<div class="particles absolute inset-0">
					<div class="particle" v-for="i in 30" :key="i"></div>
				</div>
				<!-- 文章标题部分 -->
				<div
					class="article-title w-full h-80 flex flex-col items-center justify-center relative z-10 text-white dark:brightness-85">
					<h1 class="text-4xl font-bold mb-4 mt-16">{{ article.title || '无标题' }}</h1>
					<div class="text-lg flex flex-col items-center gap-2">
						<!-- 分类分级显示 -->
						<div v-if="getCategoryName(article.category)" class="flex items-center gap-2">
							<NuxtLink
								:to="categoryLink"
								class="px-3 py-1 rounded-full cursor-pointer hover:bg-blue-600 hover:shadow-md duration-300 text-shadow-sm">
								{{ getCategoryName(article.category) }}
							</NuxtLink>
							<span
								v-if="getSubCategoryName(article.subCategory)"
								class="text-white text-shadow-sm">
								➔
							</span>
							<NuxtLink
								v-if="getSubCategoryName(article.subCategory)"
								:to="subCategoryLink"
								class="px-3 py-1 rounded-full cursor-pointer hover:bg-blue-600 hover:shadow-md duration-300 text-shadow-sm">
								{{ getSubCategoryName(article.subCategory) }}
							</NuxtLink>
						</div>
						<!-- 标签单独列出，多个标签放在同一行 -->
						<div v-if="tags.length > 0" class="flex flex-wrap gap-2 mt-3">
							<span
								v-for="(tag, index) in tags"
								:key="tag"
								class="px-2 py-1 text-sm rounded-full cursor-pointer shadow-md hover:shadow-lg transition-shadow"
								:class="getTagColor(index)">
								{{ tag }}
							</span>
						</div>
					</div>
					<div class="text-sm mt-4 text-shadow-sm flex flex-col items-center gap-1">
						<div>
							<span v-if="article.createdAt">发布时间：{{ formatDate(article.createdAt) }}</span>
							<span v-if="article.createdAt && article.updatedAt"> | </span>
							<span v-if="article.updatedAt">修改时间：{{ formatDate(article.updatedAt) }}</span>
						</div>
						<div v-if="articleAuthorName">作者：{{ articleAuthorName }}</div>
					</div>
					<!-- 浏览量/点赞量 -->
					<div class="text-sm mt-2 flex gap-4 items-center text-shadow-sm">
						<div title="浏览量" class="flex items-center gap-1">
							<i class="bi bi-eye"></i>
							<span>{{ formatNumber(article.views) }}</span>
						</div>
						<div
							title="点赞量"
							class="flex items-center gap-1 cursor-pointer"
							@click="t_likeArticle">
							<i class="bi bi-hand-thumbs-up"></i>
							<span>{{ formatNumber(article.likes) }}</span>
						</div>
					</div>
				</div>
			</div>
		</template>

		<!-- 文章内容 -->
		<section v-if="article && !loading && !error" class="mt-3 max-w-[1400px] mx-auto px-1">
			<LyCard class="px-5 py-3 flex">
				<!-- 文章内容 -->
				<MdPreview
					editorId="preview-only"
					style="background-color: transparent"
					:theme="mdTheme"
					:modelValue="articleContent" />
				<!-- 文章目录 -->
				<div
					class="catalogue transition-all duration-500 h-full px-3 sticky top-5 right-0 truncate"
					:class="{ 'w-0': !catalogueVisible, 'w-56': catalogueVisible }">
					<div class="open w-full h-5 relative flex items-center">
						<i
							v-show="!catalogueVisible"
							@click="catalogueVisible = true"
							class="bi bi-caret-left-fill text-sky-500 dark:text-slate-300 cursor-pointer absolute right-[-8px]"
							title="展开目录"></i>
						<i
							@click="catalogueVisible = false"
							v-show="catalogueVisible"
							class="bi bi-caret-right-fill text-sky-500 dark:text-slate-300 cursor-pointer absolute right-0"
							title="收起目录"></i>
					</div>
					<MdCatalog editorId="preview-only" :scrollElement="scrollElement" />
				</div>
			</LyCard>
		</section>
	</div>
</template>

<script name="ArticleDetails" lang="ts" setup>
import 'md-editor-v3/lib/preview.css';
import { ElMessage } from 'element-plus';
import { clientArticleApi } from '~/api';
import { MdPreview, MdCatalog } from 'md-editor-v3';
import type { ClientArticle } from '~/composables/useClientArticle';

const route = useRoute();
const router = useRouter();
const themeStore = useThemeStore(); // 主题状态
const screenStore = useScreenStore();

// 文章数据
const article = ref<ClientArticle | null>(null);
const loading = ref<boolean>(true);
const error = ref<string>('');

// 文章内容
const articleContent = computed(() => {
	return article.value?.content || '';
});

// 标签
const tags = computed(() => {
	return article.value?.tags || [];
});

// 作者昵称
const articleAuthorName = computed(() => {
	const author = article.value?.author as
		| { nickname?: string; username?: string }
		| string
		| undefined;
	if (!author) return '';
	if (typeof author === 'string') return '';
	return author.nickname || author.username || '';
});

// 标签颜色
const tagColors = ref<string[]>([]);
const colors: string[] = [
	'bg-red-500',
	'bg-orange-500',
	'bg-amber-500',
	'bg-yellow-500',
	'bg-lime-500',
	'bg-green-500',
	'bg-emerald-500',
	'bg-teal-500',
	'bg-cyan-500',
	'bg-sky-500',
	'bg-blue-500',
	'bg-indigo-500',
	'bg-violet-500',
	'bg-purple-500',
	'bg-fuchsia-500',
	'bg-pink-500',
	'bg-rose-500',
];

// 文章浏览器主题
const mdTheme = computed<'dark' | 'light'>(() => {
	const isDark = themeStore.currentTheme === 'dark';
	return isDark ? 'dark' : 'light';
});

// 点赞文章
const likeArticle = async (): Promise<void> => {
	if (!article.value) return;
	const result = await clientArticleApi.recordBehavior({
		articleId: article.value._id as string,
		like: true,
	});
	if (result.code === 200) {
		if (result.message === '已经点赞过这篇文章咯~') {
			ElMessage.info(result.message);
			return;
		}
		ElMessage.success('点赞成功');
		// 本地更新点赞数
		article.value.likes = (article.value.likes || 0) + 1;
	}
};
const t_likeArticle = useThrottle(likeArticle, 1000);

// MdCatalog 滚动元素
const scrollElement = ref<HTMLElement>();

// 目录展开/收起状态（自动）
const autoCatalogueVisible = computed(() => {
	return !(screenStore.screenWidth <= 768);
});
// 目录展开/收起状态（手动）
const catalogueVisible = ref(autoCatalogueVisible.value);
watch(autoCatalogueVisible, (val: boolean) => {
	catalogueVisible.value = val;
});

// 获取标签颜色（固定颜色，不随机）
const getTagColor = (index: number): string => {
	return tagColors.value[index] || colors[index % colors.length];
};

// 获取分类名称
const getCategoryName = (cat: ClientArticle['category']): string => {
	if (!cat) return '';
	if (typeof cat === 'string') return cat;
	return cat.name || '';
};

// 获取二级分类名称
const getSubCategoryName = (subCat: ClientArticle['subCategory']): string => {
	if (!subCat) return '';
	if (typeof subCat === 'string') return subCat;
	return subCat.name || '';
};

// 格式化日期
const formatDate = (dateStr: string | undefined): string => {
	if (!dateStr) return '';
	// 如果已经是格式化好的日期，直接返回
	if (dateStr.includes('年') && dateStr.includes('月') && dateStr.includes('日')) {
		return dateStr.split(' ')[0];
	}
	return dateStr;
};

// 分类链接
const categoryLink = computed(() => {
	const cat = article.value?.category;
	if (!cat) return '/';
	if (typeof cat === 'string') return `/article/category?primary=${cat}`;
	return `/article/category?primary=${cat._id}`;
});

// 二级分类链接
const subCategoryLink = computed(() => {
	const subCat = article.value?.subCategory;
	if (!subCat) return '';
	const cat = article.value?.category;
	const catId = typeof cat === 'string' ? cat : cat?._id || '';
	if (typeof subCat === 'string') return `/article/category?primary=${catId}&secondary=${subCat}`;
	return `/article/category?primary=${catId}&secondary=${subCat._id}`;
});

// 加载文章详情
const loadArticle = async (): Promise<void> => {
	const articleId = route.params.id as string;
	if (!articleId) {
		error.value = '文章ID不能为空';
		loading.value = false;
		return;
	}

	loading.value = true;
	error.value = '';

	try {
		const result = await clientArticleApi.getArticle(articleId);

		if (result.code === 200 && result.data) {
			// 检查文章是否已发布
			if (!result.data.isPublished) {
				error.value = '文章不存在或未发布';
				ElMessage.warning('文章不存在或未发布');
				setTimeout(() => {
					router.push('/');
				}, 2000);
				return;
			}

			article.value = result.data;

			// 为每个标签分配一个固定的颜色
			tagColors.value = tags.value.map(
				(tag: string, index: number) => colors[index % colors.length],
			);
		} else {
			error.value = result.message || '加载文章失败';
			ElMessage.error(error.value);
			if (result.code === 404) {
				setTimeout(() => {
					router.push('/');
				}, 2000);
			}
		}
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '加载文章失败';
		error.value = errorMessage;
		ElMessage.error(errorMessage);
	} finally {
		loading.value = false;
	}
};
await loadArticle();

// 滚动监听函数
const browseProcess = ref<number>(0); // 最大浏览进度百分比
const handleScroll = (): void => {
	const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	const scrollHeight = document.documentElement.scrollHeight;
	const clientHeight = document.documentElement.clientHeight;

	// 计算可滚动高度
	const scrollableHeight = scrollHeight - clientHeight;

	// 计算滚动百分比（处理边界情况）
	let scrollPercentage = 0;
	if (scrollableHeight > 0) {
		scrollPercentage = (scrollTop / scrollableHeight) * 100;
	}

	if (scrollPercentage > browseProcess.value) {
		browseProcess.value = Number(scrollPercentage.toFixed(0));
	}
};

let timer: any;
onMounted(async () => {
	scrollElement.value = document.documentElement;

	// 添加滚动监听
	window.addEventListener('scroll', handleScroll);

	// 定时记录浏览行为
	let browsingDuration: number = 0;
	timer = setInterval(async () => {
		// 每隔 5 秒记录一次浏览行为
		browsingDuration += 5;
		if (article.value) {
			await clientArticleApi.recordBehavior({
				articleId: article.value._id as string,
				browseProgress: browseProcess.value,
				browsingDuration,
			});
		}
	}, 5000);

	window.addEventListener('beforeunload', async () => {
		// 在页面卸载前记录最后一次浏览行为
		if (article.value) {
			await clientArticleApi.recordBehavior({
				articleId: article.value._id as string,
				browseProgress: browseProcess.value,
				browsingDuration,
			});
		}
	});
});

// 组件卸载时移除滚动监听
onUnmounted(() => {
	window.removeEventListener('scroll', handleScroll);
	clearInterval(timer);
});

const siteInfoStore = useSiteInfoStore();
const pageKeywords = computed(() => article.value?.tags?.join(',') || '');
const pageTitle = computed(() => `${siteInfoStore.siteInfo.title} - ${article.value?.title || ''}`);
useHead({
	title: pageTitle,
	meta: [{ name: 'keywords', content: pageKeywords }],
});
</script>

<style lang="scss" scoped>
@use 'sass:math';

.article-title h1 {
	text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}
.article-title span {
	text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

/* 深色模式适配 */
:root {
	--text-color: #000;
	--bg-color: #fff;
}
.dark {
	--text-color: #fff;
	--bg-color: #000;
}

.article-preview-page {
	color: var(--text-color);
	background-color: var(--bg-color);
}

.article-cover {
	.particles {
		z-index: 0;

		@for $i from 1 through 30 {
			.particle:nth-child(#{$i}) {
				position: absolute;
				width: 4px;
				height: 4px;
				background: rgba(255, 255, 255, 0.5);
				border-radius: 50%;
				animation: float 6s infinite linear;
				left: math.random() * 100%;
				top: math.random() * 100%;
				animation-delay: math.random() * 6s;
			}
		}
	}
}

@keyframes float {
	0% {
		transform: translateY(0) rotate(0deg);
		opacity: 1;
	}
	100% {
		transform: translateY(-100vh) rotate(360deg);
		opacity: 0;
	}
}

/* 页面元素进场动画 */
@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(30px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.article-title {
	h1 {
		animation: fadeInUp 0.8s ease-out both;
		animation-delay: 0.2s;
	}

	.text-lg {
		animation: fadeInUp 0.8s ease-out both;
		animation-delay: 0.4s;
	}

	.text-sm {
		animation: fadeInUp 0.8s ease-out both;
		animation-delay: 0.6s;
	}
}

section {
	animation: fadeInUp 0.8s ease-out both;
	animation-delay: 0.8s;
}

:deep(.md-editor-catalog-link) {
	padding-left: 8px !important;
}
</style>

<style>
footer {
	max-width: 1400px !important;
}
</style>
