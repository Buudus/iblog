import type { IFile } from '~/server/models/files.model';

/**
 * @api {post} /admin/file/upload 上传文件
 * @apiName 上传文件
 * @apiGroup 文件管理
 * @apiDescription 上传文件到服务器，支持多文件上传，支持所有文件类型
 *
 * @apiPermission admin
 *
 * @apiBody {File[]} files 要上传的文件数组
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccess {Object[]} data 上传成功的文件信息数组
 * @apiSuccess {String} data.fileId 文件ID
 * @apiSuccess {String} data.fileName 唯一文件名（用于数据库存储）
 * @apiSuccess {String} data.originalName 原始文件名
 * @apiSuccess {String} data.fileUrl 文件访问URL
 * @apiSuccess {String} data.filePath 文件存储路径
 * @apiSuccess {String} data.mimetype 文件MIME类型
 * @apiSuccess {Number} data.size 文件大小（字节）
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "code": 201,
 *       "message": "文件上传成功",
 *       "data": [
 *         {
 *           "_id": "68ea1c65dc9f1361520334c3",
 *           "name": "1760173157418_3dryvl.webp",
 *           "originalName": "DolaAm.jpg",
 *           "mimetype": "image/webp",
 *           "url": "/resource/1760173157418_3dryvl.webp",
 *           "path": "...public\\resource\\1760173157418_3dryvl.webp",
 *           "md5": "67995e90bbb81d6ddb1cf43487949951",
 *           "size": 26817,
 *           "createdAt": "2025年10月11日 16:57:26",
 *           "updatedAt": "2025年10月11日 16:57:26",
 *           "__v": 0
 *         }
 *       ]
 *     }
 */
export default defineEventHandler(async (event) => {
	const result: IFile[] | undefined = event.context.result;

	if (result instanceof Array && result.length > 0) {
		return resultFormat(201, '文件上传成功', result);
	}

	return resultFormat(500, '文件上传失败');
});
