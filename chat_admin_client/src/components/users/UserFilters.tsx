import React from 'react'
import { Input } from '~/components/ui/input'

type Props = {
  query: string
  setQuery: (v: string) => void
  verifyFilter: string
  setVerifyFilter: (v: string) => void
}

const UserFilters: React.FC<Props> = ({ query, setQuery, verifyFilter, setVerifyFilter }) => {
  return (
    <div className='mb-4 flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
      <div className='flex w-full items-center gap-2'>
        <Input
          placeholder='Tìm kiếm theo tên hoặc email...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className='max-w-md'
        />

        <div className='flex items-center gap-2'>
          <label className='muted-foreground text-sm'>Trạng thái:</label>
          <select
            value={verifyFilter}
            onChange={(e) => setVerifyFilter(e.target.value)}
            className='rounded-md border px-2 py-1 text-sm'
          >
            <option value='ACTIVE'>Đang hoạt động</option>
            <option value='INACTIVE'>Đã khóa</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default UserFilters
