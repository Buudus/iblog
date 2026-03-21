import { resultFormat } from '~/server/utils/util.resultFormat';
import ArticleModel from '~/server/models/article.model';
import CategoryModel from '~/server/models/categories.model';
import SubCategoryModel from '~/server/models/subCategories.model';
import AccessLogModel from '~/server/models/accessLog.model';

/**
 * @api {get} /client/site/stats 获取站点基础统计
 * @apiName 获取站点统计
 * @apiGroup 博客前台
 * @apiDescription
 *   获取展示在客户端组件（ClientBanner、AuthorInfo等）中的基础统计信息。
 *   统计内容包含发布文章数量、分类数量（一级 + 二级）以及客户端访问量。
 *
 * @apiSampleRequest /client/site/stats
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应描述
 * @apiSuccess {Object} data 统计数据
 * @apiSuccess {Number} data.articleCount 已发布文章数量
 * @apiSuccess {Number} data.categoryCount 分类总数（一级分类 + 二级分类）
 * @apiSuccess {Number} data.visitCount 访问量（仅统计客户端路由）
 *
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *    "code": 200,
 *    "message": "获取成功",
 *    "data": {
 *      "articleCount": 120,
 *      "categoryCount": 15,
 *      "visitCount": 1024
 *    }
 *  }
 */
export default defineEventHandler(async () => {
	try {
		const [publishedArticles, parentCategories, subCategories, clientVisits] = await Promise.all([
			ArticleModel.countDocuments({ isPublished: true }),
			CategoryModel.countDocuments({}),
			SubCategoryModel.countDocuments({}),
			AccessLogModel.countDocuments({
				path: { $regex: /^(?!\/admin)(?!\/api\/admin)(?!\/_nuxt)(?!\/__nuxt)(?!\/__webpack).+/ },
			}),
		]);

		return resultFormat(200, '获取成功', {
			articleCount: publishedArticles,
			categoryCount: parentCategories + subCategories,
			visitCount: clientVisits,
		});
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : '服务端错误';
		return resultFormat(500, message);
	}
});
