import { memo } from 'react'
import { Outlet } from 'react-router-dom'
import Header from 'src/components/Header'
import Footer from 'src/components/footer/Footer'
interface Props {
  children?: React.ReactNode
}
function MainLayoutInner({ children }: Props) {
  return (
    <div>
      <Header />
        {children}
        <Outlet />
      <Footer />
    </div>
  )
}
const MainLayout = memo(MainLayoutInner)
export default MainLayout