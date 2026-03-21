import { error } from '~/server/utils/util.logger';
import ArticleModel from '~/server/models/article.model';
import { resultFormat } from '~/server/utils/util.resultFormat';

/**
 * @api {delete} /admin/article/delete 删除文章
 * @apiName 删除文章
 * @apiGroup 博客文章管理
 * @apiDescription 支持批量删除文章
 *
 * @apiPermission admin
 *
 * @apiSampleRequest /admin/article/delete
 *
 * @apiQuery {String} ids 以 , 分隔的文章ID字符串，例如：id1,id2,id3
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message": "删除成功"
 *     }
 */
export default defineEventHandler(async (event) => {
	try {
		const query = getQuery(event);
		const ids = String(query.ids || '')
			.split(',')
			.filter(Boolean);
		if (!ids.length) return resultFormat(400, '请求参数错误');

		const result = await ArticleModel.deleteMany({ _id: { $in: ids } });

		if (result.deletedCount === 0) {
			return resultFormat(404, '文章不存在');
		}

		return resultFormat(200, `删除成功，共删除 ${result.deletedCount} 篇文章`);
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
