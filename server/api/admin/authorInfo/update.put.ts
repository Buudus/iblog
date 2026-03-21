import dayjs from 'dayjs';
import { error } from '~/server/utils/util.logger';
import AuthorInfoModel from '~/server/models/authorInfo.model';

/**
 * @api {put} /admin/authorInfo/update 更新作者信息
 * @apiName 更新作者信息
 * @apiGroup 作者信息
 * @apiDescription 更新指定的作者信息
 *
 * @apiPermission admin
 *
 * @apiBody {String} id 作者信息ID
 * @apiBody {Object} authorInfo 作者信息对象（同创建）
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message": "更新成功"
 *     }
 */
export default defineEventHandler(async (event) => {
	try {
		const body = await readBody(event);
		const { authorInfo } = body || {};

		console.log('authorInfo: ', authorInfo);

		if (!authorInfo || typeof authorInfo !== 'object' || !authorInfo._id) {
			return resultFormat(400, '请求参数错误');
		}

		if (authorInfo.isUse === 'yes') {
			// 如果当前更新设为启用，则将其他记录设为不启用
			await AuthorInfoModel.updateMany(
				{ _id: { $ne: authorInfo._id }, isUse: 'yes' },
				{ isUse: 'no' }
			);
		}

		const res = await AuthorInfoModel.updateOne(
			{ _id: authorInfo._id },
			{ $set: { ...authorInfo, updatedAt: dayjs().format('YYYY年MM月DD日 HH:mm:ss') } }
		);
		if (res.matchedCount === 0) {
			return resultFormat(404, '作者信息不存在');
		}

		return resultFormat(200, '更新成功');
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
