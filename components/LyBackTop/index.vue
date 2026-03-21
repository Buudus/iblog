<template>
	<el-tooltip effect="dark" placement="left" :content="isBackTop ? '返回顶部' : '前往底部'">
		<Transition>
			<div
				v-show="scrollHeight !== 0"
				@click="t_handleScrollTo"
				:style="{ transform: `${isBackTop ? 'rotate(0)' : 'rotate(180deg)'}` }"
				class="ly-back-top p-3 z-30 duration-300 overflow-hidden rounded-full bg-white dark:bg-[#1e293b] fixed right-5 bottom-5 cursor-pointer shadow-sm shadow-slate-500 dark:shadow-slate-800">
				<div class="back-top w-full h-full flex items-center justify-center">
					<i class="bi bi-rocket-fill text-sm text-sky-500"></i>
				</div>
			</div>
		</Transition>
	</el-tooltip>
</template>

<script lang="ts">
export default defineComponent({
	name: 'LyBackTop',
	setup() {
		const scrollHeight = ref<number>(0);

		// 是否为返回底部
		const isBackTop = computed(() => scrollHeight.value > 1000);

		const handleScrollTo = (): void => {
			if (isBackTop.value) {
				window.scrollTo(0, 0);
			} else {
				window.scrollTo(0, document.documentElement.scrollHeight);
			}
		};
		const t_handleScrollTo = useThrottle(handleScrollTo, 500);

		onMounted(() => {
			// 获取初始滚动高度
			scrollHeight.value = document.documentElement.scrollTop;

			window.addEventListener('scroll', () => {
				scrollHeight.value = document.documentElement.scrollTop;
			});
		});

		onBeforeUnmount(() => {
			window.removeEventListener('scroll', () => {});
		});

		return {
			isBackTop,
			scrollHeight,
			t_handleScrollTo,
		};
	},
});
</script>
