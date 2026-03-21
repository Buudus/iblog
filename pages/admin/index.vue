<template>
	<div class="admin-page p-4 space-y-4">
		<!-- 加载状态 -->
		<div v-loading="loading" class="min-h-[200px]">
			<!-- 统计卡片 -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
				<!-- 站点访问量 -->
				<LyCard>
					<div class="p-4">
						<div class="flex items-center justify-between">
							<div>
								<div class="text-2xl font-bold text-gray-800 dark:text-gray-200">
									{{ stats.totalVisits }}
								</div>
								<div class="text-sm text-gray-500 dark:text-gray-400 mt-1">站点访问量</div>
								<div class="text-xs text-green-500 mt-1">今日新增：{{ stats.todayVisits }}</div>
							</div>
							<div class="text-4xl text-blue-500 opacity-50">
								<i class="bi bi-eye-fill"></i>
							</div>
						</div>
					</div>
				</LyCard>

				<!-- 文章访问量 -->
				<LyCard>
					<div class="p-4">
						<div class="flex items-center justify-between">
							<div>
								<div class="text-2xl font-bold text-gray-800 dark:text-gray-200">
									{{ stats.totalArticleViews }}
								</div>
								<div class="text-sm text-gray-500 dark:text-gray-400 mt-1">文章访问量</div>
								<div class="text-xs text-green-500 mt-1">
									今日新增：{{ stats.todayArticleViews }}
								</div>
							</div>
							<div class="text-4xl text-purple-500 opacity-50">
								<i class="bi bi-file-text-fill"></i>
							</div>
						</div>
					</div>
				</LyCard>

				<!-- 文章数量 -->
				<LyCard>
					<div class="p-4">
						<div class="flex items-center justify-between">
							<div>
								<div class="text-2xl font-bold text-gray-800 dark:text-gray-200">
									{{ stats.articleCount }}
								</div>
								<div class="text-sm text-gray-500 dark:text-gray-400 mt-1">文章数量</div>
								<div class="text-xs text-green-500 mt-1">今日新增：{{ stats.todayArticles }}</div>
								<div class="text-xs text-gray-400 mt-1">
									已发布：{{ stats.publishedArticles }} | 草稿：{{ stats.draftArticles }}
								</div>
							</div>
							<div class="text-4xl text-green-500 opacity-50">
								<i class="bi bi-journal-text"></i>
							</div>
						</div>
					</div>
				</LyCard>

				<!-- 留言数量 -->
				<LyCard>
					<div class="p-4">
						<div class="flex items-center justify-between">
							<div>
								<div class="text-2xl font-bold text-gray-800 dark:text-gray-200">
									{{ stats.totalMessages }}
								</div>
								<div class="text-sm text-gray-500 dark:text-gray-400 mt-1">留言数量</div>
								<div class="text-xs text-green-500 mt-1">今日新增：{{ stats.todayMessages }}</div>
							</div>
							<div class="text-4xl text-orange-500 opacity-50">
								<i class="bi bi-chat-text-fill"></i>
							</div>
						</div>
					</div>
				</LyCard>
			</div>

			<!-- 第二行统计卡片 -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
				<!-- 文件数量 -->
				<LyCard>
					<div class="p-4">
						<div class="flex items-center justify-between">
							<div>
								<div class="text-2xl font-bold text-gray-800 dark:text-gray-200">
									{{ stats.totalFiles }}
								</div>
								<div class="text-sm text-gray-500 dark:text-gray-400 mt-1">文件数量</div>
								<div class="text-xs text-gray-400 mt-1">图片：{{ stats.imageFiles }}</div>
							</div>
							<div class="text-4xl text-indigo-500 opacity-50">
								<i class="bi bi-folder-fill"></i>
							</div>
						</div>
					</div>
				</LyCard>

				<!-- 文件总大小 -->
				<LyCard>
					<div class="p-4">
						<div class="flex items-center justify-between">
							<div>
								<div class="text-2xl font-bold text-gray-800 dark:text-gray-200">
									{{ formatFileSize(stats.totalFileSize) }}
								</div>
								<div class="text-sm text-gray-500 dark:text-gray-400 mt-1">文件总大小</div>
							</div>
							<div class="text-4xl text-cyan-500 opacity-50">
								<i class="bi bi-hdd-fill"></i>
							</div>
						</div>
					</div>
				</LyCard>

				<!-- 分类数量 -->
				<LyCard>
					<div class="p-4">
						<div class="flex items-center justify-between">
							<div>
								<div class="text-2xl font-bold text-gray-800 dark:text-gray-200">
									{{ stats.totalCategories }}
								</div>
								<div class="text-sm text-gray-500 dark:text-gray-400 mt-1">分类数量</div>
							</div>
							<div class="text-4xl text-pink-500 opacity-50">
								<i class="bi bi-stack"></i>
							</div>
						</div>
					</div>
				</LyCard>

				<!-- 标签数量 -->
				<LyCard>
					<div class="p-4">
						<div class="flex items-center justify-between">
							<div>
								<div class="text-2xl font-bold text-gray-800 dark:text-gray-200">
									{{ stats.totalTags }}
								</div>
								<div class="text-sm text-gray-500 dark:text-gray-400 mt-1">标签数量</div>
							</div>
							<div class="text-4xl text-yellow-500 opacity-50">
								<i class="bi bi-tags-fill"></i>
							</div>
						</div>
					</div>
				</LyCard>
			</div>

			<!-- 快速操作 -->
			<LyCard>
				<div class="p-4">
					<div class="mb-4 pb-2 border-b dark:border-gray-700">
						<h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">快速操作</h3>
					</div>
					<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
						<el-button
							type="primary"
							@click="router.push('/admin/articleManagement/publishArticle')">
							<i class="bi bi-plus-circle mr-2"></i>
							发布文章
						</el-button>
						<el-button @click="router.push('/admin/fileMenagement/uploadFile')">
							<i class="bi bi-upload mr-2"></i>
							上传文件
						</el-button>
						<el-button @click="router.push('/admin/categoryManagement')">
							<i class="bi bi-stack mr-2"></i>
							管理分类
						</el-button>
						<el-button @click="router.push('/admin/leaveMessageManagement')">
							<i class="bi bi-chat-text mr-2"></i>
							查看留言
						</el-button>
					</div>
				</div>
			</LyCard>

			<!-- 主要内容区域 -->
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
				<!-- 最近文章 -->
				<LyCard>
					<div class="p-4">
						<div class="flex items-center justify-between mb-4 pb-2 border-b dark:border-gray-700">
							<h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">最近文章</h3>
							<el-button
								type="primary"
								link
								size="small"
								@click="router.push('/admin/articleManagement/allArticle')">
								查看全部
							</el-button>
						</div>
						<div v-if="recentArticles.length === 0" class="text-center text-gray-400 py-8">
							暂无文章
						</div>
						<div v-else class="space-y-3">
							<div
								v-for="article in recentArticles"
								:key="article._id"
								class="flex items-center justify-between p-3 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
								@click="router.push(`/admin/articleManagement/editArticle/${article._id}`)">
								<div class="flex-1 min-w-0">
									<div class="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
										{{ article.title }}
									</div>
									<div class="flex items-center gap-2 mt-1 text-xs text-gray-500">
										<el-tag :type="article.isPublished ? 'success' : 'info'" size="small">
											{{ article.isPublished ? '已发布' : '草稿' }}
										</el-tag>
										<span>浏览量：{{ article.views || 0 }}</span>
										<span>{{ article.createdAt }}</span>
									</div>
								</div>
								<el-button link type="primary" size="small">
									<i class="bi bi-arrow-right"></i>
								</el-button>
							</div>
						</div>
					</div>
				</LyCard>

				<!-- 最近访问日志 -->
				<LyCard>
					<div class="p-4">
						<div class="flex items-center justify-between mb-4 pb-2 border-b dark:border-gray-700">
							<h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">最近访问</h3>
							<el-button type="primary" link size="small" @click="router.push('/admin/accessLog')">
								查看全部
							</el-button>
						</div>
						<div v-if="recentAccessLogs.length === 0" class="text-center text-gray-400 py-8">
							暂无访问记录
						</div>
						<div v-else class="space-y-2">
							<div
								v-for="log in recentAccessLogs"
								:key="log._id"
								class="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
								<div class="flex-1 min-w-0">
									<div class="flex items-center gap-2 mb-1">
										<el-tag
											:type="getStatusCodeType(log.statusCode) || 'info'"
											size="small"
											class="shrink-0">
											{{ log.statusCode }}
										</el-tag>
										<el-tag
											:type="
												log.method === 'GET'
													? 'success'
													: log.method === 'POST'
														? 'primary'
														: log.method === 'PUT'
															? 'warning'
															: 'danger'
											"
											size="small"
											class="shrink-0">
											{{ log.method }}
										</el-tag>
										<span class="text-xs text-gray-500 truncate">{{ log.path }}</span>
									</div>
									<div class="flex items-center gap-2 text-xs text-gray-400">
										<span>{{ log.ip }}</span>
										<span>·</span>
										<span>{{ log.createdAt }}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</LyCard>
			</div>
		</div>
	</div>
</template>

<script name="AdminHomePage" lang="ts" setup>
// 全局中间件会自动应用，无需显式声明
import { useDashboard } from '~/composables/useDashboard';

const router = useRouter();

// 使用 dashboard composable
const {
	stats,
	recentArticles,
	recentAccessLogs,
	loading,
	loadAll,
	formatFileSize,
	getStatusCodeType,
} = useDashboard();

// 初始化加载数据
onMounted(() => {
	loadAll();
});
</script>

<style lang="scss" scoped>
.admin-page {
	background-color: #f5f7fa;
}

.dark .admin-page {
	background-color: #0f1419;
}
</style>
