import { error } from '~/server/utils/util.logger';
import ArticleModel from '~/server/models/article.model';
import { resultFormat } from '~/server/utils/util.resultFormat';
import ArticleBehaviorModel from '~/server/models/articleBehavior.model';

/**
 * @api {get} /admin/article/list 获取文章列表
 * @apiName 获取文章列表
 * @apiGroup 博客文章管理
 * @apiDescription 获取文章列表，支持关键词搜索、分页、按状态和分类筛选
 *
 * @apiPermission admin
 *
 * @apiSampleRequest /admin/article/list
 *
 * @apiQuery {String} [keywords] 关键词（模糊匹配标题或内容）
 * @apiQuery {Number} [page=1] 当前页码
 * @apiQuery {Number} [pageSize=20] 每页数量
 * @apiQuery {String} [status] 文章状态（published/draft）
 * @apiQuery {String} [categoryId] 分类IDI
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccess {Object} data 响应数据
 * @apiSuccess {Object[]} data.list 文章列表
 * @apiSuccess {Number} data.total 总记录数
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message": "获取成功",
 *       "data": {
 *         "list": [
 *           {
 *             "_id": "6517e7c8e7b1a2a1b2c3d4e5",
 *             "cover": "https://example.com/cover.jpg",
 *             "title": "文章标题",
 *             "content": "文章内容...",
 *             "author": { "_id": "6501a2b3c4d5e6f7a8b9c0d1", "username": "admin" },
 *             "category": { "_id": "6501a2b3c4d5e6f7a8b9c0d2", "name": "前端" },
 *             "subCategory": { "_id": "6501a2b3c4d5e6f7a8b9c0d3", "name": "Vue" },
 *             "tags": ["标签1", "标签2"],
 *             "views": 123,
 *             "likes": 10,
 *             "isPublished": true,
 *             "createdAt": "2025年09月30日 12:00:00",
 *             "updatedAt": "2025年09月30日 12:00:00"
 *           }
 *         ],
 *         "total": 100
 *       }
 *     }
 */
export default defineEventHandler(async (event) => {
	try {
		// 获取查询参数
		const query = getQuery(event);
		const keywords = query.keywords ? String(query.keywords) : '';
		const page = query.page ? parseInt(String(query.page), 10) : 1;
		const pageSize = query.pageSize ? parseInt(String(query.pageSize), 10) : 20;
		const status = query.status ? String(query.status) : '';
		const categoryId = query.categoryId ? String(query.categoryId) : '';

		const filter: Record<string, unknown> = {};

		// 关键词搜索（标题或内容）
		if (keywords) {
			const escaped = keywords.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			const regex = { $regex: escaped, $options: 'i' };
			filter.$or = [{ title: regex }, { content: regex }];
		}

		// 状态筛选
		if (status === 'published') {
			filter.isPublished = true;
		} else if (status === 'draft') {
			filter.isPublished = false;
		}

		// 分类筛选
		if (categoryId) {
			filter.category = categoryId;
		}

		// 计算跳过的记录数
		const skip = (page - 1) * pageSize;

		// 查询文章列表，并填充作者和分类信息
		const articles = await ArticleModel.find(filter)
			.skip(skip)
			.limit(pageSize)
			.sort({ createdAt: -1 })
			.populate('author', 'username nickname')
			.populate('category', 'name')
			.populate('subCategory', 'name');

		// 获取总记录数
		const total = await ArticleModel.countDocuments(filter);

		// 获取所有文章的ID
		const articleIds = articles.map((article) => article._id);

		// 统计每篇文章的去重浏览量（按 ip 和 user 去重）
		const viewsStats = await ArticleBehaviorModel.aggregate([
			{ $match: { articleId: { $in: articleIds } } },
			{
				$group: {
					_id: {
						articleId: '$articleId',
						ip: '$ip',
						user: '$user',
					},
				},
			},
			{ $group: { _id: '$_id.articleId', views: { $sum: 1 } } },
		]);

		// 统计每篇文章的点赞量（like 为 true，按 user 去重）
		const likesStats = await ArticleBehaviorModel.aggregate([
			{ $match: { articleId: { $in: articleIds }, like: true } },
			{
				$group: {
					_id: {
						articleId: '$articleId',
						user: '$user',
					},
				},
			},
			{ $group: { _id: '$_id.articleId', likes: { $sum: 1 } } },
		]);

		// 将统计结果转换为 Map，方便查找
		const viewsMap = new Map<string, number>(
			viewsStats.map((stat: { _id: unknown; views: number }) => [String(stat._id), stat.views])
		);
		const likesMap = new Map<string, number>(
			likesStats.map((stat: { _id: unknown; likes: number }) => [String(stat._id), stat.likes])
		);

		// 将浏览量和点赞量更新到文章列表中
		const list = articles.map((article) => {
			const articleId = String(article._id);
			const views = viewsMap.get(articleId) || 0;
			const likes = likesMap.get(articleId) || 0;
			return {
				...article.toObject(),
				views,
				likes,
			};
		});

		return resultFormat(200, '获取成功', {
			list,
			total,
		});
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
