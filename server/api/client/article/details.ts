import { error } from '~/server/utils/util.logger';
import ArticleModel from '~/server/models/article.model';
import { resultFormat } from '~/server/utils/util.resultFormat';
import ArticleBehaviorModel from '~/server/models/articleBehavior.model';
import { getClientIp } from '~/server/utils/util.ipTool';

/**
 * @api {get} /client/article/details 获取文章详情
 * @apiName 获取文章详情
 * @apiGroup 博客前台
 * @apiDescription 通过文章ID获取文章详情，分类信息返回名称
 *
 * @apiSampleRequest /client/article/details
 *
 * @apiQuery {String} id 文章ID
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccess {Object} data 文章详情
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message": "获取成功",
 *       "data": {
 *         "_id": "6517e7c8e7b1a2a1b2c3d4e5",
 *         "cover": "https://example.com/cover.jpg",
 *         "title": "文章标题",
 *         "content": "文章内容...",
 *         "author": "6501a2b3c4d5e6f7a8b9c0d1",
 *         "category": { "_id": "6501a2b3c4d5e6f7a8b9c0d2", "name": "前端" },
 *         "subCategory": { "_id": "6501a2b3c4d5e6f7a8b9c0d3", "name": "Vue" },
 *         "tags": ["标签1", "标签2"],
 *         "views": 123,
 *         "likes": 10,
 *         "isPublished": true,
 *         "createdAt": "2025年09月30日 12:00:00",
 *         "updatedAt": "2025年09月30日 12:00:00"
 *       }
 *     }
 */
export default defineEventHandler(async (event) => {
	try {
		// 获取查询参数中的文章ID
		const query = getQuery(event);
		const id = query.id ? String(query.id) : '';

		if (!id) {
			return resultFormat(400, '请提供文章ID');
		}

		// 查询文章详情，并将分类、二级分类和作者字段 populate 成名称等信息
		const article = await ArticleModel.findById(id)
			.populate('category', 'name')
			.populate('subCategory', 'name')
			.populate('author', 'nickname username avatar');

		if (!article) return resultFormat(404, '文章不存在');

		// 统计文章的去重浏览量（按 ip 和 user 去重）
		const viewsStats = await ArticleBehaviorModel.aggregate([
			{ $match: { articleId: article._id } },
			{ $group: { _id: { ip: '$ip', user: '$user' } } },
			{ $group: { _id: null, views: { $sum: 1 } } },
		]);

		// 获取去重后的浏览量
		const views = viewsStats.length > 0 ? viewsStats[0].views : 0;

		// 统计文章的点赞量（统计 like 为 true 的记录数，按 user 去重）
		const likesStats = await ArticleBehaviorModel.aggregate([
			{ $match: { articleId: article._id, like: true } },
			{ $group: { _id: '$user' } },
			{ $group: { _id: null, likes: { $sum: 1 } } },
		]);

		// 获取去重后的点赞量
		const likes = likesStats.length > 0 ? likesStats[0].likes : 0;

		// 将浏览量和点赞量更新到文章对象中
		const articleWithViews = {
			...article.toObject(),
			views,
			likes,
		};

		// 创建文章访问记录
		await ArticleBehaviorModel.create({
			articleId: article._id,
			user: getCookie(event, 'userId') || '未知游客',
			ip: getClientIp(event),
		});

		// 返回文章详情数据
		return resultFormat(200, '获取成功', articleWithViews);
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		// 错误日志记录
		error(errorMessage);
		console.error(err);
		return resultFormat(500, errorMessage);
	}
});
