"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import { todosLosDiasChurch } from "@/lib/churches/todos-los-dias";
import { createClient } from "@/lib/supabase/client";

type FaithStory = {
  id: string;
  title: string;
  caption: string | null;
  category: string | null;
  submitter_name: string | null;
  display_name_preference: "full_name" | "first_name" | "anonymous" | null;
  media_url: string | null;
  media_type: "video" | "image" | "none";
  created_at: string;
};

const MAX_FILE_SIZE_MB = 100;

const testimonyCategories = [
  "Familia",
  "Sanidad",
  "Provisión",
  "Salvación",
  "Bautismo",
  "Restauración",
  "Otro",
];

function getPublicName(story: FaithStory) {
  if (!story.submitter_name || story.display_name_preference === "anonymous") {
    return "Anónimo";
  }

  if (story.display_name_preference === "first_name") {
    return story.submitter_name.split(" ")[0];
  }

  return story.submitter_name;
}

function sanitizeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, "-")
    .replace(/-+/g, "-");
}

export default function HistoriasDeFePage() {
  const [stories, setStories] = useState<FaithStory[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [submitStatus, setSubmitStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const featuredStory = useMemo(() => stories[0], [stories]);

  useEffect(() => {
    loadStories();
  }, []);

  async function getChurchId() {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("churches")
      .select("id")
      .eq("slug", "todos-los-dias")
      .single();

    if (error || !data) {
      throw new Error("No se encontró la iglesia.");
    }

    return data.id as string;
  }

  async function loadStories() {
    setIsLoading(true);

    const supabase = createClient();

    const { data: church } = await supabase
      .from("churches")
      .select("id")
      .eq("slug", "todos-los-dias")
      .single();

    if (!church) {
      setStories([]);
      setIsLoading(false);
      return;
    }

    const { data } = await supabase
      .from("faith_stories")
      .select(
        "id, title, caption, category, submitter_name, display_name_preference, media_url, media_type, created_at",
      )
      .eq("church_id", church.id)
      .eq("story_type", "testimony")
      .eq("status", "approved")
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false });

    setStories((data as FaithStory[] | null) ?? []);
    setIsLoading(false);
  }

  function openStory(index: number) {
    setActiveIndex(index);
  }

  function closeStory() {
    setActiveIndex(null);
  }

  function nextStory() {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex + 1) % stories.length);
  }

  function previousStory() {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex - 1 + stories.length) % stories.length);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const fullName = String(formData.get("full_name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const title = String(formData.get("title") || "").trim();
    const category = String(formData.get("category") || "").trim();
    const caption = String(formData.get("caption") || "").trim();
    const displayNamePreference = String(
      formData.get("display_name_preference") || "first_name",
    );
    const language = String(formData.get("language") || "Español");
    const hasMinor = formData.get("has_minor") === "on";
    const minorPermission = formData.get("minor_permission") === "on";
    const consentToShare = formData.get("consent_to_share") === "on";
    const file = formData.get("media") as File | null;

    setSubmitStatus("");

    if (!fullName || !title || !caption) {
      setSubmitStatus("Por favor completa tu nombre, título y testimonio.");
      return;
    }

    if (!phone && !email) {
      setSubmitStatus("Por favor agrega teléfono o correo.");
      return;
    }

    if (!file || file.size === 0) {
      setSubmitStatus("Por favor sube un video corto de tu testimonio.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setSubmitStatus(`El archivo debe pesar menos de ${MAX_FILE_SIZE_MB} MB.`);
      return;
    }

    if (hasMinor && !minorPermission) {
      setSubmitStatus(
        "Si aparece un menor de edad, confirma que tienes permiso del padre/tutor.",
      );
      return;
    }

    if (!consentToShare) {
      setSubmitStatus(
        "Necesitamos tu permiso para enviar y revisar el testimonio.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const churchId = await getChurchId();

      const mediaType = file.type.startsWith("image/") ? "image" : "video";
      const safeFileName = sanitizeFileName(file.name);
      const path = `todos-los-dias/testimonios/${Date.now()}-${crypto.randomUUID()}-${safeFileName}`;

      const { error: uploadError } = await supabase.storage
        .from("story-media")
        .upload(path, file, {
          cacheControl: "3600",
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("story-media")
        .getPublicUrl(path);

      const { error: insertError } = await supabase
        .from("faith_stories")
        .insert({
          church_id: churchId,
          story_type: "testimony",
          status: "pending",
          title,
          caption,
          category,
          language,
          submitter_name: fullName,
          submitter_phone: phone,
          submitter_email: email,
          display_name_preference: displayNamePreference,
          has_minor: hasMinor,
          minor_permission: minorPermission,
          consent_to_share: consentToShare,
          media_url: publicUrlData.publicUrl,
          media_path: path,
          media_type: mediaType,
        });

      if (insertError) throw insertError;

      form.reset();
      setSubmitStatus(
        "Gracias. Tu testimonio fue enviado al pastor para revisión.",
      );
    } catch (error) {
      console.error(error);
      setSubmitStatus("Hubo un error al enviar tu testimonio. Intenta otra vez.");
    }

    setIsSubmitting(false);
  }

  return (
    <main className="min-h-screen bg-[#F5F8FC] text-[#071A33]">
      <section className="relative overflow-hidden bg-[#071A33] px-4 py-8 text-white sm:px-6">
        <div className="absolute inset-0">
          <img
            src="/todos-los-dias/group.png"
            alt="Historias de Fe"
            className="h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(7,26,51,0.98),rgba(7,26,51,0.70),rgba(7,26,51,0.96))]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <header className="flex items-center justify-between gap-4">
            <a href="/todos-los-dias" className="flex items-center gap-3">
              <img
                src={todosLosDiasChurch.logo}
                alt={todosLosDiasChurch.name}
                className="h-14 w-14 rounded-full bg-white object-contain p-1"
              />
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[#BBD7FF]">
                  Iglesia de Todos los Días
                </p>
                <p className="font-black">Historias de Fe</p>
              </div>
            </a>

            <a
              href="/todos-los-dias"
              className="rounded-full bg-white px-5 py-3 text-sm font-black text-[#071A33] hover:bg-[#BBD7FF]"
            >
              Inicio
            </a>
          </header>

          <div className="grid gap-10 py-16 lg:grid-cols-[1fr_0.8fr] lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.35em] text-[#BBD7FF]">
                Testimonios de la familia
              </p>

              <h1 className="mt-5 text-5xl font-black leading-tight sm:text-6xl md:text-8xl">
                Dios lo hizo.
              </h1>

              <p className="mt-6 max-w-3xl text-lg font-medium leading-8 text-white/80 sm:text-xl">
                Historias reales de nuestra iglesia: familias, restauración,
                sanidad, provisión, bautismos y vidas transformadas por Dios.
              </p>
            </div>

            <a
              href="#compartir"
              className="bg-white p-6 text-[#071A33] shadow-xl hover:bg-[#BBD7FF]"
            >
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#164B8F]">
                Comparte tu historia
              </p>
              <h2 className="mt-3 text-3xl font-black">
                Sube un video corto de tu testimonio.
              </h2>
              <p className="mt-3 text-sm font-bold leading-7 text-[#52657D]">
                El pastor lo revisará antes de publicarlo.
              </p>
            </a>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-7xl">
          {isLoading ? (
            <div className="bg-white p-8 text-center shadow-sm">
              <p className="text-lg font-black">Cargando historias...</p>
            </div>
          ) : stories.length ? (
            <>
              <div className="flex gap-4 overflow-x-auto pb-5">
                {stories.map((story, index) => (
                  <button
                    key={story.id}
                    onClick={() => openStory(index)}
                    className="w-28 shrink-0 text-center"
                  >
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#B1182D] via-[#164B8F] to-[#071A33] p-1 shadow-lg">
                      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white">
                        {story.media_type === "image" && story.media_url ? (
                          <img
                            src={story.media_url}
                            alt={story.title}
                            className="h-full w-full object-cover"
                          />
                        ) : story.media_type === "video" && story.media_url ? (
                          <video
                            src={story.media_url}
                            className="h-full w-full object-cover"
                            muted
                            playsInline
                          />
                        ) : (
                          <span className="text-2xl font-black text-[#164B8F]">
                            ✝
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm font-black">
                      {getPublicName(story)}
                    </p>
                  </button>
                ))}
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
                <button
                  onClick={() => openStory(0)}
                  className="min-h-[520px] overflow-hidden bg-[#071A33] text-left text-white shadow-xl"
                >
                  {featuredStory?.media_url &&
                  featuredStory.media_type === "video" ? (
                    <video
                      src={featuredStory.media_url}
                      className="h-full min-h-[520px] w-full object-cover opacity-85"
                      muted
                      playsInline
                    />
                  ) : featuredStory?.media_url &&
                    featuredStory.media_type === "image" ? (
                    <img
                      src={featuredStory.media_url}
                      alt={featuredStory.title}
                      className="h-full min-h-[520px] w-full object-cover opacity-85"
                    />
                  ) : null}
                </button>

                <div className="bg-white p-6 shadow-sm sm:p-8">
                  <p className="text-sm font-black uppercase tracking-[0.3em] text-[#164B8F]">
                    Testimonio destacado
                  </p>
                  <h2 className="mt-3 text-4xl font-black sm:text-5xl">
                    {featuredStory?.title}
                  </h2>
                  <p className="mt-3 text-lg font-black text-[#B1182D]">
                    {featuredStory ? getPublicName(featuredStory) : ""}
                  </p>
                  <p className="mt-5 whitespace-pre-wrap text-lg font-medium leading-8 text-[#52657D]">
                    {featuredStory?.caption}
                  </p>
                  <button
                    onClick={() => openStory(0)}
                    className="mt-8 rounded-full bg-[#071A33] px-8 py-4 text-lg font-black text-white hover:bg-[#164B8F]"
                  >
                    Ver historia
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white p-8 text-center shadow-sm">
              <p className="text-sm font-black uppercase tracking-[0.3em] text-[#164B8F]">
                Próximamente
              </p>
              <h2 className="mt-3 text-4xl font-black">
                Testimonios de la iglesia
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg font-medium leading-8 text-[#52657D]">
                Cuando el pastor apruebe testimonios, aparecerán aquí como
                historias de fe.
              </p>
            </div>
          )}
        </div>
      </section>

      <section id="compartir" className="bg-white px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-[#164B8F]">
              Comparte tu testimonio
            </p>
            <h2 className="mt-3 text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
              Tu historia puede animar a otra familia.
            </h2>
            <p className="mt-5 text-lg font-medium leading-8 text-[#52657D]">
              Graba un video vertical de 30 a 90 segundos contando lo que Dios
              ha hecho. El pastor revisará el video antes de publicarlo.
            </p>

            <div className="mt-8 bg-[#F5F8FC] p-5">
              <p className="font-black">Sugerencia para grabar:</p>
              <p className="mt-2 text-sm font-bold leading-7 text-[#52657D]">
                Di tu nombre, cuenta brevemente qué estaba pasando, cómo Dios
                obró y qué quieres decirle a alguien que está pasando por algo
                similar.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-5 bg-[#F5F8FC] p-5 sm:p-7">
            <FormInput name="full_name" label="Nombre completo" required />
            <div className="grid gap-5 md:grid-cols-2">
              <FormInput name="phone" label="Teléfono" type="tel" />
              <FormInput name="email" label="Correo electrónico" type="email" />
            </div>

            <FormInput
              name="title"
              label="Título del testimonio"
              placeholder="Ej. Dios restauró mi familia"
              required
            />

            <label className="block">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-[#164B8F]">
                Categoría
              </span>
              <select
                name="category"
                className="mt-2 w-full border-2 border-[#D9E5F5] bg-white px-4 py-4 font-bold outline-none focus:border-[#164B8F]"
              >
                {testimonyCategories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-[#164B8F]">
                Resumen escrito
              </span>
              <textarea
                name="caption"
                required
                placeholder="Escribe un resumen corto de tu testimonio..."
                className="mt-2 min-h-32 w-full border-2 border-[#D9E5F5] bg-white px-4 py-4 font-medium outline-none focus:border-[#164B8F]"
              />
            </label>

            <label className="block">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-[#164B8F]">
                Sube tu video
              </span>
              <input
                name="media"
                type="file"
                accept="video/mp4,video/quicktime,video/webm,image/jpeg,image/png,image/webp"
                required
                className="mt-2 w-full border-2 border-[#D9E5F5] bg-white px-4 py-4 font-bold outline-none focus:border-[#164B8F]"
              />
              <p className="mt-2 text-xs font-bold text-[#52657D]">
                Máximo {MAX_FILE_SIZE_MB} MB. Recomendado: video vertical de
                30–90 segundos.
              </p>
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.22em] text-[#164B8F]">
                  Nombre público
                </span>
                <select
                  name="display_name_preference"
                  className="mt-2 w-full border-2 border-[#D9E5F5] bg-white px-4 py-4 font-bold outline-none focus:border-[#164B8F]"
                >
                  <option value="first_name">Solo mi primer nombre</option>
                  <option value="full_name">Mi nombre completo</option>
                  <option value="anonymous">Anónimo</option>
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.22em] text-[#164B8F]">
                  Idioma
                </span>
                <select
                  name="language"
                  className="mt-2 w-full border-2 border-[#D9E5F5] bg-white px-4 py-4 font-bold outline-none focus:border-[#164B8F]"
                >
                  <option>Español</option>
                  <option>English</option>
                </select>
              </label>
            </div>

            <label className="flex items-start gap-3 text-sm font-bold leading-6 text-[#52657D]">
              <input name="has_minor" type="checkbox" className="mt-1 h-5 w-5" />
              Aparece un menor de edad en el video.
            </label>

            <label className="flex items-start gap-3 text-sm font-bold leading-6 text-[#52657D]">
              <input
                name="minor_permission"
                type="checkbox"
                className="mt-1 h-5 w-5"
              />
              Si aparece un menor, confirmo que tengo permiso del padre/tutor.
            </label>

            <label className="flex items-start gap-3 text-sm font-bold leading-6 text-[#52657D]">
              <input
                name="consent_to_share"
                type="checkbox"
                required
                className="mt-1 h-5 w-5"
              />
              Confirmo que este testimonio es mío y doy permiso a la iglesia
              para revisarlo y compartirlo públicamente si es aprobado.
            </label>

            {submitStatus ? (
              <p className="bg-white p-4 text-sm font-black text-[#164B8F]">
                {submitStatus}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#071A33] px-6 py-4 text-lg font-black text-white hover:bg-[#164B8F] disabled:opacity-60"
            >
              {isSubmitting ? "Enviando..." : "Enviar testimonio"}
            </button>
          </form>
        </div>
      </section>

      {activeIndex !== null && stories[activeIndex] ? (
        <StoryViewer
          stories={stories}
          activeIndex={activeIndex}
          onClose={closeStory}
          onNext={nextStory}
          onPrevious={previousStory}
        />
      ) : null}
    </main>
  );
}

function FormInput({
  name,
  label,
  type = "text",
  placeholder,
  required,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[0.22em] text-[#164B8F]">
        {label}
      </span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full border-2 border-[#D9E5F5] bg-white px-4 py-4 font-medium outline-none focus:border-[#164B8F]"
      />
    </label>
  );
}

function StoryViewer({
  stories,
  activeIndex,
  onClose,
  onNext,
  onPrevious,
}: {
  stories: FaithStory[];
  activeIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}) {
  const story = stories[activeIndex];

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white">
      <div className="absolute left-0 right-0 top-0 z-20 flex gap-1 p-3">
        {stories.map((item, index) => (
          <div
            key={item.id}
            className={`h-1 flex-1 rounded-full ${
              index <= activeIndex ? "bg-white" : "bg-white/25"
            }`}
          />
        ))}
      </div>

      <button
        onClick={onClose}
        className="absolute right-4 top-8 z-30 rounded-full bg-white/15 px-4 py-2 text-sm font-black backdrop-blur hover:bg-white/25"
      >
        Cerrar
      </button>

      <button
        onClick={onPrevious}
        className="absolute bottom-0 left-0 top-0 z-10 w-1/3"
        aria-label="Historia anterior"
      />

      <button
        onClick={onNext}
        className="absolute bottom-0 right-0 top-0 z-10 w-1/3"
        aria-label="Siguiente historia"
      />

      <div className="flex h-full items-center justify-center">
        <div className="relative h-full w-full max-w-[520px] overflow-hidden bg-[#071A33]">
          {story.media_url && story.media_type === "video" ? (
            <video
              key={story.id}
              src={story.media_url}
              className="h-full w-full object-cover"
              controls
              autoPlay
              playsInline
            />
          ) : story.media_url && story.media_type === "image" ? (
            <img
              src={story.media_url}
              alt={story.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-8 text-center">
              <p className="text-5xl font-black">Historias de Fe</p>
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/75 to-transparent p-6 pt-28">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#BBD7FF]">
              {story.category ?? "Testimonio"}
            </p>
            <h2 className="mt-2 text-3xl font-black">{story.title}</h2>
            <p className="mt-2 text-sm font-black text-[#BBD7FF]">
              {getPublicName(story)}
            </p>
            {story.caption ? (
              <p className="mt-3 text-base font-medium leading-7 text-white/85">
                {story.caption}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
