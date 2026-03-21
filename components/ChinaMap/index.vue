<template>
	<div class="china-map w-full h-full" ref="mapContainer"></div>
</template>

<script lang="ts">
import * as echarts from 'echarts';
import type { PropType } from 'vue';

export default defineComponent({
	name: 'ChinaMap',
	props: {
		title: {
			type: String,
			default: '全国地区访问情况',
		},
		subTitle: {
			type: String,
			default: '从2021年月至今',
		},
		data: {
			type: Array as PropType<{ name: string; value: number }[]>,
			default: () => [],
		},
	},
	setup(props) {
		const mapContainer = useTemplateRef<HTMLDivElement>('mapContainer');
		let chartInstance: echarts.ECharts | null = null;
		let geoCoordMap: Record<string, number[]> = {};
		const mapName = 'chinaMap';
		const maxSize4Pin = 100;
		const minSize4Pin = 20;
		const max = 480;
		const min = 9;

		const convertData = (data: { name: string; value: number }[]) => {
			const res: { name: string; value: number[] }[] = [];
			for (let i = 0; i < data.length; i++) {
				const geoCoord = geoCoordMap[data[i].name];
				if (geoCoord) {
					res.push({
						name: data[i].name,
						value: geoCoord.concat(data[i].value),
					});
				}
			}
			return res;
		};

		const buildOption = (dataList: { name: string; value: number }[]) => {
			const arr = [...dataList];
			const sorted = arr.sort((a, b) => b.value - a.value);
			const maxVal = sorted[0]?.value || 200;
			return {
				title: {
					text: props.title,
					subtext: props.subTitle,
					x: 'center',
					textStyle: {
						color: 'rgb(55, 75, 113)',
						fontFamily: '等线',
						fontSize: 18,
					},
					subtextStyle: {
						fontSize: 15,
						fontFamily: '等线',
					},
				},
				visualMap: {
					show: dataList.length > 0,
					min: 0,
					max: maxVal,
					left: 'left',
					top: 'bottom',
					text: ['高', '低'], // 文本，默认为数值文本
					calculable: true,
					seriesIndex: [1],
					inRange: {
						color: ['#BBDEFB', '#1976D2'], // 浅蓝 -> 深蓝
					},
				},
				geo: {
					show: true,
					map: mapName,
					label: {
						show: false,
					},
					roam: true,
					itemStyle: {
						areaColor: '#031525',
						borderColor: '#3B5077',
					},
					emphasis: {
						label: {
							show: false,
						},
						itemStyle: {
							areaColor: '#2B91B7',
						},
					},
				},
				tooltip: {
					trigger: 'item',
					formatter: function (params: any) {
						if (params.value.length > 2) {
							return `${params.name}<br/>访问量: ${params.value[2]}`;
						} else {
							return `${params.name}<br/>访问量: ${params.value}`;
						}
					},
				},
				series: [
					{
						name: '散点',
						type: 'scatter',
						coordinateSystem: 'geo',
						data: convertData(dataList),
						symbolSize: function (val: any[]) {
							return val[2] / 10;
						},
						label: {
							formatter: '{b}',
							position: 'right',
							show: true,
						},
						emphasis: {
							label: {
								show: true,
							},
						},
						itemStyle: {
							color: '#05C3F9',
						},
					},
					{
						type: 'map',
						map: mapName,
						geoIndex: 0,
						aspectScale: 0.75, //长宽比
						showLegendSymbol: false, // 存在legend时显示
						label: {
							show: true,
							// 【修改点1】地图区域显示：省份名 + 原始数据
							formatter: function (params: any) {
								return params.name + '\n' + (params.value || 0);
							},
						},
						roam: true,
						itemStyle: {
							areaColor: '#E3F2FD',
							borderColor: '#3B5077',
						},
						animation: false,
						data: dataList,
						emphasis: {
							label: {
								show: false,
								color: '#fff',
							},
							itemStyle: {
								areaColor: '#2B91B7',
							},
						},
					},
					{
						name: '点',
						type: 'scatter',
						coordinateSystem: 'geo',
						symbol: 'pin', // 气泡
						symbolSize: function (val: any[]) {
							let a = (maxSize4Pin - minSize4Pin) / (max - min);
							let b = minSize4Pin - a * min;
							b = maxSize4Pin - a * max;
							return a * val[2] + b;
						},
						label: {
							show: true,
							color: '#fff',
							fontSize: 9,
							// 【修改点2】气泡标记显示：原始数据
							formatter: function (params: any) {
								return params.value[2];
							},
						},
						itemStyle: {
							color: '#F62157', // 标志颜色
						},
						zlevel: 6,
						data: convertData(dataList),
					},
					{
						name: 'Top 5',
						type: 'effectScatter',
						coordinateSystem: 'geo',
						data: convertData(sorted.slice(0, 5)),
						symbolSize: function (val: any[]) {
							return val[2] / 10;
						},
						showEffectOn: 'render',
						rippleEffect: {
							brushType: 'stroke',
						},
						emphasis: {
							scale: true,
						},
						label: {
							formatter: '{b}',
							position: 'right',
							show: true,
						},
						itemStyle: {
							color: 'yellow',
							shadowBlur: 10,
							shadowColor: 'yellow',
						},
						zlevel: 1,
					},
				],
			};
		};

		onMounted(() => {
			if (!mapContainer.value) return;
			chartInstance = echarts.init(mapContainer.value);
			chartInstance.showLoading();
			const mapFeatures = echarts.getMap(mapName).geoJson.features;
			chartInstance.hideLoading();
			mapFeatures.forEach((v: { properties: { name: string; cp: number[] } }) => {
				geoCoordMap[v.properties.name] = v.properties.cp;
			});
			chartInstance.setOption(buildOption(props.data || []));
			window.addEventListener('resize', () => chartInstance?.resize());
		});

		watch(
			() => props.data,
			(newData) => {
				if (chartInstance) {
					chartInstance.setOption(buildOption(newData || []));
				}
			},
			{ deep: true },
		);

		onBeforeUnmount(() => {
			chartInstance?.dispose();
		});
	},
});
</script>
