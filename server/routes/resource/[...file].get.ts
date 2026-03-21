import fs from 'node:fs';
import path from 'node:path';
import { lookup } from 'mrmime';
import { defineEventHandler, getRouterParam, sendStream, setHeader } from 'h3';

function resolvePublicDir() {
	const cwd = process.cwd();
	const candidates = [path.resolve(cwd, 'public'), path.resolve(cwd, '..', 'public')];
	return candidates.find((p) => fs.existsSync(p)) ?? path.resolve(cwd, 'public');
}

export default defineEventHandler(async (event) => {
	const fileParam = getRouterParam(event, 'file') || '';
	// 防止路径穿越：只允许相对路径且不能回退上级目录
	const normalized = path.normalize(fileParam).replace(/^([/\\])+/, '');
	if (!normalized || normalized.startsWith('..') || normalized.includes('..' + path.sep)) {
		event.node.res.statusCode = 400;
		return 'Bad Request';
	}

	const filePath = path.join(resolvePublicDir(), 'resource', normalized);
	if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
		event.node.res.statusCode = 404;
		return 'Not Found';
	}

	const mime = lookup(filePath) || 'application/octet-stream';
	setHeader(event, 'Content-Type', mime);
	return sendStream(event, fs.createReadStream(filePath));
});
