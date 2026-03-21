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
				<template #filter-r>
					<NuxtLink to="/admin/roleManagement">
						<el-button type="primary" size="small" icon="key">权限管理</el-button>
					</NuxtLink>
				</template>
				<el-table-column label="操作" fixed="right" width="200">
					<template #default="scope">
						<el-button link type="primary" size="small" @click="handleView(scope.row)">
							查看
						</el-button>
						<el-button
							link
							type="primary"
							size="small"
							@click="handleEdit(scope.row)"
							v-if="scope.row.username !== 'admin'">
							编辑
						</el-button>
						<el-button
							v-if="scope.row.username !== 'admin'"
							link
							type="warning"
							size="small"
							@click="handleResetPasswordClick(scope.row)">
							重置密码
						</el-button>
						<el-button
							v-if="scope.row.username !== 'admin'"
							link
							type="danger"
							size="small"
							@click="handleDelete(scope.row)">
							删除
						</el-button>
					</template>
				</el-table-column>
			</RichTable>
		</div>

		<!-- 添加对话框 -->
		<ElsDialog v-model="addDialogVisible" title="添加用户">
			<AdminUserForm
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
		<ElsDialog v-model="editDialogVisible" title="编辑用户">
			<AdminUserForm
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
		<ElsDialog v-model="viewDialogVisible" title="查看用户">
			<AdminUserView :data="currentView" />
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

<script name="AdminUser" lang="ts" setup>
import md5 from 'md5';
import type { AdminUser } from '~/api';
import { ElMessageBox } from 'element-plus';
import { useAdminUser } from '~/composables/useAdminUser';
import type { TableField } from '~/components/RichTable/types';
import AdminUserForm from './components/AdminUserForm/index.vue';
import AdminUserView from './components/AdminUserView/index.vue';

// 字段配置
const field: TableField[] = [
	{ type: 'text', label: 'ID', prop: '_id' },
	{ type: 'image', label: '头像', prop: 'avatar' },
	{ type: 'text', label: '用户名', prop: 'username' },
	{ type: 'text', label: '昵称', prop: 'nickname' },
	{ type: 'tag', label: '角色', prop: 'role' },
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
	handleResetPassword: resetPassword,
} = useAdminUser();

// 表格选择事件
const selected = ref<AdminUser[]>([]);
const handleSelectionChange = (val: AdminUser[]): void => {
	selected.value = val;
};

// 搜索（节流）
const t_handleSearch = useThrottle(handleSearch, 1000);

// 添加表单
const addDialogVisible = ref<boolean>(false);
const addFormRef = useTemplateRef<InstanceType<typeof AdminUserForm>>('addFormRef');
const addForm = reactive<
	Omit<AdminUser, '_id' | 'createdAt' | 'updatedAt' | 'password'> & { password: string }
>({
	username: '',
	nickname: '',
	avatar: '',
	role: '',
	password: '',
});

const handleAdd = (): void => {
	addDialogVisible.value = true;
};

const handleCancelAdd = (): void => {
	addDialogVisible.value = false;
	addFormRef.value?.resetFields();
	Object.assign(addForm, {
		username: '',
		nickname: '',
		avatar: '',
		role: '',
		password: '',
	});
};

const handleConfirmAdd = async (): Promise<void> => {
	if (!addFormRef.value) return;
	try {
		await addFormRef.value.validate();
		const success = await handleCreate({
			...addForm,
			password: md5(addForm.password),
		});
		if (success) {
			addDialogVisible.value = false;
			addFormRef.value.resetFields();
			Object.assign(addForm, {
				username: '',
				nickname: '',
				avatar: '',
				role: '',
				password: '',
			});
		}
	} catch {
		// 验证失败，不处理
	}
};
const t_handleConfirmAdd = useThrottle(handleConfirmAdd, 1000);

// 编辑表单
const editDialogVisible = ref<boolean>(false);
const editFormRef = useTemplateRef<InstanceType<typeof AdminUserForm>>('editFormRef');
const editForm = reactive<Omit<AdminUser, 'createdAt' | 'updatedAt' | 'password'>>({
	_id: '',
	username: '',
	nickname: '',
	avatar: '',
	role: '',
});

const handleEdit = (row: AdminUser): void => {
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
		// 从表单组件获取最新的表单数据
		const latestFormData = editFormRef.value.getFormData
			? editFormRef.value.getFormData()
			: editForm;
		const success = await handleUpdate(latestFormData);
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
const currentView = ref<AdminUser>({
	_id: '',
	username: '',
	nickname: '',
	avatar: '',
	role: '',
	createdAt: '',
	updatedAt: '',
});

const handleView = (row: AdminUser): void => {
	currentView.value = row;
	viewDialogVisible.value = true;
};

// 重置密码
const handleResetPasswordClick = async (row: AdminUser): Promise<void> => {
	await ElMessageBox.confirm(
		`确定要重置用户 "${row.username}" 的密码吗？重置后的密码为 Abc.123987`,
		'警告',
		{
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'warning',
		},
	)
		.then(async () => {
			await resetPassword(row.username);
		})
		.catch(() => {
			// 取消操作
		});
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
