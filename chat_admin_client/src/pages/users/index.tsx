import React from 'react'
import UserFilters from '~/components/users/UserFilters'
import UserTable from '~/components/users/UserTable'
import usersService from '~/services/users.service'
import type { AdminUser } from '~/services/users.service'
import { showToast } from '~/lib/toast'
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card'

const UsersPage: React.FC = () => {
  const [query, setQuery] = React.useState('')
  const [verifyFilter, setVerifyFilter] = React.useState('ALL')
  const [page, setPage] = React.useState(1)
  const pageSize = 10

  const [users, setUsers] = React.useState<AdminUser[]>([])
  const [loading, setLoading] = React.useState(false)
  const [loadingIds, setLoadingIds] = React.useState<Record<string, boolean>>({})
  const [total, setTotal] = React.useState(0)
  const pages = Math.max(1, Math.ceil(total / pageSize))
  // transform AdminUser -> UI User shape expected by UserTable (mockUsers shape)
  const pageItems = users.map((u) => ({
    _id: u._id,
    name: u.name || u.name || u.email.split('@')[0],
    email: u.email,
    username: u.username || '',
    avatar: u.avatar || '',
    isActive: u.isActive,
    dateOfBirth: undefined,
    createdAt: u.createdAt || new Date().toISOString()
  }))

  const fetchUsers = React.useCallback(async () => {
    setLoading(true)
    try {
      const filter: Record<string, unknown> = {}
      if (query) filter.q = query
      if (verifyFilter === 'ACTIVE') filter.isActive = true
      if (verifyFilter === 'INACTIVE') filter.isActive = false

      const res = await usersService.list(filter, page, pageSize)
      if (res && res.data) {
        setUsers(res.data.items || [])
        setTotal(res.data.total || 0)
      }
    } catch (err) {
      console.error(err)
      showToast({ title: 'Lấy danh sách thất bại', description: 'Không thể tải danh sách người dùng' })
    } finally {
      setLoading(false)
    }
  }, [query, verifyFilter, page])

  React.useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleDisable = async (id: string) => {
    try {
      setLoadingIds((s) => ({ ...s, [id]: true }))
      await usersService.disable(id)
      showToast({ title: 'Khóa thành công', description: 'Người dùng đã bị khóa.' })
      fetchUsers()
    } catch (err) {
      console.error(err)
      showToast({ title: 'Khóa thất bại', description: 'Không thể khóa người dùng.' })
    } finally {
      setLoadingIds((s) => ({ ...s, [id]: false }))
    }
  }

  const handleEnable = async (id: string) => {
    try {
      setLoadingIds((s) => ({ ...s, [id]: true }))
      await usersService.enable(id)
      showToast({ title: 'Mở thành công', description: 'Người dùng đã được mở lại.' })
      fetchUsers()
    } catch (err) {
      console.error(err)
      showToast({ title: 'Mở thất bại', description: 'Không thể mở tài khoản người dùng.' })
    } finally {
      setLoadingIds((s) => ({ ...s, [id]: false }))
    }
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Quản lý người dùng</CardTitle>
        </CardHeader>
        <CardContent>
          <UserFilters
            query={query}
            setQuery={setQuery}
            verifyFilter={verifyFilter}
            setVerifyFilter={setVerifyFilter}
          />

          {loading ? (
            <div className='py-6 text-center text-sm text-slate-300'>Đang tải...</div>
          ) : (
            <UserTable users={pageItems} onDisable={handleDisable} onEnable={handleEnable} loadingIds={loadingIds} />
          )}

          <div className='mt-4 flex items-center justify-between'>
            <div className='muted-foreground text-sm'>
              Hiển thị {pageItems.length} / {total} người dùng
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

export default UsersPage
