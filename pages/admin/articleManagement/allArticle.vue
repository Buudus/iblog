<template>
	<div>
		<div class="w-full h-[90%]">
			<RichTable
				:fields="field"
				:data="tableData"
				:loading="loadingStatus"
				@on-add="$router.push('/admin/articleManagement/publishArticle')"
				@on-search="t_handleSearch"
				@on-delete="handleDeleteMany"
				@on-selection-change="handleSelectionChange">
				<!-- 作者列 -->
				<el-table-column label="作者" align="center">
					<template #default="scope">
						<span>{{ getAuthorName(scope.row.author) }}</span>
					</template>
				</el-table-column>
				<!-- 一级分类列 -->
				<el-table-column label="一级分类" align="center">
					<template #default="scope">
						<span>{{ getCategoryName(scope.row.category) || '未分类' }}</span>
					</template>
				</el-table-column>
				<!-- 二级分类列 -->
				<el-table-column label="二级分类" align="center">
					<template #default="scope">
						<span>{{ getSubCategoryName(scope.row.subCategory) || '-' }}</span>
					</template>
				</el-table-column>
				<!-- 状态列 -->
				<el-table-column label="状态" align="center">
					<template #default="scope">
						<el-tag :type="scope.row.isPublished ? 'success' : 'info'">
							{{ scope.row.isPublished ? '已发布' : '草稿' }}
						</el-tag>
					</template>
				</el-table-column>
				<!-- 创建时间列 -->
				<el-table-column label="创建时间" align="center">
					<template #default="scope">
						<span>{{ scope.row.createdAt || '-' }}</span>
					</template>
				</el-table-column>
				<!-- 更新时间列 -->
				<el-table-column label="更新时间" align="center">
					<template #default="scope">
						<span>{{ scope.row.updatedAt || '-' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" fixed="right">
					<template #default="scope">
						<el-button link type="primary" size="small" @click="handleView(scope.row)">
							查看
						</el-button>
						<el-button link type="primary" size="small" @click="handleEdit(scope.row)">
							编辑
						</el-button>
						<el-button
							v-if="!scope.row.isPublished"
							link
							type="success"
							size="small"
							@click="handlePublishSingle(scope.row)">
							发布
						</el-button>
						<el-button link type="danger" size="small" @click="handleDelete(scope.row)">
							删除
						</el-button>
					</template>
				</el-table-column>
			</RichTable>
		</div>

		<!-- 分页 -->
		<div class="flex items-center justify-between py-2">
			<div class="mr-2 flex items-center">
				<el-text type="info" size="small">选中：{{ selected.length }} 项</el-text>
				<el-text type="info" size="small" class="ml-4"> 共 {{ total }} 篇文章 </el-text>
			</div>
			<el-scrollbar>
				<ElsPagination
					:total="total"
					:pageSize="pageSize"
					:currentPage="currentPage"
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange" />
			</el-scrollbar>
		</div>
	</div>
</template>

<script name="AllArticle" lang="ts" setup>
import { useArticle } from '~/composables/useArticle';
import type { Article } from '~/composables/useArticle';
import type { TableField } from '~/components/RichTable/types';

// 字段配置
const field: TableField[] = [
	{ type: 'image', label: '封面', prop: 'cover', width: 100 },
	{ type: 'text', label: '标题', prop: 'title' },
	{ type: 'tag', label: '标签', prop: 'tags', width: 200 },
	{ type: 'text', label: '浏览量', prop: 'views', width: 100 },
	{ type: 'text', label: '点赞量', prop: 'likes', width: 100 },
];

// 使用 composable
const {
	tableData,
	loadingStatus,
	total,
	pageSize,
	currentPage,
	loadTableData,
	handleSearch,
	handleCurrentChange,
	handleSizeChange,
	handleUpdate,
	handleDelete,
	handleDeleteMany,
} = useArticle();

// 表格选择事件
const selected = ref<Article[]>([]);
const handleSelectionChange = (val: Article[]): void => {
	selected.value = val;
};

// 搜索处理（RichTable的搜索事件）
const t_handleSearch = async (keyword: string): Promise<void> => {
	await handleSearch(keyword);
};

// 编辑
const router = useRouter();
const handleEdit = (row: Article) => {
	router.push(`/admin/articleManagement/editArticle/${row._id}`);
};

// 查看
const handleView = (row: Article) => {
	router.push(`/article/${row._id}`);
};

// 发布单个文章
const handlePublishSingle = async (row: Article) => {
	const success = await handleUpdate({
		id: row._id,
		isPublished: true,
	});
	if (success) {
		await loadTableData();
	}
};

// 获取作者昵称
const getAuthorName = (author: unknown): string => {
	if (!author) return '未知';
	if (typeof author === 'string') return '未知';
	if (typeof author === 'object' && author !== null) {
		const authorObj = author as { nickname?: string; username?: string };
		if (authorObj.nickname) return authorObj.nickname;
		if (authorObj.username) return authorObj.username;
	}
	return '未知';
};

// 获取一级分类名称
const getCategoryName = (category: unknown): string => {
	if (!category) return '';
	if (typeof category === 'object' && category !== null) {
		const catObj = category as { name?: string };
		if (catObj.name) return catObj.name;
	}
	if (typeof category === 'string') {
		return category;
	}
	return '';
};

// 获取二级分类名称
const getSubCategoryName = (subCategory: unknown): string => {
	if (!subCategory) return '';
	if (typeof subCategory === 'object' && subCategory !== null) {
		const subObj = subCategory as { name?: string };
		if (subObj.name) return subObj.name;
	}
	if (typeof subCategory === 'string') {
		return subCategory;
	}
	return '';
};

// 初始化加载数据
onMounted(() => {
	loadTableData();
});
</script>
