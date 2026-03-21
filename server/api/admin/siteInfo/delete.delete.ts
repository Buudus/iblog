import { error } from '~/server/utils/util.logger';
import SiteInfoModel from '~/server/models/siteInfo.model';

/**
 * @api {delete} /admin/siteInfo/delete 删除站点信息
 * @apiName 删除站点信息
 * @apiGroup 站点信息
 * @apiDescription 删除指定的站点信息，支持批量删除。如果目标的 isUse 为 yes，则不允许删除。
 *
 * @apiQuery {String} ids 以 , 分隔的 ID 字符串，例如： id1,id2,id3
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

		const ids = String(query.ids).split(',');

		if (!ids || ids.length < 1) {
			return resultFormat(400, '请求参数错误');
		}

		// 检查是否存在 isUse 为 yes 的记录
		const activeSite = await SiteInfoModel.findOne({ _id: { $in: ids }, isUse: 'yes' });
		if (activeSite) {
			return resultFormat(400, '无法删除正在使用的站点信息');
		}

		// 批量删除站点信息
		const result = await SiteInfoModel.deleteMany({ _id: { $in: ids } });

		if (result.deletedCount < 1) {
			return resultFormat(400, '未找到要删除的站点信息');
		}

		return resultFormat(200, `删除成功，共删除 ${result.deletedCount} 条记录`);
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
