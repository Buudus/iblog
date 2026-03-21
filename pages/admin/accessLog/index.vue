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
				<template #filter-r>
					<el-select
						v-model="statusCode"
						placeholder="筛选状态码"
						clearable
						size="small"
						style="width: 150px; margin-left: 8px"
						@change="handleStatusCodeFilter">
						<el-option label="全部" :value="''" />
						<el-option label="2xx 成功" :value="200" />
						<el-option label="3xx 重定向" :value="300" />
						<el-option label="4xx 客户端错误" :value="400" />
						<el-option label="5xx 服务器错误" :value="500" />
					</el-select>
					<el-button type="danger" size="small" style="margin-left: 8px" @click="handleClear">
						清空日志
					</el-button>
				</template>
				<!-- IP地址列 -->
				<el-table-column label="IP地址" prop="ip" width="150" align="center" />
				<!-- 请求路径列 -->
				<el-table-column label="请求路径" prop="path" min-width="300">
					<template #default="{ row }">
						<span class="truncate" :title="row.path || '-'">
							{{ row.path || '-' }}
						</span>
					</template>
				</el-table-column>
				<!-- 管理员列 -->
				<el-table-column label="管理员" prop="adminId" width="180" align="center">
					<template #default="{ row }">
						<el-tag v-if="row.isAdmin" type="primary" size="small">
							ID：{{ row.adminId || '-' }}
						</el-tag>
						<el-tag v-else type="info" size="small">游客</el-tag>
					</template>
				</el-table-column>
				<!-- 请求方法列 -->
				<el-table-column label="请求方法" prop="method" width="120" align="center">
					<template #default="{ row }">
						<el-tag
							:type="
								row.method === 'GET'
									? 'success'
									: row.method === 'POST'
									? 'primary'
									: row.method === 'PUT'
									? 'warning'
									: row.method === 'DELETE'
									? 'danger'
									: 'info'
							"
							size="small">
							{{ row.method }}
						</el-tag>
					</template>
				</el-table-column>
				<!-- 状态码列 -->
				<el-table-column label="状态码" prop="statusCode" width="120" align="center">
					<template #default="{ row }">
						<el-tag :type="getStatusCodeType(row.statusCode)" size="small">
							{{ row.statusCode }}
						</el-tag>
					</template>
				</el-table-column>
				<!-- UserAgent列 -->
				<el-table-column label="UserAgent" prop="userAgent" min-width="300">
					<template #default="{ row }">
						<span class="truncate" :title="row.userAgent || '-'">
							{{ row.userAgent || '-' }}
						</span>
					</template>
				</el-table-column>
				<!-- 访问信息列 -->
				<el-table-column label="访问信息" prop="regionInfo" min-width="200">
					<template #default="{ row }">
						{{ row.regionInfo || '-' }}
					</template>
				</el-table-column>
				<!-- 创建时间列 -->
				<el-table-column label="访问时间" prop="createdAt" width="180" align="center">
					<template #default="{ row }">
						{{ row.createdAt || '-' }}
					</template>
				</el-table-column>
				<!-- 操作列 -->
				<el-table-column label="操作" fixed="right" width="120">
					<template #default="scope">
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
				<el-text type="info" size="small" class="ml-4"> 共 {{ total }} 条日志 </el-text>
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

<script name="AccessLog" lang="ts" setup>
import type { AccessLog } from '~/api';
import { useAccessLog } from '~/composables/useAccessLog';
import type { TableField } from '~/components/RichTable/types';

// 字段配置（设置为不可见，因为我们手动定义了所有列）
const field: TableField[] = [
	{ type: 'text', label: 'IP地址', prop: 'ip', visibled: false },
	{ type: 'text', label: '请求路径', prop: 'path', visibled: false },
	{ type: 'text', label: '请求方法', prop: 'method', visibled: false },
	{ type: 'text', label: '状态码', prop: 'statusCode', visibled: false },
	{ type: 'text', label: 'UserAgent', prop: 'userAgent', visibled: false },
	{ type: 'text', label: '访问信息', prop: 'regionInfo', visibled: false },
	{ type: 'text', label: '访问时间', prop: 'createdAt', visibled: false },
	{ type: 'text', label: '管理员', prop: 'adminId', visibled: false },
];

// 使用 composable
const {
	tableData,
	loadingStatus,
	total,
	pageSize,
	currentPage,
	statusCode,
	loadTableData,
	handleSearch,
	handleStatusCodeFilter,
	handleCurrentChange,
	handleSizeChange,
	handleDelete,
	handleDeleteMany,
	handleClear,
	getStatusCodeType,
} = useAccessLog();

// 表格选择事件
const selected = ref<AccessLog[]>([]);
const handleSelectionChange = (val: AccessLog[]): void => {
	selected.value = val;
};

// 搜索（节流）
const t_handleSearch = useThrottle(handleSearch, 1000);

// 初始化加载数据
onMounted(() => {
	loadTableData();
});
</script>

<style lang="scss" scoped></style>
