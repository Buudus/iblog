<!-- 搜索文章 -->
<template>
	<div class="search-article">
		<LyCard>
			<!-- 标题栏 -->
			<div class="card-header p-1">
				<div class="flex items-center space-x-2">
					<i class="bi bi-search text-md text-blue-500"></i>
					<span class="text-base font-medium text-gray-800 dark:text-gray-200">搜索文章</span>
				</div>
			</div>

			<!-- 搜索框 -->
			<div class="card-body px-2 py-2">
				<form @submit.prevent="handleSearch" class="search-form">
					<div class="relative">
						<!-- 输入框 -->
						<input
							v-model="keyword"
							type="text"
							:placeholder="placeholder"
							class="w-full h-10 px-4 pr-12 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-gray-300 transition-colors duration-300" />

						<!-- 清除按钮 -->
						<button
							v-show="keyword"
							type="button"
							class="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
							@click="clearKeyword">
							<i class="bi bi-x text-lg"></i>
						</button>

						<!-- 搜索按钮 -->
						<button
							type="submit"
							class="absolute right-0 top-0 h-full px-3 flex items-center justify-center text-gray-400 hover:text-blue-500 transition-colors duration-300">
							<i class="bi bi-search text-lg"></i>
						</button>
					</div>
				</form>
			</div>
		</LyCard>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const keyword = ref('');
const placeholder = ref('输入关键词搜索文章...');

// 处理搜索
const handleSearch = () => {
	if (!keyword.value.trim()) return;
	emit('search', keyword.value);
};

// 清除关键词
const clearKeyword = () => {
	keyword.value = '';
	// 清除搜索时也触发事件，让父组件知道要清除搜索
	emit('search', '');
};

// 定义事件
const emit = defineEmits<{
	(e: 'search', keyword: string): void;
}>();
</script>

<style lang="scss" scoped>
.search-form {
	position: relative;
}
</style>
