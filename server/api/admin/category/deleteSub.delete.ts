import { error } from '~/server/utils/util.logger';
import SubCategoryModel from '~/server/models/subCategories.model';

/**
 * @api {delete} /admin/category/deleteSub 删除二级分类
 * @apiName 删除二级分类
 * @apiGroup 分类管理
 * @apiDescription 删除一个或多个二级分类
 *
 * @apiPermission admin
 *
 * @apiSampleRequest /admin/category/deleteSub
 *
 * @apiQuery {String} ids 以 , 分隔的二级分类ID字符串，例如：id1,id2,id3
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccess {Object} data 响应数据
 * @apiSuccess {Number} data.deletedCount 删除的二级分类数量
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message": "删除成功",
 *       "data": {
 *         "deletedCount": 3
 *       }
 *     }
 */
export default defineEventHandler(async (event) => {
	try {
		const query = getQuery(event);
		const ids = String(query.ids || '')
			.split(',')
			.filter(Boolean);

		if (!ids || ids.length === 0) {
			return resultFormat(400, '请求参数错误');
		}

		// 删除二级分类
		const result = await SubCategoryModel.deleteMany({ _id: { $in: ids } });

		if (result.deletedCount === 0) {
			return resultFormat(404, '未找到相应的二级分类');
		}

		return resultFormat(200, '删除成功', {
			deletedCount: result.deletedCount,
		});
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
