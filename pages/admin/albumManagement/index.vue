<template>
	<div>
		<div class="w-full h-[90%]">
			<RichTable
				:fields="field"
				:data="tableData"
				:loading="loadingStatus"
				@on-add="handleAdd"
				@on-search="t_handleSearch"
				@on-delete="handleDeleteMany"
				@on-selection-change="handleSelectionChange">
				<template #filter-r>
					<el-text type="success" size="small" class="ml-4">
						总大小：{{ formatFileSize(totalSize) }}
					</el-text>
				</template>
				<!-- 图片预览列 -->
				<el-table-column label="图片" width="120" align="center">
					<template #default="{ row }">
						<el-image
							:src="row.url"
							:preview-src-list="[row.url]"
							fit="cover"
							style="width: 80px; height: 80px; border-radius: 4px"
							:preview-teleported="true" />
					</template>
				</el-table-column>
				<!-- 标签列 -->
				<el-table-column label="标签" prop="tags" width="200">
					<template #default="{ row }">
						<el-tag v-for="tag in row.tags" :key="tag" size="small" class="mr-1 mb-1">
							{{ tag }}
						</el-tag>
						<span v-if="!row.tags || row.tags.length === 0" class="text-gray-400 text-sm">
							无标签
						</span>
					</template>
				</el-table-column>
				<!-- 操作列 -->
				<el-table-column label="操作" fixed="right" width="120">
					<template #default="scope">
						<el-button link type="primary" size="small" @click="handleView(scope.row)">
							查看
						</el-button>
						<el-button link type="danger" size="small" @click="handleDelete(scope.row)">
							删除
						</el-button>
					</template>
				</el-table-column>
			</RichTable>
		</div>

		<!-- 添加对话框 -->
		<ElsDialog v-model="addDialogVisible" title="上传照片" width="600px">
			<PhotoAlbumUploadForm ref="addFormRef" v-model="addForm" @upload="handleUpload" />
			<!-- 上传进度 -->
			<div v-if="uploading" class="upload-progress mt-4">
				<el-progress :percentage="uploadProgress" :status="uploadStatus" />
				<p class="text-center mt-2 text-gray-500">{{ uploadMessage }}</p>
			</div>
			<template #footer>
				<div class="flex items-center justify-end">
					<el-button @click="handleCancelAdd">取消</el-button>
					<el-button type="primary" :loading="uploading" @click="handleConfirmAdd">
						上传
					</el-button>
				</div>
			</template>
		</ElsDialog>

		<!-- 查看对话框 -->
		<ElsDialog v-model="viewDialogVisible" title="查看相册">
			<div class="space-y-4">
				<div>
					<el-image
						:src="currentView.url"
						:preview-src-list="[currentView.url]"
						fit="contain"
						style="width: 100%; max-height: 400px"
						:preview-teleported="true" />
				</div>
				<div>
					<el-text type="info" size="small">标题：</el-text>
					<el-text>{{ currentView.title }}</el-text>
				</div>
				<div>
					<el-text type="info" size="small">描述：</el-text>
					<el-text>{{ currentView.description || '无描述' }}</el-text>
				</div>
				<div>
					<el-text type="info" size="small">标签：</el-text>
					<div class="mt-2">
						<el-tag v-for="tag in currentView.tags" :key="tag" size="small" class="mr-2 mb-2">
							{{ tag }}
						</el-tag>
						<span v-if="!currentView.tags || currentView.tags.length === 0" class="text-gray-400">
							无标签
						</span>
					</div>
				</div>
				<div>
					<el-text type="info" size="small">URL：</el-text>
					<el-text class="break-all">{{ currentView.url }}</el-text>
				</div>
				<div>
					<el-text type="info" size="small">创建时间：</el-text>
					<el-text>{{ currentView.createdAt || '-' }}</el-text>
				</div>
				<div>
					<el-text type="info" size="small">更新时间：</el-text>
					<el-text>{{ currentView.updatedAt || '-' }}</el-text>
				</div>
			</div>
		</ElsDialog>

		<!-- 分页 -->
		<div class="flex items-center justify-between py-2">
			<div class="mr-2 flex items-center">
				<el-text type="info" size="small">选中：{{ selected.length }} 项</el-text>
				<el-text type="info" size="small" class="ml-4"> 共 {{ total }} 条记录 </el-text>
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

<script name="AlbumManagement" lang="ts" setup>
import type { PhotoAlbum } from '~/api';
import { usePhotoAlbum } from '~/composables/usePhotoAlbum';
import PhotoAlbumUploadForm from './components/PhotoAlbumUploadForm/index.vue';
import type { TableField } from '~/components/RichTable/types';
import type { UploadRawFile } from 'element-plus';

// 字段配置
const field: TableField[] = [
	{ type: 'text', label: 'ID', prop: '_id', visibled: false },
	{ type: 'text', label: '标题', prop: 'title' },
	{ type: 'text', label: '描述', prop: 'description' },
	{ type: 'text', label: '标签', prop: 'tags', visibled: false },
	{ type: 'text', label: '创建时间', prop: 'createdAt' },
	{ type: 'text', label: '更新时间', prop: 'updatedAt' },
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
	handleDelete,
	handleDeleteMany,
	uploading,
	uploadProgress,
	uploadStatus,
	uploadMessage,
	handleUpload: uploadPhotos,
	totalSize,
	formatFileSize,
} = usePhotoAlbum();

// 表格选择事件
const selected = ref<PhotoAlbum[]>([]);
const handleSelectionChange = (val: PhotoAlbum[]): void => {
	selected.value = val;
};

// 搜索（节流）
const t_handleSearch = useThrottle(handleSearch, 1000);

// 添加表单
const addDialogVisible = ref<boolean>(false);
const addFormRef = useTemplateRef<InstanceType<typeof PhotoAlbumUploadForm>>('addFormRef');
const addForm = ref<{
	title?: string;
	description?: string;
	tags?: string[];
	files?: UploadRawFile[];
}>({});

const handleAdd = (): void => {
	addDialogVisible.value = true;
};

const handleCancelAdd = (): void => {
	addDialogVisible.value = false;
	addFormRef.value?.resetFields();
};

const handleConfirmAdd = async (): Promise<void> => {
	if (!addFormRef.value) return;
	await addFormRef.value.triggerUpload();
};

const handleUpload = async (
	files: UploadRawFile[],
	title: string,
	description: string,
	tags: string[]
): Promise<void> => {
	await uploadPhotos(files, title, description, tags, () => {
		// 上传成功后关闭对话框
		setTimeout(() => {
			addDialogVisible.value = false;
			addFormRef.value?.resetFields();
		}, 2000);
	});
};

// 查看详情
const viewDialogVisible = ref<boolean>(false);
const currentView = ref<PhotoAlbum>({
	_id: '',
	title: '',
	url: '',
	path: '',
	description: '',
	tags: [],
	createdAt: '',
	updatedAt: '',
});

const handleView = (row: PhotoAlbum): void => {
	currentView.value = row;
	viewDialogVisible.value = true;
};

// 初始化加载数据
onMounted(() => {
	loadTableData();
});
</script>

<style lang="scss" scoped>
.upload-progress {
	padding: 16px;
	background-color: #f5f7fa;
	border-radius: 4px;
}
</style>
