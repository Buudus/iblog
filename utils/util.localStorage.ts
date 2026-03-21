/**
 * 设置 localStorage
 * @param { string } key 键
 * @param { string } value 值
 */
export function localStorageSet(key: string, value: string): string {
	localStorage.setItem(`ly-blog-${key}`, value);
	return value;
}

/**
 * 获取 localStorage
 * @param key 键
 */
export function localStorageGet(key: string): string | null {
	return localStorage.getItem(`ly-blog-${key}`);
}

/**
 * 删除 localStorage
 * @param key 键
 */
export function localStorageRemove(key: string): void {
	localStorage.removeItem(`ly-blog-${key}`);
}
