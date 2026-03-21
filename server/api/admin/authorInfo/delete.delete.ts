import { error } from '~/server/utils/util.logger';
import AuthorInfoModel from '~/server/models/authorInfo.model';

/**
 * @api {delete} /admin/authorInfo/delete 删除作者信息
 * @apiName 删除作者信息
 * @apiGroup 作者信息
 * @apiDescription 删除指定的作者信息，支持批量删除。如果目标的 isUse 为 yes，则不允许删除。
 *
 * @apiPermission admin
 *
 * @apiQuery {String} ids 以 , 分隔的 ID 字符串，例如： id1,id2,id3
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message": "删除成功，共删除 1 条作者信息"
 *     }
 */
export default defineEventHandler(async (event) => {
	try {
		const query = getQuery(event);

		const ids = String(query.ids).split(',');

		if (!ids || ids.length < 1) {
			return resultFormat(400, '请求参数错误');
		}

		// 拦截处于启用状态的记录删除
		const active = await AuthorInfoModel.findOne({ _id: { $in: ids }, isUse: 'yes' });
		if (active) {
			return resultFormat(400, '无法删除启用状态的作者信息');
		}

		const result = await AuthorInfoModel.deleteMany({ _id: { $in: ids } });
		if (result.deletedCount === 0) {
			return resultFormat(404, '未找到要删除的作者信息');
		}

		return resultFormat(200, `删除成功，共删除 ${result.deletedCount} 条作者信息`);
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
