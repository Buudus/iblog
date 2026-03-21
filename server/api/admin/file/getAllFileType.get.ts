import { error } from '~/server/utils/util.logger';
import FileModel from '~/server/models/files.model';

/**
 * @api {get} /admin/file/getFileType 获取文件类型列表
 * @apiName 获取文件类型列表
 * @apiGroup 文件管理
 * @apiDescription 获取系统中所有存在的文件类型（MIME类型）列表，用于筛选和分类
 *
 * @apiPermission admin
 *
 * @apiSampleRequest /admin/file/getFileType
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccess {String[]} data 文件类型列表
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "message": "获取成功",
 *       "data": [
 *         "image/jpeg",
 *         "image/png",
 *         "image/gif",
 *         "application/pdf",
 *         "text/plain",
 *         "application/zip"
 *       ]
 *     }
 */
export default defineEventHandler(async () => {
	try {
		// 使用 distinct 方法获取所有不同的 mimetype 值
		const fileTypes = await FileModel.distinct('mimetype');

		// 按类型排序，图片类型在前，其他类型在后
		const sortedFileTypes = fileTypes.sort((a, b) => {
			// 图片类型优先
			if (a.startsWith('image/') && !b.startsWith('image/')) return -1;
			if (!a.startsWith('image/') && b.startsWith('image/')) return 1;

			// 同类型内部按字母顺序排序
			return a.localeCompare(b);
		});

		return resultFormat(200, '获取成功', sortedFileTypes);
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
