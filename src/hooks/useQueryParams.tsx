import { useSearchParams } from 'react-router-dom'

//tạo hook để lấy các queryParam trên url
export default function useQueryParams() {
  const [searchParams] = useSearchParams()
  return Object.fromEntries([...searchParams])
}