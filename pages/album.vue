<template>
	<div class="album-page w-full">
		<!-- 标题 -->
		<PageTitle title="相册" />

		<!-- 相册内容 -->
		<section class="mt-6 max-w-[1200px] mx-auto px-4">
			<!-- 过滤器 -->
			<div class="filter-section mb-6">
				<div class="flex flex-wrap items-center justify-between gap-4">
					<div class="flex items-center space-x-4">
						<button
							v-for="tag in tagsWithAll"
							:key="tag.name"
							:class="[
								'px-4 py-2 rounded-lg font-medium transition-all duration-300',
								selectedTag === tag.name
									? 'bg-blue-500 text-white shadow-lg'
									: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600',
							]"
							@click="handleTagClick(tag.name)">
							{{ tag.label }}
							<span v-if="tag.count !== undefined" class="ml-1 text-xs opacity-70">
								({{ tag.count }})
							</span>
						</button>
					</div>

					<div class="flex items-center space-x-2">
						<button
							:class="[
								'p-2 rounded-lg transition-all duration-300',
								viewMode === 'grid'
									? 'bg-blue-500 text-white'
									: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
							]"
							@click="viewMode = 'grid'">
							<i class="bi bi-grid-3x3-gap" />
						</button>
						<button
							:class="[
								'p-2 rounded-lg transition-all duration-300',
								viewMode === 'masonry'
									? 'bg-blue-500 text-white'
									: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
							]"
							@click="viewMode = 'masonry'">
							<i class="bi bi-grid" />
						</button>
					</div>
				</div>
			</div>

			<!-- 相册图片列表 -->
			<!-- 加载状态 -->
			<div v-if="loading" class="flex items-center justify-center py-20">
				<el-icon class="is-loading text-4xl text-blue-500">
					<Loading />
				</el-icon>
			</div>

			<!-- 图片列表 -->
			<div
				v-else-if="filteredImages.length > 0"
				:class="viewMode === 'grid' ? 'album-grid' : 'album-masonry'">
				<div
					v-for="(img, idx) in filteredImages"
					:key="img._id || img.url || idx"
					v-scale
					class="album-item group">
					<LyCard
						class="h-full overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
						<!-- 图片容器 -->
						<div
							class="image-container relative overflow-hidden rounded-t-lg"
							@click="openViewer(idx)">
							<img
								:src="img.url"
								:alt="img.title"
								class="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
								loading="lazy" />

							<!-- 分类标签 -->
							<div class="absolute top-3 left-3">
								<span
									class="px-2 py-1 bg-blue-500/90 text-white text-xs rounded-full backdrop-blur-sm">
									{{ img.tags?.[0] || '未分类' }}
								</span>
							</div>
						</div>

						<!-- 图片信息 -->
						<div class="p-4">
							<h3
								class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
								{{ img.title }}
							</h3>
							<p class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
								{{ img.description }}
							</p>
							<div class="flex items-center justify-between text-xs text-gray-500">
								<span>{{ img.createdAt }}</span>
								<div class="flex flex-wrap gap-1 justify-end max-w-[180px]">
									<span
										v-for="tag in img.tags"
										:key="tag"
										class="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-200 text-[11px]">
										# {{ tag }}
									</span>
								</div>
							</div>
						</div>
					</LyCard>
				</div>
			</div>

			<!-- 空状态 -->
			<div v-else class="empty-state text-center py-12">
				<i class="bi bi-images text-6xl text-gray-400 mb-4" />
				<h3 class="text-xl font-medium text-gray-600 dark:text-gray-400 mb-2">暂无图片</h3>
				<p class="text-gray-500 dark:text-gray-500">
					{{ selectedTag === '全部' ? '暂时还没有上传任何照片' : '该标签下暂时没有图片' }}
				</p>
			</div>
		</section>

		<!-- 大图预览 -->
		<el-image-viewer
			v-if="showViewer"
			:url-list="filteredImages.map((i) => i.url)"
			:initial-index="viewerIndex"
			@close="showViewer = false" />
	</div>
</template>

<script name="AlbumPage" lang="ts" setup>
import { ElMessage } from 'element-plus';
import { Loading } from '@element-plus/icons-vue';
import type { PhotoAlbum } from '~/api';
import { clientPhotoAlbumApi } from '~/api';

// 相册数据
const images = ref<PhotoAlbum[]>([]);
const loading = ref<boolean>(false);

// 标签数据（来自相册 tags 汇总接口）
interface AlbumTagItem {
	tag: string;
	count: number;
}

const tags = ref<AlbumTagItem[]>([]);
const selectedTag = ref<string>('全部');

// 视图模式
const viewMode = ref<'grid' | 'masonry'>('grid');

// 处理标签点击
const handleTagClick = (name: string): void => {
	selectedTag.value = name;
};

// 带“全部”的标签列表
const tagsWithAll = computed(() => {
	return [
		{ name: '全部', label: '全部', count: images.value.length || undefined },
		...tags.value.map((t: AlbumTagItem) => ({
			name: t.tag,
			label: t.tag,
			count: t.count,
		})),
	];
});

// 过滤后的图片
const filteredImages = computed(() => {
	if (selectedTag.value === '全部') {
		return images.value;
	}
	return images.value.filter(
		(img: PhotoAlbum) => Array.isArray(img.tags) && img.tags.includes(selectedTag.value)
	);
});

// 图片预览
const showViewer = ref(false);
const viewerIndex = ref(0);

// 打开图片预览
const openViewer = (idx: number): void => {
	viewerIndex.value = idx;
	showViewer.value = true;
};

// 加载相册列表
const loadAlbums = async (): Promise<void> => {
	loading.value = true;
	try {
		const result = await clientPhotoAlbumApi.getAlbums();
		if (result.code === 200 && result.data) {
			images.value = result.data.data || [];
		} else {
			ElMessage.error(result.message || '加载相册失败');
		}
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : '加载相册失败';
		ElMessage.error(errorMessage);
		console.error(errorMessage);
	} finally {
		loading.value = false;
	}
};

// 加载相册标签
const loadAlbumTags = async (): Promise<void> => {
	try {
		const result = await clientPhotoAlbumApi.getAlbumTags();
		if (result.code === 200 && result.data) {
			tags.value = result.data.data || [];
		}
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : '加载标签失败';
		ElMessage.error(errorMessage);
		console.error(errorMessage);
	}
};

// 初始化加载数据（支持 SSR）
await Promise.all([loadAlbums(), loadAlbumTags()]);

const siteInfoStore = useSiteInfoStore();
const pageKeywords = images.value.map((img) => img.tags.join(',')).join(',');
useHead({
	title: `${siteInfoStore.siteInfo.title} - 相册`,
	meta: [{ name: 'keywords', content: pageKeywords }],
});
</script>

<style lang="scss" scoped>
.album-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	gap: 1.5rem;
}

.album-masonry {
	column-count: 4;
	column-gap: 1.5rem;
}

@media (max-width: 1024px) {
	.album-masonry {
		column-count: 3;
	}
}

@media (max-width: 768px) {
	.album-masonry {
		column-count: 2;
	}
	.album-grid {
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
	}
}

@media (max-width: 480px) {
	.album-masonry {
		column-count: 1;
	}
	.album-grid {
		grid-template-columns: 1fr;
	}
}

.album-item {
	break-inside: avoid;
	margin-bottom: 1.5rem;
}

.line-clamp-2 {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.empty-state {
	background-color: #f9fafb;
	border-radius: 0.5rem;
}

.dark .empty-state {
	background-color: #1f2937;
}
</style>
