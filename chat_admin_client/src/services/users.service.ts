import AxiosClient from '~/utils/axios.utils'
import type { ApiResponse } from '~/types/response.type'

export type AdminUser = {
  _id: string
  username: string
  email: string
  avatar?: string
  name: string
  dateOfBirth?: string
  verify: 'VERIFIED' | 'UNVERIFIED'
  createdAt: string
  isActive?: boolean
}

class UsersService {
  async list(
    query?: Record<string, unknown>,
    page = 1,
    limit = 20
  ): Promise<ApiResponse<{ items: AdminUser[]; total: number; page: number; limit: number }>> {
    const params = { ...(query || {}), page, limit }
    const res = await AxiosClient.axiosInstance.get('/admin/users', { params })
    return res.data
  }

  async getById(id: string): Promise<ApiResponse<AdminUser>> {
    const res = await AxiosClient.axiosInstance.get(`/admin/users/${id}`)
    return res.data
  }

  async update(id: string, dto: Record<string, unknown>): Promise<ApiResponse<AdminUser>> {
    const res = await AxiosClient.axiosInstance.patch(`/admin/users/${id}`, dto)
    return res.data
  }

  async disable(id: string): Promise<ApiResponse<AdminUser>> {
    const res = await AxiosClient.axiosInstance.post(`/admin/users/${id}/disable`)
    return res.data
  }

  async enable(id: string): Promise<ApiResponse<AdminUser>> {
    const res = await AxiosClient.axiosInstance.post(`/admin/users/${id}/enable`)
    return res.data
  }
}

export default new UsersService()
