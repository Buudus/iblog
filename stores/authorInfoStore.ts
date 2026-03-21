import { clientAuthorInfoApi, type AuthorInfo } from '~/api';

export const useAuthorInfoStore = defineStore('authorInfo', () => {
	// 作者信息
	const authorInfo = reactive<AuthorInfo>({
		avatar: '',
		name: '',
		ps: '',
		biography: '',
		qq: '',
		wechat: '',
		email: '',
		github: '',
		weibo: '',
		isUse: 'no',
	});

	// 获取作者信息
	const fetchAuthorInfo = async (): Promise<void> => {
		const result = await clientAuthorInfoApi.getAuthorInfo();
		if (result.code === 200) {
			Object.assign(authorInfo, result.data);
		}
	};

	return {
		authorInfo,
		fetchAuthorInfo,
	};
});
