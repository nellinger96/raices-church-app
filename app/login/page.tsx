export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F1E8] px-6 py-12 text-[#1F2933]">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-xl">
        <a href="/" className="text-sm font-semibold text-[#2F5D50]">
          ← Volver al inicio
        </a>

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9A7B4F]">
            Raíces
          </p>

          <h1 className="mt-3 text-3xl font-bold">Iniciar sesión</h1>

          <p className="mt-3 text-[#4B5563]">
            Entra como estudiante para continuar tus cursos o como pastor/admin
            para administrar la iglesia.
          </p>
        </div>

        <form className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-semibold">Correo electrónico</label>
            <input
              type="email"
              placeholder="tu@email.com"
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2F5D50]"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2F5D50]"
            />
          </div>

          <a
            href="/dashboard"
            className="block w-full rounded-full bg-[#2F5D50] px-6 py-3 text-center font-semibold text-white hover:bg-[#254A40]"
          >
            Iniciar sesión
          </a>
        </form>

        <div className="mt-6 rounded-2xl bg-[#F7F1E8] p-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9A7B4F]">
            Demo rápido
          </p>

          <p className="mt-2 text-sm leading-6 text-[#4B5563]">
            Para mostrar el proyecto sin configurar cuentas reales todavía,
            puedes entrar con uno de estos roles de prueba.
          </p>

          <div className="mt-4 grid gap-3">
            <a
              href="/dashboard"
              className="rounded-full bg-white px-5 py-3 text-center text-sm font-semibold text-[#2F5D50] shadow-sm hover:bg-[#EFE3D1]"
            >
              Entrar como estudiante
            </a>

            <a
              href="/admin"
              className="rounded-full border border-[#9A7B4F] bg-white px-5 py-3 text-center text-sm font-semibold text-[#9A7B4F] shadow-sm hover:bg-[#EFE3D1]"
            >
              Entrar como pastor/admin
            </a>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-[#EFE3D1] p-4 text-sm text-[#4B5563]">
          <p className="font-semibold text-[#1F2933]">Próximo paso técnico</p>
          <p className="mt-1">
            Más adelante conectaremos este formulario con Supabase Auth y roles
            para separar estudiantes, pastores y administradores.
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-[#4B5563]">
          ¿Nuevo en Raíces?{" "}
          <a href="/signup" className="font-semibold text-[#2F5D50]">
            Crea tu perfil
          </a>
        </p>
      </div>
    </main>
  );
}