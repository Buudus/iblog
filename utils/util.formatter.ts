// 格式化数字
export function formatNumber(num: number): string {
	if (!num) return '0';
	if (num < 1000) return num.toString();
	if (num < 10000) return (num / 1000).toFixed(1) + 'K';
	return (num / 10000).toFixed(1) + 'W';
}
