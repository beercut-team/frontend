import type {
	AxiosInstance,
	AxiosPromise,
	AxiosRequestConfig,
	AxiosResponse,
} from "axios"
import axios from "axios"

import { getCookie, setCookie } from "@/shared/lib/cookie"

const getApiUrl = (): string => {
	if (import.meta.env.VITE_API_URL !== undefined) {
		return import.meta.env.VITE_API_URL
	}
	return "https://api.beercut.tech"
}

export const API_URL = getApiUrl()

class ApiInstance {
	private axios: AxiosInstance
	private requestCache = new Map<string, { data: any; timestamp: number }>()
	private readonly CACHE_TTL = 30000 // 30 seconds

	constructor() {
		this.axios = axios.create({
			baseURL: API_URL,
			timeout: 120000,
			headers: {
				"Content-Type": "application/json",
				// Accept: '*/*',
			},
		})

		// 1) Интерсептор запросов (устанавливает Bearer-токен)
		this.axios.interceptors.request.use((config) => {
			// 1. Читаем токен из cookie (меняем 'authToken' на ваше имя cookie)
			const token = getCookie("token")

			// 2. Если токен найден, добавляем его в заголовок Authorization
			if (token) {
				// Вставляем токен в заголовок
				config.headers.setAuthorization(`Bearer ${token}`)
			}

			// 3. Возвращаем config, чтобы axios мог выполнить запрос
			return config
		})

		// Интерсептор ответов (обрабатывает ошибки, refresh на 401)
		this.axios.interceptors.response.use(
			(response) => response,
			async (error) => {
				const originalRequest = error.config

				if (
					error.response?.status === 401 &&
					!originalRequest._retry
				) {
					originalRequest._retry = true

					const refreshToken = getCookie("refresh_token")
					if (refreshToken) {
						try {
							const { data } = await axios.post(
								`${API_URL}/api/v1/auth/refresh`,
								{ refresh_token: refreshToken },
								{ headers: { "Content-Type": "application/json" } },
							)

							setCookie("token", data.access_token, 7)
							setCookie("refresh_token", data.refresh_token, 30)

							originalRequest.headers.Authorization = `Bearer ${data.access_token}`
							return this.axios(originalRequest)
						} catch {
							// Refresh failed — clear everything
						}
					}

					setCookie("token", "", -1)
					setCookie("refresh_token", "", -1)
					delete this.axios.defaults.headers.common["Authorization"]
				}
				return Promise.reject(error)
			},
		)
	}

	async get<T>(
		endpoint: string,
		options: AxiosRequestConfig = {},
	): AxiosPromise<T> {
		const cacheKey = `${endpoint}${JSON.stringify(options.params || {})}`
		const cached = this.requestCache.get(cacheKey)

		if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
			return Promise.resolve({ data: cached.data } as AxiosResponse<T>)
		}

		const response: AxiosResponse<T> = await this.axios.get(endpoint, options)
		this.requestCache.set(cacheKey, { data: response.data, timestamp: Date.now() })
		return response
	}

	async post<T>(
		endpoint: string,
		data: object,
		options: AxiosRequestConfig = {},
	): AxiosPromise<T> {
		this.clearCache()
		const response: AxiosResponse<T> = await this.axios.post(
			endpoint,
			data,
			options,
		)
		return response
	}

	async patch<T>(endpoint: string, data: object): AxiosPromise<T> {
		this.clearCache()
		const response: AxiosResponse<T> = await this.axios.patch(endpoint, data)
		return response
	}

	async put<T>(endpoint: string, data: object): AxiosPromise<T> {
		this.clearCache()
		const response: AxiosResponse<T> = await this.axios.put(endpoint, data)
		return response
	}

	async delete<T>(
		endpoint: string,
		options: AxiosRequestConfig = {},
	): AxiosPromise<T> {
		this.clearCache()
		const response: AxiosResponse<T> = await this.axios.delete(
			endpoint,
			options,
		)
		return response
	}

	clearCache() {
		this.requestCache.clear()
	}
}

export const apiInstance = new ApiInstance()
