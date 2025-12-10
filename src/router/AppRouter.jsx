import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Menu from '../pages/Menu';
import Details from '../pages/Details';
import Order from '../pages/Order';
import Edit from '../pages/Edit';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Promotion from '../pages/Promotion';
import { GuestRoute, PrivateRoute, AdminRoute } from './RouteGuards';
import AdminLayout from '../pages/admin/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminProductForm from '../pages/admin/AdminProductForm';
import AdminSubmissions from '../pages/admin/AdminSubmissions';

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/menu" element={<Menu />} />
    <Route path="/menu/:categoryId" element={<Menu />} />
    <Route path="/details/:id" element={<Details />} />
    <Route path="/order" element={<Order />} />
    <Route element={<PrivateRoute />}>
      <Route path="/edit/:id" element={<Edit />} />
      <Route path="/profile" element={<Profile />} />
    </Route>
    <Route element={<AdminRoute />}>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<AdminProductForm />} />
        <Route path="products/:id/edit" element={<AdminProductForm />} />
        <Route path="submissions" element={<AdminSubmissions />} />
      </Route>
    </Route>
    <Route element={<GuestRoute />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Route>
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/promotion" element={<Promotion />} />
  </Routes>
);

export default AppRouter;
