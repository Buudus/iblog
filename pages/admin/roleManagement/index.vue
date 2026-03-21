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
				<el-table-column label="操作" fixed="right" width="180">
					<template #default="scope">
						<el-button link type="primary" size="small" @click="handleView(scope.row)">
							查看
						</el-button>
						<el-button link type="primary" size="small" @click="handleEdit(scope.row)">
							编辑
						</el-button>
						<el-button
							link
							type="danger"
							size="small"
							:disabled="scope.row.name === 'admin'"
							@click="handleDelete(scope.row)">
							删除
						</el-button>
					</template>
				</el-table-column>
			</RichTable>
		</div>

		<!-- 添加对话框 -->
		<ElsDialog v-model="addDialogVisible" title="添加权限">
			<RoleForm ref="addFormRef" v-model="addForm" />
			<template #footer>
				<div class="flex items-center justify-end gap-2">
					<el-button @click="handleCancelAdd">取消</el-button>
					<el-button type="primary" @click="t_handleConfirmAdd">确认</el-button>
				</div>
			</template>
		</ElsDialog>

		<!-- 编辑对话框 -->
		<ElsDialog v-model="editDialogVisible" title="编辑权限">
			<RoleForm ref="editFormRef" v-model="editForm" :name-readonly="true" />
			<template #footer>
				<div class="flex items-center justify-end gap-2">
					<el-button @click="handleCancelEdit">取消</el-button>
					<el-button type="primary" @click="t_handleConfirmEdit">确认</el-button>
				</div>
			</template>
		</ElsDialog>

		<!-- 查看对话框 -->
		<ElsDialog v-model="viewDialogVisible" title="查看权限">
			<RoleView :data="currentView" />
		</ElsDialog>

		<!-- 分页 -->
		<div class="flex items-center justify-between py-2">
			<div class="mr-2 flex items-center">
				<el-text type="info" size="small">选中：{{ selected.length }} 项</el-text>
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

<script name="RoleManagement" lang="ts" setup>
import type { AdminRole } from '~/api';
import { useRole } from '~/composables/useRole';
import RoleForm from './components/RoleForm/index.vue';
import RoleView from './components/RoleView/index.vue';
import type { TableField } from '~/components/RichTable/types';

// 表格列配置
const field: TableField[] = [
	{ type: 'text', label: '权限名称', prop: 'name' },
	{ type: 'text', label: '描述', prop: 'description' },
	{ type: 'text', label: '创建时间', prop: 'createdAt' },
	{ type: 'text', label: '更新时间', prop: 'updatedAt' },
];

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
} = useRole();

const selected = ref<AdminRole[]>([]);
const handleSelectionChange = (val: AdminRole[]): void => {
	selected.value = val;
};

const t_handleSearch = useThrottle(handleSearch, 1000);

// 添加
const addDialogVisible = ref<boolean>(false);
const addFormRef = useTemplateRef<InstanceType<typeof RoleForm>>('addFormRef');
const addForm = reactive<Pick<AdminRole, 'name' | 'description'>>({
	name: '',
	description: '',
});

const handleAdd = (): void => {
	addForm.name = '';
	addForm.description = '';
	addDialogVisible.value = true;
};

const handleCancelAdd = (): void => {
	addDialogVisible.value = false;
	addFormRef.value?.resetFields();
	addForm.name = '';
	addForm.description = '';
};

const handleConfirmAdd = async (): Promise<void> => {
	if (!addFormRef.value) return;
	const valid = await addFormRef.value.validate();
	if (!valid) return;
	const payload = addFormRef.value.getFormData();
	const success = await handleCreate(payload);
	if (success) {
		addDialogVisible.value = false;
		addFormRef.value.resetFields();
		addForm.name = '';
		addForm.description = '';
	}
};
const t_handleConfirmAdd = useThrottle(handleConfirmAdd, 1000);

// 编辑
const editDialogVisible = ref<boolean>(false);
const editFormRef = useTemplateRef<InstanceType<typeof RoleForm>>('editFormRef');
const editForm = reactive<Pick<AdminRole, 'name' | 'description'>>({
	name: '',
	description: '',
});

const handleEdit = (row: AdminRole): void => {
	editForm.name = row.name;
	editForm.description = row.description ?? '';
	editDialogVisible.value = true;
};

const handleCancelEdit = (): void => {
	editDialogVisible.value = false;
	editFormRef.value?.resetFields();
};

const handleConfirmEdit = async (): Promise<void> => {
	if (!editFormRef.value) return;
	const valid = await editFormRef.value.validate();
	if (!valid) return;
	const payload = editFormRef.value.getFormData();
	const success = await handleUpdate(payload);
	if (success) {
		editDialogVisible.value = false;
	}
};
const t_handleConfirmEdit = useThrottle(handleConfirmEdit, 1000);

// 查看
const viewDialogVisible = ref<boolean>(false);
const currentView = ref<AdminRole>({
	name: '',
	description: '',
});

const handleView = (row: AdminRole): void => {
	currentView.value = { ...row };
	viewDialogVisible.value = true;
};

await loadTableData();
</script>
