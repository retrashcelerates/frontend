import { useState } from "react";
import DataImage from "../data";

const DeleteConfirm = ({ open, onClose, onDelete }) => {
  if (!open) return null;

  const [showSuccess, setShowSuccess] = useState(false);

  const handleDelete = async () => {
    const ok = await onDelete(); // parent harus return true bila berhasil
    if (ok !== false) {
      setShowSuccess(true);
    }
  };

  return (
    <>
      {/* OVERLAY KONFIRMASI */}
      {!showSuccess && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex justify-center items-center px-4">

          <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 animate-fadeIn relative">
            <h3 className="text-lg font-semibold text-center">
              Konfirmasi Hapus
            </h3>

            <p className="text-left text-black mt-4">
              Apakah Anda yakin ingin menghapus berita ini?
              <br />
              Tindakan tidak dapat dibatalkan.
            </p>

            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg"
              >
                Hapus
              </button>
            </div>
          </div>

        </div>
      )}

      {/* POP UP SUKSES */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 z-[110] flex items-center justify-center px-4">

          <div className="bg-white w-full max-w-sm rounded-xl shadow-xl p-7 text-center animate-fadeIn">

            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <img
                src={DataImage.CentangIcon}
                alt="success"
                className="w-12 h-12"
              />
            </div>

            <h3 className="text-xl font-semibold">Sukses</h3>
            <p className="text-gray-600 mt-1">Berhasil menghapus berita.</p>

            <button
              onClick={() => {
                setShowSuccess(false);
                onClose();
              }}
              className="mt-5 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              Oke
            </button>

          </div>

        </div>
      )}
    </>
  );
};

export default DeleteConfirm;
