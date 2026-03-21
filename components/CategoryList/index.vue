<template>
	<div class="categories">
		<!-- 加载状态 -->
		<div v-if="categoryStore.loading" class="flex items-center justify-center py-4">
			<el-icon class="is-loading text-2xl text-blue-500">
				<Loading />
			</el-icon>
		</div>

		<!-- 分类列表 -->
		<ul v-else-if="categories.length > 0" class="pl-2">
			<li v-for="cat in categories" :key="cat._id || cat.name" class="mb-2 w-fit">
				<div class="flex items-center text-lg font-semibold text-gray-700 dark:text-gray-200">
					<!-- 折叠/展开图标 -->
					<i
						v-if="cat.children && cat.children.length"
						:class="[
							'bi mr-1 text-xs cursor-pointer text-gray-500 dark:text-gray-400 transition-transform duration-300 hover:text-blue-500',
							isExpanded(cat._id as string) ? 'bi-chevron-down' : 'bi-chevron-right',
						]"
						@click.stop="toggleExpand(cat._id as string)" />
					<!-- 分类图标和名称 -->
					<div
						class="flex cursor-pointer items-center flex-1"
						@click="handleCategoryClick(cat._id as string)">
						<i class="bi bi-folder-fill text-blue-400 mr-2" />
						<span class="duration-300 hover:text-blue-500">{{ cat.name }}</span>
						<span class="ml-2 text-xs text-gray-400">({{ cat.articleCount || 0 }})</span>
					</div>
				</div>
				<!-- 二级分类列表（根据折叠状态显示/隐藏） -->
				<Transition name="slide-fade">
					<ul
						v-if="cat.children && cat.children.length && isExpanded(cat._id as string)"
						class="pl-7 mt-1">
						<li
							:key="sub._id || sub.name"
							v-for="sub in cat.children"
							class="flex items-center text-base text-gray-600 cursor-pointer dark:text-gray-400 mb-1 duration-300 hover:translate-x-1"
							@click="handleSubCategoryClick(cat._id as string, sub._id as string)">
							<i class="bi bi-folder2-open text-green-400 mr-2" />
							<span>{{ sub.name }}</span>
							<span class="ml-2 text-xs text-gray-400">({{ sub.articleCount || 0 }})</span>
						</li>
					</ul>
				</Transition>
			</li>
		</ul>

		<!-- 空状态 -->
		<div v-else class="flex flex-col items-center justify-center py-4">
			<el-icon class="text-4xl text-gray-400 mb-2">
				<Document />
			</el-icon>
			<p class="text-gray-500 dark:text-gray-400 text-sm">暂无分类</p>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { Loading, Document } from '@element-plus/icons-vue';

const categoryStore = useCategoryStore();
const router = useRouter();

const categories = computed(() => categoryStore.categories);

// 折叠状态管理（使用 Map 存储每个分类的展开/折叠状态）
const expandedCategories = ref<Map<string, boolean>>(new Map());

// 检查分类是否展开
const isExpanded = (categoryId: string): boolean => {
	return expandedCategories.value.get(categoryId) ?? false; // 默认折叠
};

// 切换折叠/展开状态
const toggleExpand = (categoryId: string): void => {
	const currentState = expandedCategories.value.get(categoryId) ?? false;
	expandedCategories.value.set(categoryId, !currentState);
};

// 处理一级分类点击
const handleCategoryClick = (categoryId: string): void => {
	router.push({
		path: '/article/category',
		query: {
			primary: categoryId,
		},
	});
};

// 处理二级分类点击
const handleSubCategoryClick = (categoryId: string, subCategoryId: string): void => {
	router.push({
		path: '/article/category',
		query: {
			primary: categoryId,
			secondary: subCategoryId,
		},
	});
};

// 初始化加载分类列表
await categoryStore.loadCategories();
onMounted(async () => {
	// 默认折叠所有分类
	categories.value.forEach((cat) => {
		if (cat._id && cat.children && cat.children.length > 0) {
			expandedCategories.value.set(cat._id as string, false);
		}
	});
});

// 监听分类列表变化，初始化折叠状态
watch(
	categories,
	(newCategories) => {
		newCategories.forEach((cat) => {
			if (cat._id && cat.children && cat.children.length > 0) {
				// 如果还没有设置过状态，默认折叠
				if (!expandedCategories.value.has(cat._id as string)) {
					expandedCategories.value.set(cat._id as string, false);
				}
			}
		});
	},
	{ deep: true }
);
</script>

<style lang="scss" scoped>
// 折叠/展开动画
.slide-fade-enter-active {
	transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
	transition: all 0.3s ease-in;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
	opacity: 0;
	transform: translateY(-10px);
}
</style>
