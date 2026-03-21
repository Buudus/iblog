import { clientSiteInfoApi, type SiteInfo } from '~/api';

export const useSiteInfoStore = defineStore('siteInfo', () => {
	const siteInfo = reactive<SiteInfo>({
		_id: '',
		title: '',
		keywords: '',
		description: '',
		globalStyle: '',
		globalScript: '',
		domain: '',
		logo: '',
		isUse: 'yes',
		createdAt: '',
		updatedAt: '',
	});

	// 获取站点信息配置
	const fetchSiteInfo = async (): Promise<void> => {
		const result = await clientSiteInfoApi.getSiteInfo();
		if (result.code === 200) {
			Object.assign(siteInfo, result.data);
		}
	};

	return {
		siteInfo,
		fetchSiteInfo,
	};
});
