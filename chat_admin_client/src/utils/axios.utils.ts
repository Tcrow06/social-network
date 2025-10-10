import axios, { AxiosError, type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '~/store/useAuth.store'

class AxiosClient {
  public axiosInstance: AxiosInstance

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'http://localhost:8000/api',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this._initializeInterceptors()
  }

  private _initializeInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        // Read token from zustand store (persisted) with a fallback to localStorage
        try {
          const token = useAuthStore.getState().data?.accessToken
          if (token && config.headers) config.headers.Authorization = `Bearer ${token}`
        } catch (e) {
          const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
          if (token && config.headers) config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    this.axiosInstance.interceptors.response.use(this._handleResponse, this._handleError)
  }

  private _handleResponse(response: AxiosResponse): AxiosResponse {
    return response
  }

  private _handleError(error: AxiosError): Promise<unknown> {
    console.error('Axios error:', error.message)
    return Promise.reject(error)
  }
}

export default new AxiosClient()
