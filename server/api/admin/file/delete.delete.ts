import path from 'node:path';
import fs from 'node:fs/promises';
import { error } from '~/server/utils/util.logger';
import FileModel from '~/server/models/files.model';
import { resolveUploadDir } from '~/server/utils/util.file';

/**
 * @api {delete} /admin/file/delete 删除文件
 * @apiName 删除文件
 * @apiGroup 文件管理
 * @apiDescription 删除数据库中的文件信息以及物理磁盘中的文件，支持批量删除
 *
 * @apiPermission admin
 *
 * @apiQuery {String} ids 以 , 分隔的文件ID字符串，例如：id1,id2,id3
 *
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
		const fileIds = String(query.ids || '')
			.split(',')
			.filter(Boolean);

		if (!fileIds || fileIds.length === 0) {
			return resultFormat(400, '请求参数错误');
		}

		const failedDeletes = [];

		for (const fileId of fileIds) {
			try {
				const fileRecord = await FileModel.findById(fileId);

				if (!fileRecord) {
					failedDeletes.push(fileId);
					continue;
				}

				// 删除物理文件
				await fs.unlink(path.join(resolveUploadDir(), fileRecord.name));

				// 删除数据库记录
				await FileModel.findByIdAndDelete(fileId);
			} catch (err: unknown) {
				failedDeletes.push(fileId);
				const errorMessage = err instanceof Error ? err.message : '未知错误';
				error(`删除文件失败: ${fileId}, 错误: ${errorMessage}`);
			}
		}

		if (failedDeletes.length > 0) {
			return resultFormat(500, '部分文件删除失败', { failedDeletes });
		}

		return resultFormat(200, '删除成功');
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
