import { api } from '~/utils/util.fetch';

export default defineNuxtPlugin(() => {
	// 将api实例注入到Nuxt应用中
	return {
		provide: {
			api,
		},
	};
});
