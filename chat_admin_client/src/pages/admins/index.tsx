import React from 'react'
import AdminTable from '~/components/admins/AdminTable'
import adminsService from '~/services/admins.service'
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose
} from '~/components/ui/dialog'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

type FormValues = { email: string; name?: string; password: string }

const AdminsPage: React.FC = () => {
  const [query, setQuery] = React.useState('')
  const [page, setPage] = React.useState(1)
  const pageSize = 10

  const [admins, setAdmins] = React.useState<{ _id: string; email: string; name?: string }[]>([])
  const [total, setTotal] = React.useState(0)
  const [creating, setCreating] = React.useState(false)

  const { register, handleSubmit, reset } = useForm<FormValues>()
  const [dialogOpen, setDialogOpen] = React.useState(false)

  const fetchAdmins = React.useCallback(async () => {
    try {
      const filter: Record<string, unknown> = {}
      if (query) filter.q = query
      const res = await adminsService.list(filter, page, pageSize)
      if (res && res.data) {
        setAdmins(res.data.items || [])
        setTotal(res.data.total || 0)
      }
    } catch (err: unknown) {
      console.error(err)
    }
  }, [query, page])

  React.useEffect(() => {
    fetchAdmins()
  }, [fetchAdmins])

  const onCreate = async (data: FormValues) => {
    setCreating(true)
    try {
      const res = await adminsService.create(data)
      if (res.code === 201) {
        toast.success('Tạo admin thành công')
        reset()
        fetchAdmins()
      }
    } catch (err: unknown) {
      console.error(err)
      const message =
        (() => {
          try {
            return (err as { response?: { data?: { message?: string } } })?.response?.data?.message
          } catch {
            return undefined
          }
        })() || 'Tạo admin thất bại'
      toast.error(message)
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await adminsService.remove(id)
      if (res.code === 200) {
        toast.success('Xóa admin thành công')
        fetchAdmins()
        return
      }
    } catch (err: unknown) {
      console.error(err)
      const message =
        (() => {
          try {
            return (err as { response?: { data?: { message?: string } } })?.response?.data?.message
          } catch {
            return undefined
          }
        })() || 'Xóa admin thất bại'
      toast.error(message)
    }
  }

  const pageItems = admins.map((a) => ({ _id: a._id, email: a.email, name: a.name }))

  return (
    <div>
      <Card>
        <CardHeader>
          <div className='flex w-full items-center justify-between'>
            <CardTitle>Quản lý admin</CardTitle>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className='bg-sky-600 hover:bg-sky-700'
                  startIcon={<img src='/logo-white.svg' alt='logo' className='h-4 w-4' />}
                >
                  Tạo admin
                </Button>
              </DialogTrigger>

              <DialogContent className='border border-white/10 bg-slate-900 text-white shadow-lg backdrop-blur-sm'>
                <DialogHeader>
                  <DialogTitle>Tạo admin mới</DialogTitle>
                  <DialogDescription>Nhập email, tên, mật khẩu và quyền (root nếu cần)</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onCreate)} className='mt-2 grid grid-cols-1 gap-3'>
                  <Input
                    placeholder='Email'
                    {...register('email', { required: true })}
                    className='border border-white/10 bg-slate-800 text-white placeholder:text-slate-400'
                  />

                  <Input
                    placeholder='Tên'
                    {...register('name')}
                    className='border border-white/10 bg-slate-800 text-white placeholder:text-slate-400'
                  />

                  <Input
                    placeholder='Mật khẩu'
                    type='password'
                    {...register('password', { required: true })}
                    className='border border-white/10 bg-slate-800 text-white placeholder:text-slate-400'
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant='ghost'>Hủy</Button>
                    </DialogClose>
                    <Button
                      type='submit'
                      isLoading={creating}
                      className='bg-sky-600 hover:bg-sky-700'
                      startIcon={<img src='/logo-white.svg' alt='logo' className='h-4 w-4' />}
                    >
                      Tạo
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className='mb-4 flex items-center gap-2'>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Tìm kiếm email/tên...'
              className='rounded border px-3 py-2'
            />
          </div>

          <AdminTable admins={pageItems} onDelete={handleDelete} />

          <div className='mt-4 flex items-center justify-between'>
            <div className='muted-foreground text-sm'>
              Hiển thị {pageItems.length} / {total} admin
            </div>
            <div className='flex items-center gap-2'>
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className='rounded border px-3 py-1'
              >
                Trước
              </button>
              <div className='px-2'>Trang {page}</div>
              <button
                disabled={page >= Math.ceil(total / pageSize)}
                onClick={() => setPage((p) => Math.min(Math.ceil(total / pageSize), p + 1))}
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

export default AdminsPage
