import { clientArticleApi } from '~/api';

export const useHotArticleStore = defineStore('hotArticle', () => {
	const hotArticles = ref<ClientArticle[]>([]);

	const getHotArticleTop3 = async (): Promise<void> => {
		const result = await clientArticleApi.getHotArticles();
		hotArticles.value = result.data;
	};

	return {
		hotArticles,
		getHotArticleTop3,
	};
});
