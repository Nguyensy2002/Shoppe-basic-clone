import CartHeader from 'src/components/CartHeader'
import Footer from 'src/components/footer/Footer'
interface Props {
  children?: React.ReactNode
}
//XÂY DỰNG LAYOUT CHÍNH CHO TRANG CHỦ
export default function CartLayout({ children }: Props) {
  return (
    <div>
      <CartHeader />
        {children}
      <Footer />
    </div>
  )
}