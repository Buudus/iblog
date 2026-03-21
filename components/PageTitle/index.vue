<!-- 页面标题 -->
<template>
	<div class="page-title-com shadow-lg">
		<div
			class="title w-full h-72 flex items-center justify-center bg-center bg-cover bg-no-repeat duration-300 dark:brightness-85"
			style="background-image: url('/background.png')">
			<h1 v-scale class="text-4xl font-bold text-white text-shadow-xs">
				{{ title }}
			</h1>
			<div class="particles">
				<div class="particle" v-for="n in 30" :key="n"></div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
export default defineComponent({
	name: 'PageTitle',
	props: {
		title: {
			type: String,
			default: '标题',
		},
	},
});
</script>

<style lang="scss" scoped>
@use 'sass:math';

.page-title-com {
	.title {
		position: relative;
		overflow: hidden;

		.particles {
			position: absolute;
			inset: 0;
			z-index: 0;

			@for $i from 1 through 30 {
				.particle:nth-child(#{$i}) {
					position: absolute;
					width: 4px;
					height: 4px;
					background: rgba(255, 255, 255, 0.5);
					border-radius: 50%;
					animation: float 6s infinite linear;
					left: math.random() * 100%;
					top: math.random() * 100%;
					animation-delay: math.random() * 6000ms;
					animation-duration: (math.random() * 8000 + 4000) * 1ms; // 调整速度范围
				}
			}
		}

		h1 {
			position: relative;
			z-index: 1;
			text-shadow: 0 5px 10px rgba(114, 114, 114, 0.5); // 加大阴影范围
		}
	}
}

@keyframes float {
	0% {
		transform: translateY(0) rotate(0deg);
		opacity: 0;
	}
	20% {
		opacity: 1;
	}
	80% {
		opacity: 1;
	}
	100% {
		transform: translateY(-100vh) rotate(360deg);
		opacity: 0;
	}
}
</style>
