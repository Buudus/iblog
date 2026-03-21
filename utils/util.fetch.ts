import type { FetchOptions } from 'ofetch';

// 响应数据类型定义
export interface ApiResponse<T = unknown> {
	code: number;
	message: string;
	data: T;
}

// 请求配置类型
export interface RequestConfig extends Omit<FetchOptions, 'method'> {
	showLoading?: boolean; // 是否显示加载状态
	showError?: boolean; // 是否显示错误提示
	timeout?: number; // 请求超时时间
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
}

// 请求拦截器类型
export type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;

// 响应拦截器类型
export type ResponseInterceptor = <T>(
	response: ApiResponse<T>
) => ApiResponse<T> | Promise<ApiResponse<T>>;

// 错误拦截器类型
export type ErrorInterceptor = (error: unknown) => unknown;

class FetchWrapper {
	private baseURL: string;
	private defaultOptions: RequestConfig;
	private requestInterceptors: RequestInterceptor[] = [];
	private responseInterceptors: ResponseInterceptor[] = [];
	private errorInterceptors: ErrorInterceptor[] = [];

	constructor(baseURL: string = '', defaultOptions: RequestConfig = {}) {
		this.baseURL = baseURL;
		this.defaultOptions = {
			timeout: 10000,
			showLoading: true,
			showError: true,
			...defaultOptions,
		};
	}

	// 添加请求拦截器
	addRequestInterceptor(interceptor: RequestInterceptor) {
		this.requestInterceptors.push(interceptor);
	}

	// 添加响应拦截器
	addResponseInterceptor(interceptor: ResponseInterceptor) {
		this.responseInterceptors.push(interceptor);
	}

	// 添加错误拦截器
	addErrorInterceptor(interceptor: ErrorInterceptor) {
		this.errorInterceptors.push(interceptor);
	}

	// 执行请求拦截器
	private async executeRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
		let finalConfig = { ...config };
		for (const interceptor of this.requestInterceptors) {
			finalConfig = await interceptor(finalConfig);
		}
		return finalConfig;
	}

	// 执行响应拦截器
	private async executeResponseInterceptors<T>(response: ApiResponse<T>): Promise<ApiResponse<T>> {
		let result = response;
		for (const interceptor of this.responseInterceptors) {
			result = await interceptor(result);
		}
		return result;
	}

	// 执行错误拦截器
	private async executeErrorInterceptors(error: unknown): Promise<unknown> {
		let finalError = error;
		for (const interceptor of this.errorInterceptors) {
			finalError = await interceptor(finalError);
		}
		return finalError;
	}

	// 显示加载状态
	private showLoading() {
		console.log('Loading started...');
	}

	// 隐藏加载状态
	private hideLoading() {
		console.log('Loading finished...');
	}

	// 显示错误消息
	private showError(message: string) {
		console.error('Error:', message);
	}

	// 提取错误消息（优先使用后端返回的错误信息）
	private extractErrorMessage(error: unknown): string {
		const errorObj = error as {
			response?: {
				_status?: number;
				status?: number;
				_data?: ApiResponse<unknown> | unknown;
			};
			data?: ApiResponse<unknown> | { message?: string };
			message?: string;
		};

		// 优先从响应体中提取错误信息（后端返回的 ApiResponse 格式）
		// ofetch 错误对象的响应体通常在 response._data 中
		if (errorObj?.response?._data) {
			const responseData = errorObj.response._data;
			// 检查是否是 ApiResponse 格式
			if (typeof responseData === 'object' && responseData !== null && 'message' in responseData) {
				const apiResponse = responseData as ApiResponse<unknown>;
				if (apiResponse.message && typeof apiResponse.message === 'string') {
					return apiResponse.message;
				}
			}
		}

		// 尝试从 data 字段中提取（可能是直接返回的 ApiResponse）
		if (errorObj?.data) {
			if (
				typeof errorObj.data === 'object' &&
				errorObj.data !== null &&
				'message' in errorObj.data
			) {
				const apiResponse = errorObj.data as ApiResponse<unknown>;
				if (apiResponse.message && typeof apiResponse.message === 'string') {
					return apiResponse.message;
				}
			}
		}

		// 如果后端没有返回消息，使用 error.message（可能是自定义消息）
		if (errorObj?.message && typeof errorObj.message === 'string') {
			return errorObj.message;
		}

		// 最后使用默认消息
		return '请求失败';
	}

	// 核心请求方法
	async request<T = unknown>(url: string, options: RequestConfig = {}): Promise<ApiResponse<T>> {
		// 合并配置
		const config: RequestConfig = {
			...this.defaultOptions,
			...options,
			baseURL: this.baseURL,
		};

		// 执行请求拦截器
		const finalConfig = await this.executeRequestInterceptors(config);

		// 显示加载状态
		if (finalConfig.showLoading) {
			this.showLoading();
		}

		try {
			// 发送请求
			const response = await $fetch<ApiResponse<T>>(url, finalConfig);

			// 隐藏加载状态
			if (finalConfig.showLoading) {
				this.hideLoading();
			}

			// 执行响应拦截器
			const result = await this.executeResponseInterceptors(response);

			return result;
		} catch (error: unknown) {
			// 隐藏加载状态
			if (finalConfig.showLoading) {
				this.hideLoading();
			}

			// 执行错误拦截器
			const finalError = await this.executeErrorInterceptors(error);

			// 显示错误消息
			if (finalConfig.showError) {
				const errorMessage = this.extractErrorMessage(finalError);
				this.showError(errorMessage);
			}

			throw finalError;
		}
	}

	// GET请求
	async get<T = unknown>(url: string, options: RequestConfig = {}): Promise<ApiResponse<T>> {
		return this.request<T>(url, { ...options, method: 'GET' });
	}

	// POST请求
	async post<T = unknown>(
		url: string,
		body?: object,
		options: RequestConfig = {}
	): Promise<ApiResponse<T>> {
		return this.request<T>(url, { ...options, method: 'POST', body });
	}

	// PUT请求
	async put<T = unknown>(
		url: string,
		body?: object,
		options: RequestConfig = {}
	): Promise<ApiResponse<T>> {
		return this.request<T>(url, { ...options, method: 'PUT', body });
	}

	// DELETE请求
	async delete<T = unknown>(url: string, options: RequestConfig = {}): Promise<ApiResponse<T>> {
		return this.request<T>(url, { ...options, method: 'DELETE' });
	}

	// PATCH请求
	async patch<T = unknown>(
		url: string,
		body?: object,
		options: RequestConfig = {}
	): Promise<ApiResponse<T>> {
		return this.request<T>(url, { ...options, method: 'PATCH', body });
	}
}

// 创建默认实例
const api = new FetchWrapper();

// 添加默认的请求拦截器
api.addRequestInterceptor((config) => {
	// 添加认证token
	const token = useCookie('token');
	if (token.value) {
		config.headers = {
			...config.headers,
			Authorization: `Bearer ${token.value}`,
		};
	}

	// 添加默认请求头（文件上传时不要设置Content-Type）
	// 确保 body 存在且不是 FormData
	if (config.body && !(config.body instanceof FormData)) {
		config.headers = {
			'Content-Type': 'application/json',
			...config.headers,
		};
	} else if (!config.body) {
		// 如果没有 body，也设置 Content-Type（GET 请求等）
		config.headers = {
			'Content-Type': 'application/json',
			...config.headers,
		};
	}

	return config;
});

// 添加默认的响应拦截器
api.addResponseInterceptor((response) => {
	// 不再拦截业务状态码错误，让调用方自己处理
	// 业务状态码（如 400、500）应该由调用方根据 code 字段判断
	// 只有 HTTP 层面的错误（网络错误、HTTP 状态码错误）才会被 catch
	return response;
});

// 添加默认的错误拦截器
api.addErrorInterceptor((error: unknown) => {
	// 提取后端返回的错误信息
	const extractBackendMessage = (err: unknown): string | null => {
		const errObj = err as {
			response?: {
				_status?: number;
				status?: number;
				_data?: ApiResponse<unknown> | unknown;
			};
			data?: ApiResponse<unknown> | { message?: string };
		};
		// 优先从响应体中提取（后端返回的 ApiResponse 格式）
		// ofetch 错误对象的响应体通常在 response._data 中
		if (errObj?.response?._data) {
			const responseData = errObj.response._data;
			// 检查是否是 ApiResponse 格式
			if (typeof responseData === 'object' && responseData !== null && 'message' in responseData) {
				const apiResponse = responseData as ApiResponse<unknown>;
				if (apiResponse.message && typeof apiResponse.message === 'string') {
					return apiResponse.message;
				}
			}
		}

		// 尝试从 data 字段中提取
		if (errObj?.data) {
			if (typeof errObj.data === 'object' && errObj.data !== null && 'message' in errObj.data) {
				const apiResponse = errObj.data as ApiResponse<unknown>;
				if (apiResponse.message && typeof apiResponse.message === 'string') {
					return apiResponse.message;
				}
			}
		}

		return null;
	};

	const errorObj = error as {
		response?: {
			_status?: number;
			status?: number;
			_data?: ApiResponse<unknown> | unknown;
		};
		message?: string;
	};

	// 处理网络错误（没有响应）
	if (!errorObj.response) {
		const backendMessage = extractBackendMessage(error);
		errorObj.message = backendMessage || errorObj.message || '网络错误，请检查网络连接';
		return errorObj;
	}

	// 处理 HTTP 状态码错误
	const backendMessage = extractBackendMessage(error);
	if (backendMessage) {
		// 如果后端返回了错误信息，优先使用后端的消息
		errorObj.message = backendMessage;
	} else {
		// 如果后端没有返回消息，使用自定义消息
		const status = errorObj.response?.status || errorObj.response?._status;
		switch (status) {
			case 401:
				errorObj.message = '未授权，请重新登录';
				// 可以在这里处理登录跳转
				break;
			case 403:
				errorObj.message = '拒绝访问，权限不足';
				break;
			case 404:
				errorObj.message = '请求的资源不存在';
				break;
			case 500:
				errorObj.message = '服务器内部错误';
				break;
			default:
				errorObj.message = errorObj.message || '请求失败';
		}
	}

	return errorObj;
});

// 导出实例和类
export { api, FetchWrapper };
export default api;
