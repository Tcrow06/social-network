import type { ApiResponse } from '../types/response.type'
import AxiosClient from '../utils/axios.utils'

class AuthService {
  async login(dto: { email: string; password: string }): Promise<
    ApiResponse<{
      accessToken: string
      refreshToken: string
      admin: {
        id: string
        email: string
        name: string
      }
    }>
  > {
    const response = await AxiosClient.axiosInstance.post('/auth/login', dto)
    return response.data
  }

  async forgotPassword(dto: { email: string }): Promise<ApiResponse<null>> {
    const response = await AxiosClient.axiosInstance.post('/auth/forgot-password', dto)
    return response.data
  }

  async verifyOtp(dto: { email: string; otp: string }): Promise<ApiResponse<null>> {
    const response = await AxiosClient.axiosInstance.post('/auth/verify-otp', dto)
    return response.data
  }

  async resetPassword(dto: { email: string; otp: string; newPassword: string }): Promise<ApiResponse<null>> {
    const response = await AxiosClient.axiosInstance.post('/auth/reset-password', dto)
    return response.data
  }
}

export default new AuthService()
