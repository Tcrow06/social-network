import React from 'react'
import { Link } from 'react-router-dom'

const NotFound: React.FC = () => {
  return (
    <div className='flex min-h-[60vh] items-center justify-center'>
      <div className='text-center'>
        <div className='mb-8'>
          <p className='text-9xl font-bold text-gray-800'>404</p>
          <div className='text-6xl'>🏟️</div>
        </div>

        <h2 className='mb-4 text-3xl font-bold text-gray-800'>Trang không tồn tại</h2>

        <p className='mx-auto mb-8 max-w-md text-gray-600'>
          Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </p>

        <div className='space-x-4'>
          <Link
            to='/'
            className='bg-sidebar inline-block rounded-lg px-6 py-3 text-white transition-colors duration-200 hover:scale-105 hover:bg-cyan-700'
          >
            ← Về Dashboard
          </Link>

          <button
            onClick={() => window.history.back()}
            className='inline-block rounded-lg bg-gray-700 px-6 py-3 text-white transition-colors duration-200 hover:scale-105 hover:bg-gray-800'
          >
            Quay lại
          </button>
        </div>

        {/* Quick links */}
        <div className='mt-12'>
          <h3 className='mb-4 text-lg font-semibold text-gray-700'>Hoặc truy cập:</h3>
          <div className='flex justify-center space-x-6'>
            <Link to='/stadiums' className='text-sidebar hover:underline'>
              Quản lý sân
            </Link>
            <Link to='/bookings' className='text-sidebar hover:underline'>
              Đặt sân
            </Link>
            <Link to='/users' className='text-sidebar hover:underline'>
              Người dùng
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
