import React from 'react'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '~/components/ui/table'
import { Button } from '~/components/ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '~/components/ui/popover'
import { MoreHorizontal, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar'

export type Post = {
  _id: string
  userId: string
  author?: { _id?: string; displayName?: string; avatar?: string; email?: string }
  content?: string
  media?: string[]
  hidden?: boolean
  isDeleted?: boolean
  createdAt?: string
}

type Props = {
  posts: Post[]
  onDelete?: (id: string) => void
  loadingIds?: Record<string, boolean>
}

const PostTable: React.FC<Props> = ({ posts, onDelete, loadingIds }) => {
  return (
    <Table>
      <TableHeader>
        <tr>
          <TableHead className='w-[40px]'>#</TableHead>
          <TableHead>Nội dung</TableHead>
          <TableHead>Tác giả</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead>Ngày tạo</TableHead>
          <TableHead className='text-center'>Hành động</TableHead>
        </tr>
      </TableHeader>
      <TableBody>
        {posts.map((p, idx) => (
          <TableRow key={p._id}>
            <TableCell>{idx + 1}</TableCell>
            <TableCell>
              <div className='max-w-[60vw] truncate text-sm sm:max-w-[400px]' title={p.content || '-'}>
                {p.content || '-'}
              </div>
            </TableCell>
            <TableCell className='muted-foreground text-sm'>
              <div className='flex items-center gap-3'>
                <Avatar>
                  {p.author?.avatar ? (
                    <AvatarImage src={p.author.avatar} />
                  ) : (
                    <AvatarFallback>
                      {(p.author?.displayName || p.author?.email || p.userId || '-').slice(0, 2)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className='flex flex-col'>
                  <div className='text-sm font-medium'>{p.author?.displayName || p.author?.email || p.userId}</div>
                  <div className='muted-foreground text-xs'>{p.author?._id}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              {p.isDeleted ? (
                <span className='rounded-full bg-red-600 px-2 py-0.5 text-xs text-white'>Đã xóa</span>
              ) : p.hidden ? (
                <span className='rounded-full bg-yellow-600 px-2 py-0.5 text-xs text-white'>Đã ẩn</span>
              ) : (
                <span className='rounded-full bg-green-600 px-2 py-0.5 text-xs text-white'>Công khai</span>
              )}
            </TableCell>
            <TableCell className='muted-foreground text-sm'>
              {p.createdAt ? format(new Date(p.createdAt), 'dd/MM/yyyy HH:mm') : '-'}
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
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => onDelete && onDelete(p._id)}
                        isLoading={!!(loadingIds && loadingIds[p._id])}
                        className='flex w-full items-center justify-start gap-2 rounded-md px-2 py-2 text-sm text-slate-100'
                      >
                        <Trash2 className='h-4 w-4' />
                        Ẩn bài viết
                      </Button>
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

export default PostTable
