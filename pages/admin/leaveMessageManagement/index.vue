<template>
	<div>
		<div class="w-full h-[90%]">
			<RichTable
				:fields="field"
				:data="tableData"
				:loading="loadingStatus"
				@on-search="t_handleSearch"
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
		<ElsDialog v-model="viewDialogVisible" title="查看留言">
			<LeaveMessageView :data="currentView" />
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

<script name="LeaveMessageManagement" lang="ts" setup>
import type { LeaveMessage } from '~/api';
import { useLeaveMessage } from '~/composables/useLeaveMessage';
import LeaveMessageView from './components/LeaveMessageView/index.vue';
import type { TableField } from '~/components/RichTable/types';

// 字段配置
const field: TableField[] = [
	{ type: 'text', label: 'ID', prop: '_id' },
	{ type: 'text', label: '联系人', prop: 'concat' },
	{ type: 'text', label: '留言内容', prop: 'content' },
	{ type: 'text', label: 'IP 地址', prop: 'ip' },
	{ type: 'text', label: 'UserAgent', prop: 'userAgent' },
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
} = useLeaveMessage();

// 表格选择事件
const selected = ref<LeaveMessage[]>([]);
const handleSelectionChange = (val: LeaveMessage[]): void => {
	selected.value = val;
};

// 搜索（节流）
const t_handleSearch = useThrottle(handleSearch, 1000);

// 查看详情
const viewDialogVisible = ref<boolean>(false);
const currentView = ref<LeaveMessage>({
	_id: '',
	concat: '',
	content: '',
	ip: '',
	userAgent: '',
	createdAt: '',
	updatedAt: '',
});

const handleView = (row: LeaveMessage): void => {
	currentView.value = row;
	viewDialogVisible.value = true;
};

// 初始化加载数据
await loadTableData();
</script>
