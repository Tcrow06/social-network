import React from 'react'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '~/components/ui/table'
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '~/components/ui/popover'
import { MoreHorizontal, Eye, Slash } from 'lucide-react'
import { format } from 'date-fns'
// import type { User } from '~/data/mockUsers'
export type User = {
  _id: string
  username: string
  email: string
  avatar?: string
  name: string
  dateOfBirth?: string
  verify?: 'VERIFIED' | 'UNVERIFIED'
  createdAt: string
  isActive?: boolean
}

type Props = {
  users: User[]
  onDisable?: (id: string) => void
  onEnable?: (id: string) => void
  loadingIds?: Record<string, boolean>
}

const UserTable: React.FC<Props> = ({ users, onDisable, onEnable, loadingIds }) => {
  return (
    <Table>
      <TableHeader>
        <tr>
          <TableHead className='w-[40px]'>#</TableHead>
          <TableHead>Tên</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead>Ngày sinh</TableHead>
          <TableHead>Ngày tạo</TableHead>
          <TableHead className='text-center'>Hành động</TableHead>
        </tr>
      </TableHeader>
      <TableBody>
        {users.map((u, idx) => (
          <TableRow key={u._id}>
            <TableCell>{idx + 1}</TableCell>
            <TableCell>
              <div className='flex items-center gap-3'>
                <Avatar>
                  {u.avatar ? <AvatarImage src={u.avatar} /> : <AvatarFallback>{u.name?.slice(0, 2)}</AvatarFallback>}
                </Avatar>
                <div className='flex flex-col'>
                  <div className='text-sm font-medium'>{u.name}</div>
                  <div className='muted-foreground text-xs'>{u.email}</div>
                </div>
              </div>
            </TableCell>
            <TableCell className='muted-foreground text-sm'>{u.email}</TableCell>
            <TableCell className='muted-foreground text-sm'>{u.username}</TableCell>
            <TableCell>
              {u.isActive ? (
                <span className='rounded-full bg-green-600 px-2 py-0.5 text-xs text-white'>Đang hoạt động</span>
              ) : (
                <span className='rounded-full bg-yellow-500 px-2 py-0.5 text-xs text-white'>Đã khóa</span>
              )}
            </TableCell>
            <TableCell className='muted-foreground text-sm'>
              {u.dateOfBirth ? format(new Date(u.dateOfBirth), 'dd/MM/yyyy') : '-'}
            </TableCell>
            <TableCell className='muted-foreground text-sm'>
              {format(new Date(u.createdAt), 'dd/MM/yyyy HH:mm')}
            </TableCell>
            <TableCell className='text-center'>
              <div className='flex items-center justify-center gap-2'>
                {/* Secondary actions in a compact popover */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant='ghost' size='sm' className='p-2'>
                      <MoreHorizontal className='h-4 w-4' />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className='w-44 rounded-md border border-white/6 bg-slate-800 p-2 text-white shadow-lg'>
                    <div className='flex flex-col space-y-1'>
                      {u.isActive ? (
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => onDisable && onDisable(u._id)}
                          isLoading={!!(loadingIds && loadingIds[u._id])}
                          className='flex w-full items-center justify-start gap-2 rounded-md px-2 py-2 text-sm text-slate-100'
                        >
                          <Slash className='h-4 w-4' />
                          Khóa người dùng
                        </Button>
                      ) : (
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => onEnable && onEnable(u._id)}
                          isLoading={!!(loadingIds && loadingIds[u._id])}
                          className='flex w-full items-center justify-start gap-2 rounded-md px-2 py-2 text-sm text-slate-100'
                        >
                          <Slash className='h-4 w-4' />
                          Mở lại tài khoản
                        </Button>
                      )}

                      <button
                        type='button'
                        className='flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-slate-100 hover:bg-slate-700'
                      >
                        <Eye className='h-4 w-4' />
                        Xem chi tiết
                      </button>

                      <div className='my-1 h-px bg-white/6' />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default UserTable
