import AxiosClient from '~/utils/axios.utils'
import type { ApiResponse } from '~/types/response.type'

export type AdminPost = {
  _id: string
  userId: string
  content?: string
  media?: string[]
  hidden?: boolean
  isDeleted?: boolean
  createdAt?: string
  author?: {
    _id?: string
    email?: string
    displayName?: string
    avatar?: string
  }
}

class PostsService {
  async list(
    query?: Record<string, unknown>,
    page = 1,
    limit = 20
  ): Promise<ApiResponse<{ items: AdminPost[]; total: number; page: number; limit: number }>> {
    const params = { ...(query || {}), page, limit }
    const res = await AxiosClient.axiosInstance.get('/admin/posts', { params })
    return res.data
  }

  async getById(id: string): Promise<ApiResponse<AdminPost>> {
    const res = await AxiosClient.axiosInstance.get(`/admin/posts/${id}`)
    return res.data
  }

  async remove(id: string): Promise<ApiResponse<AdminPost>> {
    const res = await AxiosClient.axiosInstance.delete(`/admin/posts/${id}`)
    return res.data
  }
}

export default new PostsService()
