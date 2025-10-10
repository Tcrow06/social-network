import React from 'react'
import PostTable from '~/components/posts/PostTable'
import postsService from '~/services/posts.service'
import type { AdminPost } from '~/services/posts.service'
import { showToast } from '~/lib/toast'
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card'

const PostsPage: React.FC = () => {
  const [query, setQuery] = React.useState('')
  const [page, setPage] = React.useState(1)
  const pageSize = 10

  const [posts, setPosts] = React.useState<AdminPost[]>([])
  const [total, setTotal] = React.useState(0)
  const [loadingIds, setLoadingIds] = React.useState<Record<string, boolean>>({})
  const pages = Math.max(1, Math.ceil(total / pageSize))

  const fetchPosts = React.useCallback(async () => {
    try {
      const filter: Record<string, unknown> = {}
      if (query) filter.q = query
      const res = await postsService.list(filter, page, pageSize)
      if (res && res.data) {
        setPosts(res.data.items || [])
        setTotal(res.data.total || 0)
      }
    } catch (err) {
      console.error(err)
      showToast({ title: 'Lấy danh sách thất bại', description: 'Không thể tải danh sách bài viết' })
    }
  }, [query, page])

  React.useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const handleDelete = async (id: string) => {
    try {
      setLoadingIds((s) => ({ ...s, [id]: true }))
      await postsService.remove(id)
      showToast({ title: 'Xóa thành công', description: 'Bài viết đã được xóa.' })
      fetchPosts()
    } catch (err) {
      console.error(err)
      showToast({ title: 'Xóa thất bại', description: 'Không thể xóa bài viết.' })
    } finally {
      setLoadingIds((s) => ({ ...s, [id]: false }))
    }
  }

  const pageItems = posts.map((p) => ({
    _id: p._id,
    userId: p.userId,
    author: (p as AdminPost).author,
    content: p.content,
    media: p.media,
    hidden: p.hidden,
    isDeleted: p.isDeleted,
    createdAt: p.createdAt
  }))

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Quản lý bài viết</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='mb-4 flex items-center gap-2 text-sm'>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Tìm kiếm nội dung bài...'
              className='rounded border px-3 py-2'
            />
          </div>

          <PostTable posts={pageItems} onDelete={handleDelete} loadingIds={loadingIds} />

          <div className='mt-4 flex items-center justify-between'>
            <div className='muted-foreground text-sm'>
              Hiển thị {pageItems.length} / {total} bài viết
            </div>
            <div className='flex items-center gap-2'>
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className='rounded border px-3 py-1'
              >
                Trước
              </button>
              <div className='px-2'>
                Trang {page} / {pages}
              </div>
              <button
                disabled={page >= pages}
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                className='rounded border px-3 py-1'
              >
                Sau
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PostsPage
