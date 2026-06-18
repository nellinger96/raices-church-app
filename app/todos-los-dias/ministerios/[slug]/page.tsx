"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Ministry = {
  id: string;
  church_id: string;
  slug: string;
  name: string;
  category: string | null;
  short_description: string | null;
  description: string | null;
  leader_name: string | null;
  leader_role: string | null;
  leader_bio: string | null;
  leader_photo_url: string | null;
  leader_phone?: string | null;
  leader_email?: string | null;
  meeting_day: string | null;
  meeting_time: string | null;
  location: string | null;
  hero_image_url: string | null;
  contact_button_label: string | null;
};

type Church = {
  id: string;
  name: string;
  display_name: string | null;
  logo_url: string | null;
};

type MinistryFallback = {
  category: string;
  heroImage: string;
  shortDescription: string;
  description: string;
  who: string[];
  nextSteps: string[];
  meetingNote: string;
};

const ministryFallbacks: Record<string, MinistryFallback> = {
  evangelismo: {
    category: "Alcance",
    heroImage: "/todos-los-dias/group.png",
    shortDescription:
      "Un ministerio para compartir el amor de Jesús con nuestra comunidad y acompañar a personas nuevas en su caminar con Dios.",
    description:
      "Evangelismo existe para servir a la comunidad, invitar a nuevas familias y ayudar a que cada persona que llega a la iglesia se sienta recibida, escuchada y acompañada.",
    who: [
      "Personas con corazón por la comunidad",
      "Voluntarios que desean invitar, servir y conectar",
      "Miembros que quieren apoyar eventos de alcance",
    ],
    nextSteps: [
      "Llena el formulario de interés",
      "El equipo pastoral revisará tu información",
      "Un líder de la iglesia se comunicará contigo",
    ],
    meetingNote: "Los detalles de reuniones y actividades se confirmarán pronto.",
  },
  "estudio-biblico": {
    category: "Discipulado",
    heroImage: "/todos-los-dias/worship.png",
    shortDescription:
      "Un espacio para crecer en la Palabra, hacer preguntas y fortalecer tu relación con Dios.",
    description:
      "Estudio Bíblico ayuda a la iglesia a profundizar en la Biblia de una manera práctica, clara y centrada en Jesús. Es un lugar para aprender, crecer y caminar con otros.",
    who: [
      "Personas nuevas en la fe",
      "Familias que desean crecer espiritualmente",
      "Miembros que quieren estudiar la Biblia en comunidad",
    ],
    nextSteps: [
      "Comparte tu interés en el formulario",
      "Te contactaremos con el horario disponible",
      "Ven listo para aprender y crecer",
    ],
    meetingNote: "Horario y grupo por confirmar.",
  },
  mujeres: {
    category: "Comunidad",
    heroImage: "/todos-los-dias/Mujeres.png",
    shortDescription:
      "Un ministerio para animar, fortalecer y conectar a las mujeres de la iglesia.",
    description:
      "Mujeres es un espacio de amistad, oración, apoyo y crecimiento espiritual. Nuestro deseo es que cada mujer se sienta vista, acompañada y fortalecida en Dios.",
    who: [
      "Mujeres de todas las edades",
      "Mujeres que buscan comunidad y oración",
      "Mujeres que desean servir y crecer juntas",
    ],
    nextSteps: [
      "Llena el formulario",
      "Un líder de la iglesia dará seguimiento",
      "Te compartiremos próximos encuentros y actividades",
    ],
    meetingNote: "Próximas reuniones por confirmar.",
  },
  "escuela-dominical": {
    category: "Familias",
    heroImage: "/todos-los-dias/vbs.png",
    shortDescription:
      "Un espacio seguro y alegre para que los niños aprendan de Jesús de una forma sencilla y especial.",
    description:
      "Escuela Dominical ayuda a los niños a conocer a Dios, aprender historias bíblicas y crecer en un ambiente de amor, cuidado y alegría.",
    who: [
      "Niños y familias",
      "Padres que desean conectar a sus hijos con la iglesia",
      "Voluntarios con corazón para servir a niños",
    ],
    nextSteps: [
      "Llena el formulario de interés",
      "Te daremos información de horarios y edades",
      "Un líder se comunicará contigo pronto",
    ],
    meetingNote: "Horarios y edades se confirmarán pronto.",
  },
  oracion: {
    category: "Cuidado pastoral",
    heroImage: "/todos-los-dias/free-worship.png",
    shortDescription:
      "Un ministerio para interceder, acompañar y levantar en oración las necesidades de la iglesia.",
    description:
      "Oración existe para cubrir a la iglesia, las familias y la comunidad en oración. Creemos que Dios escucha, fortalece y responde cuando su pueblo ora unido.",
    who: [
      "Personas con corazón de intercesión",
      "Miembros que desean aprender a orar por otros",
      "Personas que quieren apoyar el cuidado espiritual de la iglesia",
    ],
    nextSteps: [
      "Comparte tu interés",
      "El equipo pastoral revisará tu solicitud",
      "Te contactaremos para próximos pasos",
    ],
    meetingNote: "Reuniones de oración por confirmar.",
  },
  jovenes: {
    category: "Próxima generación",
    heroImage: "/todos-los-dias/group.png",
    shortDescription:
      "Un espacio para que los jóvenes conozcan a Dios, formen amistades sanas y crezcan con propósito.",
    description:
      "Jóvenes busca crear un ambiente donde la nueva generación pueda acercarse a Jesús, hacer comunidad y descubrir su identidad y propósito en Dios.",
    who: [
      "Jóvenes y adolescentes",
      "Familias con jóvenes en casa",
      "Voluntarios que desean apoyar a la nueva generación",
    ],
    nextSteps: [
      "Llena el formulario",
      "Te avisaremos de próximos encuentros",
      "Un líder de la iglesia se comunicará contigo",
    ],
    meetingNote: "Días y horarios por confirmar.",
  },
  alabanza: {
    category: "Adoración",
    heroImage: "/todos-los-dias/worship.png",
    shortDescription:
      "Un ministerio para servir a Dios y a la iglesia por medio de la adoración.",
    description:
      "Alabanza prepara el corazón de la iglesia para adorar a Dios. Es un equipo de servicio, excelencia, humildad y dependencia del Espíritu Santo.",
    who: [
      "Personas con dones musicales o técnicos",
      "Vocalistas, músicos y servidores de sonido/media",
      "Personas con corazón de adoración y servicio",
    ],
    nextSteps: [
      "Comparte tu interés y experiencia",
      "El equipo pastoral revisará tu información",
      "Un líder se comunicará contigo para próximos pasos",
    ],
    meetingNote: "Ensayos y horarios por confirmar.",
  },
};

const defaultFallback: MinistryFallback = {
  category: "Ministerio",
  heroImage: "/todos-los-dias/worship.png",
  shortDescription:
    "Conoce más sobre este ministerio y cómo puedes conectarte con la iglesia.",
  description:
    "Este ministerio existe para servir a Dios, fortalecer a la iglesia y ayudar a más personas a conectarse en comunidad.",
  who: [
    "Personas que desean conectarse",
    "Miembros que quieren crecer y servir",
    "Familias que buscan comunidad",
  ],
  nextSteps: [
    "Llena el formulario de interés",
    "El equipo pastoral revisará tu información",
    "Un líder de la iglesia se comunicará contigo pronto",
  ],
  meetingNote: "Detalles por confirmar.",
};

export default function MinistryPage() {
  const params = useParams();
  const ministrySlug = String(params.slug || "");

  const [church, setChurch] = useState<Church | null>(null);
  const [ministry, setMinistry] = useState<Ministry | null>(null);
  const [pageStatus, setPageStatus] = useState("Cargando ministerio...");
  const [formStatus, setFormStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fallback = useMemo(
    () => ministryFallbacks[ministrySlug] ?? defaultFallback,
    [ministrySlug],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadMinistry() {
      setPageStatus("Cargando ministerio...");

      try {
        const supabase = createClient();

        const { data: churchData, error: churchError } = await supabase
          .from("churches")
          .select("id, name, display_name, logo_url")
          .eq("slug", "todos-los-dias")
          .single();

        if (churchError || !churchData) {
          throw new Error("No pudimos encontrar la iglesia.");
        }

        const { data: ministryData, error: ministryError } = await supabase
          .from("ministries")
          .select("*")
          .eq("church_id", churchData.id)
          .eq("slug", ministrySlug)
          .eq("is_published", true)
          .single();

        if (ministryError || !ministryData) {
          throw new Error("No pudimos encontrar este ministerio.");
        }

        if (isMounted) {
          setChurch(churchData as Church);
          setMinistry(ministryData as Ministry);
          setPageStatus("");
        }
      } catch (error) {
        console.error(error);
        if (isMounted) {
          setPageStatus("No pudimos cargar este ministerio.");
        }
      }
    }

    loadMinistry();

    return () => {
      isMounted = false;
    };
  }, [ministrySlug]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!church || !ministry) {
      setFormStatus("Espera un momento e intenta otra vez.");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    const fullName = String(formData.get("full_name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!fullName) {
      setFormStatus("Por favor escribe tu nombre.");
      return;
    }

    setIsSubmitting(true);
    setFormStatus("");

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("ministry_interest_submissions")
        .insert({
          church_id: church.id,
          ministry_id: ministry.id,
          full_name: fullName,
          phone,
          email,
          message,
        });

      if (error) throw error;

      form.reset();
      setFormStatus(
        "Listo. Tu información fue enviada y un líder de la iglesia podrá darte seguimiento pronto.",
      );
    } catch (error) {
      console.error(error);
      setFormStatus("Hubo un error. Intenta otra vez.");
    }

    setIsSubmitting(false);
  }

  if (pageStatus && !ministry) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#071A33] px-6 text-white">
        <div className="max-w-xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-[#BBD7FF]">
            Ministerios
          </p>
          <h1 className="mt-4 text-4xl font-black">{pageStatus}</h1>
          <a
            href="/todos-los-dias"
            className="mt-8 inline-flex rounded-full bg-white px-6 py-3 font-black text-[#071A33] hover:bg-[#BBD7FF]"
          >
            Regresar a la página principal
          </a>
        </div>
      </main>
    );
  }

  if (!ministry || !church) {
    return null;
  }

  const category = ministry.category || fallback.category;
  const heroImage = ministry.hero_image_url || fallback.heroImage;
  const shortDescription =
    ministry.short_description || fallback.shortDescription;
  const description = ministry.description || fallback.description;
  const leaderName = ministry.leader_name || "Equipo pastoral";
  const leaderRole = ministry.leader_role || "Iglesia de Todos los Días";
  const leaderBio =
    ministry.leader_bio ||
    "Por ahora, este ministerio recibirá formularios de interés y el equipo pastoral dará seguimiento directamente.";
  const meetingDay = ministry.meeting_day || "Por confirmar";
  const meetingTime = ministry.meeting_time || "Por confirmar";
  const meetingLocation = ministry.location || "Iglesia de Todos los Días";
  const buttonLabel = ministry.contact_button_label || "Quiero conectarme";

  return (
    <main className="min-h-screen bg-[#EEF3F9] text-[#071A33]">
      <section className="relative overflow-hidden bg-[#071A33] text-white">
        <img
          src={heroImage}
          alt={ministry.name}
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(7,26,51,0.98),rgba(7,26,51,0.72),rgba(7,26,51,0.96))]" />
        <div className="absolute inset-0 opacity-25">
          <div className="h-full w-full bg-[radial-gradient(circle_at_18%_20%,rgba(187,215,255,0.65),transparent_26%),radial-gradient(circle_at_90%_15%,rgba(177,24,45,0.35),transparent_28%),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:auto,auto,70px_70px,70px_70px]" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[650px] max-w-7xl flex-col px-4 sm:px-6">
          <header className="flex items-center justify-between gap-4 py-5">
            <a href="/todos-los-dias" className="flex items-center gap-3">
              <img
                src={church.logo_url || "/todos-los-dias/logo.png"}
                alt={church.display_name || church.name}
                className="h-14 w-14 rounded-2xl bg-white object-contain p-1 shadow-lg"
              />
              <div className="hidden sm:block">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[#BBD7FF]">
                  Ministerio
                </p>
                <p className="font-black">{church.display_name || church.name}</p>
              </div>
            </a>

            <a
              href="/todos-los-dias#ministerios"
              className="rounded-full bg-white px-5 py-3 text-sm font-black text-[#071A33] shadow-lg hover:bg-[#BBD7FF]"
            >
              Todos los ministerios
            </a>
          </header>

          <div className="grid flex-1 gap-10 py-14 lg:grid-cols-[1fr_380px] lg:items-center">
            <div className="max-w-4xl">
              <p className="text-sm font-black uppercase tracking-[0.35em] text-[#BBD7FF]">
                {category}
              </p>
              <h1 className="mt-5 text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl md:text-8xl">
                {ministry.name}
              </h1>
              <p className="mt-7 max-w-2xl text-xl font-medium leading-9 text-white/85 md:text-2xl">
                {shortDescription}
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#interes"
                  className="rounded-full bg-[#B1182D] px-8 py-4 text-center text-lg font-black text-white hover:bg-[#8F1324]"
                >
                  {buttonLabel}
                </a>
                <a
                  href="/todos-los-dias"
                  className="rounded-full border border-white/25 px-8 py-4 text-center text-lg font-black text-white hover:bg-white/10"
                >
                  Volver a la app
                </a>
              </div>
            </div>

            <aside className="rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#BBD7FF]">
                Cómo conectarte
              </p>
              <div className="mt-5 grid gap-4">
                {fallback.nextSteps.map((step, index) => (
                  <div key={step} className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-lg font-black text-[#071A33]">
                      {index + 1}
                    </div>
                    <p className="pt-2 text-sm font-bold leading-6 text-white/80">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_0.85fr]">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8 md:p-10">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-[#164B8F]">
              Acerca del ministerio
            </p>
            <h2 className="mt-3 text-4xl font-black md:text-5xl">
              ¿De qué se trata?
            </h2>
            <p className="mt-6 text-xl font-medium leading-9 text-[#52657D]">
              {description}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <InfoCard title="Conectar" text="Ayudarte a dar el siguiente paso." />
              <InfoCard title="Crecer" text="Caminar con otros en comunidad." />
              <InfoCard title="Servir" text="Usar tus dones para bendecir." />
            </div>
          </div>

          <aside className="grid gap-5">
            <div className="rounded-[2rem] bg-[#071A33] p-6 text-white shadow-sm sm:p-8">
              <p className="text-sm font-black uppercase tracking-[0.3em] text-[#BBD7FF]">
                Reuniones
              </p>
              <div className="mt-5 space-y-4 text-lg font-bold text-white/85">
                <DetailLine label="Día" value={meetingDay} />
                <DetailLine label="Hora" value={meetingTime} />
                <DetailLine label="Lugar" value={meetingLocation} />
              </div>
              <p className="mt-6 rounded-2xl bg-white/10 p-4 text-sm font-bold leading-6 text-white/75">
                {fallback.meetingNote}
              </p>
            </div>

            <div className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-black uppercase tracking-[0.3em] text-[#164B8F]">
                Contacto del ministerio
              </p>

              <div className="mt-5 flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl bg-[#EEF5FF]">
                  {ministry.leader_photo_url ? (
                    <img
                      src={ministry.leader_photo_url}
                      alt={leaderName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-black text-[#164B8F]">
                      {leaderName.charAt(0)}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-2xl font-black">{leaderName}</h3>
                  <p className="font-bold text-[#52657D]">{leaderRole}</p>
                </div>
              </div>

              <p className="mt-5 text-base font-medium leading-7 text-[#52657D]">
                {leaderBio}
              </p>

              <div className="mt-5 rounded-2xl bg-[#F5F8FC] p-4 text-sm font-black leading-6 text-[#071A33]">
                ¿Quieres conectarte con este ministerio? Llena el formulario y
                un líder de la iglesia se comunicará contigo pronto.
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-white p-6 shadow-sm sm:p-8 md:p-10">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-[#164B8F]">
            Para quién es
          </p>
          <h2 className="mt-3 text-4xl font-black md:text-5xl">
            Este ministerio puede ser para ti si...
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {fallback.who.map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-[#D9E5F5] bg-[#F8FBFF] p-5"
              >
                <p className="text-lg font-black leading-7">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="interes" className="bg-white px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1fr] lg:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-[#164B8F]">
              Conéctate
            </p>
            <h2 className="mt-3 text-5xl font-black leading-tight md:text-6xl">
              ¿Quieres saber más?
            </h2>
            <p className="mt-5 text-xl font-medium leading-9 text-[#52657D]">
              Llena este formulario y el equipo pastoral podrá ver tu interés
              en el dashboard para dar seguimiento.
            </p>

            <div className="mt-6 rounded-[2rem] bg-[#F5F8FC] p-5">
              <p className="text-sm font-black uppercase tracking-[0.25em] text-[#164B8F]">
                Después de enviarlo
              </p>
              <p className="mt-3 text-base font-bold leading-7 text-[#52657D]">
                Tu solicitud no se publica. Va directo al panel pastoral de la
                iglesia para seguimiento.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] bg-[#F5F8FC] p-6 shadow-sm sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Nombre completo" className="sm:col-span-2">
                <input
                  name="full_name"
                  required
                  className="mt-2 w-full rounded-2xl border-2 border-[#D9E5F5] bg-white px-4 py-4 text-lg font-medium outline-none focus:border-[#164B8F]"
                  placeholder="Tu nombre"
                />
              </Field>

              <Field label="Teléfono">
                <input
                  name="phone"
                  className="mt-2 w-full rounded-2xl border-2 border-[#D9E5F5] bg-white px-4 py-4 text-lg font-medium outline-none focus:border-[#164B8F]"
                  placeholder="(000) 000-0000"
                />
              </Field>

              <Field label="Email">
                <input
                  name="email"
                  type="email"
                  className="mt-2 w-full rounded-2xl border-2 border-[#D9E5F5] bg-white px-4 py-4 text-lg font-medium outline-none focus:border-[#164B8F]"
                  placeholder="correo@email.com"
                />
              </Field>

              <Field label="Mensaje" className="sm:col-span-2">
                <textarea
                  name="message"
                  className="mt-2 min-h-32 w-full rounded-2xl border-2 border-[#D9E5F5] bg-white px-4 py-4 text-lg font-medium outline-none focus:border-[#164B8F]"
                  placeholder={`Estoy interesado en ${ministry.name}...`}
                />
              </Field>
            </div>

            {formStatus ? (
              <div className="mt-5 rounded-2xl border-l-4 border-[#164B8F] bg-white p-4 text-sm font-bold text-[#164B8F]">
                {formStatus}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 w-full rounded-full bg-[#071A33] px-6 py-4 text-lg font-black text-white hover:bg-[#164B8F] disabled:opacity-60"
            >
              {isSubmitting ? "Enviando..." : buttonLabel}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl bg-[#F5F8FC] p-5">
      <p className="text-xl font-black">{title}</p>
      <p className="mt-2 text-sm font-bold leading-6 text-[#52657D]">{text}</p>
    </div>
  );
}

function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <span className="text-white">{label}:</span>{" "}
      <span className="text-white/80">{value}</span>
    </p>
  );
}

function Field({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={className}>
      <span className="text-sm font-black uppercase tracking-[0.2em] text-[#52657D]">
        {label}
      </span>
      {children}
    </label>
  );
}
