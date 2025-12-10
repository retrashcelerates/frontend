import { useEffect, useState } from "react";
import axios from "axios";
import DataImage from "../../data";

import AdminSidebar from "../../components/AdminSidebar";
import AdminNavbar from "../../components/AdminNavbar";
import TambahBerita from "../../components/FormTambahBerita";
import EditBerita from "../../components/FormEditBerita";
import DeleteConfirm from "../../components/DeleteBerita";

const API_URL = "https://backend-deployment-topaz.vercel.app/api/berita";

const AdminBerita = () => {
  const [berita, setBerita] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [openTambah, setOpenTambah] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [selectedId, setSelectedId] = useState(null);

  // Fetch berita
  const fetchData = () => {
    axios
      .get(API_URL)
      .then((res) => {
        setBerita(res.data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setBerita([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter hasil pencarian
  const filtered = berita.filter((item) =>
    (item.judul || "").toLowerCase().includes(search.toLowerCase())
  );

  // Delete fungsi
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${selectedId}`);
      setOpenDelete(false);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus berita!");
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <AdminSidebar />

      <div className="flex-1 bg-white">
        <AdminNavbar />

        <div className="p-6">
          {/* Header Search + Tambah Berita */}
          <div className="flex justify-between items-center mb-6">
            {/* SEARCH */}
            <div className="relative">
              <img
                src={DataImage.SearchIcon}
                alt="search"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-70"
              />

              <input
                type="text"
                placeholder="Cari berita..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="text-sm border pl-10 pr-4 bg-white py-2 rounded-lg w-64 shadow-sm"
              />
            </div>

            {/* BUTTON TAMBAH */}
            <button
              onClick={() => setOpenTambah(true)}
              className="bg-[#47CF65] text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              + Tambah Berita
            </button>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-xl shadow border border-[#857A7A] overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#D8D8D8] text-black text-sm border-b">
                <tr className="h-14">
                  <th className="px-10 text-left w-[45%] font-semibold">
                    Judul
                  </th>
                  <th className="px-10 text-center w-[20%] font-semibold">
                    Tanggal Publikasi
                  </th>
                  <th className="px-10 text-center w-[20%] font-semibold">
                    Status
                  </th>
                  <th className="px-10 text-center w-[15%] font-semibold">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-gray-500">
                      Memuat data...
                    </td>
                  </tr>
                ) : filtered.length > 0 ? (
                  filtered.map((item) => (
                    <tr key={item.id} className="border-t hover:bg-gray-50">
                      {/* Judul + Gambar */}
                      <td className="p-3 flex gap-3 items-center">
                        <img
                          src={item.image_url}
                          className="w-20 h-16 object-cover rounded-md"
                        />
                        <div>
                          <p className="font-medium">{item.judul}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">
                            {item.konten}
                          </p>
                        </div>
                      </td>

                      {/* Tanggal */}
                      <td className="text-center text-sm text-gray-600">
                        {new Date(item.created_at).toLocaleDateString("id-ID")}
                      </td>

                      {/* Status */}
                      <td className="text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            item.status === "terbit"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* ACTION BUTTONS */}
                      <td className="py-2 w-[120px]">
                        <div className="flex items-center justify-center gap-4">
                          {/* EDIT */}
                          <button
                            onClick={() => {
                              setSelectedId(item.id);
                              setOpenEdit(true);
                            }}
                            className="hover:opacity-80"
                          >
                            <img
                              src={DataImage.EditIcon}
                              alt="Edit"
                              className="w-5 h-5"
                            />
                          </button>

                          {/* DELETE */}
                          <button
                            onClick={() => {
                              setSelectedId(item.id);
                              setOpenDelete(true);
                            }}
                            className="hover:opacity-80"
                          >
                            <img
                              src={DataImage.DeleteIcon}
                              alt="Delete"
                              className="w-5 h-5"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-10 text-gray-500">
                      Tidak ada berita ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL TAMBAH */}
      <TambahBerita
        open={openTambah}
        onClose={() => setOpenTambah(false)}
        onSuccess={() => {
          setOpenTambah(false);
          fetchData();
        }}
      />

      {/* MODAL EDIT */}
      <EditBerita
        open={openEdit}
        beritaId={selectedId}
        onClose={() => setOpenEdit(false)}
        onSuccess={() => {
          setOpenEdit(false);
          fetchData();
        }}
      />

      {/* MODAL DELETE */}
      <DeleteConfirm
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminBerita;
