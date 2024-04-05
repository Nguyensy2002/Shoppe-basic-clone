
// khai báo đường dẫn để dùng trong các component đỡ tránh tình trạng viết sai đường dẫn
const path = {
    home: '/',
    user: '/user',
    login: '/login',
    register: '/register',
    profile: '/user/profile',
    changePassword: '/user/password',
    historyPurchase:'/user/purchase',
    logout: '/logout',
    ProductDetails: ':nameId',
    cart: '/cart'
} as const
export default path