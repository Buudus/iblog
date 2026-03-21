<template>
	<LyCard>
		<div class="ly-copyright w-full h-16">
			<div class="content w-full h-full flex flex-col justify-center items-center">
				<p class="text-xs text-gray-500 dark:text-gray-300">
					CopyRight &#169; 2025 - {{ year }} by LanYun
				</p>
				<p class="text-xs text-gray-500 dark:text-gray-300 mt-3">{{ currentDateTime }}</p>
			</div>
		</div>
	</LyCard>
</template>

<script lang="ts">
import dayjs from 'dayjs';

export default defineComponent({
	name: 'LyCopyRight',
	setup() {
		// 当前年份
		const year = new Date().getFullYear();

		// 获取当前日期时间
		const currentDateTime = ref<string>('');
		const getCurrentDateTime = () => {
			const dateTime = dayjs().format('YYYY年MM月DD日 HH:mm:ss');
			currentDateTime.value = dateTime;
		};

		let timer: any;
		onMounted((): void => {
			timer = setInterval(getCurrentDateTime, 1000);
		});

		onBeforeUnmount((): void => {
			clearInterval(timer);
		});

		return {
			year,
			currentDateTime,
		};
	},
});
</script>
