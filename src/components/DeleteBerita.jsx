const DeleteConfirm = ({ open, onClose, onDelete }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-[100] flex justify-center items-center px-4">
      
      {/* CARD */}
      <div className="bg-white w-full max-w-sm rounded-xl shadow-lg p-6 animate-fadeIn relative">

        <h3 className="text-sm font-semibold text-black mb-4">
          Konfirmasi Hapus
        </h3>

        <p className="text-black text-sm leading-relaxed">
          Apakah Anda yakin ingin menghapus berita ini?
          <br />
          Tindakan tidak dapat dibatalkan.
        </p>

        {/* BUTTON */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={onDelete}
            className="bg-red-600 hover:bg-red-400 text-white px-6 py-2 rounded-lg"
          >
            Hapus
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeleteConfirm;
