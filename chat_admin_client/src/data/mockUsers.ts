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

export const mockUsers: User[] = [
  {
    _id: '68dcdd9a5070550828b27402',
    username: 'congquynguyen2510011451770',
    email: 'congquynguyen296.dev@gmail.com',
    avatar: '',
    name: 'congquynguyen',
    dateOfBirth: '2025-12-09T17:00:00.000Z',
    verify: 'VERIFIED',
    createdAt: '2025-10-01T07:51:54.102Z'
  },
  {
    _id: '68dcd5025070550828b272c5',
    username: 'congquynguyen2510011415485',
    email: 'congquynguyen296@gmail.com',
    avatar: '',
    name: 'congquynguyen',
    dateOfBirth: '2004-09-19T17:00:00.000Z',
    verify: 'VERIFIED',
    createdAt: '2025-10-01T07:15:14.488Z'
  },
  {
    _id: '68cf9726d05efbe9581b5ef5',
    username: 'pham-tien-anh2509211311616',
    email: 'phamtienanh815@gmail.com',
    avatar: 'https://res.cloudinary.com/dcxceafr7/image/upload/v1759917497/posts/images/i5ppufus9qtavq2ktcdb.jpg',
    name: 'Phạm Tiến Anh',
    dateOfBirth: '2004-04-01T17:00:00.000Z',
    verify: 'VERIFIED',
    createdAt: '2025-09-21T06:11:51.001Z'
  },
  // extra mock users
  {
    _id: 'u4',
    username: 'linhdoe',
    email: 'linh@example.com',
    avatar: '',
    name: 'Linh Nguyễn',
    dateOfBirth: '1995-05-01T00:00:00.000Z',
    verify: 'UNVERIFIED',
    createdAt: '2025-08-11T10:00:00.000Z'
  },
  {
    _id: 'u5',
    username: 'huytran',
    email: 'huy.tran@mail.com',
    avatar: '',
    name: 'Huy Trần',
    dateOfBirth: '1990-02-12T00:00:00.000Z',
    verify: 'VERIFIED',
    createdAt: '2025-06-21T09:20:00.000Z'
  },
  {
    _id: 'u6',
    username: 'anhle',
    email: 'anh.le@mail.com',
    avatar: '',
    name: 'Anh Lê',
    dateOfBirth: '1988-07-03T00:00:00.000Z',
    verify: 'UNVERIFIED',
    createdAt: '2025-05-01T08:11:00.000Z'
  },
  {
    _id: 'u7',
    username: 'thuongpham',
    email: 'thuong@example.com',
    avatar: '',
    name: 'Thương Phạm',
    dateOfBirth: '1998-11-11T00:00:00.000Z',
    verify: 'VERIFIED',
    createdAt: '2025-04-10T12:00:00.000Z'
  },
  {
    _id: 'u8',
    username: 'minhng',
    email: 'minh.ng@gmail.com',
    avatar: '',
    name: 'Minh Nguyễn',
    dateOfBirth: '1992-03-18T00:00:00.000Z',
    verify: 'VERIFIED',
    createdAt: '2025-03-12T14:00:00.000Z'
  },
  {
    _id: 'u9',
    username: 'thaohoa',
    email: 'thaohoa@mail.com',
    avatar: '',
    name: 'Thảo Hòa',
    dateOfBirth: '1996-12-22T00:00:00.000Z',
    verify: 'UNVERIFIED',
    createdAt: '2025-02-02T11:11:00.000Z'
  },
  {
    _id: 'u10',
    username: 'ducpham',
    email: 'duc@example.com',
    avatar: '',
    name: 'Đức Phạm',
    dateOfBirth: '1993-09-09T00:00:00.000Z',
    verify: 'VERIFIED',
    createdAt: '2025-01-01T07:00:00.000Z'
  }
]

export default mockUsers
