import { error } from '~/server/utils/util.logger';
import ArticleModel from '~/server/models/article.model';
import AccessLogModel from '~/server/models/accessLog.model';
import LeaveMessageModel from '~/server/models/leaveMessage.model';
import FileModel from '~/server/models/files.model';
import CategoryModel from '~/server/models/categories.model';
import { resultFormat } from '~/server/utils/util.resultFormat';
import dayjs from 'dayjs';

/**
 * @api {get} /admin/dashboard/stats 获取后台首页统计数据
 * @apiName 获取后台首页统计数据
 * @apiGroup 仪表盘
 * @apiDescription 获取后台首页的各种统计数据：访问量、文章与浏览量、留言、文件、分类与标签等
 *
 * @apiPermission admin
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccess {Object} data 统计数据
 * @apiSuccess {Number} data.totalVisits 总访问量
 * @apiSuccess {Number} data.todayVisits 今日访问量
 * @apiSuccess {Number} data.totalArticleViews 文章总浏览量
 * @apiSuccess {Number} data.todayArticleViews 今日文章浏览量
 * @apiSuccess {Number} data.articleCount 文章总数
 * @apiSuccess {Number} data.todayArticles 今日新增文章数
 * @apiSuccess {Number} data.publishedArticles 已发布文章数
 * @apiSuccess {Number} data.draftArticles 草稿文章数
 * @apiSuccess {Number} data.totalMessages 留言总数
 * @apiSuccess {Number} data.todayMessages 今日新增留言数
 * @apiSuccess {Number} data.totalFiles 文件总数
 * @apiSuccess {Number} data.totalFileSize 文件总大小（字节）
 * @apiSuccess {Number} data.imageFiles 图片文件数
 * @apiSuccess {Number} data.totalCategories 分类总数
 * @apiSuccess {Number} data.totalTags 标签总数
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message": "获取成功",
 *       "data": {
 *         "totalVisits": 15000,
 *         "todayVisits": 320,
 *         "totalArticleViews": 8500,
 *         "todayArticleViews": 88,
 *         "articleCount": 56,
 *         "todayArticles": 1,
 *         "publishedArticles": 50,
 *         "draftArticles": 6,
 *         "totalMessages": 128,
 *         "todayMessages": 3,
 *         "totalFiles": 240,
 *         "totalFileSize": 52428800,
 *         "imageFiles": 180,
 *         "totalCategories": 8,
 *         "totalTags": 25
 *       }
 *     }
 */
export default defineEventHandler(async () => {
	try {
		const today = dayjs().format('YYYY年MM月DD日');
		const todayStart = `${today} 00:00:00`;
		const todayEnd = `${today} 23:59:59`;

		// 并行查询所有统计数据
		const [
			totalVisits,
			todayVisits,
			totalArticleViews,
			todayArticleViews,
			articleCount,
			todayArticles,
			publishedArticles,
			draftArticles,
			totalMessages,
			todayMessages,
			totalFiles,
			imageFiles,
			totalFileSizeResult,
			totalCategories,
			totalTags,
		] = await Promise.all([
			// 总访问量
			AccessLogModel.countDocuments({}),
			// 今日访问量
			AccessLogModel.countDocuments({
				createdAt: { $gte: todayStart, $lte: todayEnd },
			}),
			// 文章总浏览量
			ArticleModel.aggregate([
				{
					$group: {
						_id: null,
						total: { $sum: '$views' },
					},
				},
			]),
			// 今日文章浏览量（需要从访问日志中统计访问文章的次数）
			AccessLogModel.countDocuments({
				path: { $regex: /^\/api\/client\/article/ },
				createdAt: { $gte: todayStart, $lte: todayEnd },
			}),
			// 文章总数
			ArticleModel.countDocuments({}),
			// 今日新增文章数
			ArticleModel.countDocuments({
				createdAt: { $gte: todayStart, $lte: todayEnd },
			}),
			// 已发布文章数
			ArticleModel.countDocuments({ isPublished: true }),
			// 草稿文章数
			ArticleModel.countDocuments({ isPublished: false }),
			// 留言总数
			LeaveMessageModel.countDocuments({}),
			// 今日新增留言数
			LeaveMessageModel.countDocuments({
				createdAt: { $gte: todayStart, $lte: todayEnd },
			}),
			// 文件总数
			FileModel.countDocuments({}),
			// 图片文件数
			FileModel.countDocuments({ mimetype: { $regex: /^image\// } }),
			// 文件总大小
			FileModel.aggregate([
				{
					$group: {
						_id: null,
						totalSize: { $sum: '$size' },
					},
				},
			]),
			// 分类总数
			CategoryModel.countDocuments({}),
			// 标签总数（统计所有文章中唯一标签的数量）
			ArticleModel.aggregate([
				{ $match: { tags: { $exists: true, $ne: [], $type: 'array' } } },
				{ $unwind: '$tags' },
				{ $match: { tags: { $exists: true, $ne: '', $type: 'string' } } },
				{ $group: { _id: '$tags' } },
				{ $count: 'total' },
			]),
		]);

		// 提取聚合结果
		const totalArticleViewsValue = totalArticleViews.length > 0 ? totalArticleViews[0].total : 0;
		const totalFileSize = totalFileSizeResult.length > 0 ? totalFileSizeResult[0].totalSize : 0;
		const totalTagsValue = totalTags.length > 0 ? totalTags[0].total : 0;

		return resultFormat(200, '获取成功', {
			totalVisits,
			todayVisits,
			totalArticleViews: totalArticleViewsValue,
			todayArticleViews,
			articleCount,
			todayArticles,
			publishedArticles,
			draftArticles,
			totalMessages,
			todayMessages,
			totalFiles,
			totalFileSize,
			imageFiles,
			totalCategories,
			totalTags: totalTagsValue,
		});
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
