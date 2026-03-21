<template>
	<div>
		<div class="w-full h-[90%]">
			<RichTable
				:fields="field"
				:data="tableData"
				:loading="loadingStatus"
				@on-add="$router.push('/admin/fileMenagement/uploadFile')"
				@on-search="t_handleSearch"
				@on-delete="(rows) => handleDeleteMany(rows, 'image')"
				@on-selection-change="handleSelectionChange">
				<template #filter-r>
					<el-text type="success" size="small" class="ml-4">
						总大小：{{ formatFileSize(totalSize) }}
					</el-text>
				</template>
				<!-- ID列 -->
				<el-table-column label="ID" prop="id" width="120" align="center">
					<template #default="{ row }">
						<span class="truncate" :title="row.id || row._id">
							{{ row.id || row._id || '-' }}
						</span>
					</template>
				</el-table-column>
				<!-- 预览列 -->
				<el-table-column label="预览" width="120" align="center">
					<template #default="{ row }">
						<el-image
							:src="row.url"
							:preview-src-list="[row.url]"
							fit="cover"
							class="w-16 h-16 cursor-pointer"
							preview-teleported />
					</template>
				</el-table-column>
				<!-- 原文件名列 -->
				<el-table-column label="原文件名" prop="originalName" min-width="200">
					<template #default="{ row }">
						<span class="truncate" :title="row.originalName || '-'">
							{{ row.originalName || '-' }}
						</span>
					</template>
				</el-table-column>
				<!-- 文件名列 -->
				<el-table-column label="文件名" prop="name" min-width="200">
					<template #default="{ row }">
						<span class="truncate" :title="row.name || '-'">
							{{ row.name || '-' }}
						</span>
					</template>
				</el-table-column>
				<!-- MD5列 -->
				<el-table-column label="MD5" prop="md5" width="200" align="center">
					<template #default="{ row }">
						<span class="truncate" :title="row.md5 || '-'">
							{{ row.md5 || '-' }}
						</span>
					</template>
				</el-table-column>
				<!-- 文件类型列 -->
				<el-table-column label="文件类型" prop="mimetype" width="150" align="center">
					<template #default="{ row }">
						{{ row.mimetype || row.type || '-' }}
					</template>
				</el-table-column>
				<!-- 文件大小列 -->
				<el-table-column label="文件大小" width="120" align="center">
					<template #default="{ row }">
						{{ formatFileSize(row.size) }}
					</template>
				</el-table-column>
				<!-- 上传时间列 -->
				<el-table-column label="上传时间" prop="createdAt" width="180" align="center">
					<template #default="{ row }">
						{{ row.createdAt || '-' }}
					</template>
				</el-table-column>
				<!-- 操作列 -->
				<el-table-column label="操作" fixed="right" width="150">
					<template #default="scope">
						<el-button type="primary" link size="small" @click="copyToClipboard(scope.row.url)">
							复制链接
						</el-button>
						<el-button type="danger" link size="small" @click="handleDelete(scope.row, 'image')">
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
				<el-text type="info" size="small" class="ml-4"> 共 {{ total }} 张图片 </el-text>
			</div>
			<el-scrollbar>
				<ElsPagination
					:total="total"
					:page-size="pageSize"
					:current-page="currentPage"
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange" />
			</el-scrollbar>
		</div>
	</div>
</template>

<script name="ImageFile" lang="ts" setup>
import { useFile, type ExtendedFileView } from '~/composables/useFile';
import type { TableField } from '~/components/RichTable/types';

// 字段配置（设置为不可见，因为我们手动定义了所有列）
const field: TableField[] = [
	{ type: 'text', label: '文件名', prop: 'name', width: 200, visibled: false },
	{ type: 'text', label: '文件类型', prop: 'mimetype', width: 150, visibled: false },
	{ type: 'text', label: '上传时间', prop: 'createdAt', width: 180, visibled: false },
];

// 使用 composable
const {
	tableData,
	loadingStatus,
	total,
	pageSize,
	currentPage,
	totalSize,
	loadImageList,
	handleSearch,
	handleCurrentChange: changePage,
	handleSizeChange: changeSize,
	handleDelete,
	handleDeleteMany,
	formatFileSize,
} = useFile();

// 表格选择事件
const selected = ref<ExtendedFileView[]>([]);
const handleSelectionChange = (val: ExtendedFileView[]): void => {
	selected.value = val;
};

// 搜索（节流）
const t_handleSearch = useThrottle((keyword: string) => handleSearch(keyword, 'image'), 1000);

// 分页变化
const handleCurrentChange = async (page: number): Promise<void> => {
	await changePage(page, 'image');
};

const handleSizeChange = async (size: number): Promise<void> => {
	await changeSize(size, 'image');
};

// 初始化加载数据
onMounted(() => {
	loadImageList();
});
</script>

<style lang="scss" scoped></style>
