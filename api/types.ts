// 通用响应类型
export interface ApiResponse<T = unknown> {
	code: number;
	message: string;
	data: T;
	success: boolean;
}

// 分页响应类型
export interface PaginationResponse<T = unknown> {
	list: T[];
	total: number;
	page: number;
	pageSize: number;
}

// 文件上传响应类型
export interface FileView {
	_id: string;
	url: string;
	name: string;
	size: number;
	type?: string;
	mimetype?: string;
	originalName?: string;
	createdAt: string;
}

// 站点信息类型
export interface SiteInfo {
	_id?: string;
	title: string;
	keywords: string;
	description: string;
	globalStyle: string;
	globalScript: string;
	domain: string;
	logo: string;
	isUse: 'yes' | 'no';
	createdAt?: string;
	updatedAt?: string;
}

// 作者信息类型
export interface AuthorInfo {
	_id?: string;
	avatar: string;
	name: string;
	ps: string;
	biography: string;
	qq: string;
	wechat: string;
	email: string;
	github: string;
	weibo: string;
	isUse: 'yes' | 'no';
	createdAt?: string;
	updatedAt?: string;
}

// 分类类型
export interface Category {
	_id?: string;
	name: string;
	description: string;
	createdAt?: string;
	updatedAt?: string;
}

// 文章类型
export interface Article {
	_id?: string;
	title: string;
	content: string;
	views: number;
	cover: string;
	tags: string[];
	categoryId: string;
	likes: number;
	status: 'draft' | 'published';
	createdAt?: string;
	updatedAt?: string;
}

// 管理员角色/权限类型
export interface AdminRole {
	name: string;
	description: string;
	createdAt?: string;
	updatedAt?: string;
}

// 管理员用户类型
export interface AdminUser {
	_id?: string;
	username: string;
	nickname: string;
	avatar: string;
	password?: string;
	role: string;
	createdAt?: string;
	updatedAt?: string;
}

// 友情链接类型
export interface FriendlyLink {
	_id?: string;
	name: string;
	url: string;
	icon: string;
	description: string;
	email: string;
	remark: string;
	status: 'pending' | 'approved' | 'rejected';
	createdAt?: string;
	updatedAt?: string;
}

// 留言类型
export interface LeaveMessage {
	_id?: string;
	concat: string; // 联系人
	content: string; // 留言内容
	ip: string; // IP 地址
	userAgent?: string; // User-Agent（可选）
	createdAt?: string; // 创建时间
	updatedAt?: string; // 更新时间
}

// 相册类型
export interface PhotoAlbum {
	_id?: string;
	title: string;
	url: string;
	path: string;
	description: string;
	tags: string[];
	createdAt?: string;
	updatedAt?: string;
}
