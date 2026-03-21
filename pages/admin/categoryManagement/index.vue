<template>
	<div>
		<!-- 工具栏 -->
		<div class="w-full flex justify-between items-center pb-2 border-b mb-2 dark:border-[#1e293b]">
			<div>
				<el-button icon="EditPen" size="small" type="primary" @click="handleAddParent">
					添加一级分类
				</el-button>
			</div>
		</div>

		<!-- 树形表格 -->
		<div class="w-full h-[95%]">
			<el-table
				:data="tableData"
				:loading="loadingStatus"
				border
				row-key="_id"
				:tree-props="{ children: 'children' }"
				height="750">
				<el-table-column prop="name" label="分类名称" width="200" />
				<el-table-column prop="description" label="分类描述" />
				<el-table-column prop="articleCount" label="文章数量" width="120" align="center">
					<template #default="scope">
						{{ scope.row.articleCount || 0 }}
					</template>
				</el-table-column>
				<el-table-column prop="createdAt" label="创建时间" width="180" />
				<el-table-column prop="updatedAt" label="更新时间" width="180" />
				<el-table-column label="操作" fixed="right" width="200">
					<template #default="scope">
						<el-button link type="primary" size="small" @click="handleView(scope.row)">
							查看
						</el-button>
						<el-button link type="primary" size="small" @click="handleEdit(scope.row)">
							编辑
						</el-button>
						<el-button
							v-if="!scope.row.parentId"
							link
							type="success"
							size="small"
							@click="handleAddSub(scope.row)">
							添加二级分类
						</el-button>
						<el-button link type="danger" size="small" @click="handleDelete(scope.row)">
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<!-- 底部统计信息 -->
		<div class="flex items-center justify-start py-2">
			<el-text type="info" size="small">
				共 {{ categoryStats.total }} 个分类（一级分类：{{
					categoryStats.parentCount
				}}
				个，二级分类：{{ categoryStats.subCount }} 个）
			</el-text>
		</div>

		<!-- 添加一级分类对话框 -->
		<ElsDialog v-model="addParentDialogVisible" title="添加一级分类">
			<CategoryForm ref="addParentFormRef" v-model="addParentForm" :is-sub="false" />
			<template #footer>
				<div class="flex items-center justify-end">
					<el-button @click="addParentDialogVisible = false">取消</el-button>
					<el-button type="primary" @click="handleConfirmAddParent">确认</el-button>
				</div>
			</template>
		</ElsDialog>

		<!-- 添加二级分类对话框 -->
		<ElsDialog v-model="addSubDialogVisible" title="添加二级分类">
			<CategoryForm
				ref="addSubFormRef"
				v-model="addSubForm"
				:is-sub="true"
				:parent-id="currentParentId" />
			<template #footer>
				<div class="flex items-center justify-end">
					<el-button @click="addSubDialogVisible = false">取消</el-button>
					<el-button type="primary" @click="handleConfirmAddSub">确认</el-button>
				</div>
			</template>
		</ElsDialog>

		<!-- 编辑对话框 -->
		<ElsDialog v-model="editDialogVisible" :title="isEditingSub ? '编辑二级分类' : '编辑一级分类'">
			<CategoryForm ref="editFormRef" v-model="editForm" :is-sub="isEditingSub" />
			<template #footer>
				<div class="flex items-center justify-end">
					<el-button @click="editDialogVisible = false">取消</el-button>
					<el-button type="primary" @click="handleConfirmEdit">确认</el-button>
				</div>
			</template>
		</ElsDialog>

		<!-- 查看对话框 -->
		<ElsDialog v-model="viewDialogVisible" :title="isViewingSub ? '查看二级分类' : '查看一级分类'">
			<DataView :data="currentViewAsRecord" :fields="viewFields" />
		</ElsDialog>
	</div>
</template>

<script name="CategoryManagement" lang="ts" setup>
import type { CategoryWithChildren, SubCategoryWithCount } from '~/api';
import { useCategory } from '~/composables/useCategory';
import CategoryForm from './components/CategoryForm/index.vue';
import DataView from '~/components/DataView/index.vue';
import type { ViewField } from '~/components/DataView/index.vue';

// 使用 composable
const {
	tableData,
	loadingStatus,
	loadTableData,
	handleCreateParent,
	handleCreateSub,
	handleUpdateParent,
	handleUpdateSub,
	handleDeleteParent,
	handleDeleteSub,
} = useCategory();

// 查看字段配置
const viewFields: ViewField[] = [
	{ label: '分类名称', prop: 'name', type: 'text' },
	{ label: '分类描述', prop: 'description', type: 'text' },
	{ label: '文章数量', prop: 'articleCount', type: 'text' },
	{ label: '创建时间', prop: 'createdAt', type: 'text' },
	{ label: '更新时间', prop: 'updatedAt', type: 'text' },
];

// 添加一级分类
const addParentDialogVisible = ref<boolean>(false);
const addParentFormRef = useTemplateRef('addParentFormRef');
const addParentForm = ref<{ name: string; description: string }>({
	name: '',
	description: '',
});

const handleAddParent = () => {
	addParentForm.value = { name: '', description: '' };
	addParentDialogVisible.value = true;
};

const handleConfirmAddParent = async () => {
	if (!addParentFormRef.value) return;
	try {
		await addParentFormRef.value.validate();
		const success = await handleCreateParent(addParentForm.value);
		if (success) {
			addParentDialogVisible.value = false;
		}
	} catch {
		// 验证失败，不处理
	}
};

// 添加二级分类
const addSubDialogVisible = ref<boolean>(false);
const addSubFormRef = useTemplateRef<any>('addSubFormRef');
const addSubForm = ref<{ name: string; description: string }>({
	name: '',
	description: '',
});
const currentParentId = ref<string>('');

const handleAddSub = (parent: CategoryWithChildren) => {
	currentParentId.value = parent._id as string;
	addSubForm.value = { name: '', description: '' };
	addSubDialogVisible.value = true;
};

const handleConfirmAddSub = async () => {
	if (!addSubFormRef.value) return;
	try {
		await addSubFormRef.value.validate();
		const success = await handleCreateSub({
			...addSubForm.value,
			parentId: currentParentId.value,
		});
		if (success) {
			addSubDialogVisible.value = false;
		}
	} catch {
		// 验证失败，不处理
	}
};

// 编辑
const editDialogVisible = ref<boolean>(false);
const editFormRef = useTemplateRef<any>('editFormRef');
const editForm = ref<{ _id?: string; name: string; description: string }>({
	name: '',
	description: '',
});
const isEditingSub = ref<boolean>(false);

const handleEdit = (row: CategoryWithChildren | SubCategoryWithCount) => {
	isEditingSub.value = !!(row as SubCategoryWithCount).parentId;
	editForm.value = {
		_id: row._id,
		name: row.name,
		description: row.description,
	};
	editDialogVisible.value = true;
};

const handleConfirmEdit = async () => {
	if (!editFormRef.value) return;
	try {
		await editFormRef.value.validate();
		const formData = editFormRef.value.getFormData
			? editFormRef.value.getFormData()
			: editForm.value;
		const success = isEditingSub.value
			? await handleUpdateSub({
					id: formData._id!,
					name: formData.name,
					description: formData.description,
			  })
			: await handleUpdateParent({
					id: formData._id!,
					name: formData.name,
					description: formData.description,
			  });
		if (success) {
			editDialogVisible.value = false;
		}
	} catch {
		// 验证失败，不处理
	}
};

// 删除
const handleDelete = (row: CategoryWithChildren | SubCategoryWithCount) => {
	if ((row as SubCategoryWithCount).parentId) {
		handleDeleteSub(row as SubCategoryWithCount);
	} else {
		handleDeleteParent(row as CategoryWithChildren);
	}
};

// 查看
const viewDialogVisible = ref<boolean>(false);
const currentView = ref<any>({});
const isViewingSub = ref<boolean>(false);

// 将 currentView 转换为 Record<string, unknown> 类型
const currentViewAsRecord = computed(() => currentView.value as any as Record<string, any>);

const handleView = (row: CategoryWithChildren | SubCategoryWithCount) => {
	isViewingSub.value = !!(row as SubCategoryWithCount).parentId;
	currentView.value = {
		...row,
		articleCount: row.articleCount || 0,
	};
	viewDialogVisible.value = true;
};

// 统计分类数量
const categoryStats = computed(() => {
	const parentCount = tableData.value.length;
	let subCount = 0;
	tableData.value.forEach((category: CategoryWithChildren) => {
		if (category.children && Array.isArray(category.children)) {
			subCount += category.children.length;
		}
	});
	return {
		parentCount,
		subCount,
		total: parentCount + subCount,
	};
});

// 初始化加载数据
onMounted(() => {
	loadTableData();
});
</script>
