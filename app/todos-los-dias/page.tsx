import {
  missionVision,
  todosLosDiasChurch,
  volunteerAreas,
} from "@/lib/churches/todos-los-dias";

const churchAddress = "1310 E Lincoln Ave, Orange, CA 92865";

const googleMapsUrl =
  "https://www.google.com/maps/search/?api=1&query=1310%20E%20Lincoln%20Ave%2C%20Orange%2C%20CA%2092865";

const appleMapsUrl =
  "https://maps.apple.com/?q=1310%20E%20Lincoln%20Ave%2C%20Orange%2C%20CA%2092865";

const churchPhotos = {
  hero: "/todos-los-dias/worship.png",
  family: "/todos-los-dias/group.png",
  leadership: "/todos-los-dias/Leadership.png",
  women: "/todos-los-dias/Mujeres.png",
  pastor: "/todos-los-dias/pastor.png",
  pm: "/todos-los-dias/pm.png",
  pastorWife: "/todos-los-dias/pastor-wife.png",
  pastorFamily: "/todos-los-dias/pastor-family.png",
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

const upcomingAnnouncements = [
  {
    title: "Free Worship",
    category: "Adoración / Prayer / Freedom",
    date: "Every Wednesday",
    time: "6:30 PM",
    location: "Main Place Christian Fellowship",
    description:
      "A night of worship, prayer, and freedom. Everyone is welcome to come as they are.",
    flyer: "/todos-los-dias/free-worship.png",
    accent: "red",
  },
  {
    title: "Día en el Parque",
    category: "Familia / Comunidad",
    date: "Sábado, 1 de agosto",
    time: "Todo el día",
    location: "Irvine Regional Park · 1 Irvine Park Rd, Orange, CA 92869",
    description:
      "Comida, juegos, diversión, devocional, alabanza y compañerismo para toda la familia.",
    flyer: "/todos-los-dias/dia-parque.png",
    accent: "green",
  },
  {
    title: "VBS: Illumination Station",
    category: "Niños / Kids Ministry",
    date: "July 24–26",
    time: "Fri/Sat 9:00 AM–1:30 PM · Sunday 9:00 AM–12:00 PM",
    location: "Main Place Christian Fellowship",
    description:
      "Un evento para niños de 4 a 11 años con fe, juegos, música y aventuras bíblicas.",
    flyer: "/todos-los-dias/vbs.png",
    accent: "purple",
  },
  {
    title: "Reunión de Hermanas",
    category: "Mujeres",
    date: "Viernes 19 de junio",
    time: "5:30 PM",
    location: "Iglesia de Todos los Días",
    description:
      "Una noche para conectar, crear y disfrutar entre hermanas con aperitivos, juegos y manualidades.",
    flyer: "/todos-los-dias/hermanas.png",
    accent: "pink",
  },
];

export default function TodosLosDiasPage() {
  return (
    <main
      className="min-h-screen text-[#071A33]"
      style={{
        backgroundImage: `linear-gradient(rgba(245, 248, 252, 0.97), rgba(245, 248, 252, 0.97)), url(${todosLosDiasChurch.logo})`,
        backgroundSize: "520px",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden bg-[#071A33] text-white">
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

          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(7,26,51,0.94),rgba(7,26,51,0.58),rgba(7,26,51,0.92))]" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(22,75,143,0.55),transparent_34%),radial-gradient(circle_at_88%_70%,rgba(177,24,45,0.35),transparent_32%)]" />

          <div className="absolute inset-0 opacity-20">
            <div className="h-full w-full bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:64px_64px]" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#F5F8FC] via-[#F5F8FC]/40 to-transparent" />
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
                className="h-16 w-16 rounded-full bg-white object-contain p-1 shadow-lg"
              />

              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[#BBD7FF]">
                  Iglesia en Español
                </p>
                <h1 className="text-lg font-black">
                  {todosLosDiasChurch.shortName}
                </h1>
              </div>
            </a>

            <nav className="hidden items-center gap-7 text-sm font-bold md:flex">
              <a href="#anuncios" className="hover:text-[#BBD7FF]">
                Anuncios
              </a>
              <a href="#pastor" className="hover:text-[#BBD7FF]">
                Pastor
              </a>
              <a href="#conectar" className="hover:text-[#BBD7FF]">
                Conectar
              </a>
              <a href="#donar" className="hover:text-[#BBD7FF]">
                Donar
              </a>
            </nav>

            <a
              href="#conectar"
              className="rounded-full bg-white px-5 py-3 text-sm font-black text-[#071A33] shadow-lg hover:bg-[#BBD7FF]"
            >
              Soy Nuevo
            </a>
          </header>

          <div className="flex flex-1 items-center pb-16 pt-10">
            <div className="max-w-5xl">
              <p className="text-sm font-black uppercase tracking-[0.35em] text-[#BBD7FF]">
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

          {/* SERVICE BANNER */}
          <div className="relative mb-10 overflow-hidden border border-white/25 bg-white/58 text-[#071A33] shadow-2xl backdrop-blur-md">
            <div className="grid md:grid-cols-[1fr_1.2fr_0.8fr]">
              <div className="border-b border-white/35 p-6 md:border-b-0 md:border-r">
                <p className="text-sm font-black uppercase tracking-[0.25em] text-[#164B8F]">
                  Nos reunimos
                </p>

                <h3 className="mt-2 text-4xl font-black">Domingo</h3>

                <div className="mt-4 space-y-2">
                  <p className="text-lg font-black text-[#071A33]">
                    English Service · 10:00 AM
                  </p>

                  <p className="text-lg font-black text-[#B1182D]">
                    Servicio en Español · 1:00 PM
                  </p>
                </div>
              </div>

              <div className="border-b border-white/35 p-6 md:border-b-0 md:border-r">
                <p className="text-sm font-black uppercase tracking-[0.25em] text-[#164B8F]">
                  Lugar
                </p>

                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-white/60 p-2 shadow-sm backdrop-blur-sm">
                      <img
                        src={todosLosDiasChurch.mainPlaceLogo}
                        alt={todosLosDiasChurch.partnershipName}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <div>
                      <h3 className="text-2xl font-black">The Main Place</h3>
                      <p className="text-sm font-bold text-[#52657D]">
                        English Service · 10:00 AM
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-white/60 p-2 shadow-sm backdrop-blur-sm">
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
                      <p className="text-sm font-bold text-[#B1182D]">
                        Servicio en Español · 1:00 PM
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-base font-black leading-7 text-[#071A33] underline decoration-[#164B8F] decoration-2 underline-offset-4 hover:text-[#B1182D]"
                    >
                      {churchAddress}
                    </a>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-[#071A33] px-4 py-2 text-sm font-black text-white hover:bg-[#164B8F]"
                      >
                        Google Maps
                      </a>

                      <a
                        href={appleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-white/65 px-4 py-2 text-sm font-black text-[#071A33] shadow-sm backdrop-blur-sm hover:bg-[#BBD7FF]"
                      >
                        Apple Maps
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <a
                href="#conectar"
                className="flex items-center justify-center bg-[#B1182D]/88 p-6 text-center text-2xl font-black text-white backdrop-blur-sm hover:bg-[#8F1324]/95"
              >
                Planear mi visita
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE QUICK ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-3 border-t border-white/20 bg-[#071A33]/95 text-center text-xs font-black text-white shadow-2xl backdrop-blur md:hidden">
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

      {/* ANNOUNCEMENTS */}
      <section id="anuncios" className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.35em] text-[#164B8F]">
                Lo más importante
              </p>
              <h2 className="mt-2 text-5xl font-black leading-tight md:text-7xl">
                Anuncios y eventos
              </h2>
            </div>

            <p className="max-w-lg text-lg font-medium leading-8 text-[#52657D]">
              Lee la información principal aquí y toca cada volante para verlo
              completo.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {upcomingAnnouncements.map((announcement) => (
              <AnnouncementCard
                key={announcement.title}
                announcement={announcement}
              />
            ))}
          </div>
        </div>
      </section>

      {/* COMMUNITY IMAGE BAND */}
      <section className="relative min-h-[520px] overflow-hidden bg-[#071A33] text-white">
        <img
          src={churchPhotos.pastor}
          alt="Pastor Socrates e Iglesia de Todos los Días"
          className="h-full min-h-[520px] w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#071A33]/95 via-[#071A33]/65 to-[#071A33]/20" />

        <div className="absolute inset-0 flex items-center px-6">
          <div className="mx-auto w-full max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.35em] text-[#BBD7FF]">
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
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_center,rgba(22,75,143,0.20),transparent_35%),linear-gradient(135deg,rgba(7,26,51,0.08),rgba(187,215,255,0.45))] lg:block" />

        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-[#164B8F]">
              ¿Primera vez?
            </p>

            <h2 className="mt-4 text-5xl font-black leading-tight md:text-7xl">
              Ven con tu familia. Te esperamos.
            </h2>

            <p className="mt-6 max-w-2xl text-xl font-medium leading-9 text-[#52657D]">
              No tienes que saber qué hacer ni a dónde ir. Queremos recibirte,
              conocerte y ayudarte a sentirte en casa.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a
                href="#conectar"
                className="rounded-full bg-[#071A33] px-8 py-4 text-center text-lg font-black text-white hover:bg-[#164B8F]"
              >
                Avisar que voy
              </a>

              <a
                href="#oracion"
                className="rounded-full border-2 border-[#071A33] px-8 py-4 text-center text-lg font-black text-[#071A33] hover:bg-white"
              >
                Pedir oración
              </a>
            </div>
          </div>

          <div className="relative min-h-[420px] overflow-hidden bg-[#071A33] shadow-xl">
            <img
              src={churchPhotos.family}
              alt="Comunidad de Iglesia de Todos los Días"
              className="h-full min-h-[420px] w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#071A33]/85 via-[#071A33]/25 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <p className="text-sm font-black uppercase tracking-[0.3em] text-[#BBD7FF]">
                Comunidad
              </p>
              <h3 className="mt-3 text-4xl font-black">
                Una iglesia para toda la familia
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* PASTOR BIO */}
      <section id="pastor" className="bg-white px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="relative min-h-[460px] overflow-hidden bg-[#071A33] shadow-xl sm:translate-y-8">
              <img
                src={churchPhotos.pastorWife}
                alt="Pastor Socrates y su esposa"
                className="h-full min-h-[460px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071A33]/65 to-transparent" />
            </div>

            <div className="space-y-4">
              <div className="relative min-h-[270px] overflow-hidden bg-[#071A33] shadow-xl">
                <img
                  src={churchPhotos.pastorFamily}
                  alt="Familia del Pastor Socrates"
                  className="h-full min-h-[270px] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071A33]/60 to-transparent" />
              </div>

              <div className="bg-[#071A33] p-7 text-white shadow-xl">
                <p className="text-sm font-black uppercase tracking-[0.3em] text-[#BBD7FF]">
                  Liderazgo
                </p>
                <h3 className="mt-3 text-3xl font-black">
                  Sirviendo a Dios y a la comunidad.
                </h3>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-[#164B8F]">
              Conoce al Pastor
            </p>

            <h2 className="mt-4 text-5xl font-black leading-tight md:text-7xl">
              Pastor Socrates Lopez
            </h2>

            <p className="mt-6 text-xl font-medium leading-9 text-[#52657D]">
              Pastor Socrates sirve a la comunidad con un corazón pastoral,
              familiar y cercano. Su deseo es que cada persona que llegue a
              Iglesia de Todos los Días pueda sentirse bienvenida, amada y
              acompañada en su caminar con Dios.
            </p>

            <p className="mt-5 text-xl font-medium leading-9 text-[#52657D]">
              Junto a su familia, busca levantar una iglesia centrada en la
              Palabra de Dios, la oración, la comunidad y el servicio a las
              familias hispanas.
            </p>

            <div className="mt-9 grid gap-4 sm:grid-cols-3">
              <div className="border-t-4 border-[#164B8F] bg-[#F5F8FC] p-5">
                <p className="text-3xl font-black">Fe</p>
                <p className="mt-2 text-sm font-bold text-[#52657D]">
                  Guiados por la Palabra de Dios
                </p>
              </div>

              <div className="border-t-4 border-[#B1182D] bg-[#F5F8FC] p-5">
                <p className="text-3xl font-black">Familia</p>
                <p className="mt-2 text-sm font-bold text-[#52657D]">
                  Una iglesia para todas las generaciones
                </p>
              </div>

              <div className="border-t-4 border-[#164B8F] bg-[#F5F8FC] p-5">
                <p className="text-3xl font-black">Servicio</p>
                <p className="mt-2 text-sm font-bold text-[#52657D]">
                  Amando y sirviendo a la comunidad
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PHOTOS */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-[#164B8F]">
              Comunidad
            </p>
            <h2 className="mt-2 text-5xl font-black md:text-6xl">
              Vida de la iglesia
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <PhotoBlock title="Adoración" image={churchPhotos.hero} />
            <PhotoBlock title="Familia" image={churchPhotos.family} />
            <PhotoBlock title="Liderazgo" image={churchPhotos.leadership} />
            <PhotoBlock title="Mujeres" image={churchPhotos.women} />
          </div>
        </div>
      </section>

      {/* BIG ACTIONS */}
      <section id="conectar" className="bg-[#071A33] px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-[#BBD7FF]">
              ¿Qué necesitas hoy?
            </p>
            <h2 className="mt-3 text-5xl font-black md:text-6xl">
              Estamos aquí para ti.
            </h2>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <a
              href="#soy-nuevo-form"
              className="group min-h-64 bg-white p-8 text-[#071A33] transition hover:scale-[1.01]"
            >
              <p className="text-sm font-black uppercase tracking-[0.3em] text-[#164B8F]">
                Nuevo visitante
              </p>
              <h3 className="mt-4 text-5xl font-black leading-none">
                Soy Nuevo
              </h3>
              <p className="mt-6 text-lg font-medium leading-8 text-[#52657D]">
                Queremos conocerte y ayudarte a conectarte con la iglesia.
              </p>
            </a>

            <a
              href="#oracion"
              className="group min-h-64 bg-[#164B8F] p-8 text-white transition hover:scale-[1.01]"
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
              className="group min-h-64 bg-[#B1182D] p-8 text-white transition hover:scale-[1.01]"
            >
              <p className="text-sm font-black uppercase tracking-[0.3em] text-white/70">
                Quiero apoyar
              </p>
              <h3 className="mt-4 text-5xl font-black leading-none">
                Servir
              </h3>
              <p className="mt-6 text-lg font-medium leading-8 text-white/80">
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
            color="navy"
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
      <section id="vision" className="bg-white px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-[#164B8F]">
            Nuestra identidad
          </p>
          <h2 className="mt-3 max-w-4xl text-5xl font-black leading-tight md:text-7xl">
            Una iglesia que vive la Palabra todos los días.
          </h2>

          <div className="mt-12 space-y-8">
            {missionVision.map((item) => (
              <div
                key={item.label}
                className="border-t border-[#D9E5F5] pt-8 md:grid md:grid-cols-[260px_1fr] md:gap-10"
              >
                <p className="text-sm font-black uppercase tracking-[0.3em] text-[#164B8F]">
                  {item.label}
                </p>

                <div>
                  <h3 className="text-4xl font-black text-[#071A33]">
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-4xl text-xl font-medium leading-9 text-[#52657D]">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIDEOS */}
      <section className="bg-[#F5F8FC] px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-[#164B8F]">
              Mensajes
            </p>
            <h2 className="mt-3 text-5xl font-black md:text-6xl">
              Mira enseñanzas en YouTube.
            </h2>
            <p className="mt-5 text-xl font-medium leading-9 text-[#52657D]">
              Visita el canal de Pastor Socrates para ver mensajes y contenido
              para fortalecer tu fe.
            </p>

            <a
              href={todosLosDiasChurch.youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex rounded-full bg-[#071A33] px-8 py-4 text-lg font-black text-white hover:bg-[#164B8F]"
            >
              Abrir YouTube
            </a>
          </div>

          <div className="relative min-h-[420px] overflow-hidden bg-[#071A33] p-8 text-white">
            <img
              src={churchPhotos.pm}
              alt="Pastor Socrates mensajes"
              className="absolute inset-0 h-full w-full object-cover opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071A33]/90 to-[#071A33]/35" />

            <div className="relative z-10">
              <p className="text-sm font-black uppercase tracking-[0.35em] text-[#BBD7FF]">
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
      <section id="donar" className="bg-[#071A33] px-6 py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-[#BBD7FF]">
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

          <div className="bg-white p-8 text-[#071A33]">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-[#164B8F]">
              Zelle
            </p>
            <h3 className="mt-3 text-4xl font-black">Dar por Zelle</h3>
            <p className="mt-4 text-lg font-medium leading-8 text-[#52657D]">
              Aquí irá el correo, teléfono o código QR oficial de la iglesia.
            </p>

            <div className="mt-6 flex h-48 items-center justify-center border-4 border-dashed border-[#164B8F] text-center">
              <p className="text-2xl font-black text-[#164B8F]">
                QR / Zelle
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* QR */}
      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div className="flex h-80 items-center justify-center bg-[#071A33] text-white">
            <div className="text-center">
              <p className="text-7xl font-black">QR</p>
              <p className="mt-2 text-lg font-bold text-white/70">
                Escanea aquí
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-[#164B8F]">
              Acceso rápido
            </p>
            <h2 className="mt-3 text-5xl font-black leading-tight md:text-6xl">
              Guarda la iglesia en tu teléfono.
            </h2>
            <p className="mt-5 max-w-2xl text-xl font-medium leading-9 text-[#52657D]">
              Los visitantes podrán escanear un QR para abrir esta página y
              tener acceso rápido a anuncios, eventos, oración, voluntariado y
              donaciones.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#071A33] px-6 py-10 text-white">
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

function AnnouncementCard({
  announcement,
}: {
  announcement: {
    title: string;
    category: string;
    date: string;
    time: string;
    location: string;
    description: string;
    flyer: string;
    accent: string;
  };
}) {
  const accentClass =
    announcement.accent === "red"
      ? "border-[#B1182D] text-[#B1182D]"
      : announcement.accent === "green"
        ? "border-[#16834A] text-[#16834A]"
        : announcement.accent === "purple"
          ? "border-[#6B35B8] text-[#6B35B8]"
          : "border-[#C0268A] text-[#C0268A]";

  return (
    <article className="grid overflow-hidden bg-white shadow-xl md:grid-cols-[0.95fr_1.05fr]">
      <a
        href={announcement.flyer}
        target="_blank"
        rel="noreferrer"
        className="group relative flex min-h-[520px] items-center justify-center overflow-hidden bg-white"
      >
        <img
          src={announcement.flyer}
          alt={`${announcement.title} flyer`}
          className="h-full max-h-[680px] w-full object-contain transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#071A33]/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />

        <div className="absolute bottom-4 left-4 right-4 hidden bg-white px-4 py-3 text-center text-sm font-black text-[#071A33] shadow-lg group-hover:block">
          Ver volante completo
        </div>
      </a>

      <div className="flex flex-col justify-between p-7">
        <div>
          <p
            className={`inline-flex border-l-4 pl-3 text-sm font-black uppercase tracking-[0.25em] ${accentClass}`}
          >
            {announcement.category}
          </p>

          <h3 className="mt-5 text-4xl font-black leading-tight text-[#071A33]">
            {announcement.title}
          </h3>

          <div className="mt-5 space-y-3 text-lg font-bold text-[#52657D]">
            <p>
              <span className="text-[#071A33]">Fecha:</span>{" "}
              {announcement.date}
            </p>
            <p>
              <span className="text-[#071A33]">Hora:</span>{" "}
              {announcement.time}
            </p>
            <p>
              <span className="text-[#071A33]">Lugar:</span>{" "}
              {announcement.location}
            </p>
          </div>

          <p className="mt-5 text-lg font-medium leading-8 text-[#52657D]">
            {announcement.description}
          </p>
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <a
            href={announcement.flyer}
            target="_blank"
            rel="noreferrer"
            className="bg-[#071A33] px-5 py-3 text-sm font-black text-white hover:bg-[#164B8F]"
          >
            Ver volante
          </a>

          <a
            href="#conectar"
            className="bg-[#EEF5FF] px-5 py-3 text-sm font-black text-[#071A33] hover:bg-[#BBD7FF]"
          >
            Preguntar más
          </a>
        </div>
      </div>
    </article>
  );
}

function PhotoBlock({ title, image }: { title: string; image: string }) {
  return (
    <div className="relative flex aspect-[4/3] items-end overflow-hidden bg-[#071A33] shadow-sm">
      <img src={image} alt={title} className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#071A33]/75 via-[#071A33]/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="inline-flex bg-white px-4 py-2 text-sm font-black text-[#071A33]">
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
  color: "navy" | "blue";
}) {
  const buttonClass =
    color === "navy"
      ? "bg-[#071A33] hover:bg-[#164B8F]"
      : "bg-[#164B8F] hover:bg-[#0E356B]";

  return (
    <form id={id} className="bg-white p-7 shadow-sm">
      <h3 className="text-4xl font-black text-[#071A33]">{title}</h3>
      <p className="mt-3 text-lg font-medium leading-8 text-[#52657D]">
        {description}
      </p>

      <div className="mt-6 space-y-4">
        <input
          placeholder="Nombre completo"
          className="w-full border-b-2 border-[#D9E5F5] bg-transparent px-1 py-4 text-lg font-medium outline-none focus:border-[#164B8F]"
        />

        <input
          placeholder="Teléfono"
          className="w-full border-b-2 border-[#D9E5F5] bg-transparent px-1 py-4 text-lg font-medium outline-none focus:border-[#164B8F]"
        />

        <textarea
          placeholder="Mensaje"
          className="min-h-28 w-full border-b-2 border-[#D9E5F5] bg-transparent px-1 py-4 text-lg font-medium outline-none focus:border-[#164B8F]"
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
      <h3 className="text-4xl font-black text-[#071A33]">Quiero Servir</h3>
      <p className="mt-3 text-lg font-medium leading-8 text-[#52657D]">
        Déjanos saber en qué área te gustaría apoyar.
      </p>

      <div className="mt-6 space-y-4">
        <input
          placeholder="Nombre completo"
          className="w-full border-b-2 border-[#D9E5F5] bg-transparent px-1 py-4 text-lg font-medium outline-none focus:border-[#164B8F]"
        />

        <input
          placeholder="Teléfono o correo"
          className="w-full border-b-2 border-[#D9E5F5] bg-transparent px-1 py-4 text-lg font-medium outline-none focus:border-[#164B8F]"
        />

        <select className="w-full border-b-2 border-[#D9E5F5] bg-transparent px-1 py-4 text-lg font-medium outline-none focus:border-[#164B8F]">
          <option>Área donde deseas servir</option>
          {volunteerAreas.map((area) => (
            <option key={area}>{area}</option>
          ))}
        </select>

        <button
          type="button"
          className="w-full bg-[#B1182D] px-6 py-4 text-lg font-black text-white hover:bg-[#8F1324]"
        >
          Enviar
        </button>
      </div>
    </form>
  );
}
