import './App.css'
import { Routes, Route } from "react-router-dom";
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './components/AdminLayout'
import Dashboard from './components/Dashboard'
import Customers from './components/UserManagement'
import Products from './components/Products';
import Orders from './components/Orders';
import ProtectedRoute from './components/ProtectedRoute'
import Category from './components/Category';
import AddProduct from './components/AddProduct';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditProduct from './components/EditProduct';

function App() {


  return (
    <>

<ToastContainer />

    
      <Routes>  

        <Route path='/adminlogin' element={<AdminLogin />} />

        <Route
          path='/'
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >

          <Route index element={<Dashboard />} />
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='usermanagement' element={<Customers />} />
          <Route path='products' element={<Products />} />
          <Route path='orders' element={<Orders />} />
          <Route path='category' element={<Category />} />
          <Route path='addproduct' element={<AddProduct />} />
          <Route path='editproduct/:id' element={<EditProduct />} />

        </Route>

      </Routes>

    </>
  )
}

export default App
