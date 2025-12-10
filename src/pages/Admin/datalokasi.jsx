import { useEffect, useState } from "react";
import axios from "axios";
import Navbaradmin from "../../components/Navbaradmin";
import Footeradmin from "../../components/Footeradmin";
import DataImage from "../../data";
import FormTambahLokasi from "../../components/FormTambahLokasi";

const API_URL = "https://backend-deployment-topaz.vercel.app/api/lokasi";

const AdminLokasi = () => {
  const [lokasi, setLokasi] = useState([]);
  const [loading, setLoading] = useState(true);

  // MODAL STATE
  const [openTambah, setOpenTambah] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [selectedId, setSelectedId] = useState(null);

  // Fetch lokasi data
  const fetchData = () => {
    axios
      .get(API_URL)
      .then((res) => {
        setLokasi(res.data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // HAPUS LOKASI
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${selectedId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setOpenDelete(false);
      setSelectedId(null);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus lokasi!");
    }
  };

  return (
    <div className="bg-[#F7F7F7] min-h-screen flex">
      {/* SIDEBAR */}
      <Navbaradmin />

      {/* MAIN CONTENT */}
      <div className="flex-1 lg:ml-64 bg-[#F7F7F7] min-h-screen">
        
          {/* HEADER FIXED + SHADOW (di atas konten) */}
          <div className="fixed top-0 left-0 lg:left-64 w-full lg:w-[calc(100%-16rem)] z-40 bg-[#F7F7F7] border-b border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.18)]">
            <div className="h-16 flex items-center justify-between px-6">
              <div>
                <h1 className="font-semibold text-[23px]">Daftar User</h1>
                <p className="text-gray-600 text-[15px]">
                  Kelola data pelanggan bank sampah.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src="https://i.pravatar.cc/150?img=12"
                  className="w-10 h-10 rounded-full"
                  alt="profile"
                />
                <div>
                  <p className="font-semibold text-sm">Indi Ariyanti</p>
                  <p className="text-gray-500 text-xs">Admin</p>
                </div>
              </div>
            </div>
          </div>

        {/* CONTENT */}
        <div className="pt-[100px] px-6 pb-36">

          {/* BUTTON TAMBAH */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setOpenTambah(true)}
              className="bg-[#47CF65] hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              + Tambah Lokasi
            </button>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-xl shadow border border-gray-500 overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead className="bg-[#D8D8D8] text-sm text-black">
                <tr className="h-14">
                  <th className="px-5 text-left font-semibold w-[25%]">Nama Lokasi</th>
                  <th className="px-5 font-semibold w-[15%]">Jalan</th>
                  <th className="px-5 font-semibold w-[10%]">Desa</th>
                  <th className="px-5 font-semibold w-[10%]">Kecamatan</th>
                  <th className="px-5 font-semibold w-[10%]">Kabupaten</th>
                  <th className="px-5 font-semibold w-[10%]">Kode Pos</th>
                  <th className="px-5 font-semibold w-[10%] text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-500">
                      Memuat data...
                    </td>
                  </tr>
                ) : lokasi.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-500">
                      Tidak ada data lokasi.
                    </td>
                  </tr>
                ) : (
                  lokasi.map((item) => (
                    <tr key={item.id} className="border-t border-gray-500 hover:bg-gray-50">

                      {/* FOTO + NAMA */}
                      <td className="flex items-center gap-3 p-3">
                        <img
                          src={item.image_url}
                          className="w-16 h-16 rounded-md object-cover"
                          alt="lokasi"
                        />
                        <span className="font-medium text-sm">{item.name}</span>
                      </td>

                      <td className="text-gray-700 text-sm text-center">{item.jalan}</td>
                      <td className="text-gray-700 text-sm text-center">{item.desa}</td>
                      <td className="text-gray-700 text-sm text-center">{item.kecamatan}</td>
                      <td className="text-gray-700 text-sm text-center">{item.kabupaten}</td>
                      <td className="text-gray-700 text-sm text-center">{item.kodepos}</td>

                      {/* Aksi */}
                      <td className="text-center py-2">
                        <button
                          onClick={() => {
                            setSelectedId(item.id);
                            setOpenDelete(true);
                          }}
                          className="hover:opacity-80"
                        >
                          <img src={DataImage.DeleteIcon} className="w-5" alt="delete" />
                        </button>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER */}
        <div className="fixed bottom-0 left-0 lg:left-64 w-full lg:w-[calc(100%-16rem)]
                        bg-white shadow z-40">
          <Footeradmin />
        </div>
      </div>

      {/* MODAL TAMBAH */}
      <FormTambahLokasi
        open={openTambah}
        onClose={() => setOpenTambah(false)}
        onSuccess={() => {
          setOpenTambah(false);
          fetchData();
        }}
      />

      {/* MODAL DELETE */}
      {openDelete && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-md rounded-xl p-8 shadow-lg">

            <h3 className="text-lg font-semibold text-center">Hapus Lokasi?</h3>
            <p className="text-left text-black mt-4">
              Apakah Anda yakin ingin menghapus lokasi ini? <br/> Tindakan tidak dapat dibatalkan.
            </p>

            <div className="flex justify-center gap-3 mt-10">
              <button
                onClick={handleDelete}
                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Hapus
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminLokasi;
