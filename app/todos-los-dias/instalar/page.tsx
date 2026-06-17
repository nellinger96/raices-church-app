export default function InstalarAppPage() {
  return (
    <main className="min-h-screen bg-[#F5F8FC] px-4 py-10 text-[#071A33] sm:px-6">
      <section className="mx-auto max-w-3xl bg-white p-6 shadow-sm sm:p-10">
        <p className="text-sm font-black uppercase tracking-[0.35em] text-[#164B8F]">
          App de la iglesia
        </p>

        <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">
          Guarda la app en tu teléfono.
        </h1>

        <p className="mt-5 text-lg font-medium leading-8 text-[#52657D]">
          Abre la página de Iglesia de Todos los Días y agrégala a tu pantalla
          de inicio para tener acceso rápido a anuncios, ministerios, Hoy con
          Dios, Historias de Fe y donaciones.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="bg-[#F5F8FC] p-5">
            <h2 className="text-2xl font-black">iPhone</h2>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-base font-bold leading-7 text-[#52657D]">
              <li>Toca el botón de compartir.</li>
              <li>Elige “Agregar a pantalla de inicio”.</li>
              <li>Toca “Agregar”.</li>
            </ol>
          </div>

          <div className="bg-[#F5F8FC] p-5">
            <h2 className="text-2xl font-black">Android</h2>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-base font-bold leading-7 text-[#52657D]">
              <li>Toca el menú de tres puntos.</li>
              <li>Elige “Instalar app” o “Agregar a pantalla principal”.</li>
              <li>Confirma la instalación.</li>
            </ol>
          </div>
        </div>

        <a
          href="/todos-los-dias"
          className="mt-8 inline-flex rounded-full bg-[#071A33] px-8 py-4 text-lg font-black text-white hover:bg-[#164B8F]"
        >
          Abrir app
        </a>
      </section>
    </main>
  );
}
