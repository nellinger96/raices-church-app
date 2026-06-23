"use client";

import { type FormEvent, useEffect, useState } from "react";
import {
  missionVision,
  todosLosDiasChurch,
  volunteerAreas,
} from "@/lib/churches/todos-los-dias";
import { createClient } from "@/lib/supabase/client";

type ActionFormType = "visitor" | "prayer" | "volunteer";

type PublicAnnouncement = {
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  description: string;
  flyer: string;
  accent: string;
};

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


const youtubeShorts = [
  {
    id: "u5AlOcQkwhM",
    title: "Mensaje corto del Pastor",
  },
  {
    id: "eybbrECZRAc",
    title: "Palabra para tu semana",
  },
  {
    id: "YfwhJH_GklA",
    title: "Reflexión de fe",
  },
  {
    id: "uCKZ7kUhpUU",
    title: "Devocional corto",
  },
  {
    id: "zOvqSijdNoc",
    title: "Ánimo espiritual",
  },
];

const ministryLinks = [
  { name: "Evangelismo", href: "/todos-los-dias/ministerios/evangelismo" },
  {
    name: "Estudio Bíblico",
    href: "/todos-los-dias/ministerios/estudio-biblico",
  },
  { name: "Mujeres", href: "/todos-los-dias/ministerios/mujeres" },
  {
    name: "Escuela Dominical",
    href: "/todos-los-dias/ministerios/escuela-dominical",
  },
  { name: "Oración", href: "/todos-los-dias/ministerios/oracion" },
  { name: "Jóvenes", href: "/todos-los-dias/ministerios/jovenes" },
  { name: "Alabanza", href: "/todos-los-dias/ministerios/alabanza" },
];

const fallbackAnnouncements: PublicAnnouncement[] = [
  {
    title: "Adoración Libre",
    category: "Adoración / Oración / Libertad",
    date: "Cada miércoles",
    time: "6:30 PM",
    location: "Main Place Christian Fellowship",
    description:
      "Una noche de adoración, oración y libertad. Todos son bienvenidos tal como son.",
    flyer: "/todos-los-dias/free-worship.png",
    accent: "red",
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
  {
    title: "Escuelita Bíblica de Verano: Illumination Station",
    category: "Niños / Ministerio Infantil",
    date: "24–26 de julio",
    time: "Viernes/Sábado 9:00 AM–1:30 PM · Domingo 9:00 AM–12:00 PM",
    location: "Main Place Christian Fellowship",
    description:
      "Un evento para niños de 4 a 11 años con fe, juegos, música y aventuras bíblicas.",
    flyer: "/todos-los-dias/vbs.png",
    accent: "purple",
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
];

function getAnnouncementAccent(category?: string | null, title?: string | null) {
  const text = `${category ?? ""} ${title ?? ""}`.toLowerCase();

  if (
    text.includes("oración") ||
    text.includes("adoración") ||
    text.includes("worship")
  ) {
    return "red";
  }

  if (
    text.includes("niños") ||
    text.includes("escuelita") ||
    text.includes("bíblica") ||
    text.includes("vbs")
  ) {
    return "purple";
  }

  if (
    text.includes("parque") ||
    text.includes("familia") ||
    text.includes("comunidad")
  ) {
    return "green";
  }

  return "pink";
}

async function loadPublishedAnnouncements() {
  const supabase = createClient();
  const churchId = await getTodosLosDiasChurchId();

  const { data, error } = await supabase
    .from("announcements")
    .select(
      "title, category, description, date_text, time_text, location, flyer_url, sort_order, created_at",
    )
    .eq("church_id", churchId)
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    throw error;
  }

  return (data ?? []).map((announcement) => ({
    title: announcement.title ?? "Anuncio",
    category: announcement.category ?? "Anuncio",
    date: announcement.date_text ?? "",
    time: announcement.time_text ?? "",
    location: announcement.location ?? "",
    description: announcement.description ?? "",
    flyer: announcement.flyer_url ?? "/todos-los-dias/logo.png",
    accent: getAnnouncementAccent(announcement.category, announcement.title),
  }));
}

async function getTodosLosDiasChurchId() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("churches")
    .select("id")
    .eq("slug", "todos-los-dias")
    .single();

  if (error || !data) {
    throw new Error("Could not find church record.");
  }

  return data.id;
}

export default function TodosLosDiasPage() {
  const [activeForm, setActiveForm] = useState<ActionFormType | null>(null);
  const [announcements, setAnnouncements] = useState<PublicAnnouncement[]>([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadAnnouncements() {
      try {
        const publishedAnnouncements = await loadPublishedAnnouncements();

        if (isMounted) {
          setAnnouncements(publishedAnnouncements);
        }
      } catch {
        if (isMounted) {
          setAnnouncements(fallbackAnnouncements);
        }
      }

      if (isMounted) {
        setAnnouncementsLoading(false);
      }
    }

    loadAnnouncements();

    return () => {
      isMounted = false;
    };
  }, []);

  function openForm(formType: ActionFormType) {
    setActiveForm(formType);

    setTimeout(() => {
      document.getElementById("formulario")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  }

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

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-4 sm:px-6">
          <header className="flex items-center justify-between py-5">
            <a href="/" className="flex items-center gap-3">
              <img
                src={todosLosDiasChurch.logo}
                alt={todosLosDiasChurch.name}
                className="h-14 w-14 rounded-full bg-white object-contain p-1 shadow-lg sm:h-16 sm:w-16"
              />

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#BBD7FF] sm:text-xs sm:tracking-[0.3em]">
                  Iglesia en Español
                </p>
                <h1 className="text-base font-black sm:text-lg">
                  {todosLosDiasChurch.shortName}
                </h1>
              </div>
            </a>

            <nav className="hidden items-center gap-6 text-sm font-bold lg:flex">
              <a href="/todos-los-dias/hoy" className="hover:text-[#BBD7FF]">
                Hoy con Dios
              </a>

              <a href="/todos-los-dias/historias" className="hover:text-[#BBD7FF]">
                Historias de Fe
              </a>

              <details className="group relative">
                <summary className="cursor-pointer list-none font-bold hover:text-[#BBD7FF]">
                  Ministerios ▾
                </summary>

                <div className="absolute right-0 top-full z-50 pt-3">
                  <div className="w-72 border border-white/15 bg-white p-2 text-[#071A33] shadow-2xl">
                    {ministryLinks.map((ministry) => (
                      <a
                        key={ministry.href}
                        href={ministry.href}
                        className="block px-4 py-3 text-sm font-black hover:bg-[#EEF5FF] hover:text-[#164B8F]"
                      >
                        {ministry.name}
                      </a>
                    ))}
                  </div>
                </div>
              </details>

              <a href="#donar" className="hover:text-[#BBD7FF]">
                Donar
              </a>
            </nav>

            <a
              href="#conectar"
              className="hidden rounded-full bg-white px-4 py-3 text-xs font-black text-[#071A33] shadow-lg hover:bg-[#BBD7FF] sm:inline-flex sm:px-5 sm:text-sm"
            >
              Soy Nuevo
            </a>
          </header>

          <div className="flex flex-1 items-center pb-16 pt-10">
            <div className="max-w-5xl">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#BBD7FF] sm:text-sm sm:tracking-[0.35em]">
                Una iglesia para la comunidad hispana
              </p>

              <h2 className="mt-5 max-w-5xl text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl md:text-8xl">
                Bienvenido a casa.
              </h2>

              <p className="mt-7 max-w-2xl text-lg font-medium leading-8 text-white/85 sm:text-xl sm:leading-9 md:text-2xl">
                En Iglesia de Todos los Días queremos que tú y tu familia se
                sientan amados, recibidos y acompañados en su caminar con Dios.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <details className="relative rounded-full bg-white text-[#071A33] shadow-lg">
                  <summary className="cursor-pointer list-none px-6 py-4 text-center text-sm font-black hover:bg-[#BBD7FF]">
                    Ministerios
                  </summary>

                  <div className="absolute left-0 z-50 mt-3 w-72 overflow-hidden bg-white p-2 text-left text-[#071A33] shadow-2xl sm:w-80">
                    {ministryLinks.map((ministry) => (
                      <a
                        key={ministry.href}
                        href={ministry.href}
                        className="block px-4 py-3 text-sm font-black hover:bg-[#EEF5FF] hover:text-[#164B8F]"
                      >
                        {ministry.name}
                      </a>
                    ))}
                  </div>
                </details>

                <a
                  href="/todos-los-dias/hoy"
                  className="rounded-full border border-white/30 bg-white/10 px-6 py-4 text-center text-sm font-black text-white hover:bg-white/20"
                >
                  Hoy con Dios
                </a>

                <a
                  href="/todos-los-dias/historias"
                  className="rounded-full border border-white/30 bg-white/10 px-6 py-4 text-center text-sm font-black text-white hover:bg-white/20"
                >
                  Historias de Fe
                </a>
              </div>
            </div>
          </div>

          {/* SERVICE BANNER */}
          <div className="relative mb-10 overflow-hidden border border-white/25 bg-white/58 text-[#071A33] shadow-2xl backdrop-blur-md">
            <div className="grid md:grid-cols-[1fr_1.2fr_0.8fr]">
              <div className="border-b border-white/35 p-5 sm:p-6 md:border-b-0 md:border-r">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-[#164B8F] sm:text-sm">
                  Nos reunimos
                </p>

                <h3 className="mt-2 text-3xl font-black sm:text-4xl">
                  Domingo
                </h3>

                <div className="mt-4 space-y-2">
                  <p className="text-base font-black text-[#071A33] sm:text-lg">
                    English Service · 10:00 AM
                  </p>

                  <p className="text-base font-black text-[#B1182D] sm:text-lg">
                    Servicio en Español · 1:00 PM
                  </p>
                </div>
              </div>

              <div className="border-b border-white/35 p-5 sm:p-6 md:border-b-0 md:border-r">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-[#164B8F] sm:text-sm">
                  Lugar
                </p>

                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center">
                      <img
                        src={todosLosDiasChurch.mainPlaceLogo}
                        alt={todosLosDiasChurch.partnershipName}
                        className="h-10 w-10 object-contain"
                      />
                    </div>

                    <div>
                      <h3 className="text-xl font-black sm:text-2xl">
                        The Main Place
                      </h3>
                      <p className="text-sm font-bold text-[#52657D]">
                        English Service · 10:00 AM
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center">
                      <img
                        src={todosLosDiasChurch.logo}
                        alt={todosLosDiasChurch.name}
                        className="h-10 w-10 object-contain"
                      />
                    </div>

                    <div>
                      <h3 className="text-xl font-black sm:text-2xl">
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
                      className="block text-sm font-black leading-7 text-[#071A33] underline decoration-[#164B8F] decoration-2 underline-offset-4 hover:text-[#B1182D] sm:text-base"
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
        <button onClick={() => openForm("visitor")} className="px-2 py-3">
          Soy Nuevo
        </button>
        <button
          onClick={() => openForm("prayer")}
          className="border-x border-white/10 px-2 py-3"
        >
          Oración
        </button>
        <a href="#donar" className="px-2 py-3">
          Donar
        </a>
      </div>

      {/* ANNOUNCEMENTS */}
      <section id="anuncios" className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.35em] text-[#164B8F] sm:text-sm">
                Lo más importante
              </p>
              <h2 className="mt-2 text-4xl font-black leading-tight sm:text-5xl md:text-7xl">
                Anuncios y eventos
              </h2>
            </div>

            <p className="max-w-lg text-base font-medium leading-8 text-[#52657D] sm:text-lg">
              Lee la información principal aquí y toca cada volante para verlo
              completo.
            </p>
          </div>

          {announcementsLoading ? (
            <div className="bg-white p-8 text-center shadow-xl">
              <p className="text-lg font-black text-[#52657D]">
                Cargando anuncios...
              </p>
            </div>
          ) : announcements.length ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {announcements.map((announcement) => (
                <AnnouncementCard
                  key={`${announcement.title}-${announcement.date}`}
                  announcement={announcement}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 text-center shadow-xl">
              <p className="text-lg font-black text-[#52657D]">
                No hay anuncios publicados por ahora.
              </p>
            </div>
          )}
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

        <div className="absolute inset-0 flex items-center px-4 sm:px-6">
          <div className="mx-auto w-full max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.35em] text-[#BBD7FF] sm:text-sm">
                Una familia en Cristo
              </p>

              <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl md:text-7xl">
                Dios está formando algo hermoso.
              </h2>

              <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-white/80 sm:text-xl sm:leading-9">
                Iglesia de Todos los Días existe para amar, servir, discipular y
                caminar con la comunidad hispana todos los días.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FIRST-TIME VISITOR */}
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_center,rgba(22,75,143,0.20),transparent_35%),linear-gradient(135deg,rgba(7,26,51,0.08),rgba(187,215,255,0.45))] lg:block" />

        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.35em] text-[#164B8F] sm:text-sm">
              ¿Primera vez?
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl md:text-7xl">
              Ven con tu familia. Te esperamos.
            </h2>

            <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-[#52657D] sm:text-xl sm:leading-9">
              No tienes que saber qué hacer ni a dónde ir. Queremos recibirte,
              conocerte y ayudarte a sentirte en casa.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={() => openForm("visitor")}
                className="rounded-full bg-[#071A33] px-8 py-4 text-center text-lg font-black text-white hover:bg-[#164B8F]"
              >
                Avisar que voy
              </button>

              <button
                onClick={() => openForm("prayer")}
                className="rounded-full border-2 border-[#071A33] px-8 py-4 text-center text-lg font-black text-[#071A33] hover:bg-white"
              >
                Pedir oración
              </button>
            </div>
          </div>

          <div className="relative min-h-[420px] overflow-hidden bg-[#071A33] shadow-xl">
            <img
              src={churchPhotos.family}
              alt="Comunidad de Iglesia de Todos los Días"
              className="h-full min-h-[420px] w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#071A33]/85 via-[#071A33]/25 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#BBD7FF] sm:text-sm">
                Comunidad
              </p>
              <h3 className="mt-3 text-3xl font-black sm:text-4xl">
                Una iglesia para toda la familia
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* BIG ACTIONS */}
      <section id="conectar" className="bg-[#071A33] px-4 py-16 text-white sm:px-6 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.35em] text-[#BBD7FF] sm:text-sm">
              ¿Qué necesitas hoy?
            </p>
            <h2 className="mt-3 text-4xl font-black sm:text-5xl md:text-6xl">
              Estamos aquí para ti.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3 md:gap-5">
            <ActionCard
              eyebrow="Nuevo visitante"
              title="Soy Nuevo"
              description="Queremos conocerte y ayudarte a conectarte con la iglesia."
              active={activeForm === "visitor"}
              variant="white"
              onClick={() => openForm("visitor")}
            />

            <ActionCard
              eyebrow="Necesito ayuda"
              title="Oración"
              description="Comparte tu petición. Queremos orar contigo."
              active={activeForm === "prayer"}
              variant="blue"
              onClick={() => openForm("prayer")}
            />

            <ActionCard
              eyebrow="Quiero apoyar"
              title="Servir"
              description="Usa tus dones para bendecir a otros."
              active={activeForm === "volunteer"}
              variant="red"
              onClick={() => openForm("volunteer")}
            />
          </div>

          <div id="formulario" className="scroll-mt-28">
            {activeForm ? (
              <div className="mt-8 max-w-3xl">
                {activeForm === "visitor" ? (
                  <SimpleForm
                    id="soy-nuevo-form"
                    title="Soy Nuevo"
                    description="Déjanos tu información y alguien de la iglesia podrá saludarte."
                    button="Enviar"
                    color="navy"
                    formType="visitor"
                  />
                ) : null}

                {activeForm === "prayer" ? (
                  <SimpleForm
                    id="oracion"
                    title="Pedir Oración"
                    description="Escribe tu petición. Queremos orar por ti y tu familia."
                    button="Enviar petición"
                    color="blue"
                    formType="prayer"
                  />
                ) : null}

                {activeForm === "volunteer" ? <VolunteerForm /> : null}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* MISSION / VISION */}
      <section id="vision" className="bg-white px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-[#164B8F] sm:text-sm">
            Nuestra identidad
          </p>
          <h2 className="mt-3 max-w-4xl text-4xl font-black leading-tight sm:text-5xl md:text-7xl">
            Una iglesia que vive la Palabra todos los días.
          </h2>

          <div className="mt-12 space-y-8">
            {missionVision.map((item) => (
              <div
                key={item.label}
                className="border-t border-[#D9E5F5] pt-8 md:grid md:grid-cols-[260px_1fr] md:gap-10"
              >
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[#164B8F] sm:text-sm">
                  {item.label}
                </p>

                <div>
                  <h3 className="text-3xl font-black text-[#071A33] sm:text-4xl">
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-4xl text-lg font-medium leading-8 text-[#52657D] sm:text-xl sm:leading-9">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SHORTS */}
      <section className="bg-[#F5F8FC] px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.35em] text-[#164B8F] sm:text-sm">
              Momentos de Fe
            </p>
            <h2 className="mt-3 text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
              Mensajes cortos para tu semana.
            </h2>
            <p className="mt-5 text-lg font-medium leading-8 text-[#52657D] sm:text-xl sm:leading-9">
              Mira reflexiones breves del Pastor Socrates en formato vertical.
              Desliza hacia abajo para ver más mensajes.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={todosLosDiasChurch.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-[#071A33] px-8 py-4 text-center text-lg font-black text-white hover:bg-[#164B8F]"
              >
                Ver canal de YouTube
              </a>

              <a
                href="/todos-los-dias/hoy"
                className="rounded-full border-2 border-[#071A33] px-8 py-4 text-center text-lg font-black text-[#071A33] hover:bg-white"
              >
                Ir a Hoy con Dios
              </a>
            </div>
          </div>

          <ShortsLoop />
        </div>
      </section>

      {/* DONATE */}
      <section id="donar" className="bg-[#071A33] px-4 py-16 text-white sm:px-6 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.35em] text-[#BBD7FF] sm:text-sm">
              Dar / Donar
            </p>
            <h2 className="mt-3 text-4xl font-black leading-tight sm:text-5xl md:text-7xl">
              Apoya la misión.
            </h2>
            <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-white/85 sm:text-xl sm:leading-9">
              Tus ofrendas ayudan a la iglesia a servir, discipular y alcanzar
              familias con el amor de Cristo.
            </p>
          </div>

          <div className="bg-white p-6 text-[#071A33] sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#164B8F] sm:text-sm">
              Zelle
            </p>
            <h3 className="mt-3 text-3xl font-black sm:text-4xl">
              Dar por Zelle
            </h3>
            <p className="mt-4 text-lg font-medium leading-8 text-[#52657D]">
              Si desea enviar sus donaciones a través de Zelle, por favor
              escanee el código QR. Si prefiere emitir un cheque, por favor
              hágalo a nombre de: <strong>Ministry Inc.</strong> Muchas gracias
              por sus donaciones.
            </p>

            <div className="mt-6 bg-[#F5F8FC] p-5 text-center">
              <div className="mx-auto flex h-72 w-72 items-center justify-center overflow-hidden bg-white p-3 shadow-sm">
                <img
                  src="/todos-los-dias/zelle.png"
                  alt="Código QR para dar por Zelle"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#071A33] px-4 py-10 pb-20 text-white sm:px-6 md:pb-10">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_auto] md:items-center">
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

          <nav className="flex flex-wrap gap-3 text-sm font-black">
            <a href="/todos-los-dias" className="bg-white/10 px-4 py-2 hover:bg-white/20">
              Inicio
            </a>
            <a
              href="/todos-los-dias/liderazgo"
              className="bg-white px-4 py-2 text-[#071A33] hover:bg-[#BBD7FF]"
            >
              Liderazgo
            </a>
            <a
              href="/todos-los-dias/hoy"
              className="bg-white/10 px-4 py-2 hover:bg-white/20"
            >
              Hoy con Dios
            </a>
            <a
              href="/todos-los-dias/historias"
              className="bg-white/10 px-4 py-2 hover:bg-white/20"
            >
              Historias de Fe
            </a>
            <a
              href="/todos-los-dias/ministerios/evangelismo"
              className="bg-white/10 px-4 py-2 hover:bg-white/20"
            >
              Ministerios
            </a>
            <a href="#donar" className="bg-white/10 px-4 py-2 hover:bg-white/20">
              Donar
            </a>
          </nav>

          <div className="flex items-center gap-4 md:col-span-2">
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


function ShortsLoop() {
  const loopedShorts = [...youtubeShorts, ...youtubeShorts];

  return (
    <div className="relative">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-[#164B8F]">
          Shorts
        </p>
        <p className="text-sm font-bold text-[#52657D]">
          Desliza para ver más
        </p>
      </div>

      <div
        className="max-h-[720px] snap-y snap-mandatory overflow-y-auto pr-2"
        onScroll={(event) => {
          const container = event.currentTarget;
          const halfway = container.scrollHeight / 2;

          if (container.scrollTop >= halfway) {
            container.scrollTop = 0;
          }
        }}
      >
        <div className="grid gap-5">
          {loopedShorts.map((short, index) => (
            <article
              key={`${short.id}-${index}`}
              className="snap-start overflow-hidden bg-[#071A33] shadow-xl"
            >
              <div className="aspect-[9/16] w-full">
                <iframe
                  src={`https://www.youtube.com/embed/${short.id}?rel=0&modestbranding=1&playsinline=1`}
                  title={short.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              <div className="bg-white p-4">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#164B8F]">
                  Pastor Socrates
                </p>
                <h3 className="mt-2 text-xl font-black text-[#071A33]">
                  {short.title}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </div>

      <p className="mt-3 text-xs font-bold leading-6 text-[#52657D]">
        Nota: YouTube puede requerir tocar reproducir en algunos teléfonos.
        La lista vuelve al inicio automáticamente al llegar al final.
      </p>
    </div>
  );
}

function ActionCard({
  eyebrow,
  title,
  description,
  active,
  variant,
  onClick,
}: {
  eyebrow: string;
  title: string;
  description: string;
  active: boolean;
  variant: "white" | "blue" | "red";
  onClick: () => void;
}) {
  const variantClass =
    variant === "white"
      ? "bg-white text-[#071A33]"
      : variant === "blue"
        ? "bg-[#164B8F] text-white"
        : "bg-[#B1182D] text-white";

  const eyebrowClass =
    variant === "white" ? "text-[#164B8F]" : "text-white/70";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group min-h-56 p-6 text-left transition hover:scale-[1.01] sm:min-h-64 sm:p-8 ${variantClass} ${
        active ? "ring-4 ring-[#BBD7FF]" : ""
      }`}
    >
      <p
        className={`text-xs font-black uppercase tracking-[0.3em] sm:text-sm ${eyebrowClass}`}
      >
        {eyebrow}
      </p>
      <h3 className="mt-4 text-4xl font-black leading-none sm:text-5xl">
        {title}
      </h3>
      <p
        className={`mt-6 text-base font-medium leading-8 sm:text-lg ${
          variant === "white" ? "text-[#52657D]" : "text-white/80"
        }`}
      >
        {description}
      </p>
      <p className="mt-6 text-sm font-black">
        {active ? "Formulario abierto" : "Toca para abrir"}
      </p>
    </button>
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
        className="group relative flex min-h-[360px] items-center justify-center overflow-hidden bg-white sm:min-h-[520px]"
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

      <div className="flex flex-col justify-between p-6 sm:p-7">
        <div>
          <p
            className={`inline-flex border-l-4 pl-3 text-xs font-black uppercase tracking-[0.25em] sm:text-sm ${accentClass}`}
          >
            {announcement.category}
          </p>

          <h3 className="mt-5 text-3xl font-black leading-tight text-[#071A33] sm:text-4xl">
            {announcement.title}
          </h3>

          <div className="mt-5 space-y-3 text-base font-bold text-[#52657D] sm:text-lg">
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

          <p className="mt-5 text-base font-medium leading-8 text-[#52657D] sm:text-lg">
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
  formType,
}: {
  id: string;
  title: string;
  description: string;
  button: string;
  color: "navy" | "blue";
  formType: "visitor" | "prayer";
}) {
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const buttonClass =
    color === "navy"
      ? "bg-[#071A33] hover:bg-[#164B8F]"
      : "bg-[#164B8F] hover:bg-[#0E356B]";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;

    setIsSubmitting(true);
    setStatus("");

    const formData = new FormData(form);
    const fullName = String(formData.get("full_name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!fullName) {
      setStatus("Por favor escribe tu nombre.");
      setIsSubmitting(false);
      return;
    }

    if (!phone && !email) {
      setStatus("Por favor agrega teléfono o correo.");
      setIsSubmitting(false);
      return;
    }

    try {
      const supabase = createClient();
      const churchId = await getTodosLosDiasChurchId();

      if (formType === "prayer") {
        const { error } = await supabase.from("prayer_requests").insert({
          church_id: churchId,
          full_name: fullName,
          phone,
          email,
          prayer_request: message || "Sin mensaje",
        });

        if (error) throw error;
      } else {
        const { error } = await supabase.from("visitor_submissions").insert({
          church_id: churchId,
          full_name: fullName,
          phone,
          email,
          message,
        });

        if (error) throw error;
      }

      form.reset();
      setStatus("Listo. Tu información fue enviada.");
    } catch (error) {
      console.error(error);
      setStatus("Hubo un error. Intenta otra vez.");
    }

    setIsSubmitting(false);
  }

  return (
    <form id={id} onSubmit={handleSubmit} className="bg-white p-5 text-[#071A33] shadow-xl sm:p-7">
      <h3 className="text-3xl font-black sm:text-4xl">{title}</h3>
      <p className="mt-3 text-base font-medium leading-8 text-[#52657D] sm:text-lg">
        {description}
      </p>

      <div className="mt-6 grid gap-5">
        <label className="block">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-[#164B8F]">
            Nombre completo
          </span>
          <input
            name="full_name"
            placeholder="Ej. María González"
            className="mt-2 w-full rounded-none border-2 border-[#D9E5F5] bg-white px-4 py-4 text-base font-medium text-[#071A33] outline-none focus:border-[#164B8F] sm:text-lg"
          />
        </label>

        <label className="block">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-[#164B8F]">
            Teléfono
          </span>
          <input
            name="phone"
            type="tel"
            placeholder="Ej. (714) 555-1234"
            className="mt-2 w-full rounded-none border-2 border-[#D9E5F5] bg-white px-4 py-4 text-base font-medium text-[#071A33] outline-none focus:border-[#164B8F] sm:text-lg"
          />
        </label>

        <label className="block">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-[#164B8F]">
            Correo electrónico
          </span>
          <input
            name="email"
            type="email"
            placeholder="Ej. maria@email.com"
            className="mt-2 w-full rounded-none border-2 border-[#D9E5F5] bg-white px-4 py-4 text-base font-medium text-[#071A33] outline-none focus:border-[#164B8F] sm:text-lg"
          />
        </label>

        <label className="block">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-[#164B8F]">
            Mensaje
          </span>
          <textarea
            name="message"
            placeholder={
              formType === "prayer"
                ? "Escribe tu petición de oración..."
                : "Cuéntanos cómo podemos ayudarte..."
            }
            className="mt-2 min-h-32 w-full rounded-none border-2 border-[#D9E5F5] bg-white px-4 py-4 text-base font-medium text-[#071A33] outline-none focus:border-[#164B8F] sm:text-lg"
          />
        </label>

        {status ? (
          <p className="rounded bg-[#EEF5FF] p-3 text-sm font-bold text-[#164B8F]">
            {status}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full px-6 py-4 text-lg font-black text-white disabled:opacity-60 ${buttonClass}`}
        >
          {isSubmitting ? "Enviando..." : button}
        </button>
      </div>
    </form>
  );
}

function VolunteerForm() {
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;

    setIsSubmitting(true);
    setStatus("");

    const formData = new FormData(form);
    const fullName = String(formData.get("full_name") || "").trim();
    const contact = String(formData.get("contact") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const area = String(formData.get("area") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!fullName) {
      setStatus("Por favor escribe tu nombre.");
      setIsSubmitting(false);
      return;
    }

    if (!contact && !email) {
      setStatus("Por favor agrega teléfono o correo.");
      setIsSubmitting(false);
      return;
    }

    try {
      const supabase = createClient();
      const churchId = await getTodosLosDiasChurchId();

      const { error } = await supabase.from("volunteer_signups").insert({
        church_id: churchId,
        full_name: fullName,
        phone: contact,
        email,
        area,
        message,
      });

      if (error) throw error;

      form.reset();
      setStatus("Listo. Tu información fue enviada.");
    } catch (error) {
      console.error(error);
      setStatus("Hubo un error. Intenta otra vez.");
    }

    setIsSubmitting(false);
  }

  return (
    <form id="servir" onSubmit={handleSubmit} className="bg-white p-5 text-[#071A33] shadow-xl sm:p-7">
      <h3 className="text-3xl font-black sm:text-4xl">Quiero Servir</h3>
      <p className="mt-3 text-base font-medium leading-8 text-[#52657D] sm:text-lg">
        Déjanos saber en qué área te gustaría apoyar.
      </p>

      <div className="mt-6 grid gap-5">
        <label className="block">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-[#164B8F]">
            Nombre completo
          </span>
          <input
            name="full_name"
            placeholder="Ej. José Ramírez"
            className="mt-2 w-full rounded-none border-2 border-[#D9E5F5] bg-white px-4 py-4 text-base font-medium text-[#071A33] outline-none focus:border-[#164B8F] sm:text-lg"
          />
        </label>

        <label className="block">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-[#164B8F]">
            Teléfono
          </span>
          <input
            name="contact"
            type="tel"
            placeholder="Ej. (714) 555-1234"
            className="mt-2 w-full rounded-none border-2 border-[#D9E5F5] bg-white px-4 py-4 text-base font-medium text-[#071A33] outline-none focus:border-[#164B8F] sm:text-lg"
          />
        </label>

        <label className="block">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-[#164B8F]">
            Correo electrónico
          </span>
          <input
            name="email"
            type="email"
            placeholder="Ej. jose@email.com"
            className="mt-2 w-full rounded-none border-2 border-[#D9E5F5] bg-white px-4 py-4 text-base font-medium text-[#071A33] outline-none focus:border-[#164B8F] sm:text-lg"
          />
        </label>

        <label className="block">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-[#164B8F]">
            Área donde deseas servir
          </span>
          <select
            name="area"
            className="mt-2 w-full rounded-none border-2 border-[#D9E5F5] bg-white px-4 py-4 text-base font-medium text-[#071A33] outline-none focus:border-[#164B8F] sm:text-lg"
          >
            <option value="">Selecciona un área</option>
            {volunteerAreas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-[#164B8F]">
            Mensaje
          </span>
          <textarea
            name="message"
            placeholder="Cuéntanos cómo te gustaría servir..."
            className="mt-2 min-h-32 w-full rounded-none border-2 border-[#D9E5F5] bg-white px-4 py-4 text-base font-medium text-[#071A33] outline-none focus:border-[#164B8F] sm:text-lg"
          />
        </label>

        {status ? (
          <p className="rounded bg-[#EEF5FF] p-3 text-sm font-bold text-[#164B8F]">
            {status}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#B1182D] px-6 py-4 text-lg font-black text-white hover:bg-[#8F1324] disabled:opacity-60"
        >
          {isSubmitting ? "Enviando..." : "Enviar"}
        </button>
      </div>
    </form>
  );
}
