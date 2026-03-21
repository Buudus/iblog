<template>
	<div
		v-loading="loading"
		class="data-view h-full min-h-[560px] relative overflow-hidden rounded-lg">
		<!-- 地图铺满，作为主视觉 -->
		<div class="china-map-wrapper absolute inset-0 z-0">
			<ChinaMap :data="data.mapData" />
		</div>

		<!-- 左侧：热门文章 TOP3（浮层，固定宽度） -->
		<div class="absolute left-4 top-2 z-10 w-[280px] max-h-[calc(100%-6rem)] flex flex-col">
			<div
				class="panel rounded-xl border border-white/20 dark:border-white/10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-xl overflow-hidden flex flex-col flex-1 min-h-0">
				<div class="panel-header px-3 py-2 border-b border-gray-200/60 dark:border-gray-700/60">
					<div class="flex items-center gap-2">
						<i class="bi bi-fire text-orange-500 text-sm" />
						<span class="font-medium text-gray-800 dark:text-gray-200 text-sm">热门文章 TOP3</span>
					</div>
				</div>
				<div class="panel-body flex-1 overflow-y-auto p-2">
					<NuxtLink
						v-for="item in data.hotArticles"
						:key="item._id"
						:to="`/article/${item._id}`"
						class="hot-item block mb-2 last:mb-0 rounded-lg p-2 transition-all duration-200 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 active:scale-[0.99]">
						<div class="flex items-center gap-2">
							<div
								class="cover w-12 h-12 rounded-lg flex-shrink-0 shadow-inner bg-cover bg-center bg-gradient-to-br from-sky-400 to-blue-600"
								:style="item.cover ? { backgroundImage: `url('${item.cover}')` } : undefined" />
							<div class="info min-w-0 flex-1">
								<div class="title text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
									{{ item.title }}
								</div>
								<div
									class="views-likes flex items-center gap-2 mt-0.5 text-xs text-gray-500 dark:text-gray-400">
									<span class="flex items-center gap-1">
										<i class="bi bi-eye" /> {{ formatNumber(item.views) }}
									</span>
									<span class="flex items-center gap-1">
										<i class="bi bi-hand-thumbs-up" /> {{ formatNumber(item.likes) }}
									</span>
								</div>
								<div class="text-xs text-gray-500 dark:text-gray-400">
									总浏览时长: {{ item.totalBrowsingDurationMinutes }} 分钟
								</div>
							</div>
						</div>
					</NuxtLink>
					<div v-if="data.hotArticles.length === 0" class="text-center text-gray-400 py-4 text-sm">
						暂无热门文章
					</div>
				</div>
			</div>
		</div>

		<!-- 右侧上：折线图（浮层） -->
		<div class="absolute right-4 top-2 z-10">
			<div
				class="panel rounded-xl border border-white/20 dark:border-white/10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-xl overflow-hidden">
				<div class="p-2">
					<LineChart
						:category="data.lineChart.category"
						:data="data.lineChart.data"
						:title="data.lineChart.title" />
				</div>
			</div>
		</div>

		<!-- 右侧下：柱状图（浮层） -->
		<div class="absolute right-4 bottom-6 z-10">
			<div
				class="panel rounded-xl border border-white/20 dark:border-white/10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-xl overflow-hidden">
				<div class="p-2">
					<BarChart
						:category="data.barChart.category"
						:data="data.barChart.data"
						:title="data.barChart.title" />
				</div>
			</div>
		</div>

		<!-- 底部中央：今日访问量（小浮层） -->
		<div
			class="absolute left-1/2 -translate-x-1/2 bottom-4 z-10 flex items-center gap-2 px-4 py-2 rounded-xl shadow-lg border border-white/20 dark:border-white/10 bg-white/85 dark:bg-gray-900/85 backdrop-blur-sm">
			<i class="bi bi-graph-up-arrow text-[#1976D2] dark:text-sky-400 text-lg" />
			<span class="text-sm text-gray-600 dark:text-gray-400">今日新增访问量</span>
			<span class="text-lg font-bold text-[#1976D2] dark:text-sky-400 tabular-nums">
				{{ data.todayVisits }}
			</span>
			<span class="text-sm text-gray-600 dark:text-gray-400">未知地区访问</span>
			<span class="text-lg font-bold text-[#1976D2] dark:text-sky-400 tabular-nums">
				{{ unknownAreaStore?.value || 0 }}
			</span>
		</div>
	</div>
</template>

<script name="DataView" lang="ts" setup>
import { formatNumber } from '~/utils/util.formatter';

const { data, loading, loadData } = useDataView();

const unknownAreaStore = computed(() => {
	return data.value.mapData.find((item) => item.name === '未知');
});

await loadData();
</script>

<style lang="scss" scoped>
.china-map-wrapper {
	border-radius: inherit;
}

.china-map-wrapper :deep(.china-map) {
	border-radius: inherit;
}

.hot-item:focus-visible {
	outline: 2px solid var(--admin-accent-color, #0ea5e9);
	outline-offset: 2px;
}
</style>
