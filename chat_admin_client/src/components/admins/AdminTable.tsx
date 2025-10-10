import React from 'react'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '~/components/ui/table'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '~/components/ui/popover'
import { MoreHorizontal, Trash2 } from 'lucide-react'

export type AdminItem = {
  _id: string
  email: string
  name?: string
  isRoot?: boolean
}

type Props = {
  admins: AdminItem[]
  onDelete?: (id: string) => void
}

const AdminTable: React.FC<Props> = ({ admins, onDelete }) => {
  return (
    <Table>
      <TableHeader>
        <tr>
          <TableHead className='w-[40px]'>#</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Tên</TableHead>
          <TableHead className='text-center'>Quyền</TableHead>
          <TableHead className='text-center'>Hành động</TableHead>
        </tr>
      </TableHeader>
      <TableBody>
        {admins.map((a, idx) => (
          <TableRow key={a._id}>
            <TableCell>{idx + 1}</TableCell>
            <TableCell className='muted-foreground text-sm'>{a.email}</TableCell>
            <TableCell>
              <div className='flex items-center gap-3'>
                <Avatar>
                  <AvatarFallback>{(a.name || a.email).slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className='flex flex-col'>
                  <div className='text-sm font-medium'>{a.name || a.email.split('@')[0]}</div>
                  <div className='muted-foreground text-xs'>{a.email}</div>
                </div>
              </div>
            </TableCell>
            <TableCell className='text-center'>
              {a.isRoot ? (
                <span className='rounded-full bg-indigo-600 px-2 py-0.5 text-xs text-white'>Root</span>
              ) : (
                <span className='rounded-full bg-slate-700 px-2 py-0.5 text-xs text-white'>Admin</span>
              )}
            </TableCell>
            <TableCell className='text-center'>
              <div className='flex items-center justify-center gap-2'>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant='ghost' size='sm' className='p-2'>
                      <MoreHorizontal className='h-4 w-4' />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className='w-44 rounded-md border border-white/6 bg-slate-800 p-2 text-white shadow-lg'>
                    <div className='flex flex-col space-y-1'>
                      <button
                        type='button'
                        onClick={() => onDelete && onDelete(a._id)}
                        className='flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-slate-100 hover:bg-slate-700'
                      >
                        <Trash2 className='h-4 w-4' />
                        Xóa
                      </button>
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

export default AdminTable
