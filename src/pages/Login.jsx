import DataImage from "../data";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10">
      <div className="bg-white p-10 rounded-2xl shadow-lg grid md:grid-cols-2 gap-10 w-[900px]">
        {/* IMAGE */}
        <img src={DataImage.LoginImage} className="rounded-xl object-cover" />

        {/* FORM */}
        <div>
          <h1 className="text-2xl font-bold mb-1">
            Login Akun <span className="text-green-600">ReTrash</span>
          </h1>

          <p className="text-sm text-gray-500 mb-4">
            Pengguna terdaftar dapat masuk menggunakan email dan kata sandi.
          </p>

          <form className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full border px-4 py-2 rounded-lg"
            />

            <input
              type="password"
              placeholder="Kata Sandi"
              className="w-full border px-4 py-2 rounded-lg"
            />

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-lg hover:bg-green-600 transition"
            >
              Login
            </button>
          </form>

          <p className="mt-4 text-sm">
            Belum punya akun?{" "}
            <a href="/register" className="text-green-600 underline">
              Daftar Sekarang
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
