import { localStorageGet, localStorageSet } from '~/utils/util.localStorage';

export interface AdminPreferenceState {
	fixedHeader: boolean;
	reduceMotion: boolean;
	accentColor: string;
	watermarkEnabled: boolean;
	watermarkText: string;
}

const STORAGE_KEY = 'admin-preferences';
const defaultPreferences: AdminPreferenceState = {
	fixedHeader: true,
	reduceMotion: false,
	accentColor: '#0ea5e9',
	watermarkEnabled: false,
	watermarkText: 'LanYun Blog',
};

export function useAdminPreferences() {
	const route = useRoute();
	const preferences = useState<AdminPreferenceState>('admin-preferences', () => ({
		...defaultPreferences,
	}));
	const initialized = useState('admin-preferences-initialized', () => false);

	const persistPreferences = () => {
		if (!process.client) return;
		localStorageSet(STORAGE_KEY, JSON.stringify(preferences.value));
	};

	const loadPreferences = () => {
		if (!process.client || initialized.value) return;
		const stored = localStorageGet(STORAGE_KEY);
		if (stored) {
			try {
				const parsed = JSON.parse(stored) as Partial<AdminPreferenceState>;
				preferences.value = {
					...defaultPreferences,
					...parsed,
				};
			} catch (error) {
				console.warn('[SystemSettings] 解析本地配置失败：', error);
				preferences.value = { ...defaultPreferences };
			}
		}
		initialized.value = true;
	};

	const applyBodyEffects = () => {
		if (!process.client) return;
		const body = document.body;
		const inAdmin = route.path.startsWith('/admin');

		const toggleClass = (className: string, condition: boolean) => {
			if (condition) {
				body.classList.add(className);
			} else {
				body.classList.remove(className);
			}
		};

		toggleClass('admin-reduce-motion', inAdmin && preferences.value.reduceMotion);
		toggleClass('admin-watermark-enabled', inAdmin && preferences.value.watermarkEnabled);

		if (inAdmin && preferences.value.watermarkEnabled) {
			body.dataset.adminWatermark =
				preferences.value.watermarkText || defaultPreferences.watermarkText;
		} else {
			delete body.dataset.adminWatermark;
		}
	};

	const updatePreference = <K extends keyof AdminPreferenceState>(
		key: K,
		value: AdminPreferenceState[K]
	) => {
		preferences.value[key] = value;
		persistPreferences();
		applyBodyEffects();
	};

	const resetPreferences = () => {
		preferences.value = { ...defaultPreferences };
		persistPreferences();
		applyBodyEffects();
	};

	onMounted(() => {
		loadPreferences();
		applyBodyEffects();
	});

	watch(
		() => route.path,
		() => {
			applyBodyEffects();
		}
	);

	return {
		preferences,
		updatePreference,
		resetPreferences,
		loadPreferences,
		defaultPreferences,
	};
}
