export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F1E8] px-6 py-12 text-[#1F2933]">
      <div className="w-full max-w-xl rounded-[2rem] bg-white p-8 shadow-xl">
        <a href="/" className="text-sm font-semibold text-[#2F5D50]">
          ← Volver al inicio
        </a>

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9A7B4F]">
            Raíces
          </p>

          <h1 className="mt-3 text-3xl font-bold">Crea tu perfil</h1>

          <p className="mt-3 text-[#4B5563]">
            Tu perfil ayuda a la iglesia a acompañarte, asignarte cursos y
            guardar tu progreso de discipulado.
          </p>
        </div>

        <form className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-semibold">Nombre completo</label>
            <input
              type="text"
              placeholder="Tu nombre"
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2F5D50]"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Correo electrónico</label>
            <input
              type="email"
              placeholder="tu@email.com"
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2F5D50]"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Teléfono</label>
            <input
              type="tel"
              placeholder="(000) 000-0000"
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2F5D50]"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Contraseña</label>
            <input
              type="password"
              placeholder="Crea una contraseña"
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2F5D50]"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">
              ¿Cómo te identificas?
            </label>

            <select className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2F5D50]">
              <option>Nuevo visitante</option>
              <option>Miembro de la iglesia</option>
              <option>Nuevo creyente</option>
              <option>Interesado en bautismo</option>
              <option>Líder / voluntario</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold">Iglesia</label>

            <select className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2F5D50]">
              <option>The Main Place Español</option>
            </select>

            <p className="mt-2 text-sm text-[#4B5563]">
              Más adelante, cada iglesia tendrá su propia página y sus propios
              perfiles.
            </p>
          </div>

          <a
            href="/dashboard"
            className="block w-full rounded-full bg-[#2F5D50] px-6 py-3 text-center font-semibold text-white hover:bg-[#254A40]"
          >
            Crear perfil
          </a>
        </form>

        <div className="mt-6 rounded-2xl bg-[#F7F1E8] p-4 text-sm text-[#4B5563]">
          <p className="font-semibold text-[#1F2933]">Demo para el portfolio</p>
          <p className="mt-1">
            Por ahora este formulario lleva directo al dashboard. Luego lo
            conectaremos con Supabase Auth y una tabla de perfiles.
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-[#4B5563]">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="font-semibold text-[#2F5D50]">
            Inicia sesión
          </a>
        </p>
      </div>
    </main>
  );
}