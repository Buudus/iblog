<template>
	<!-- 热门文章 -->
	<div class="hot-articles">
		<LyCard>
			<!-- 标题栏 -->
			<div class="card-header p-1">
				<div class="flex items-center space-x-2">
					<i class="bi bi-fire text-lg text-blue-500"></i>
					<span class="text-base font-medium text-gray-800 dark:text-gray-200">热门文章</span>
				</div>
			</div>

			<!-- 文章列表 -->
			<div class="card-body px-3">
				<NuxtLink
					v-for="(item, index) in hotArticles"
					:key="item._id"
					:to="`/article/${item._id}`"
					class="hot-article-item group block"
					:class="{ 'border-b border-gray-100 dark:border-gray-700': index !== 2 }">
					<div class="flex items-start py-3 transition-all duration-300">
						<!-- 封面图 -->
						<div class="relative overflow-hidden rounded-lg">
							<div
								class="cover bg-no-repeat bg-cover bg-center w-[70px] h-[70px] transform transition-transform duration-500 group-hover:scale-110"
								:style="{
									backgroundImage: `url('${item.cover}')`,
								}"></div>
							<div
								class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
						</div>

						<!-- 文章信息 -->
						<div class="flex-1 ml-2">
							<!-- 标题 -->
							<h4
								class="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2 group-hover:text-blue-500 transition-colors duration-300"
								:title="item.title">
								{{ item.title }}
							</h4>

							<!-- 数据统计 -->
							<div class="flex items-center space-x-4 mt-2">
								<div class="flex items-center text-xs text-gray-500 dark:text-gray-400">
									<i class="bi bi-eye text-[13px] mr-1"></i>
									<span>{{ formatNumber(item.views) }}</span>
								</div>
								<div class="flex items-center text-xs text-gray-500 dark:text-gray-400">
									<i class="bi bi-hand-thumbs-up text-[13px] mr-1"></i>
									<span>{{ formatNumber(item.likes) }}</span>
								</div>
							</div>
						</div>
					</div>
				</NuxtLink>
			</div>
		</LyCard>
	</div>
</template>

<script lang="ts">
export default defineComponent({
	name: 'HotArticle',
	async setup() {
		// 获取热门文章 TOP3
		const hotArticleStore = useHotArticleStore();
		await hotArticleStore.getHotArticleTop3();
		const hotArticles = computed<ClientArticle[]>(() => hotArticleStore.hotArticles);

		return {
			hotArticles,
		};
	},
});
</script>

<style lang="scss" scoped>
.hot-article-item {
	&:last-child {
		.article-item-inner {
			border-bottom: none;
			margin-bottom: 0;
			padding-bottom: 0;
		}
	}
}

.line-clamp-2 {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
</style>
