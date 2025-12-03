import DataImage from "../data";


export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10">
      <div className="bg-white p-10 rounded-2xl shadow-lg grid md:grid-cols-2 gap-10 w-[900px]">
        {/* IMAGE */}
        <img src={DataImage.LoginImage} className="rounded-xl object-cover" />

        {/* FORM */}
        <div>
          <h1 className="text-2xl font-bold mb-1">
            Register Akun <span className="text-green-600">ReTrash</span>
          </h1>

          <form className="space-y-4">
            <input
              type="text"
              placeholder="Nama Lengkap"
              className="w-full border px-4 py-2 rounded-lg"
            />
            <input
              type="text"
              placeholder="Alamat"
              className="w-full border px-4 py-2 rounded-lg"
            />
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
              Register
            </button>
          </form>

          <p className="mt-4 text-sm">
            Sudah punya akun?{" "}
            <a href="/login" className="text-green-600 underline">
              Login Sekarang
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
