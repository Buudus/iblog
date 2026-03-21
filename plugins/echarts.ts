import * as echarts from 'echarts';
import chinaMap from '~/assets/json/chinaMap.json';
import type { GeoJSONCompressed } from 'echarts/types/src/coord/geo/geoTypes.js';

export default defineNuxtPlugin((nuxtApp) => {
	// 注册中国地图
	echarts.registerMap('chinaMap', chinaMap as GeoJSONCompressed);
});
