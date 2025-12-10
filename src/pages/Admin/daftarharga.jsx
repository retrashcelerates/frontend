import { useState } from "react";
import Navbaradmin from "../../components/Navbaradmin";
import Footeradmin from "../../components/Footeradmin";

export default function DaftarHarga() {
  const [showEdit, setShowEdit] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const dataDummy = [
    {
      id: 1,
      nama: "Botol Plastik (PET/PETE)",
      harga: "Rp 3.000/kg",
      status: "Aktif",
    },
    {
      id: 2,
      nama: "Kantong Plastik (HDPE/LDPE)",
      harga: "Rp 2.500/kg",
      status: "Aktif",
    },
    {
      id: 3,
      nama: "Gelas Plastik (PP/PS)",
      harga: "Rp 2.000/kg",
      status: "Aktif",
    },
    {
      id: 4,
      nama: "Botol Plastik (PET/PETE)",
      harga: "Rp 1.500/kg",
      status: "Aktif",
    },
  ];

  return (
    <div className="bg-[#F7F7F7] min-h-screen flex">
      <Navbaradmin />

      {/* PAGE WRAPPER */}
      <div className="flex-1 lg:ml-64 px-4 sm:px-6 pt-20 pb-60">
        {/* HEADER FIXED */}
        <div className="fixed top-0 left-0 lg:left-64 w-full lg:w-[calc(100%-16rem)] z-40 bg-[#F7F7F7] border-b border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.18)]">
          <div className="h-16 flex items-center justify-between px-6">
            <div>
              <h1 className="font-semibold text-[23px]">Daftar Harga</h1>
              <p className="text-gray-600 text-[15px]">
                Ubah harga dan status sampah
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

        {/* TABLE */}
        <div className="mt-6 bg-white shadow rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-[#D9D9D9] text-gray-800 text-[14px] font-semibold">
                  <th className="p-4 text-left text-[16px] sm:text-[18px]">
                    Jenis Sampah
                  </th>
                  <th className="p-4 text-left text-[16px] sm:text-[18px]">
                    Harga/kg
                  </th>
                  <th className="p-4 text-left text-[16px] sm:text-[18px]">
                    Status
                  </th>
                  <th className="p-4 text-center text-[16px] sm:text-[18px]">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {dataDummy.map((item) => (
                  <tr key={item.id} className="border-b h-[100px] sm:h-[124px]">
                    <td className="p-4 text-[14px]">{item.nama}</td>
                    <td className="p-4 text-[14px]">{item.harga}</td>
                    <td className="p-4">
                      <span className="bg-green-100 text-green-700 px-3 py-1 text-xs rounded-md">
                        {item.status}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => {
                            setSelectedData(item);
                            setShowEdit(true);
                          }}
                          className="p-2 rounded-md border border-gray-400 hover:bg-gray-100"
                        >
                          ✎
                        </button>

                        <button
                          onClick={() => {
                            setSelectedData(item);
                            setShowDelete(true);
                          }}
                          className="p-2 rounded-md bg-red-500 hover:bg-red-600 text-white"
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="fixed bottom-0 left-0 lg:left-64 w-full lg:w-[calc(100%-16rem)] z-50 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
        <Footeradmin />
      </div>

      {/* MODAL EDIT */}
      {showEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[90%] max-w-[360px] p-6 relative">
            <h2 className="font-semibold mb-4 text-lg">Edit Harga</h2>

            <label className="text-sm">Harga/Kg</label>
            <input
              type="text"
              defaultValue={selectedData?.harga}
              className="w-full mt-2 p-2 border rounded-md text-sm"
            />

            <div className="mt-4">
              <p className="text-sm mb-1">Status</p>
              <div className="flex gap-4 text-sm">
                <label className="flex items-center gap-1">
                  <input type="radio" name="status" defaultChecked /> Aktif
                </label>
                <label className="flex items-center gap-1">
                  <input type="radio" name="status" /> Tidak Aktif
                </label>
              </div>
            </div>

            <button
              onClick={() => {
                setShowEdit(false);
                setShowSuccess(true);
              }}
              className="mt-5 w-full bg-green-500 text-white py-2 rounded-md"
            >
              Selesai
            </button>

            <button
              onClick={() => setShowEdit(false)}
              className="absolute top-3 right-3 text-gray-400 text-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* MODAL SUCCESS */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[90%] max-w-[320px] p-6 text-center">
            <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl">
              ✓
            </div>

            <h3 className="font-semibold text-lg">Sukses</h3>
            <p className="text-gray-500 text-sm mt-1">
              Berhasil mengedit harga sampah
            </p>

            <button
              onClick={() => setShowSuccess(false)}
              className="mt-5 bg-green-500 text-white px-6 py-2 rounded-md text-sm"
            >
              Oke
            </button>
          </div>
        </div>
      )}

      {/* MODAL DELETE */}
      {showDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[90%] max-w-[340px] p-6 text-center">
            <h3 className="font-semibold mb-2">Konfirmasi Hapus</h3>
            <p className="text-sm text-gray-600">
              Apakah Anda yakin ingin menghapus data ini?
              <br />
              Tindakan tidak dapat dibatalkan.
            </p>

            <div className="mt-5 flex justify-center gap-4">
              <button
                onClick={() => setShowDelete(false)}
                className="px-4 py-2 border rounded-md text-sm"
              >
                Batal
              </button>

              <button
                onClick={() => setShowDelete(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-md text-sm"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
