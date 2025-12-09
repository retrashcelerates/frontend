import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  const menu = [
    { name: "Dashboard", icon: "📊", path: "/admin" },
    { name: "Berita", icon: "📰", path: "/admin/berita" },
    { name: "Daftar Harga", icon: "💲", path: "/admin/harga" },
    { name: "Daftar User", icon: "👤", path: "/admin/user" },
  ];

  return (
    <div className="w-64 min-h-screen bg-white border-r p-4">
      <h1 className="text-xl font-bold text-green-600 mb-6">ReTrash</h1>

      <ul className="space-y-2">
        {menu.map((item, i) => (
          <NavLink
            key={i}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition ${
                isActive ? "bg-green-500 text-white" : "hover:bg-gray-100"
              }`
            }
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </ul>

      <button className="mt-10 w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg">
        Keluar
      </button>
    </div>
  );
};

export default AdminSidebar;
