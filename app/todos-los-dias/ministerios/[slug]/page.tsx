"use client";

import { type FormEvent, useEffect, useState } from "react";
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

export default function MinistryPage() {
  const params = useParams();
  const ministrySlug = String(params.slug || "");

  const [church, setChurch] = useState<Church | null>(null);
  const [ministry, setMinistry] = useState<Ministry | null>(null);
  const [pageStatus, setPageStatus] = useState("Cargando ministerio...");
  const [formStatus, setFormStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        "Listo. Tu información fue enviada y el equipo pastoral podrá dar seguimiento.",
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
            className="mt-8 inline-flex bg-white px-6 py-3 font-black text-[#071A33] hover:bg-[#BBD7FF]"
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

  return (
    <main className="min-h-screen bg-[#F5F8FC] text-[#071A33]">
      <section className="relative min-h-[620px] overflow-hidden bg-[#071A33] text-white">
        <img
          src={ministry.hero_image_url || "/todos-los-dias/worship.png"}
          alt={ministry.name}
          className="absolute inset-0 h-full w-full object-cover opacity-65"
        />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(7,26,51,0.96),rgba(7,26,51,0.62),rgba(7,26,51,0.90))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(22,75,143,0.55),transparent_36%),radial-gradient(circle_at_88%_70%,rgba(177,24,45,0.28),transparent_30%)]" />

        <div className="relative z-10 mx-auto flex min-h-[620px] max-w-7xl flex-col px-6">
          <header className="flex items-center justify-between py-5">
            <a href="/todos-los-dias" className="flex items-center gap-3">
              <img
                src={church.logo_url || "/todos-los-dias/logo.png"}
                alt={church.display_name || church.name}
                className="h-14 w-14 rounded-full bg-white object-contain p-1 shadow-lg"
              />
              <div>
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

          <div className="flex flex-1 items-center py-16">
            <div className="max-w-4xl">
              <p className="text-sm font-black uppercase tracking-[0.35em] text-[#BBD7FF]">
                {ministry.category || "Ministerio"}
              </p>
              <h1 className="mt-5 text-6xl font-black leading-[0.95] tracking-tight md:text-8xl">
                {ministry.name}
              </h1>
              <p className="mt-7 max-w-2xl text-xl font-medium leading-9 text-white/85 md:text-2xl">
                {ministry.short_description ||
                  "Conoce más sobre este ministerio y cómo puedes conectarte."}
              </p>
              <a
                href="#interes"
                className="mt-9 inline-flex rounded-full bg-[#B1182D] px-8 py-4 text-lg font-black text-white hover:bg-[#8F1324]"
              >
                {ministry.contact_button_label || "Quiero más información"}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.85fr]">
          <div className="bg-white p-8 shadow-sm md:p-10">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-[#164B8F]">
              Acerca del ministerio
            </p>
            <h2 className="mt-3 text-4xl font-black md:text-5xl">
              ¿De qué se trata?
            </h2>
            <p className="mt-6 text-xl font-medium leading-9 text-[#52657D]">
              {ministry.description ||
                "Muy pronto agregaremos más información sobre este ministerio."}
            </p>
          </div>

          <aside className="space-y-5">
            <div className="bg-[#071A33] p-8 text-white shadow-sm">
              <p className="text-sm font-black uppercase tracking-[0.3em] text-[#BBD7FF]">
                Reuniones
              </p>
              <div className="mt-5 space-y-3 text-lg font-bold text-white/85">
                <p>
                  <span className="text-white">Día:</span>{" "}
                  {ministry.meeting_day || "Por confirmar"}
                </p>
                <p>
                  <span className="text-white">Hora:</span>{" "}
                  {ministry.meeting_time || "Por confirmar"}
                </p>
                <p>
                  <span className="text-white">Lugar:</span>{" "}
                  {ministry.location || "Iglesia de Todos los Días"}
                </p>
              </div>
            </div>

            <div className="bg-white p-8 shadow-sm">
              <p className="text-sm font-black uppercase tracking-[0.3em] text-[#164B8F]">
                Líder del ministerio
              </p>

              <div className="mt-5 flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#EEF5FF]">
                  {ministry.leader_photo_url ? (
                    <img
                      src={ministry.leader_photo_url}
                      alt={ministry.leader_name || "Líder del ministerio"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-black text-[#164B8F]">
                      {ministry.leader_name?.charAt(0) || "L"}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-2xl font-black">
                    {ministry.leader_name || "Por confirmar"}
                  </h3>
                  <p className="font-bold text-[#52657D]">
                    {ministry.leader_role || "Líder de Ministerio"}
                  </p>
                </div>
              </div>

              <p className="mt-5 text-base font-medium leading-7 text-[#52657D]">
                {ministry.leader_bio ||
                  "Muy pronto agregaremos más información sobre el líder de este ministerio."}
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section id="interes" className="bg-white px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1fr] lg:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-[#164B8F]">
              Conéctate
            </p>
            <h2 className="mt-3 text-5xl font-black leading-tight md:text-6xl">
              ¿Quieres saber más?
            </h2>
            <p className="mt-5 text-xl font-medium leading-9 text-[#52657D]">
              Llena esta forma y Pastor Socrates podrá ver tu interés en el
              dashboard para dar seguimiento.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-[#F5F8FC] p-8 shadow-sm">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-sm font-black uppercase tracking-[0.2em] text-[#52657D]">
                  Nombre completo
                </label>
                <input
                  name="full_name"
                  required
                  className="mt-2 w-full border-2 border-[#D9E5F5] bg-white px-4 py-4 text-lg font-medium outline-none focus:border-[#164B8F]"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label className="text-sm font-black uppercase tracking-[0.2em] text-[#52657D]">
                  Teléfono
                </label>
                <input
                  name="phone"
                  className="mt-2 w-full border-2 border-[#D9E5F5] bg-white px-4 py-4 text-lg font-medium outline-none focus:border-[#164B8F]"
                  placeholder="(000) 000-0000"
                />
              </div>

              <div>
                <label className="text-sm font-black uppercase tracking-[0.2em] text-[#52657D]">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  className="mt-2 w-full border-2 border-[#D9E5F5] bg-white px-4 py-4 text-lg font-medium outline-none focus:border-[#164B8F]"
                  placeholder="correo@email.com"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm font-black uppercase tracking-[0.2em] text-[#52657D]">
                  Mensaje
                </label>
                <textarea
                  name="message"
                  className="mt-2 min-h-32 w-full border-2 border-[#D9E5F5] bg-white px-4 py-4 text-lg font-medium outline-none focus:border-[#164B8F]"
                  placeholder={`Estoy interesado en ${ministry.name}...`}
                />
              </div>
            </div>

            {formStatus ? (
              <div className="mt-5 border-l-4 border-[#164B8F] bg-white p-4 text-sm font-bold text-[#164B8F]">
                {formStatus}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 w-full bg-[#071A33] px-6 py-4 text-lg font-black text-white hover:bg-[#164B8F] disabled:opacity-60"
            >
              {isSubmitting
                ? "Enviando..."
                : ministry.contact_button_label || "Quiero más información"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
