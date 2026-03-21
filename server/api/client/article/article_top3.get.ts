import { error } from '~/server/utils/util.logger';
import ArticleModel from '~/server/models/article.model';
import { resultFormat } from '~/server/utils/util.resultFormat';
import ArticleBehaviorModel from '~/server/models/articleBehavior.model';

/**
 * @api {get} /client/article/article_top3 获取TOP3热门文章
 * @apiName 获取TOP3热门文章
 * @apiGroup 博客前台
 * @apiDescription 根据文章行为记录表统计浏览量和点赞量，计算热度并返回TOP3热门文章
 *
 * @apiSampleRequest /client/article/article_top3
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccess {Object[]} data 热门文章列表（最多3条）
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message": "获取成功",
 *       "data": [
 *         {
 *           "_id": "6517e7c8e7b1a2a1b2c3d4e5",
 *           "cover": "https://example.com/cover.jpg",
 *           "title": "文章标题",
 *           "category": { "_id": "6501a2b3c4d5e6f7a8b9c0d2", "name": "前端" },
 *           "subCategory": { "_id": "6501a2b3c4d5e6f7a8b9c0d3", "name": "Vue" },
 *           "tags": ["标签1", "标签2"],
 *           "views": 123,
 *           "likes": 10,
 *           "createdAt": "2025年09月30日 12:00:00"
 *         }
 *       ]
 *     }
 */
export default defineEventHandler(async () => {
	try {
		// 1. 获取所有已发布文章的ID
		const publishedArticles = await ArticleModel.find({ isPublished: true }).select('_id');
		const articleIds = publishedArticles.map((article) => article._id);

		if (articleIds.length === 0) {
			return resultFormat(200, '获取成功', []);
		}

		// 2. 统计每篇文章的去重浏览量（按 ip 和 user 去重）
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

		// 3. 统计每篇文章的点赞量（like 为 true，按 user 去重）
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

		// 4. 将统计结果转换为 Map，方便查找
		const viewsMap = new Map<string, number>(
			viewsStats.map((stat: { _id: unknown; views: number }) => [String(stat._id), stat.views])
		);
		const likesMap = new Map<string, number>(
			likesStats.map((stat: { _id: unknown; likes: number }) => [String(stat._id), stat.likes])
		);

		// 5. 计算每篇文章的热度分数并排序
		// 热度 = 浏览量 * 1 + 点赞量 * 2（点赞量权重更高，因为用户主动行为）
		const articleScores = articleIds.map((articleId) => {
			const articleIdStr = String(articleId);
			const views = viewsMap.get(articleIdStr) || 0;
			const likes = likesMap.get(articleIdStr) || 0;
			const hotScore = views * 1 + likes * 2; // 点赞量权重为2
			return {
				articleId,
				views,
				likes,
				hotScore,
			};
		});

		// 6. 按热度分数降序排序，取TOP3
		const top3Articles = articleScores
			.sort((a, b) => b.hotScore - a.hotScore)
			.slice(0, 3)
			.map((item) => item.articleId);

		if (top3Articles.length === 0) {
			return resultFormat(200, '获取成功', []);
		}

		// 7. 创建文章ID到统计数据的映射（用于后续查找）
		const scoreMap = new Map(
			articleScores.map((score) => [
				String(score.articleId),
				{ views: score.views, likes: score.likes },
			])
		);

		// 8. 批量查询TOP3文章的详细信息
		const articles = await ArticleModel.find({ _id: { $in: top3Articles } })
			.populate('category', 'name')
			.populate('subCategory', 'name')
			.select('cover title category subCategory tags createdAt');

		// 9. 按照热度排序顺序重新排列文章，并添加浏览量和点赞量
		const articleMap = new Map(articles.map((article) => [String(article._id), article]));
		const result = top3Articles
			.map((articleId) => {
				const article = articleMap.get(String(articleId));
				if (!article) return null;
				const stats = scoreMap.get(String(articleId));
				return {
					...article.toObject(),
					views: stats?.views || 0,
					likes: stats?.likes || 0,
				};
			})
			.filter((item): item is NonNullable<typeof item> => item !== null);

		return resultFormat(200, '获取成功', result);
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		console.error(err);
		return resultFormat(500, errorMessage);
	}
});
