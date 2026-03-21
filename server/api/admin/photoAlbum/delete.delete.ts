import { error } from '~/server/utils/util.logger';
import PhotoAlbumModel from '~/server/models/photoAlbum.model';
import { resultFormat } from '~/server/utils/util.resultFormat';

/**
 * @api {delete} /admin/photoAlbum/delete 删除相册
 * @apiName 删除相册
 * @apiGroup 相册管理
 * @apiDescription 删除指定的相册记录，支持批量删除
 *
 * @apiPermission admin
 *
 * @apiQuery {String} ids 以 , 分隔的相册ID字符串，例如：id1,id2,id3
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 */
export default defineEventHandler(async (event) => {
	try {
		const query = getQuery(event);
		const albumIds = String(query.ids || '')
			.split(',')
			.filter(Boolean);

		if (!albumIds || albumIds.length === 0) {
			return resultFormat(400, '请求参数错误');
		}

		const result = await PhotoAlbumModel.deleteMany({ _id: { $in: albumIds } });

		return resultFormat(200, `删除成功，共删除 ${result.deletedCount} 条记录`);
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
