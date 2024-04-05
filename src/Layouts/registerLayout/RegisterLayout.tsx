import { memo } from 'react'
import { Outlet } from 'react-router-dom'
import RegisterHeader from 'src/components/RegisterHeader'
import Footer from 'src/components/footer/Footer'

interface Props {
  children?: React.ReactNode
}
function RegisterLayoutInner({ children }: Props) {
  return (
    <div>
      <RegisterHeader />
      {children}
      <Outlet />
      <Footer />
    </div>
  )
}

const RegisterLayout = memo(RegisterLayoutInner)

export default RegisterLayout