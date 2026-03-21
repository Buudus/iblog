<template>
	<div>
		<div class="w-full h-[90%]">
			<RichTable
				:fields="field"
				:data="tableData"
				@on-add="handleAdd"
				:loading="loadingStatus"
				@on-search="t_handleSearch"
				@on-delete="handleDeleteMany"
				@on-selection-change="handleSelectionChange">
				<el-table-column label="操作" fixed="right">
					<template #default="scope">
						<el-button link type="primary" size="small" @click="handleView(scope.row)">
							查看
						</el-button>
						<el-button link type="primary" size="small" @click="handleEdit(scope.row)">
							编辑
						</el-button>
						<el-button link type="danger" size="small" @click="handleDelete(scope.row)">
							删除
						</el-button>
					</template>
				</el-table-column>
			</RichTable>
		</div>

		<!-- 添加对话框 -->
		<ElsDialog v-model="addDialogVisible" title="添加">
			<SiteInfoForm
				ref="addFormRef"
				v-model="addForm"
				@upload="(file, field) => handleUploadFile(file, field, 'add')" />
			<template #footer>
				<div class="flex items-center justify-end">
					<el-button @click="handleCancelAdd">取消</el-button>
					<el-button type="primary" @click="t_handleConfirmAdd">确认</el-button>
				</div>
			</template>
		</ElsDialog>

		<!-- 编辑对话框 -->
		<ElsDialog v-model="editDialogVisible" title="编辑">
			<SiteInfoForm
				ref="editFormRef"
				v-model="editForm"
				@upload="(file, field) => handleUploadFile(file, field, 'edit')" />
			<template #footer>
				<div class="flex items-center justify-end">
					<el-button @click="handleCancelEdit">取消</el-button>
					<el-button type="primary" @click="t_handleConfirmEdit">确认</el-button>
				</div>
			</template>
		</ElsDialog>

		<!-- 查看对话框 -->
		<ElsDialog v-model="viewDialogVisible" title="查看">
			<SiteInfoView :data="currentView" />
		</ElsDialog>

		<!-- 分页 -->
		<div class="flex items-center justify-between py-2">
			<div class="mr-2 flex items-center">
				<el-text type="info" size="small">选中：{{ selected.length }} 项</el-text>
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

<script name="SiteInfo" lang="ts" setup>
import type { SiteInfo } from '~/api';
import { useSiteInfo } from '~/composables/useSiteInfo';
import SiteInfoForm from './components/SiteInfoForm/index.vue';
import SiteInfoView from './components/SiteInfoView/index.vue';
import type { TableField } from '~/components/RichTable/types';

// 字段配置
const field: TableField[] = [
	{ type: 'text', label: 'ID', prop: '_id' },
	{ type: 'image', label: 'LOGO', prop: 'logo' },
	{ type: 'text', label: '标题', prop: 'title' },
	{ type: 'link', label: '域名', prop: 'domain' },
	{ type: 'text', label: '关键词', prop: 'keywords' },
	{ type: 'text', label: '描述', prop: 'description' },
	{ type: 'text', label: '全局样式', prop: 'globalStyle' },
	{ type: 'text', label: '全局脚本', prop: 'globalScript' },
	{ type: 'tag', label: '是否启用', prop: 'isUse' },
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
	handleCreate,
	handleUpdate,
	handleDelete,
	handleDeleteMany,
	handleUpload,
} = useSiteInfo();

// 表格选择事件
const selected = ref<SiteInfo[]>([]);
const handleSelectionChange = (val: SiteInfo[]): void => {
	selected.value = val;
};

// 搜索（节流）
const t_handleSearch = useThrottle(handleSearch, 1000);

// 添加表单
const addDialogVisible = ref<boolean>(false);
const addFormRef = useTemplateRef<InstanceType<typeof SiteInfoForm>>('addFormRef');
const addForm = reactive<Omit<SiteInfo, '_id' | 'createdAt' | 'updatedAt'>>({
	logo: '',
	title: '',
	domain: '',
	keywords: '',
	description: '',
	globalStyle: '',
	globalScript: '',
	isUse: 'no',
});

const handleAdd = (): void => {
	addDialogVisible.value = true;
};

const handleCancelAdd = (): void => {
	addDialogVisible.value = false;
	addFormRef.value?.resetFields();
};

const handleConfirmAdd = async (): Promise<void> => {
	if (!addFormRef.value) return;
	try {
		await addFormRef.value.validate();
		const success = await handleCreate(addForm);
		if (success) {
			addDialogVisible.value = false;
			addFormRef.value.resetFields();
		}
	} catch {
		// 验证失败，不处理
	}
};
const t_handleConfirmAdd = useThrottle(handleConfirmAdd, 1000);

// 编辑表单
const editDialogVisible = ref<boolean>(false);
const editFormRef = useTemplateRef<InstanceType<typeof SiteInfoForm>>('editFormRef');
const editForm = reactive<Omit<SiteInfo, 'createdAt' | 'updatedAt'>>({
	_id: '',
	logo: '',
	title: '',
	domain: '',
	keywords: '',
	description: '',
	globalStyle: '',
	globalScript: '',
	isUse: 'no',
});

const handleEdit = (row: SiteInfo): void => {
	editDialogVisible.value = true;
	Object.assign(editForm, row);
};

const handleCancelEdit = (): void => {
	editDialogVisible.value = false;
	editFormRef.value?.resetFields();
};

const handleConfirmEdit = async (): Promise<void> => {
	if (!editFormRef.value) return;
	try {
		await editFormRef.value.validate();
		const success = await handleUpdate(editForm);
		if (success) {
			editDialogVisible.value = false;
		}
	} catch {
		// 验证失败，不处理
	}
};
const t_handleConfirmEdit = useThrottle(handleConfirmEdit, 1000);

// 查看详情
const viewDialogVisible = ref<boolean>(false);
const currentView = ref<SiteInfo>({
	_id: '',
	logo: '',
	title: '',
	domain: '',
	keywords: '',
	description: '',
	globalStyle: '',
	globalScript: '',
	isUse: 'no',
	createdAt: '',
	updatedAt: '',
});

const handleView = (row: SiteInfo): void => {
	currentView.value = row;
	viewDialogVisible.value = true;
};

// 文件上传
const handleUploadFile = async (file: File, field: string, type: 'add' | 'edit'): Promise<void> => {
	await handleUpload(file, (url: string) => {
		if (type === 'add') {
			(addForm as Record<string, unknown>)[field] = url;
		} else {
			(editForm as Record<string, unknown>)[field] = url;
		}
	});
};

// 初始化加载数据
await loadTableData();
</script>
