import {
  missionVision,
  pilotAnnouncements,
  pilotEvents,
  todosLosDiasChurch,
  volunteerAreas,
} from "@/lib/churches/todos-los-dias";

const churchPhotos = {
  hero: "/todos-los-dias/worship.png",
  family: "/todos-los-dias/group.png",
  leadership: "/todos-los-dias/Leadership.png",
  women: "/todos-los-dias/Mujeres.png",
  pastor: "/todos-los-dias/pastor.png",
  pm: "/todos-los-dias/pm.png",
};

const heroSlides = [
  {
    image: "/todos-los-dias/worship.png",
    alt: "Adoración en Iglesia de Todos los Días",
  },
  {
    image: "/todos-los-dias/group.png",
    alt: "Comunidad de Iglesia de Todos los Días",
  },
  {
    image: "/todos-los-dias/pastor.png",
    alt: "Pastor Socrates y la iglesia",
  },
  {
    image: "/todos-los-dias/Mujeres.png",
    alt: "Ministerio de mujeres",
  },
];

export default function TodosLosDiasPage() {
  return (
    <main
      className="min-h-screen text-[#151515]"
      style={{
        backgroundImage: `linear-gradient(rgba(248, 241, 227, 0.96), rgba(248, 241, 227, 0.96)), url(${todosLosDiasChurch.logo})`,
        backgroundSize: "520px",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden bg-[#111111] text-white">
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <img
              key={slide.image}
              src={slide.image}
              alt={slide.alt}
              className="absolute inset-0 h-full w-full object-cover opacity-0"
              style={{
                animation: "heroFade 24s infinite",
                animationDelay: `${index * 6}s`,
              }}
            />
          ))}

          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(0,0,0,0.9),rgba(0,0,0,0.48),rgba(0,0,0,0.76))]" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(201,154,46,0.45),transparent_32%),radial-gradient(circle_at_85%_70%,rgba(0,166,184,0.28),transparent_34%)]" />

          <div className="absolute inset-0 opacity-20">
            <div className="h-full w-full bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:64px_64px]" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-[#F8F1E3] via-[#F8F1E3]/50 to-transparent" />
        </div>

        <style>
          {`
            @keyframes heroFade {
              0% {
                opacity: 0;
                transform: scale(1);
              }
              6% {
                opacity: 1;
              }
              25% {
                opacity: 1;
                transform: scale(1.04);
              }
              33% {
                opacity: 0;
                transform: scale(1.08);
              }
              100% {
                opacity: 0;
                transform: scale(1);
              }
            }
          `}
        </style>

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-6">
          <header className="flex items-center justify-between py-5">
            <a href="/" className="flex items-center gap-3">
              <img
                src={todosLosDiasChurch.logo}
                alt={todosLosDiasChurch.name}
                className="h-16 w-16 rounded-full bg-white object-contain p-1"
              />

              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[#F8D36A]">
                  Iglesia en Español
                </p>
                <h1 className="text-lg font-black">
                  {todosLosDiasChurch.shortName}
                </h1>
              </div>
            </a>

            <nav className="hidden items-center gap-7 text-sm font-bold md:flex">
              <a href="#anuncios" className="hover:text-[#F8D36A]">
                Anuncios
              </a>
              <a href="#eventos" className="hover:text-[#F8D36A]">
                Eventos
              </a>
              <a href="#conectar" className="hover:text-[#F8D36A]">
                Conectar
              </a>
              <a href="#donar" className="hover:text-[#F8D36A]">
                Donar
              </a>
            </nav>

            <a
              href="#conectar"
              className="rounded-full bg-[#C99A2E] px-5 py-3 text-sm font-black text-[#111111] shadow-lg hover:bg-[#E0B84A]"
            >
              Soy Nuevo
            </a>
          </header>

          <div className="flex flex-1 items-center pb-16 pt-10">
            <div className="max-w-5xl">
              <p className="text-sm font-black uppercase tracking-[0.35em] text-[#F8D36A]">
                Una iglesia para la comunidad hispana
              </p>

              <h2 className="mt-5 max-w-5xl text-6xl font-black leading-[0.95] tracking-tight md:text-8xl">
                Bienvenido a casa.
              </h2>

              <p className="mt-7 max-w-2xl text-xl font-medium leading-9 text-white/85 md:text-2xl">
                En Iglesia de Todos los Días queremos que tú y tu familia se
                sientan amados, recibidos y acompañados en su caminar con Dios.
              </p>
            </div>
          </div>

          {/* Big service banner */}
          <div className="relative mb-10 overflow-hidden bg-white text-[#111111] shadow-2xl">
            <div className="grid md:grid-cols-[1fr_1.2fr_0.8fr]">
              <div className="border-b border-[#E9D8BA] p-6 md:border-b-0 md:border-r">
                <p className="text-sm font-black uppercase tracking-[0.25em] text-[#C99A2E]">
                  Nos reunimos
                </p>

                <h3 className="mt-2 text-4xl font-black">Domingo</h3>

                <div className="mt-4 space-y-2">
                  <p className="text-lg font-black text-[#111111]">
                    English Service · 10:00 AM
                  </p>

                  <p className="text-lg font-black text-[#E31B23]">
                    Servicio en Español · 1:00 PM
                  </p>
                </div>
              </div>

              <div className="border-b border-[#E9D8BA] p-6 md:border-b-0 md:border-r">
                <p className="text-sm font-black uppercase tracking-[0.25em] text-[#00A6B8]">
                  Lugar
                </p>

                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-[#F8F1E3] p-2">
                      <img
                        src={todosLosDiasChurch.mainPlaceLogo}
                        alt={todosLosDiasChurch.partnershipName}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <div>
                      <h3 className="text-2xl font-black">The Main Place</h3>
                      <p className="text-sm font-bold text-[#4B5563]">
                        English Service · 10:00 AM
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-[#F8F1E3] p-2">
                      <img
                        src={todosLosDiasChurch.logo}
                        alt={todosLosDiasChurch.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <div>
                      <h3 className="text-2xl font-black">
                        Iglesia de Todos los Días
                      </h3>
                      <p className="text-sm font-bold text-[#E31B23]">
                        Servicio en Español · 1:00 PM
                      </p>
                    </div>
                  </div>

                  <p className="pt-2 text-base font-bold leading-7 text-[#4B5563]">
                    {todosLosDiasChurch.address}
                  </p>
                </div>
              </div>

              <a
                href="#conectar"
                className="flex items-center justify-center bg-[#E31B23] p-6 text-center text-2xl font-black text-white hover:bg-[#C9161D]"
              >
                Planear mi visita
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE QUICK ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-3 border-t border-white/20 bg-[#111111]/95 text-center text-xs font-black text-white shadow-2xl backdrop-blur md:hidden">
        <a href="#conectar" className="px-2 py-3">
          Soy Nuevo
        </a>
        <a href="#oracion" className="border-x border-white/10 px-2 py-3">
          Oración
        </a>
        <a href="#donar" className="px-2 py-3">
          Donar
        </a>
      </div>

      {/* ANNOUNCEMENTS FIRST */}
      <section id="anuncios" className="px-6 pb-14 pt-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.35em] text-[#C99A2E]">
                Lo más importante
              </p>
              <h2 className="mt-2 text-5xl font-black md:text-6xl">
                Anuncios
              </h2>
            </div>

            <p className="max-w-md text-lg font-medium leading-8 text-[#4B5563]">
              Aquí encontrarás lo que la iglesia quiere comunicar esta semana.
            </p>
          </div>

          <div className="divide-y-4 divide-[#F8F1E3] overflow-hidden bg-white shadow-sm">
            {pilotAnnouncements.map((announcement, index) => (
              <div
                key={announcement.title}
                className="grid gap-4 p-6 md:grid-cols-[160px_1fr] md:p-8"
              >
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.25em] text-[#E31B23]">
                    Anuncio {index + 1}
                  </p>
                </div>

                <div>
                  <h3 className="text-3xl font-black">
                    {announcement.title}
                  </h3>
                  <p className="mt-3 max-w-3xl text-lg font-medium leading-8 text-[#4B5563]">
                    {announcement.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EVENTS HIGH ON PAGE */}
      <section id="eventos" className="bg-[#111111] px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-[#F8D36A]">
              Esta semana
            </p>
            <h2 className="mt-2 text-5xl font-black md:text-6xl">
              Eventos de la iglesia
            </h2>
          </div>

          <div className="space-y-5">
            {pilotEvents.map((event) => (
              <div
                key={event.title}
                className="grid gap-5 border-l-8 border-[#C99A2E] bg-white/5 p-6 backdrop-blur md:grid-cols-[240px_1fr]"
              >
                <div>
                  <p className="text-2xl font-black text-[#F8D36A]">
                    {event.date}
                  </p>
                  <p className="mt-2 font-bold text-white/60">
                    {event.location}
                  </p>
                </div>

                <div>
                  <h3 className="text-4xl font-black">{event.title}</h3>
                  <p className="mt-3 max-w-3xl text-lg font-medium leading-8 text-white/70">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMUNITY IMAGE BAND */}
      <section className="relative min-h-[520px] overflow-hidden bg-[#111111] text-white">
        <img
          src={churchPhotos.pastor}
          alt="Pastor Socrates e Iglesia de Todos los Días"
          className="h-full min-h-[520px] w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/15" />

        <div className="absolute inset-0 flex items-center px-6">
          <div className="mx-auto w-full max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.35em] text-[#F8D36A]">
                Una familia en Cristo
              </p>

              <h2 className="mt-4 text-5xl font-black leading-tight md:text-7xl">
                Dios está formando algo hermoso.
              </h2>

              <p className="mt-6 max-w-2xl text-xl font-medium leading-9 text-white/80">
                Iglesia de Todos los Días existe para amar, servir, discipular y
                caminar con la comunidad hispana todos los días.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FIRST-TIME VISITOR */}
      <section className="relative overflow-hidden px-6 py-24">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_center,rgba(201,154,46,0.35),transparent_35%),linear-gradient(135deg,rgba(227,27,35,0.16),rgba(0,166,184,0.22))] lg:block" />

        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-[#C99A2E]">
              ¿Primera vez?
            </p>

            <h2 className="mt-4 text-5xl font-black leading-tight md:text-7xl">
              Ven con tu familia. Te esperamos.
            </h2>

            <p className="mt-6 max-w-2xl text-xl font-medium leading-9 text-[#4B5563]">
              No tienes que saber qué hacer ni a dónde ir. Queremos recibirte,
              conocerte y ayudarte a sentirte en casa.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a
                href="#conectar"
                className="rounded-full bg-[#E31B23] px-8 py-4 text-center text-lg font-black text-white hover:bg-[#C9161D]"
              >
                Avisar que voy
              </a>

              <a
                href="#oracion"
                className="rounded-full border-2 border-[#111111] px-8 py-4 text-center text-lg font-black text-[#111111] hover:bg-white"
              >
                Pedir oración
              </a>
            </div>
          </div>

          <div className="relative min-h-[420px] overflow-hidden bg-[#111111] shadow-xl">
            <img
              src={churchPhotos.family}
              alt="Comunidad de Iglesia de Todos los Días"
              className="h-full min-h-[420px] w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <p className="text-sm font-black uppercase tracking-[0.3em] text-[#F8D36A]">
                Comunidad
              </p>
              <h3 className="mt-3 text-4xl font-black">
                Una iglesia para toda la familia
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* PHOTOS */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <PhotoBlock title="Adoración" image={churchPhotos.hero} />
            <PhotoBlock title="Familia" image={churchPhotos.family} />
            <PhotoBlock title="Liderazgo" image={churchPhotos.leadership} />
            <PhotoBlock title="Mujeres" image={churchPhotos.women} />
          </div>
        </div>
      </section>

      {/* BIG ACTIONS */}
      <section id="conectar" className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-[#C99A2E]">
              ¿Qué necesitas hoy?
            </p>
            <h2 className="mt-3 text-5xl font-black md:text-6xl">
              Estamos aquí para ti.
            </h2>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <a
              href="#soy-nuevo-form"
              className="group min-h-64 bg-[#E31B23] p-8 text-white transition hover:scale-[1.01]"
            >
              <p className="text-sm font-black uppercase tracking-[0.3em] text-white/70">
                Nuevo visitante
              </p>
              <h3 className="mt-4 text-5xl font-black leading-none">
                Soy Nuevo
              </h3>
              <p className="mt-6 text-lg font-medium leading-8 text-white/80">
                Queremos conocerte y ayudarte a conectarte con la iglesia.
              </p>
            </a>

            <a
              href="#oracion"
              className="group min-h-64 bg-[#00A6B8] p-8 text-white transition hover:scale-[1.01]"
            >
              <p className="text-sm font-black uppercase tracking-[0.3em] text-white/70">
                Necesito ayuda
              </p>
              <h3 className="mt-4 text-5xl font-black leading-none">
                Oración
              </h3>
              <p className="mt-6 text-lg font-medium leading-8 text-white/80">
                Comparte tu petición. Queremos orar contigo.
              </p>
            </a>

            <a
              href="#servir"
              className="group min-h-64 bg-[#C99A2E] p-8 text-[#111111] transition hover:scale-[1.01]"
            >
              <p className="text-sm font-black uppercase tracking-[0.3em] text-black/60">
                Quiero apoyar
              </p>
              <h3 className="mt-4 text-5xl font-black leading-none">
                Servir
              </h3>
              <p className="mt-6 text-lg font-bold leading-8 text-black/70">
                Usa tus dones para bendecir a otros.
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* FORMS */}
      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-3">
          <SimpleForm
            id="soy-nuevo-form"
            title="Soy Nuevo"
            description="Déjanos tu información y alguien de la iglesia podrá saludarte."
            button="Enviar"
            color="red"
          />

          <SimpleForm
            id="oracion"
            title="Pedir Oración"
            description="Escribe tu petición. Queremos orar por ti y tu familia."
            button="Enviar petición"
            color="blue"
          />

          <VolunteerForm />
        </div>
      </section>

      {/* MISSION / VISION */}
      <section id="vision" className="bg-[#111111] px-6 py-24 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-[#F8D36A]">
            Nuestra identidad
          </p>
          <h2 className="mt-3 max-w-4xl text-5xl font-black leading-tight md:text-7xl">
            Una iglesia que vive la Palabra todos los días.
          </h2>

          <div className="mt-12 space-y-8">
            {missionVision.map((item) => (
              <div
                key={item.label}
                className="border-t border-white/20 pt-8 md:grid md:grid-cols-[260px_1fr] md:gap-10"
              >
                <p className="text-sm font-black uppercase tracking-[0.3em] text-[#00A6B8]">
                  {item.label}
                </p>

                <div>
                  <h3 className="text-4xl font-black text-[#F8D36A]">
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-4xl text-xl font-medium leading-9 text-white/72">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIDEOS */}
      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-[#C99A2E]">
              Mensajes
            </p>
            <h2 className="mt-3 text-5xl font-black md:text-6xl">
              Mira enseñanzas en YouTube.
            </h2>
            <p className="mt-5 text-xl font-medium leading-9 text-[#4B5563]">
              Visita el canal de Pastor Socrates para ver mensajes y contenido
              para fortalecer tu fe.
            </p>

            <a
              href={todosLosDiasChurch.youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex rounded-full bg-[#E31B23] px-8 py-4 text-lg font-black text-white hover:bg-[#C9161D]"
            >
              Abrir YouTube
            </a>
          </div>

          <div className="relative min-h-[420px] overflow-hidden bg-[#111111] p-8 text-white">
            <img
              src={churchPhotos.pm}
              alt="Pastor Socrates mensajes"
              className="absolute inset-0 h-full w-full object-cover opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/30" />

            <div className="relative z-10">
              <p className="text-sm font-black uppercase tracking-[0.35em] text-[#F8D36A]">
                Canal oficial
              </p>
              <h3 className="mt-4 text-5xl font-black">Pastor Socrates</h3>
              <p className="mt-5 max-w-xl text-lg font-medium leading-8 text-white/80">
                Cuando tengamos videos específicos, aquí se mostrarán como
                mensajes destacados.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DONATE */}
      <section id="donar" className="bg-[#E31B23] px-6 py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-white/70">
              Dar / Donar
            </p>
            <h2 className="mt-3 text-5xl font-black leading-tight md:text-7xl">
              Apoya la misión.
            </h2>
            <p className="mt-6 max-w-2xl text-xl font-medium leading-9 text-white/85">
              Tus ofrendas ayudan a la iglesia a servir, discipular y alcanzar
              familias con el amor de Cristo.
            </p>
          </div>

          <div className="bg-white p-8 text-[#111111]">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-[#00A6B8]">
              Zelle
            </p>
            <h3 className="mt-3 text-4xl font-black">Dar por Zelle</h3>
            <p className="mt-4 text-lg font-medium leading-8 text-[#4B5563]">
              Aquí irá el correo, teléfono o código QR oficial de la iglesia.
            </p>

            <div className="mt-6 flex h-48 items-center justify-center border-4 border-dashed border-[#C99A2E] text-center">
              <p className="text-2xl font-black text-[#C99A2E]">
                QR / Zelle
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* QR */}
      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div className="flex h-80 items-center justify-center bg-[#111111] text-white">
            <div className="text-center">
              <p className="text-7xl font-black">QR</p>
              <p className="mt-2 text-lg font-bold text-white/70">
                Escanea aquí
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-[#C99A2E]">
              Acceso rápido
            </p>
            <h2 className="mt-3 text-5xl font-black leading-tight md:text-6xl">
              Guarda la iglesia en tu teléfono.
            </h2>
            <p className="mt-5 max-w-2xl text-xl font-medium leading-9 text-[#4B5563]">
              Los visitantes podrán escanear un QR para abrir esta página y
              tener acceso rápido a anuncios, eventos, oración, voluntariado y
              donaciones.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#111111] px-6 py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <img
              src={todosLosDiasChurch.logo}
              alt={todosLosDiasChurch.name}
              className="h-14 w-14 rounded-full bg-white object-contain p-1"
            />
            <div>
              <p className="font-black">{todosLosDiasChurch.name}</p>
              <p className="text-sm text-white/60">
                Una iglesia para la comunidad hispana
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <p className="text-sm text-white/60">En colaboración con</p>
            <img
              src={todosLosDiasChurch.mainPlaceLogo}
              alt={todosLosDiasChurch.partnershipName}
              className="max-h-10 max-w-32 object-contain"
            />
          </div>
        </div>
      </footer>
    </main>
  );
}

function PhotoBlock({
  title,
  image,
}: {
  title: string;
  image: string;
}) {
  return (
    <div className="relative flex aspect-[4/3] items-end overflow-hidden bg-[#111111] shadow-sm">
      <img src={image} alt={title} className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="inline-flex bg-white px-4 py-2 text-sm font-black text-[#111111]">
          {title}
        </p>
      </div>
    </div>
  );
}

function SimpleForm({
  id,
  title,
  description,
  button,
  color,
}: {
  id: string;
  title: string;
  description: string;
  button: string;
  color: "red" | "blue";
}) {
  const buttonClass =
    color === "red"
      ? "bg-[#E31B23] hover:bg-[#C9161D]"
      : "bg-[#00A6B8] hover:bg-[#048C9B]";

  return (
    <form id={id} className="bg-white p-7 shadow-sm">
      <h3 className="text-4xl font-black">{title}</h3>
      <p className="mt-3 text-lg font-medium leading-8 text-[#4B5563]">
        {description}
      </p>

      <div className="mt-6 space-y-4">
        <input
          placeholder="Nombre completo"
          className="w-full border-b-2 border-[#D8C6A8] bg-transparent px-1 py-4 text-lg font-medium outline-none focus:border-[#C99A2E]"
        />
        <input
          placeholder="Teléfono"
          className="w-full border-b-2 border-[#D8C6A8] bg-transparent px-1 py-4 text-lg font-medium outline-none focus:border-[#C99A2E]"
        />
        <textarea
          placeholder="Mensaje"
          className="min-h-28 w-full border-b-2 border-[#D8C6A8] bg-transparent px-1 py-4 text-lg font-medium outline-none focus:border-[#C99A2E]"
        />

        <button
          type="button"
          className={`w-full px-6 py-4 text-lg font-black text-white ${buttonClass}`}
        >
          {button}
        </button>
      </div>
    </form>
  );
}

function VolunteerForm() {
  return (
    <form id="servir" className="bg-white p-7 shadow-sm">
      <h3 className="text-4xl font-black">Quiero Servir</h3>
      <p className="mt-3 text-lg font-medium leading-8 text-[#4B5563]">
        Déjanos saber en qué área te gustaría apoyar.
      </p>

      <div className="mt-6 space-y-4">
        <input
          placeholder="Nombre completo"
          className="w-full border-b-2 border-[#D8C6A8] bg-transparent px-1 py-4 text-lg font-medium outline-none focus:border-[#C99A2E]"
        />

        <input
          placeholder="Teléfono o correo"
          className="w-full border-b-2 border-[#D8C6A8] bg-transparent px-1 py-4 text-lg font-medium outline-none focus:border-[#C99A2E]"
        />

        <select className="w-full border-b-2 border-[#D8C6A8] bg-transparent px-1 py-4 text-lg font-medium outline-none focus:border-[#C99A2E]">
          <option>Área donde deseas servir</option>
          {volunteerAreas.map((area) => (
            <option key={area}>{area}</option>
          ))}
        </select>

        <button
          type="button"
          className="w-full bg-[#C99A2E] px-6 py-4 text-lg font-black text-[#111111] hover:bg-[#E0B84A]"
        >
          Enviar
        </button>
      </div>
    </form>
  );
}