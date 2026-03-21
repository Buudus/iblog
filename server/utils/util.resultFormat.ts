/**
 * 格式化返回结果
 * @param { number } code 返回状态码
 * @param { string } message 返回消息
 * @param { object } data 返回数据
 */
export function resultFormat(code: number, message: string, data?: object) {
	if (!code || !message) throw new Error('参数缺失，无法格式化返回结果');

	return {
		code,
		message,
		data: data || undefined,
	};
}
