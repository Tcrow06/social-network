import AxiosClient from '~/utils/axios.utils'
import type { ApiResponse } from '~/types/response.type'

export type AdminItem = {
  _id: string
  email: string
  name?: string
  isRoot?: boolean
  createdAt?: string
}

class AdminsService {
  async list(
    query?: Record<string, unknown>,
    page = 1,
    limit = 20
  ): Promise<ApiResponse<{ items: AdminItem[]; total: number; page: number; limit: number }>> {
    const params = { ...(query || {}), page, limit }
    const res = await AxiosClient.axiosInstance.get('/admin/admins', { params })
    return res.data
  }

  async create(dto: { email: string; password: string; name?: string }) {
    const res = await AxiosClient.axiosInstance.post('/admin/admins', dto)
    return res.data
  }

  async remove(id: string) {
    const res = await AxiosClient.axiosInstance.delete(`/admin/admins/${id}`)
    return res.data
  }
}

export default new AdminsService()
