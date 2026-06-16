"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Church = {
  id: string;
  name: string;
  display_name: string | null;
};

type FaithStory = {
  id: string;
  church_id: string;
  story_type: "pastor" | "testimony";
  status: "draft" | "pending" | "approved" | "rejected" | "expired";
  title: string;
  caption: string | null;
  category: string | null;
  language: string | null;
  verse_reference: string | null;
  verse_text: string | null;
  devotional_text: string | null;
  prayer_focus: string | null;
  submitter_name: string | null;
  submitter_phone: string | null;
  submitter_email: string | null;
  display_name_preference: string | null;
  has_minor: boolean | null;
  minor_permission: boolean | null;
  consent_to_share: boolean | null;
  media_url: string | null;
  media_path: string | null;
  media_type: "video" | "image" | "none";
  is_featured: boolean | null;
  expires_at: string | null;
  pastor_notes: string | null;
  created_at: string;
};

const MAX_FILE_SIZE_MB = 100;

function sanitizeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, "-")
    .replace(/-+/g, "-");
}

function getExpirationDate(value: string) {
  if (value === "none") return null;

  const now = new Date();

  if (value === "24h") now.setHours(now.getHours() + 24);
  if (value === "3d") now.setDate(now.getDate() + 3);
  if (value === "7d") now.setDate(now.getDate() + 7);
  if (value === "30d") now.setDate(now.getDate() + 30);

  return now.toISOString();
}

export default function AdminHistoriasPage() {
  const [church, setChurch] = useState<Church | null>(null);
  const [stories, setStories] = useState<FaithStory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pastorStories = useMemo(
    () => stories.filter((story) => story.story_type === "pastor"),
    [stories],
  );

  const pendingTestimonies = useMemo(
    () =>
      stories.filter(
        (story) => story.story_type === "testimony" && story.status === "pending",
      ),
    [stories],
  );

  const approvedTestimonies = useMemo(
    () =>
      stories.filter(
        (story) =>
          story.story_type === "testimony" && story.status === "approved",
      ),
    [stories],
  );

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setIsLoading(true);

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/todos-los-dias/login";
      return;
    }

    const { data: churchData, error: churchError } = await supabase
      .from("churches")
      .select("id, name, display_name")
      .eq("slug", "todos-los-dias")
      .single();

    if (churchError || !churchData) {
      setStatusMessage("No se encontró la iglesia.");
      setIsLoading(false);
      return;
    }

    const { data: admin } = await supabase
      .from("church_admins")
      .select("id")
      .eq("church_id", churchData.id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!admin) {
      window.location.href = "/todos-los-dias/login";
      return;
    }

    setChurch(churchData as Church);

    const { data: storyData, error: storyError } = await supabase
      .from("faith_stories")
      .select("*")
      .eq("church_id", churchData.id)
      .order("created_at", { ascending: false });

    if (storyError) {
      console.error(storyError);
      setStatusMessage("No se pudieron cargar las historias.");
      setIsLoading(false);
      return;
    }

    setStories((storyData as FaithStory[] | null) ?? []);
    setIsLoading(false);
  }

  async function uploadStoryMedia(file: File, pathPrefix: string) {
    const supabase = createClient();

    if (!file || file.size === 0) {
      return {
        mediaUrl: null,
        mediaPath: null,
        mediaType: "none" as const,
      };
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      throw new Error(`El archivo debe pesar menos de ${MAX_FILE_SIZE_MB} MB.`);
    }

    const mediaType = file.type.startsWith("image/") ? "image" : "video";
    const safeFileName = sanitizeFileName(file.name);
    const path = `${pathPrefix}/${Date.now()}-${crypto.randomUUID()}-${safeFileName}`;

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

    return {
      mediaUrl: publicUrlData.publicUrl,
      mediaPath: path,
      mediaType,
    };
  }

  async function createPastorStory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!church) return;

    const form = event.currentTarget;
    const formData = new FormData(form);

    const title = String(formData.get("title") || "").trim();
    const caption = String(formData.get("caption") || "").trim();
    const verseReference = String(formData.get("verse_reference") || "").trim();
    const verseText = String(formData.get("verse_text") || "").trim();
    const devotionalText = String(formData.get("devotional_text") || "").trim();
    const prayerFocus = String(formData.get("prayer_focus") || "").trim();
    const expiration = String(formData.get("expiration") || "24h");
    const isFeatured = formData.get("is_featured") === "on";
    const file = formData.get("media") as File | null;

    if (!title) {
      setStatusMessage("Agrega un título para la historia pastoral.");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage("");

    try {
      const supabase = createClient();
      const media = file
        ? await uploadStoryMedia(file, "todos-los-dias/pastor")
        : {
            mediaUrl: null,
            mediaPath: null,
            mediaType: "none" as const,
          };

      const { error } = await supabase.from("faith_stories").insert({
        church_id: church.id,
        story_type: "pastor",
        status: "approved",
        title,
        caption,
        verse_reference: verseReference,
        verse_text: verseText,
        devotional_text: devotionalText,
        prayer_focus: prayerFocus,
        media_url: media.mediaUrl,
        media_path: media.mediaPath,
        media_type: media.mediaType,
        is_featured: isFeatured,
        expires_at: getExpirationDate(expiration),
        approved_at: new Date().toISOString(),
      });

      if (error) throw error;

      form.reset();
      setStatusMessage("Historia pastoral publicada.");
      await loadDashboard();
    } catch (error) {
      console.error(error);
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Hubo un error al publicar la historia.",
      );
    }

    setIsSubmitting(false);
  }

  async function updateStoryStatus(story: FaithStory, status: FaithStory["status"]) {
    const supabase = createClient();

    setStatusMessage("");

    const { error } = await supabase
      .from("faith_stories")
      .update({
        status,
        approved_at: status === "approved" ? new Date().toISOString() : null,
      })
      .eq("id", story.id)
      .eq("church_id", story.church_id);

    if (error) {
      console.error(error);
      setStatusMessage("No se pudo actualizar la historia.");
      return;
    }

    setStatusMessage("Historia actualizada.");
    await loadDashboard();
  }

  async function deleteStory(story: FaithStory) {
    const supabase = createClient();

    setStatusMessage("");

    if (story.media_path) {
      await supabase.storage.from("story-media").remove([story.media_path]);
    }

    const { error } = await supabase
      .from("faith_stories")
      .delete()
      .eq("id", story.id)
      .eq("church_id", story.church_id);

    if (error) {
      console.error(error);
      setStatusMessage("No se pudo eliminar la historia.");
      return;
    }

    setStatusMessage("Historia eliminada.");
    await loadDashboard();
  }

  async function savePastorNotes(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const id = String(formData.get("id") || "");
    const notes = String(formData.get("pastor_notes") || "").trim();

    const supabase = createClient();

    const { error } = await supabase
      .from("faith_stories")
      .update({ pastor_notes: notes })
      .eq("id", id);

    if (error) {
      console.error(error);
      setStatusMessage("No se pudieron guardar las notas.");
      return;
    }

    setStatusMessage("Notas guardadas.");
    await loadDashboard();
  }

  return (
    <main className="min-h-screen bg-[#F5F8FC] text-[#071A33]">
      <header className="bg-[#071A33] px-4 py-8 text-white sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.35em] text-[#BBD7FF] sm:text-sm">
              Panel Pastoral Raíces
            </p>
            <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">
              Historias
            </h1>
            <p className="mt-3 text-sm font-bold text-white/65">
              {church?.display_name ?? church?.name ?? "Iglesia de Todos los Días"}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/todos-los-dias/admin"
              className="bg-white px-5 py-3 text-sm font-black text-[#071A33] hover:bg-[#BBD7FF]"
            >
              Volver al dashboard
            </a>
            <a
              href="/todos-los-dias/historias"
              className="border border-white/30 px-5 py-3 text-sm font-black text-white hover:bg-white/10"
            >
              Ver historias públicas
            </a>
          </div>
        </div>
      </header>

      <section className="px-4 py-8 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-3">
          <StatCard label="Historias pastorales" value={pastorStories.length} />
          <StatCard label="Testimonios pendientes" value={pendingTestimonies.length} />
          <StatCard label="Testimonios aprobados" value={approvedTestimonies.length} />
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-6">
          {statusMessage ? (
            <div className="bg-white p-4 text-sm font-black text-[#164B8F] shadow-sm">
              {statusMessage}
            </div>
          ) : null}

          {isLoading ? (
            <div className="bg-white p-8 text-center shadow-sm">
              <p className="text-lg font-black">Cargando...</p>
            </div>
          ) : (
            <>
              <Panel
                eyebrow="Hoy con Dios"
                title="Crear historia pastoral"
                description="Publica un video corto, versículo, devocional y enfoque de oración para la iglesia."
              >
                <form onSubmit={createPastorStory} className="grid gap-5">
                  <Input name="title" label="Título" required />
                  <Input name="verse_reference" label="Referencia bíblica" placeholder="Ej. Juan 15:5" />

                  <label className="block">
                    <span className="text-xs font-black uppercase tracking-[0.22em] text-[#164B8F]">
                      Texto bíblico
                    </span>
                    <textarea
                      name="verse_text"
                      className="mt-2 min-h-24 w-full border-2 border-[#D9E5F5] bg-white px-4 py-4 font-medium outline-none focus:border-[#164B8F]"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-black uppercase tracking-[0.22em] text-[#164B8F]">
                      Devocional corto
                    </span>
                    <textarea
                      name="devotional_text"
                      className="mt-2 min-h-28 w-full border-2 border-[#D9E5F5] bg-white px-4 py-4 font-medium outline-none focus:border-[#164B8F]"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-black uppercase tracking-[0.22em] text-[#164B8F]">
                      Enfoque de oración
                    </span>
                    <textarea
                      name="prayer_focus"
                      className="mt-2 min-h-24 w-full border-2 border-[#D9E5F5] bg-white px-4 py-4 font-medium outline-none focus:border-[#164B8F]"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-black uppercase tracking-[0.22em] text-[#164B8F]">
                      Caption / descripción breve
                    </span>
                    <textarea
                      name="caption"
                      className="mt-2 min-h-24 w-full border-2 border-[#D9E5F5] bg-white px-4 py-4 font-medium outline-none focus:border-[#164B8F]"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-black uppercase tracking-[0.22em] text-[#164B8F]">
                      Video o imagen
                    </span>
                    <input
                      name="media"
                      type="file"
                      accept="video/mp4,video/quicktime,video/webm,image/jpeg,image/png,image/webp"
                      className="mt-2 w-full border-2 border-[#D9E5F5] bg-white px-4 py-4 font-bold outline-none focus:border-[#164B8F]"
                    />
                    <p className="mt-2 text-xs font-bold text-[#52657D]">
                      Máximo {MAX_FILE_SIZE_MB} MB.
                    </p>
                  </label>

                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="block">
                      <span className="text-xs font-black uppercase tracking-[0.22em] text-[#164B8F]">
                        Expira en
                      </span>
                      <select
                        name="expiration"
                        defaultValue="24h"
                        className="mt-2 w-full border-2 border-[#D9E5F5] bg-white px-4 py-4 font-bold outline-none focus:border-[#164B8F]"
                      >
                        <option value="24h">24 horas</option>
                        <option value="3d">3 días</option>
                        <option value="7d">7 días</option>
                        <option value="30d">30 días</option>
                        <option value="none">No expira</option>
                      </select>
                    </label>

                    <label className="flex items-center gap-3 pt-8 text-sm font-black">
                      <input name="is_featured" type="checkbox" className="h-5 w-5" />
                      Destacar historia
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#071A33] px-6 py-4 text-lg font-black text-white hover:bg-[#164B8F] disabled:opacity-60"
                  >
                    {isSubmitting ? "Publicando..." : "Publicar historia"}
                  </button>
                </form>
              </Panel>

              <Panel
                eyebrow="Historias de Fe"
                title="Testimonios pendientes"
                description="Revisa videos enviados por miembros/visitantes antes de publicarlos."
              >
                {pendingTestimonies.length ? (
                  <div className="grid gap-4">
                    {pendingTestimonies.map((story) => (
                      <StoryReviewCard
                        key={story.id}
                        story={story}
                        onApprove={() => updateStoryStatus(story, "approved")}
                        onReject={() => updateStoryStatus(story, "rejected")}
                        onDelete={() => deleteStory(story)}
                        onSaveNotes={savePastorNotes}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState text="No hay testimonios pendientes." />
                )}
              </Panel>

              <Panel
                eyebrow="Historias públicas"
                title="Historias aprobadas"
                description="Testimonios ya visibles para la iglesia."
              >
                {approvedTestimonies.length ? (
                  <div className="grid gap-4">
                    {approvedTestimonies.map((story) => (
                      <StoryReviewCard
                        key={story.id}
                        story={story}
                        onApprove={() => updateStoryStatus(story, "approved")}
                        onReject={() => updateStoryStatus(story, "rejected")}
                        onDelete={() => deleteStory(story)}
                        onSaveNotes={savePastorNotes}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState text="No hay testimonios aprobados todavía." />
                )}
              </Panel>

              <Panel
                eyebrow="Hoy con Dios"
                title="Historias pastorales publicadas"
                description="Historias creadas por el pastor/admin para la sección Hoy con Dios."
              >
                {pastorStories.length ? (
                  <div className="grid gap-4">
                    {pastorStories.map((story) => (
                      <StoryReviewCard
                        key={story.id}
                        story={story}
                        onApprove={() => updateStoryStatus(story, "approved")}
                        onReject={() => updateStoryStatus(story, "rejected")}
                        onDelete={() => deleteStory(story)}
                        onSaveNotes={savePastorNotes}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState text="Todavía no hay historias pastorales." />
                )}
              </Panel>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-[#164B8F]">
        {label}
      </p>
      <p className="mt-3 text-5xl font-black">{value}</p>
    </div>
  );
}

function Panel({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-6">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-[#164B8F]">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-3xl font-black sm:text-4xl">{title}</h2>
        <p className="mt-3 max-w-3xl text-base font-medium leading-8 text-[#52657D]">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}

function Input({
  name,
  label,
  placeholder,
  required,
}: {
  name: string;
  label: string;
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
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full border-2 border-[#D9E5F5] bg-white px-4 py-4 font-medium outline-none focus:border-[#164B8F]"
      />
    </label>
  );
}

function StoryReviewCard({
  story,
  onApprove,
  onReject,
  onDelete,
  onSaveNotes,
}: {
  story: FaithStory;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
  onSaveNotes: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <article className="border border-[#D9E5F5] bg-[#F5F8FC] p-4 sm:p-5">
      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <div className="overflow-hidden bg-[#071A33]">
          {story.media_url && story.media_type === "video" ? (
            <video
              src={story.media_url}
              controls
              className="aspect-[9/16] w-full object-cover"
            />
          ) : story.media_url && story.media_type === "image" ? (
            <img
              src={story.media_url}
              alt={story.title}
              className="aspect-[9/16] w-full object-cover"
            />
          ) : (
            <div className="flex aspect-[9/16] items-center justify-center p-6 text-center text-white">
              <p className="text-3xl font-black">Sin video</p>
            </div>
          )}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-3xl font-black">{story.title}</h3>
            <StatusBadge status={story.status} />
          </div>

          <div className="mt-4 grid gap-2 text-sm font-bold text-[#52657D] md:grid-cols-2">
            <p>Tipo: {story.story_type === "pastor" ? "Pastoral" : "Testimonio"}</p>
            <p>Categoría: {story.category || "—"}</p>
            <p>Nombre: {story.submitter_name || "—"}</p>
            <p>Teléfono: {story.submitter_phone || "—"}</p>
            <p>Correo: {story.submitter_email || "—"}</p>
            <p>Idioma: {story.language || "—"}</p>
            <p>Menor en video: {story.has_minor ? "Sí" : "No"}</p>
            <p>Permiso menor: {story.minor_permission ? "Sí" : "No"}</p>
          </div>

          {story.verse_reference || story.verse_text ? (
            <div className="mt-4 bg-white p-4">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#164B8F]">
                Versículo
              </p>
              <p className="mt-2 font-black">{story.verse_reference}</p>
              <p className="mt-2 whitespace-pre-wrap text-sm font-medium leading-6 text-[#52657D]">
                {story.verse_text}
              </p>
            </div>
          ) : null}

          <div className="mt-4 bg-white p-4">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#164B8F]">
              Descripción
            </p>
            <p className="mt-2 whitespace-pre-wrap text-base font-medium leading-7 text-[#52657D]">
              {story.caption || story.devotional_text || "Sin descripción."}
            </p>
          </div>

          {story.prayer_focus ? (
            <div className="mt-4 bg-white p-4">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#164B8F]">
                Enfoque de oración
              </p>
              <p className="mt-2 whitespace-pre-wrap text-base font-medium leading-7 text-[#52657D]">
                {story.prayer_focus}
              </p>
            </div>
          ) : null}

          <form onSubmit={onSaveNotes} className="mt-4 bg-white p-4">
            <input type="hidden" name="id" value={story.id} />
            <label className="text-xs font-black uppercase tracking-[0.22em] text-[#52657D]">
              Notas pastorales
            </label>
            <textarea
              name="pastor_notes"
              defaultValue={story.pastor_notes ?? ""}
              className="mt-2 min-h-24 w-full border-2 border-[#D9E5F5] bg-white px-3 py-3 font-medium outline-none focus:border-[#164B8F]"
            />
            <button
              type="submit"
              className="mt-3 bg-[#071A33] px-4 py-3 text-sm font-black text-white hover:bg-[#164B8F]"
            >
              Guardar notas
            </button>
          </form>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={onApprove}
              className="bg-[#16834A] px-5 py-3 text-sm font-black text-white hover:bg-[#0F6A3A]"
            >
              Aprobar
            </button>

            <button
              onClick={onReject}
              className="bg-[#8A5A00] px-5 py-3 text-sm font-black text-white hover:bg-[#6A4500]"
            >
              Rechazar/Ocultar
            </button>

            <details className="bg-white">
              <summary className="cursor-pointer px-5 py-3 text-sm font-black text-[#B1182D] hover:bg-[#FFF1F3]">
                Eliminar
              </summary>
              <div className="border border-[#FFE0E6] p-4">
                <p className="text-sm font-bold text-[#52657D]">
                  Esto elimina la historia y el archivo de video/imagen.
                </p>
                <button
                  onClick={onDelete}
                  className="mt-3 bg-[#B1182D] px-5 py-3 text-sm font-black text-white hover:bg-[#8F1324]"
                >
                  Sí, eliminar
                </button>
              </div>
            </details>
          </div>
        </div>
      </div>
    </article>
  );
}

function StatusBadge({ status }: { status: string }) {
  const className =
    status === "pending"
      ? "bg-[#FFF4D7] text-[#8A5A00]"
      : status === "approved"
        ? "bg-[#E6F7ED] text-[#16834A]"
        : status === "rejected"
          ? "bg-[#FFE0E6] text-[#B1182D]"
          : "bg-[#F3F4F6] text-[#52657D]";

  const label =
    status === "pending"
      ? "Pendiente"
      : status === "approved"
        ? "Aprobada"
        : status === "rejected"
          ? "Rechazada"
          : status;

  return (
    <span className={`px-3 py-1 text-xs font-black uppercase ${className}`}>
      {label}
    </span>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="border border-dashed border-[#BBD7FF] bg-[#F5F8FC] p-8 text-center">
      <p className="text-lg font-bold text-[#52657D]">{text}</p>
    </div>
  );
}
