let transitionTimer: number | null = null;

const triggerThemeTransition = () => {
	if (typeof document === 'undefined') return;
	const root = document.documentElement;
	root.classList.add('theme-transition');
	if (transitionTimer) {
		window.clearTimeout(transitionTimer);
	}
	transitionTimer = window.setTimeout(() => {
		root.classList.remove('theme-transition');
		transitionTimer = null;
	}, 400);
};

export const useThemeStore = defineStore('theme', () => {
	// 当前主题模式
	const theme = ref<'dark' | 'light'>('light');
	watch(theme, (val: 'dark' | 'light') => {
		if (val === 'dark') {
			document.documentElement.classList.add('dark');
			return;
		}
		document.documentElement.classList.remove('dark');
	});

	// 切换主题
	const toggleTheme = (): void => {
		triggerThemeTransition();
		if (theme.value === 'dark') {
			theme.value = 'light';
			localStorageSet('theme', 'light');
		} else {
			theme.value = 'dark';
			localStorageSet('theme', 'dark');
		}
	};

	onMounted(() => {
		// 初始化主题模式
		if (localStorageGet('theme') === 'dark') {
			theme.value = 'dark';
		}
	});

	// 当前主题
	const currentTheme = computed<'dark' | 'light'>(() => {
		return theme.value;
	});

	return {
		currentTheme,
		toggleTheme,
	};
});
