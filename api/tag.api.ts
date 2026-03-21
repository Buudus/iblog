import { api } from '~/utils/util.fetch';
import { clientArticleApi } from './article.api';

// 标签类型
export interface Tag {
	name: string;
	count: number;
}

// 标签管理API
export const tagApi = {
	// 获取标签列表（使用客户端接口，逻辑相同）
	getList: () => clientArticleApi.getTags(),

	// 删除标签（会删除所有包含该标签的文章）
	delete: (tags: string) => api.delete(`/api/admin/tag/delete?tags=${tags}`),
};
