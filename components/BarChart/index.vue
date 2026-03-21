<template>
	<div class="bar-chart w-[350px] h-[230px]" ref="barChartContainer"></div>
</template>

<script lang="ts">
import * as echarts from 'echarts';

export default defineComponent({
	name: 'BarChart',
	props: {
		category: {
			type: Array as PropType<string[]>,
			default: () => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
		},
		data: {
			type: Array as PropType<number[]>,
			default: () => [150, 230, 224, 218, 135],
		},
		title: {
			type: String,
			default: '最近七天浏览量最高的分类TOP5',
		},
	},
	setup(props) {
		const barChartContainer = useTemplateRef<HTMLDivElement>('barChartContainer');
		let chartInstance: echarts.ECharts | null = null;

		const option = computed(() => ({
			title: {
				text: props.title,
				textStyle: { fontSize: 14 },
			},
			grid: { left: '3%', right: '3%', bottom: '3%' },
			yAxis: { type: 'category', data: props.category },
			xAxis: { type: 'value' },
			series: [{ data: props.data, type: 'bar' }],
			tooltip: { trigger: 'item' },
		}));

		const updateChart = () => {
			if (chartInstance && barChartContainer.value) {
				chartInstance.setOption(option.value);
			}
		};

		onMounted(() => {
			if (barChartContainer.value) {
				chartInstance = echarts.init(barChartContainer.value);
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
