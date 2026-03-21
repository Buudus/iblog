import fs from 'node:fs';
import path from 'node:path';

// 资源路径
export function resolveUploadDir(): string {
	const cwd = process.cwd();

	// 兼容打包后 `.output/server` 与 `.output/public` 分离的结构：
	// - 若 cwd 为 `.output`：public 在 `${cwd}/public`
	// - 若 cwd 为 `.output/server`：public 在 `${cwd}/../public`
	const publicDirCandidates = [path.resolve(cwd, 'public'), path.resolve(cwd, '..', 'public')];
	const publicDir =
		publicDirCandidates.find((p) => fs.existsSync(p)) ?? path.resolve(cwd, 'public');

	return path.join(publicDir, 'resource');
}
