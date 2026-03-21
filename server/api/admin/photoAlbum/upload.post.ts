import { error } from '~/server/utils/util.logger';
import type { IFile } from '~/server/models/files.model';
import PhotoAlbumModel from '~/server/models/photoAlbum.model';
import { resultFormat } from '~/server/utils/util.resultFormat';

/**
 * @api {post} /admin/photoAlbum/upload 上传照片到相册
 * @apiName 上传照片
 * @apiGroup 相册管理
 * @apiDescription 上传图片并写入相册记录（仅处理图片文件，非图片将被忽略）。上传文件由全局上传中间件处理，接口读取处理结果并落库。
 *
 * @apiPermission admin
 *
 * @apiSampleRequest /admin/photoAlbum/upload
 *
 * @apiBody {File[]} files 要上传的图片数组（字段名为 files）
 * @apiBody {String} [title] 标题（未提供时将使用原始文件名去扩展名）
 * @apiBody {String} [description] 照片描述
 * @apiBody {String[]} [tags] 标签
 *
 * @apiSuccess {Number} code 响应状态码
 * @apiSuccess {String} message 响应消息
 * @apiSuccess {Object[]} data 新增的相册记录
 * @apiSuccess {String} data._id 记录ID
 * @apiSuccess {String} data.title 标题
 * @apiSuccess {String} data.url 资源URL
 * @apiSuccess {String} data.path 服务器路径
 * @apiSuccess {String} data.description 描述
 * @apiSuccess {String[]} data.tags 标签
 * @apiSuccess {String} data.createdAt 创建时间
 * @apiSuccess {String} data.updatedAt 更新时间
 */
export default defineEventHandler(async (event) => {
	try {
		// 在 multipart 场景下，字段由 multer 写入 req.body
		// @ts-expect-error - Express.Multer types may not be fully compatible
		const formBody = (event.node.req.body || {}) as Record<string, unknown>;
		const commonTitle: string = typeof formBody.title === 'string' ? formBody.title : '';
		const description: string =
			typeof formBody.description === 'string' ? formBody.description : '';
		const rawTags = formBody.tags;
		const tags: string[] = Array.isArray(rawTags)
			? (rawTags as string[]).filter((tag) => typeof tag === 'string' && tag.trim() !== '')
			: typeof rawTags === 'string' && rawTags.trim()
				? [rawTags.trim()]
				: [];
		const middlewareResult: IFile[] | undefined = event.context.result;

		if (!Array.isArray(middlewareResult) || middlewareResult.length === 0) {
			return resultFormat(400, '未检测到上传的文件');
		}

		// 仅保留图片类型
		const imageFiles = middlewareResult.filter(
			(f: IFile) => typeof f.mimetype === 'string' && f.mimetype.startsWith('image/')
		);

		if (imageFiles.length === 0) {
			return resultFormat(400, '未检测到图片文件');
		}

		const stripExt = (name: string) => name.replace(/\.[^.]+$/, '');
		const createPayloads = imageFiles.map((f: IFile) => {
			const originalName = f.originalName;
			const derivedTitle = commonTitle || (originalName ? stripExt(originalName) : '');
			return {
				title: derivedTitle,
				url: f.url,
				path: f.path,
				description,
				tags,
			};
		});

		const created = await PhotoAlbumModel.insertMany(createPayloads);

		return resultFormat(200, '上传成功', created);
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return resultFormat(500, errorMessage);
	}
});
