import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PlusCircle,
  List,
  ShoppingCart,
  Users,
  LogOut,
  Menu,
  X,
  Search
} from 'lucide-react';

const Dashboard = () => {
  const [tab, setTab] = useState('users');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchEndpoints = {
    users: '/api/admin/users',
    sellers: '/api/admin/sellers',
    products: '/api/admin/products',
    orders: '/api/admin/orders',
    addresses: '/api/admin/addresses',
  };

  const iconMap = {
    users: Users,
    sellers: List,
    products: PlusCircle,
    orders: ShoppingCart,
    addresses: List,
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get('/api/admin/check', { withCredentials: true });
        if (!data.success) navigate('/admin');
      } catch {
        navigate('/admin');
      }
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(fetchEndpoints[tab], { withCredentials: true });
        setData(response.data?.[tab] || []);
      } catch {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tab]);

  const handleLogout = () => {
    document.cookie = 'adminToken=; Max-Age=0; path=/;';
    navigate('/admin');
  };

  const filteredData = data.filter((item) =>
    Object.values(item).some((val) =>
      val?.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

 const renderTable = () => {
  if (tab === 'users' || tab === 'sellers') {
    return (
      <table className="w-full table-auto text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Email</th>
            {tab === 'sellers' && (
              <>
                <th className="py-2 px-4 text-left">Phone</th>
                <th className="py-2 px-4 text-left">PAN</th>
              </>
            )}
            <th className="py-2 px-4 text-left">Role</th>
            <th className="py-2 px-4 text-left">Created</th>
            <th className="py-2 px-4 text-left">More</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item._id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{item.name}</td>
              <td className="py-2 px-4">{item.email}</td>
              {tab === 'sellers' && (
                <>
                  <td className="py-2 px-4">{item.phone || item.number || '—'}</td>
                  <td className="py-2 px-4">{item.pan || '—'}</td>
                </>
              )}
              <td className="py-2 px-4 capitalize">
                {item.role || (tab === 'users' ? 'user' : 'seller')}
              </td>
              <td className="py-2 px-4">
                {new Date(item.createdAt).toLocaleDateString()}
              </td>
              <td className="py-2 px-4 text-xs text-gray-500 max-w-[200px] overflow-x-auto">
                <pre>{JSON.stringify(item, null, 1)}</pre>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

    if (tab === 'products') {
      return (
        <table className="w-full table-auto text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Price</th>
              <th className="py-2 px-4 text-left">Category</th>
              <th className="py-2 px-4 text-left">Seller</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((p) => (
              <tr key={p._id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{p.name}</td>
                <td className="py-2 px-4">₹{p.price}</td>
                <td className="py-2 px-4">{p.category || '—'}</td>
                <td className="py-2 px-4">{p.sellerId?.name || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
if (tab === 'orders') {
  return (
    <table className="w-full table-auto text-sm">
      <thead className="bg-gray-100 text-gray-700">
        <tr>
          <th className="py-2 px-4 text-left">Order ID</th>
          <th className="py-2 px-4 text-left">User</th>
          <th className="py-2 px-4 text-left">Amount</th>
          <th className="py-2 px-4 text-left">Qty</th>
          <th className="py-2 px-4 text-left">Payment</th>
          <th className="py-2 px-4 text-left">Address</th>
          <th className="py-2 px-4 text-left">Status</th>
        </tr>
      </thead>
      <tbody>
        {filteredData.map((o, index) => (
          <tr key={o._id || index} className="border-b hover:bg-gray-50">
            <td className="py-2 px-4">{o._id}</td>
            <td className="py-2 px-4">{o.userId?.email || 'N/A'}</td>
            <td className="py-2 px-4">₹{o.amount}</td>
            <td className="py-2 px-4">{o.cart?.length || '0'}</td>
            <td className="py-2 px-4">{o.paymentMethod || '—'}</td>
            <td className="py-2 px-4">
              {typeof o.address === 'object' && o.address !== null
                ? Object.values(o.address).filter(Boolean).join(', ')
                : o.address || '—'}
            </td>
            <td className="py-2 px-4">{o.orderStatus}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

if (tab === 'addresses') {
  return (
    <table className="w-full table-auto text-sm">
      <thead className="bg-gray-100 text-gray-700">
        <tr>
          <th className="py-2 px-4 text-left">Name</th>
          <th className="py-2 px-4 text-left">Email</th>
          <th className="py-2 px-4 text-left">Phone</th>
          <th className="py-2 px-4 text-left">Role</th>
          <th className="py-2 px-4 text-left">Address</th>
        </tr>
      </thead>
      <tbody>
        {filteredData.map((item, index) => (
          <tr key={item._id || item.id || index} className="border-b hover:bg-gray-50">
            <td className="py-2 px-4">
              {item.name || `${item.firstName || ''} ${item.lastName || ''}`}
            </td>
            <td className="py-2 px-4">{item.email}</td>
            <td className="py-2 px-4">{item.phone || item.number || '—'}</td>
            <td className="py-2 px-4 capitalize">{item.role || 'user'}</td>
            <td className="py-2 px-4 max-w-xs whitespace-pre-wrap">
              {typeof item.address === 'object' && item.address !== null
                ? Object.values(item.address).filter(Boolean).join(', ')
                : item.address || '—'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}





    return null;
  };

  return (
// Updated Dashboard Component
<div className="flex min-h-screen bg-gradient-to-tr from-[#f1fdf7] via-white to-[#e8f0ff] font-[Outfit]">
  {/* Sidebar */}
  <motion.aside
    initial={{ x: -100, opacity: 0 }}
    animate={{ x: isSidebarOpen ? 0 : -260, opacity: 1 }}
    transition={{ duration: 0.3 }}
    className={`fixed top-0 left-0 h-full z-30 w-64 bg-gray-900 shadow-xl border-r transition-transform duration-300 ease-in-out ${
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
    }`}
  >
    <div className="py-6 px-5 flex flex-col gap-4 h-full">
      <h1 className="text-3xl font-bold text-green-600 mb-6">Admin Panel</h1>

      {Object.entries(fetchEndpoints).map(([key]) => {
        const Icon = iconMap[key];
        const isActive = tab === key;
        return (
          <motion.button
            whileHover={{ scale: 1.03 }}
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all text-left ${
              isActive
                ? 'bg-green-100 text-green-700 font-semibold shadow-md'
                : 'text-white hover:bg-green-700'
            }`}
          >
            <Icon size={20} />
            <span className="capitalize text-base">{key}</span>
          </motion.button>
        );
      })}

      <div className="mt-auto pt-6 border-t">
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-600 hover:text-red-700 px-4 py-2 rounded-xl"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </motion.button>
      </div>
    </div>
  </motion.aside>

  {/* Sidebar Toggle (mobile) */}
  <button
    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
    className="absolute top-4 left-4 md:hidden z-50 bg-white rounded-full p-2 shadow-md border"
  >
    {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
  </button>

  {/* Main Content */}
  <div
    className={`flex-1 p-4 md:p-8 w-full transition-all duration-300 ${
      isSidebarOpen ? 'md:ml-64' : 'ml-0'
    }`}
  >
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
      <h2 className="text-3xl font-bold capitalize text-gray-800">{tab} Analytics</h2>
      <div className="relative w-full md:w-64">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-400 w-full transition-all"
        />
        <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
      </div>
    </div>

    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 min-h-[60vh] transition-all duration-300">
      {loading ? (
        <div className="text-center text-gray-500 py-10 animate-pulse">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-10">{error}</div>
      ) : filteredData.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No results found.</div>
      ) : (
        renderTable()
      )}
    </div>
  </div>
</div>

  );
};

export default Dashboard;
