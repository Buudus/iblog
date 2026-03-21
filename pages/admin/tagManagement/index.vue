<template>
	<div>
		<div class="w-full h-[90%]">
			<RichTable
				:fields="field"
				:data="tableData"
				:loading="loadingStatus"
				@on-delete="handleDeleteMany"
				@on-selection-change="handleSelectionChange">
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

		<!-- 查看对话框 -->
		<ElsDialog v-model="viewDialogVisible" title="查看标签">
			<DataView :data="currentViewAsRecord" :fields="viewFields" />
		</ElsDialog>

		<!-- 底部信息 -->
		<div class="flex items-center justify-between py-2">
			<div class="mr-2 flex items-center">
				<el-text type="info" size="small">选中：{{ selected.length }} 项</el-text>
				<el-text type="info" size="small" class="ml-4"> 共 {{ tableData.length }} 个标签 </el-text>
			</div>
		</div>
	</div>
</template>

<script name="TagManagement" lang="ts" setup>
import type { Tag } from '~/api';
import { useTag } from '~/composables/useTag';
import DataView from '~/components/DataView/index.vue';
import type { TableField } from '~/components/RichTable/types';
import type { ViewField } from '~/components/DataView/index.vue';

// 字段配置
const field: TableField[] = [
	{ type: 'tag', label: '标签名称', prop: 'name' },
	{ type: 'text', label: '文章数量', prop: 'count' },
];

// 查看字段配置
const viewFields: ViewField[] = [
	{ label: '标签名称', prop: 'name', type: 'tag' },
	{ label: '文章数量', prop: 'count', type: 'text' },
];

// 使用 composable
const { tableData, loadingStatus, loadTableData, handleDelete, handleDeleteMany } = useTag();

// 表格选择事件
const selected = ref<Tag[]>([]);
const handleSelectionChange = (val: Tag[]): void => {
	selected.value = val;
};

// 查看详情
const viewDialogVisible = ref<boolean>(false);
const currentView = ref<Tag>({
	name: '',
	count: 0,
});

// 将 Tag 转换为 Record<string, unknown> 类型
const currentViewAsRecord = computed(() => currentView.value as any as Record<string, any>);

const handleView = (row: Tag): void => {
	currentView.value = row;
	viewDialogVisible.value = true;
};

// 初始化加载数据
await loadTableData();
</script>

<style lang="scss" scoped>
// 隐藏添加按钮，标签管理不需要新增功能
:deep(.els-table) {
	// 隐藏工具栏中的"添加"按钮（第二个按钮，type为primary）
	> div:nth-child(2) > div:last-child > .el-button[type='primary'] {
		display: none;
	}
}
</style>
