export const useScreenStore = defineStore('screen', () => {
	const screenWidth = ref<number>(0);

	// 当前屏幕模式
	const screenMode = computed<'mobile' | 'tablet' | 'desktop'>(() => {
		if (screenWidth.value <= 768) {
			return 'mobile';
		}

		if (screenWidth.value <= 1200) {
			return 'tablet';
		}

		return 'desktop';
	});

	onMounted(() => {
		screenWidth.value = window.innerWidth;
		window.addEventListener('resize', () => {
			screenWidth.value = window.innerWidth;
		});
	});

	onBeforeUnmount(() => {
		window.removeEventListener('resize', () => {});
	});

	return {
		screenMode,
		screenWidth,
	};
});
