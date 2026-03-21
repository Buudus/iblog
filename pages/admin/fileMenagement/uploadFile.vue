<template>
	<div>
		<!-- 工具栏 -->
		<div class="w-full flex justify-between items-center pb-2 border-b mb-2 dark:border-[#1e293b]">
			<div>
				<el-button
					type="danger"
					size="small"
					:disabled="uploadedFiles.length === 0"
					@click="clearAllFiles">
					清空列表
				</el-button>
			</div>
			<div>
				<el-text type="info" size="small"> 已上传 {{ uploadedFiles.length }} 个文件 </el-text>
			</div>
		</div>

		<!-- 上传组件 -->
		<div class="upload-section mb-4">
			<MultipleUpload
				ref="multipleUploadRef"
				:accept="acceptTypes"
				:limit="maxUploadCount"
				:handle-upload="handleFileUpload" />
		</div>

		<!-- 上传进度 -->
		<div v-if="uploading" class="upload-progress mb-4">
			<el-progress :percentage="uploadProgress" :status="uploadStatus" />
			<p class="text-center mt-2 text-gray-500">{{ uploadMessage }}</p>
		</div>

		<!-- 已上传文件列表 -->
		<div class="w-full h-[90%]">
			<el-table v-if="uploadedFiles.length > 0" :data="uploadedFiles" :loading="false" border>
				<el-table-column prop="name" label="文件名" min-width="200">
					<template #default="{ row }">
						<div class="flex items-center gap-2">
							<el-icon v-if="isImage(row.mimetype)" class="text-blue-500">
								<Picture />
							</el-icon>
							<el-icon v-else class="text-gray-500">
								<Document />
							</el-icon>
							<span class="truncate" :title="row.originalName || row.name">
								{{ row.originalName || row.name }}
							</span>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="mimetype" label="文件类型" width="150" />
				<el-table-column prop="size" label="文件大小" width="120" align="center">
					<template #default="{ row }">
						{{ formatFileSize(row.size) }}
					</template>
				</el-table-column>
				<el-table-column label="上传状态" width="120" align="center">
					<template #default>
						<el-tag type="success" size="small">上传成功</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="url" label="预览" width="120" align="center">
					<template #default="{ row }">
						<el-image
							v-if="isImage(row.mimetype)"
							:src="row.url"
							:preview-src-list="[row.url]"
							fit="cover"
							class="w-16 h-16 cursor-pointer"
							preview-teleported />
						<el-button v-else type="primary" link size="small" @click="copyFileUrl(row.url)">
							复制链接
						</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="createdAt" label="上传时间" width="180" />
				<el-table-column label="操作" width="120" fixed="right">
					<template #default="{ row }">
						<el-button type="danger" link size="small" @click="handleDeleteFile(row)">
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-empty v-else description="暂无上传文件" />
		</div>
	</div>
</template>

<script name="UploadFile" lang="ts" setup>
import { Picture, Document } from '@element-plus/icons-vue';
import MultipleUpload from '~/components/Upload/MultipleUpload/index.vue';
import { useFileUpload } from '~/composables/useFileUpload';
import type { UploadRawFile } from 'element-plus';

// 允许的文件类型（所有类型）
const acceptTypes = ref<string>('*');

// 最大上传数量
const maxUploadCount = ref<number>(20);

// 上传组件引用
const multipleUploadRef = useTemplateRef<InstanceType<typeof MultipleUpload>>('multipleUploadRef');

// 使用 composable
const {
	uploadedFiles,
	uploading,
	uploadProgress,
	uploadStatus,
	uploadMessage,
	isImage,
	formatFileSize,
	copyFileUrl,
	handleFileUpload: uploadFiles,
	handleDeleteFile,
	clearAllFiles,
} = useFileUpload();

// 处理文件上传（包装以清空上传组件）
const handleFileUpload = async (files: UploadRawFile[]): Promise<void> => {
	const clearUpload = () => {
		if (multipleUploadRef.value) {
			if (typeof multipleUploadRef.value.clearFileList === 'function') {
				multipleUploadRef.value.clearFileList();
			}
			// 清空el-upload的文件列表
			const uploadInstance = (
				multipleUploadRef.value as { uploadRef?: { clearFiles?: () => void } }
			).uploadRef;
			if (uploadInstance && typeof uploadInstance.clearFiles === 'function') {
				uploadInstance.clearFiles();
			}
		}
	};

	await uploadFiles(files, clearUpload);
};
</script>

<style lang="scss" scoped>
.upload-section {
	min-height: 200px;
}

.upload-progress {
	padding: 16px;
	background-color: #f5f7fa;
	border-radius: 4px;
}
</style>
