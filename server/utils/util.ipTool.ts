import IP2Region from 'ip2region';
import { getRequestIP, getHeader } from 'h3';
import type { H3Event } from 'h3';

export interface RegionInfo {
	country: string;
	province: string;
	city: string;
	isp: string;
}

export function ipToRegion(ip: string) {
	const query = new (IP2Region as any).default();
	const result = query.search(ip);

	if (!result) {
		return {
			country: '未知',
			province: '未知',
			city: '未知',
			isp: '未知',
		};
	}

	return {
		country: result.country,
		province: result.province,
		city: result.city,
		isp: result.isp,
	};
}

/**
 * 获取客户端真实 IP（兼容 Nginx 等反向代理）
 * 优先读取 X-Real-IP，其次 X-Forwarded-For 最左侧 IP，最后为连接方 IP
 */
export function getClientIp(event: H3Event): string {
	const xRealIp = getHeader(event, 'x-real-ip');
	if (xRealIp && typeof xRealIp === 'string') {
		const ip = xRealIp.trim().split(',')[0].trim();
		if (ip) return ip;
	}
	const xForwardedFor = getHeader(event, 'x-forwarded-for');
	if (xForwardedFor && typeof xForwardedFor === 'string') {
		const ip = xForwardedFor.trim().split(',')[0].trim();
		if (ip) return ip;
	}
	const ip = getRequestIP(event, { xForwardedFor: true });
	return ip || 'Unknown';
}
