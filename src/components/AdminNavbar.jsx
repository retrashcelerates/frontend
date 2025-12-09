const AdminHeader = () => {
  return (
    <div className="w-full flex justify-between items-center py-4 px-6 bg-white border-b">
      <div>
        <h2 className="text-lg font-semibold">Daftar Berita</h2>
        <p className="text-sm text-gray-500">Kelola berita untuk Bank Sampah Anda</p>
      </div>

      <div className="flex items-center gap-3">
        <img
          src="https://ui-avatars.com/api/?name=Admin"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="text-sm font-semibold">Indi Arliyanti</p>
          <p className="text-xs text-gray-500">Admin</p>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
