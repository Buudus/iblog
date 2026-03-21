<template>
	<div class="line-chart w-[350px] h-[230px]" ref="lineChartContainer"></div>
</template>

<script lang="ts">
import * as echarts from 'echarts';

export default defineComponent({
	name: 'LineChart',
	props: {
		category: {
			type: Array as PropType<string[]>,
			default: () => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
		},
		data: {
			type: Array as PropType<number[]>,
			default: () => [150, 230, 224, 218, 135, 147, 260],
		},
		title: {
			type: String,
			default: '最近七天文章浏览时长',
		},
	},
	setup(props) {
		const lineChartContainer = useTemplateRef<HTMLDivElement>('lineChartContainer');
		let chartInstance: echarts.ECharts | null = null;

		const option = computed(() => ({
			title: {
				text: props.title,
				textStyle: { fontSize: 14 },
			},
			grid: { left: '3%', right: '3%', bottom: '3%' },
			xAxis: { type: 'category', data: props.category },
			yAxis: { type: 'value' },
			series: [{ data: props.data, type: 'line' }],
			tooltip: { trigger: 'axis' },
		}));

		const updateChart = () => {
			if (chartInstance && lineChartContainer.value) {
				chartInstance.setOption(option.value);
			}
		};

		onMounted(() => {
			if (lineChartContainer.value) {
				chartInstance = echarts.init(lineChartContainer.value);
				chartInstance.setOption(option.value);
			}
		});

		watch(
			() => [props.category, props.data, props.title],
			updateChart,
			{ deep: true }
		);

		onBeforeUnmount(() => {
			chartInstance?.dispose();
		});
	},
});
</script>
