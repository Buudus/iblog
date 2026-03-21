import { api } from '~/utils/util.fetch';

export interface ClientSiteStats {
	articleCount: number;
	categoryCount: number;
	visitCount: number;
}

export const siteStatsApi = {
	getStats: () => api.get<ClientSiteStats>('/api/client/site/stats'),
};
