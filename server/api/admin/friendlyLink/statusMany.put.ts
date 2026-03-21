import dayjs from 'dayjs';
import { error } from '~/server/utils/util.logger';
import FriendlyLinkModel from '~/server/models/friendlyLink.model';
import { resultFormat } from '~/server/utils/util.resultFormat';

/**
 * @api {put} /admin/friendlyLink/statusMany 批量更新友链状态
 * @apiName 批量更新友链状态
 * @apiGroup 友链管理
 * @apiDescription 批量更新友链状态，支持批量审批或拒绝
 *
 * @apiPermission admin
 *
 * @apiSampleRequest /admin/friendlyLink/statusMany
 *
 * @apiBody {String[]} ids 友链ID数组
 * @apiBody {String} status 友链状态 (pending/approved/rejected)
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message": "批量更新成功，共更新 5 条记录"
 *     }
 */
export default defineEventHandler(async (event) => {
	try {
		const { ids, status } = await readBody(event);

		if (!ids || !Array.isArray(ids) || ids.length < 1) {
			return resultFormat(400, '请求参数错误：ids 必须是非空数组');
		}

		if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
			return resultFormat(400, '请求参数错误：status 必须是 pending、approved 或 rejected');
		}

		const updateData = {
			status,
			updatedAt: dayjs().format('YYYY年MM月DD日 HH:mm:ss'),
		};

		const result = await FriendlyLinkModel.updateMany(
			{ _id: { $in: ids } },
			{ $set: updateData }
		);

		if (result.matchedCount < 1) {
			return resultFormat(404, '未找到要更新的友链');
		}

		return resultFormat(200, `批量更新成功，共更新 ${result.modifiedCount} 条记录`);
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});

