import { error } from '~/server/utils/util.logger';
import PhotoAlbumModel from '~/server/models/photoAlbum.model';
import { resultFormat } from '~/server/utils/util.resultFormat';

/**
 * @api {post} /admin/photoAlbum/deleteMany 批量删除相册
 * @apiName 批量删除相册
 * @apiGroup 相册管理
 * @apiDescription 批量删除相册记录
 *
 * @apiPermission admin
 *
 * @apiBody {String[]} ids 相册ID数组
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 */
export default defineEventHandler(async (event) => {
	try {
		const body = await readBody(event);
		const ids = body.ids;

		if (!Array.isArray(ids) || ids.length === 0) {
			return resultFormat(400, '请求参数错误');
		}

		const result = await PhotoAlbumModel.deleteMany({ _id: { $in: ids } });

		return resultFormat(200, `删除成功，共删除 ${result.deletedCount} 条记录`);
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
