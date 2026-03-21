import dayjs from 'dayjs';
import { error } from '~/server/utils/util.logger';
import FriendlyLinkModel from '~/server/models/friendlyLink.model';

/**
 * @api {put} /admin/friendlyLink/update 更新友链
 * @apiName 更新友链
 * @apiGroup 友链管理
 * @apiDescription 更新友链信息，包括状态、描述、备注等
 *
 * @apiPermission admin
 *
 * @apiSampleRequest /admin/friendlyLink/update
 *
 * @apiBody {Object} friendlyLink 友链对象
 * @apiBody {String} friendlyLink.id 友链ID
 * @apiBody {String} [friendlyLink.name] 友链名称
 * @apiBody {String} [friendlyLink.url] 友链地址
 * @apiBody {String} [friendlyLink.icon] 友链图标
 * @apiBody {String} [friendlyLink.status] 友链状态 (pending/approved/rejected)
 * @apiBody {String} [friendlyLink.description] 友链描述
 * @apiBody {String} [friendlyLink.email] 联系邮箱
 * @apiBody {String} [friendlyLink.remark] 备注
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccess {Object} data 更新后的友链数据
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message": "更新成功"
 *     }
 */
export default defineEventHandler(async (event) => {
	try {
		const { friendlyLink } = await readBody(event);

		console.log('friendlyLink: ', friendlyLink);

		if (!friendlyLink || !friendlyLink.id) {
			return resultFormat(400, '请求参数错误');
		}

		const { id, name, url, icon, status, description, email, remark } = friendlyLink;

		// 构建更新数据对象
		const updateData: Record<string, unknown> = {};

		if (name) updateData.name = name;
		if (url) updateData.url = url;
		if (icon !== undefined) updateData.icon = icon;
		if (status) updateData.status = status;
		if (description !== undefined) updateData.description = description;
		if (email) updateData.email = email;
		if (remark !== undefined) updateData.remark = remark;

		// 更新更新时间
		updateData.updatedAt = dayjs().format('YYYY年MM月DD日 HH:mm:ss');

		const updatedFriendlyLink = await FriendlyLinkModel.findByIdAndUpdate(id, updateData, {
			new: true,
			runValidators: true,
		});

		if (!updatedFriendlyLink) {
			return resultFormat(404, '友链不存在');
		}

		return resultFormat(200, '更新成功');
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
