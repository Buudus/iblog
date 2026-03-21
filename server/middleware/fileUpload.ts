import fs from 'node:fs';
import sharp from 'sharp';
import multer from 'multer';
import path from 'node:path';
import { md5 } from '~/server/utils/util.crypto';
import { error } from '~/server/utils/util.logger';
import FileModel from '~/server/models/files.model';
import { resolveUploadDir } from '../utils/util.file';

// 配置 multer，上传到 public/resource 目录
const uploadDir = resolveUploadDir();

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.memoryStorage();

const upload = multer({
	storage,
	limits: {
		// 文件上传大小限制为 500M
		fileSize: 500 * 1024 * 1024,
		// 最大同时上传文件数量限制为 10
		files: 10,
	},
});

// 需要处理的路径
const UPLOAD_REQUIRED_PATHS = ['/api/admin/file/upload', '/api/admin/photoAlbum/upload'];

export default defineEventHandler(async (event) => {
	// 检查当前路径是否需要验证码校验
	const currentPath = event.path;
	const needsHandle = UPLOAD_REQUIRED_PATHS.some((path) => currentPath.includes(path));

	if (!needsHandle) return;

	try {
		// 处理 multipart/form-data
		await new Promise((resolve, reject) => {
			// @ts-expect-error - Express types compatibility
			upload.array('files')(event.node.req, event.node.res, (err) => {
				if (err) reject(err);
				else resolve(null);
			});
		});

		// @ts-expect-error - Express.Multer types may not be fully compatible
		const files = event.node.req.files as Express.Multer.File[];
		if (!files || files.length === 0) {
			return { code: 0, message: '未检测到上传文件' };
		}

		const results = [];
		for (const file of files) {
			try {
				const fileMd5 = md5(file.buffer);

				// 查找数据库是否已存在
				const exist = await FileModel.findOne({ md5: fileMd5 });
				if (exist) {
					results.push(exist);
					continue;
				}

				// 生成文件名
				const ext = path.extname(file.originalname).toLowerCase();

				// 修复中文文件名乱码
				const safeOriginalName = Buffer.from(file.originalname, 'latin1').toString('utf8');

				const isImage = ['.jpg', '.jpeg', '.png'].includes(ext);

				let saveName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

				let savePath = '';

				let mimeType = file.mimetype;

				if (isImage) {
					// 转 webp
					saveName += '.webp';

					savePath = path.join(uploadDir, saveName);

					await sharp(file.buffer).webp().toFile(savePath);

					mimeType = 'image/webp';
				} else {
					// 其他文件原格式保存
					saveName += ext;

					savePath = path.join(uploadDir, saveName);

					fs.writeFileSync(savePath, file.buffer);
				}

				// 生成 url 路径（假设静态资源映射 /upload）
				const url = `/resource/${saveName}`;

				// 写入数据库
				const createResult = await FileModel.create({
					name: saveName,
					originalName: safeOriginalName,
					mimetype: mimeType,
					md5: fileMd5,
					url,
					size: file.size,
				});

				results.push(createResult);
			} catch (fileErr: unknown) {
				const errorMessage = fileErr instanceof Error ? fileErr.message : '单文件处理失败';
				results.push({
					error: true,
					originalName: file.originalname,
					message: errorMessage,
				});
			}
		}

		event.context.result = results;
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : '服务端错误';
		error(errorMessage);
		return {
			code: 500,
			message: errorMessage,
		};
	}
});
