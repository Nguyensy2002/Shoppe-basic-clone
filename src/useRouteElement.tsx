import { Navigate, Outlet, useRoutes } from "react-router-dom";
import ProductList from "./pages/ProductList";
import Register from "./pages/Register";
import Login from "./pages/Login";
import RegisterLayout from "./Layouts/registerLayout";
import MainLayout from "./Layouts/MainLayout";
import { AppContext } from "./contexts/app.context";
import { useContext} from 'react'
import path from "./constants/path";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import CartLayout from "./Layouts/CartLayout";
import UserLayout from "./pages/User/layout/UserLayout";
import ChangePassword from "./pages/User/pages/ChangePassword";
import HistoryPurchase from "./pages/User/pages/HistoryPurchase";
import Profile from "./pages/User/pages/profile";
import NotFound from "./pages/NotFound";


function ProtectedRoute(){
    const {isAuthenticated} = useContext(AppContext)
    //khi đăng nhập thành công sẽ cho vào outlet còn chưa thành công thì sẽ ở lại trang login
    return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

//kiểm tra xem nếu đã login rồi thì sẽ không cho vào trang login nữa
function RejectRoute(){
    const {isAuthenticated} = useContext(AppContext)
    //khi đăng nhập chưa thành công sẽ cho vào outlet còn thành công thì sẽ tới trang /
    return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}
export default function useRouteElement(){
    const routeElements = useRoutes([
        {
            path: '',
            element: <ProtectedRoute />,
            children: [
                {
                    path: path.cart,
                    element: (
                        <CartLayout>
                            <Cart/>
                        </CartLayout>
                    )
                },
                {
                    path: path.user,
                    element: (
                        <MainLayout>
                            <UserLayout/>
                        </MainLayout>
                    ),
                    children: [
                        {
                            path: path.profile,
                            element:(
                                <Profile/>
                            )
                        },
                        {
                            path: path.changePassword,
                            element:(
                                <ChangePassword/>
                            )
                        },
                        {
                            path: path.historyPurchase,
                            element:(
                                <HistoryPurchase/>
                            )
                        },
                    ]
                },
            ]
        },
        {
            path: '',
            element: <RejectRoute />,
            children: [
            {
                path: path.login,
                element: (<RegisterLayout><Login /></RegisterLayout>)
            },
            {
                path: path.register,
                element: (<RegisterLayout><Register /></RegisterLayout>)
            }]
        },
        {
            path: path.ProductDetails,
            index: true,
            element: 
            <MainLayout>
                <ProductDetail/>
            </MainLayout>
        },
        {
            path: '/',
            index: true,
            element: 
            <MainLayout>
                <ProductList/>
            </MainLayout>
        },
        {
            path:'*',
            element: (
                <MainLayout>
                    <NotFound />
                </MainLayout>
            )
        }
])
    return routeElements
}