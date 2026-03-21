import { v4 as uuidv4 } from 'uuid';

export const useUserSotre = defineStore('user', () => {
	// 用户初始化
	const userInit = (): void => {
		const localUserId = localStorageGet('userId');

		if (!localUserId) {
			const id = uuidv4();
			localStorageSet('userId', id);
			document.cookie = `userId=${id}; path=/; max-age=${60 * 60 * 24 * 365}`;
		}

		document.cookie = `userId=${localUserId}; path=/; max-age=${60 * 60 * 24 * 365}`;
	};

	return {
		userInit,
	};
});
