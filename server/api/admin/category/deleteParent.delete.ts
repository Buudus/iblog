import { error } from '~/server/utils/util.logger';
import CategoryModel from '~/server/models/categories.model';
import SubCategoryModel from '~/server/models/subCategories.model';

/**
 * @api {delete} /admin/category/deleteParent 删除一级分类
 * @apiName 删除一级分类
 * @apiGroup 分类管理
 * @apiDescription 删除一个或多个一级分类，同时删除其下的所有二级分类
 *
 * @apiPermission admin
 *
 * @apiSampleRequest /admin/category/deleteParent
 *
 * @apiQuery {String} ids 以 , 分隔的一级分类ID字符串，例如：id1,id2,id3
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccess {Object} data 响应数据
 * @apiSuccess {Number} data.deletedParentCount 删除的一级分类数量
 * @apiSuccess {Number} data.deletedSubCategoryCount 删除的二级分类数量
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message": "删除成功",
 *       "data": {
 *         "deletedParentCount": 2,
 *         "deletedSubCategoryCount": 5
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

		// 删除一级分类
		const parentResult = await CategoryModel.deleteMany({ _id: { $in: ids } });

		// 删除对应的二级分类
		const subCategoryResult = await SubCategoryModel.deleteMany({ parentId: { $in: ids } });

		return resultFormat(200, '删除成功', {
			deletedParentCount: parentResult.deletedCount,
			deletedSubCategoryCount: subCategoryResult.deletedCount,
		});
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
