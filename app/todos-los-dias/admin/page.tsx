import type { ReactNode } from "react";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const CHURCH_SLUG = "todos-los-dias";
const ADMIN_PATH = "/todos-los-dias/admin";
const LOGIN_PATH = "/todos-los-dias/login";
const PUBLIC_PATH = "/todos-los-dias";

type Church = {
  id: string;
  slug: string;
  name: string;
  display_name: string | null;
};

type AdminProfile = {
  id: string;
  role: string;
  full_name: string | null;
  email: string | null;
};

type StatusValue = "Pendiente" | "Contactado" | "Cerrado";

const validStatuses: StatusValue[] = ["Pendiente", "Contactado", "Cerrado"];

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getOptionalString(formData: FormData, key: string) {
  const value = getString(formData, key);
  return value.length ? value : null;
}

function getStatus(formData: FormData) {
  const status = getString(formData, "status") as StatusValue;
  return validStatuses.includes(status) ? status : "Pendiente";
}

function getSortOrder(formData: FormData) {
  const rawValue = getString(formData, "sort_order");
  const parsed = Number.parseInt(rawValue, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function sanitizeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, "-")
    .replace(/-+/g, "-");
}

async function uploadAnnouncementFlyer(
  formData: FormData,
  supabase: Awaited<ReturnType<typeof createClient>>,
) {
  const existingUrl = getOptionalString(formData, "flyer_url");
  const file = formData.get("flyer_file");

  if (!(file instanceof File) || file.size === 0) {
    return existingUrl;
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("El volante debe ser una imagen.");
  }

  const maxFileSize = 10 * 1024 * 1024;

  if (file.size > maxFileSize) {
    throw new Error("La imagen debe pesar menos de 10 MB.");
  }

  const safeFileName = sanitizeFileName(file.name || "announcement.png");
  const path = `${CHURCH_SLUG}/announcements/${Date.now()}-${crypto.randomUUID()}-${safeFileName}`;

  const { error: uploadError } = await supabase.storage
    .from("story-media")
    .upload(path, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from("story-media").getPublicUrl(path);

  return data.publicUrl;
}

async function getChurchAndRequireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(LOGIN_PATH);
  }

  const { data: church, error: churchError } = await supabase
    .from("churches")
    .select("id, slug, name, display_name")
    .eq("slug", CHURCH_SLUG)
    .single<Church>();

  if (churchError || !church) {
    throw new Error("Church not found. Check the churches table in Supabase.");
  }

  const { data: admin } = await supabase
    .from("church_admins")
    .select("id, role, full_name, email")
    .eq("church_id", church.id)
    .eq("user_id", user.id)
    .maybeSingle<AdminProfile>();

  if (!admin) {
    redirect(LOGIN_PATH);
  }

  return {
    supabase,
    church,
    admin,
    user,
  };
}


export default async function TodosLosDiasAdminPage() {
  const { supabase, church, admin, user } = await getChurchAndRequireAdmin();

  const [
    visitorsResult,
    prayerResult,
    volunteersResult,
    ministryInterestsResult,
    announcementsResult,
    eventsResult,
  ] = await Promise.all([
    supabase
      .from("visitor_submissions")
      .select("*")
      .eq("church_id", church.id)
      .order("created_at", { ascending: false }),

    supabase
      .from("prayer_requests")
      .select("*")
      .eq("church_id", church.id)
      .order("created_at", { ascending: false }),

    supabase
      .from("volunteer_signups")
      .select("*")
      .eq("church_id", church.id)
      .order("created_at", { ascending: false }),

    supabase
      .from("ministry_interest_submissions")
      .select("*, ministries(name, slug)")
      .eq("church_id", church.id)
      .order("created_at", { ascending: false }),

    supabase
      .from("announcements")
      .select("*")
      .eq("church_id", church.id)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),

    supabase
      .from("events")
      .select("*")
      .eq("church_id", church.id)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),
  ]);

  const visitors = visitorsResult.data ?? [];
  const prayers = prayerResult.data ?? [];
  const volunteers = volunteersResult.data ?? [];
  const ministryInterests = ministryInterestsResult.data ?? [];
  const announcements = announcementsResult.data ?? [];
  const events = eventsResult.data ?? [];

  const pendingVisitors = visitors.filter((item) => item.status === "Pendiente");
  const pendingPrayers = prayers.filter((item) => item.status === "Pendiente");
  const pendingVolunteers = volunteers.filter(
    (item) => item.status === "Pendiente",
  );
  const pendingMinistryInterests = ministryInterests.filter(
    (item) => item.status === "Pendiente",
  );

  const totalRequests =
    visitors.length + prayers.length + volunteers.length + ministryInterests.length;
  const totalPending =
    pendingVisitors.length +
    pendingPrayers.length +
    pendingVolunteers.length +
    pendingMinistryInterests.length;

  return (
    <main className="min-h-screen bg-[#EEF3F9] text-[#071A33]">
      <section className="relative overflow-hidden bg-[#071A33] px-4 py-8 text-white sm:px-6">
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full bg-[radial-gradient(circle_at_18%_20%,rgba(187,215,255,0.65),transparent_26%),radial-gradient(circle_at_90%_15%,rgba(177,24,45,0.35),transparent_28%),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:auto,auto,70px_70px,70px_70px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.35em] text-[#BBD7FF] sm:text-sm">
                Panel Pastoral Raíces
              </p>
              <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
                {church.display_name ?? church.name}
              </h1>
              <p className="mt-4 text-sm font-bold text-white/65">
                Sesión iniciada como {admin.full_name ?? user.email} · Rol:{" "}
                {admin.role}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={PUBLIC_PATH}
                className="rounded-full bg-white px-6 py-3 text-center text-sm font-black text-[#071A33] shadow-lg hover:bg-[#BBD7FF]"
              >
                Ver página pública
              </a>

              <form action={signOut}>
                <button
                  type="submit"
                  className="w-full rounded-full border border-white/25 px-6 py-3 text-sm font-black text-white hover:bg-white/10"
                >
                  Cerrar sesión
                </button>
              </form>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <HeroMetric
              label="Solicitudes totales"
              value={totalRequests}
              subtext="Formularios recibidos"
            />
            <HeroMetric
              label="Pendientes"
              value={totalPending}
              subtext="Requieren seguimiento"
              urgent={totalPending > 0}
            />
            <a
              href="/todos-los-dias/admin/historias"
              className="group rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur transition hover:bg-white/15"
            >
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#BBD7FF]">
                Historias
              </p>
              <p className="mt-2 text-3xl font-black">Hoy + Testimonios</p>
              <p className="mt-2 text-sm font-bold leading-6 text-white/65">
                Administra devocionales y testimonios en video.
              </p>
            </a>
          </div>
        </div>
      </section>

      <section className="px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex gap-3 overflow-x-auto pb-2">
            <PillLink href="#seguimiento" label="Seguimiento" />
            <PillLink href="/todos-los-dias/admin/historias" label="Historias" />
            <PillLink href="#contenido" label="Contenido" />
            <PillLink href="#soy-nuevo" label="Visitantes" />
            <PillLink href="#oracion" label="Oración" />
            <PillLink href="#ministerios" label="Ministerios" />
          </div>
        </div>
      </section>

      <section id="seguimiento" className="px-4 pb-8 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[2rem] bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.28em] text-[#164B8F]">
                  Centro de seguimiento
                </p>
                <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                  Lo que necesita atención
                </h2>
                <p className="mt-2 max-w-2xl text-sm font-bold leading-7 text-[#52657D]">
                  Revisa nuevas personas, peticiones, voluntarios e intereses de
                  ministerios sin que el panel se sienta pesado.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <WorkflowCard
                href="#soy-nuevo"
                label="Soy Nuevo"
                title="Visitantes nuevos"
                value={visitors.length}
                pending={pendingVisitors.length}
                description="Personas que quieren conectarse con la iglesia."
              />
              <WorkflowCard
                href="#oracion"
                label="Oración"
                title="Peticiones"
                value={prayers.length}
                pending={pendingPrayers.length}
                description="Solicitudes privadas de oración para seguimiento."
              />
              <WorkflowCard
                href="#servir"
                label="Servir"
                title="Voluntarios"
                value={volunteers.length}
                pending={pendingVolunteers.length}
                description="Personas interesadas en ayudar y servir."
              />
              <WorkflowCard
                href="#ministerios"
                label="Ministerios"
                title="Intereses"
                value={ministryInterests.length}
                pending={pendingMinistryInterests.length}
                description="Personas conectando con ministerios específicos."
              />
            </div>
          </div>

          <aside className="grid gap-4">
            <a
              href="/todos-los-dias/admin/historias"
              className="rounded-[2rem] bg-[#071A33] p-6 text-white shadow-sm hover:bg-[#164B8F]"
            >
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#BBD7FF]">
                Historias de Fe
              </p>
              <h3 className="mt-3 text-3xl font-black">Gestionar historias</h3>
              <p className="mt-3 text-sm font-bold leading-7 text-white/70">
                Publica Hoy con Dios, revisa testimonios y aprueba videos.
              </p>
            </a>

            <div className="rounded-[2rem] bg-white p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#164B8F]">
                Accesos rápidos
              </p>
              <div className="mt-4 grid gap-3">
                <QuickLink href="#anuncios" label="Administrar anuncios" />
                <QuickLink href="#eventos" label="Administrar eventos" />
                <QuickLink href="/todos-los-dias/hoy" label="Ver Hoy con Dios" />
                <QuickLink
                  href="/todos-los-dias/historias"
                  label="Ver Historias de Fe"
                />
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-5">
          <DashboardSection
            id="soy-nuevo"
            eyebrow="Seguimiento"
            title="Visitantes nuevos"
            count={visitors.length}
            pendingCount={pendingVisitors.length}
            description="Personas que llenaron el formulario Soy Nuevo en la página pública."
          >
            {visitors.length ? (
              <div className="grid gap-4">
                {visitors.map((submission) => (
                  <SubmissionCard
                    key={submission.id}
                    item={submission}
                    updateAction={updateVisitorStatus}
                    deleteAction={deleteVisitorSubmission}
                    messageLabel="Mensaje"
                    messageValue={submission.message}
                  />
                ))}
              </div>
            ) : (
              <EmptyState text="Todavía no hay formularios de visitantes." />
            )}
          </DashboardSection>

          <DashboardSection
            id="oracion"
            eyebrow="Cuidado pastoral"
            title="Peticiones de oración"
            count={prayers.length}
            pendingCount={pendingPrayers.length}
            description="Peticiones privadas enviadas desde la página pública."
          >
            {prayers.length ? (
              <div className="grid gap-4">
                {prayers.map((request) => (
                  <SubmissionCard
                    key={request.id}
                    item={request}
                    updateAction={updatePrayerStatus}
                    deleteAction={deletePrayerRequest}
                    messageLabel="Petición de oración"
                    messageValue={request.prayer_request}
                  />
                ))}
              </div>
            ) : (
              <EmptyState text="Todavía no hay peticiones de oración." />
            )}
          </DashboardSection>

          <DashboardSection
            id="servir"
            eyebrow="Equipo"
            title="Personas interesadas en servir"
            count={volunteers.length}
            pendingCount={pendingVolunteers.length}
            description="Personas que desean apoyar en algún área de la iglesia."
          >
            {volunteers.length ? (
              <div className="grid gap-4">
                {volunteers.map((volunteer) => (
                  <SubmissionCard
                    key={volunteer.id}
                    item={volunteer}
                    updateAction={updateVolunteerStatus}
                    deleteAction={deleteVolunteerSignup}
                    sourceLabel="Área"
                    sourceValue={volunteer.area ?? "No seleccionada"}
                    messageLabel="Mensaje"
                    messageValue={volunteer.message}
                  />
                ))}
              </div>
            ) : (
              <EmptyState text="Todavía no hay voluntarios registrados." />
            )}
          </DashboardSection>

          <DashboardSection
            id="ministerios"
            eyebrow="Ministerios"
            title="Intereses de ministerios"
            count={ministryInterests.length}
            pendingCount={pendingMinistryInterests.length}
            description="Formularios enviados desde las páginas de ministerios. Pastor Socrates puede dar seguimiento desde aquí."
          >
            {ministryInterests.length ? (
              <div className="grid gap-4">
                {ministryInterests.map((interest) => (
                  <SubmissionCard
                    key={interest.id}
                    item={interest}
                    updateAction={updateMinistryInterestStatus}
                    deleteAction={deleteMinistryInterest}
                    sourceLabel="Ministerio"
                    sourceValue={interest.ministries?.name ?? "Ministerio general"}
                    messageLabel="Mensaje de interés"
                    messageValue={interest.message}
                  />
                ))}
              </div>
            ) : (
              <EmptyState text="Todavía no hay formularios de ministerios." />
            )}
          </DashboardSection>

          <div id="contenido" className="grid gap-5 lg:grid-cols-2">
            <DashboardSection
              id="anuncios"
              eyebrow="Página pública"
              title="Anuncios"
              count={announcements.length}
              pendingCount={announcements.filter((item) => item.is_published).length}
              pendingLabel="publicados"
              description="Crea y actualiza anuncios para la página pública."
              compact
            >
              <details className="mb-4 overflow-hidden rounded-2xl border border-[#D9E5F5] bg-[#F5F8FC]">
                <summary className="cursor-pointer px-5 py-4 text-lg font-black">
                  + Crear nuevo anuncio
                </summary>
                <div className="border-t border-[#D9E5F5] p-5">
                  <CreateAnnouncementForm />
                </div>
              </details>

              <div className="grid gap-3">
                {announcements.length ? (
                  announcements.map((announcement) => (
                    <AnnouncementEditor
                      key={announcement.id}
                      announcement={announcement}
                    />
                  ))
                ) : (
                  <EmptyState text="Todavía no hay anuncios." />
                )}
              </div>
            </DashboardSection>

            <DashboardSection
              id="eventos"
              eyebrow="Calendario"
              title="Eventos"
              count={events.length}
              pendingCount={events.filter((item) => item.is_published).length}
              pendingLabel="publicados"
              description="Crea y actualiza eventos para la iglesia."
              compact
            >
              <details className="mb-4 overflow-hidden rounded-2xl border border-[#D9E5F5] bg-[#F5F8FC]">
                <summary className="cursor-pointer px-5 py-4 text-lg font-black">
                  + Crear nuevo evento
                </summary>
                <div className="border-t border-[#D9E5F5] p-5">
                  <CreateEventForm />
                </div>
              </details>

              <div className="grid gap-3">
                {events.length ? (
                  events.map((event) => <EventEditor key={event.id} event={event} />)
                ) : (
                  <EmptyState text="Todavía no hay eventos." />
                )}
              </div>
            </DashboardSection>
          </div>
        </div>
      </section>
    </main>
  );
}

function HeroMetric({
  label,
  value,
  subtext,
  urgent,
}: {
  label: string;
  value: number;
  subtext: string;
  urgent?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-[#BBD7FF]">
        {label}
      </p>
      <div className="mt-2 flex items-end gap-3">
        <p className="text-5xl font-black">{value}</p>
        {urgent ? (
          <span className="mb-2 rounded-full bg-[#FFF4D7] px-3 py-1 text-xs font-black uppercase text-[#8A5A00]">
            Revisar
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-sm font-bold text-white/65">{subtext}</p>
    </div>
  );
}

function PillLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="shrink-0 rounded-full bg-white px-5 py-3 text-sm font-black text-[#071A33] shadow-sm hover:bg-[#BBD7FF]"
    >
      {label}
    </a>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="flex items-center justify-between rounded-2xl bg-[#F5F8FC] px-4 py-3 text-sm font-black text-[#071A33] hover:bg-[#BBD7FF]"
    >
      {label}
      <span>→</span>
    </a>
  );
}

function WorkflowCard({
  href,
  label,
  title,
  value,
  pending,
  description,
}: {
  href: string;
  label: string;
  title: string;
  value: number;
  pending: number;
  description: string;
}) {
  return (
    <a
      href={href}
      className="group rounded-3xl border border-[#D9E5F5] bg-[#F8FBFF] p-5 transition hover:-translate-y-0.5 hover:border-[#BBD7FF] hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#164B8F]">
            {label}
          </p>
          <h3 className="mt-2 text-2xl font-black">{title}</h3>
        </div>
        <div className="rounded-2xl bg-white px-4 py-3 text-center shadow-sm">
          <p className="text-3xl font-black">{value}</p>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#52657D]">
            total
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm font-bold leading-7 text-[#52657D]">
        {description}
      </p>

      <div className="mt-5 flex items-center justify-between">
        <span
          className={`rounded-full px-3 py-1 text-xs font-black uppercase ${
            pending > 0
              ? "bg-[#FFF4D7] text-[#8A5A00]"
              : "bg-[#E6F7ED] text-[#16834A]"
          }`}
        >
          {pending} pendientes
        </span>
        <span className="text-sm font-black text-[#164B8F] group-hover:translate-x-1">
          Abrir →
        </span>
      </div>
    </a>
  );
}

function DashboardSection({
  id,
  eyebrow,
  title,
  count,
  pendingCount,
  pendingLabel = "pendientes",
  description,
  compact,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  count: number;
  pendingCount: number;
  pendingLabel?: string;
  description: string;
  compact?: boolean;
  children: ReactNode;
}) {
  return (
    <details
      id={id}
      className="scroll-mt-6 overflow-hidden rounded-[2rem] bg-white shadow-sm"
    >
      <summary className="cursor-pointer list-none p-5 hover:bg-[#F8FBFF] sm:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#164B8F]">
              {eyebrow}
            </p>
            <h2
              className={`mt-2 font-black leading-tight ${
                compact ? "text-3xl" : "text-3xl sm:text-4xl"
              }`}
            >
              {title}
            </h2>
            <p className="mt-2 max-w-3xl text-sm font-bold leading-7 text-[#52657D]">
              {description}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <MiniMetric label="Total" value={count} />
            <MiniMetric label={pendingLabel} value={pendingCount} alert />
            <div className="hidden rounded-full bg-[#071A33] px-5 py-3 text-sm font-black text-white sm:block">
              Abrir
            </div>
          </div>
        </div>
      </summary>

      <div className="border-t border-[#D9E5F5] bg-[#FBFDFF] p-5 sm:p-6">
        {children}
      </div>
    </details>
  );
}

function MiniMetric({
  label,
  value,
  alert,
}: {
  label: string;
  value: number;
  alert?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl px-4 py-3 text-center ${
        alert ? "bg-[#FFF4D7] text-[#8A5A00]" : "bg-[#F5F8FC] text-[#071A33]"
      }`}
    >
      <p className="text-3xl font-black">{value}</p>
      <p className="text-[10px] font-black uppercase tracking-[0.18em]">
        {label}
      </p>
    </div>
  );
}

function SubmissionCard({
  item,
  updateAction,
  deleteAction,
  sourceLabel,
  sourceValue,
  messageLabel,
  messageValue,
}: {
  item: {
    id: string;
    full_name: string;
    phone: string | null;
    email: string | null;
    status: string;
    notes: string | null;
    created_at: string;
  };
  updateAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
  sourceLabel?: string;
  sourceValue?: string | null;
  messageLabel: string;
  messageValue: string | null;
}) {
  return (
    <article className="overflow-hidden rounded-3xl border border-[#D9E5F5] bg-white shadow-sm">
      <div className="grid gap-0 lg:grid-cols-[1fr_330px]">
        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-2xl font-black">{item.full_name}</h3>
            <StatusBadge status={item.status} />
          </div>

          <div className="mt-4 grid gap-3 text-sm font-bold text-[#52657D] md:grid-cols-2">
            <InfoLine label="Teléfono" value={item.phone || "—"} />
            <InfoLine label="Correo" value={item.email || "—"} />
            {sourceLabel ? (
              <InfoLine
                label={sourceLabel}
                value={sourceValue || "—"}
                wide
              />
            ) : null}
            <InfoLine
              label="Enviado"
              value={new Date(item.created_at).toLocaleString()}
              wide
            />
          </div>

          <div className="mt-5 rounded-2xl border border-[#D9E5F5] bg-[#F8FBFF] p-4">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#164B8F]">
              {messageLabel}
            </p>
            <p className="mt-2 whitespace-pre-wrap text-base font-medium leading-7 text-[#071A33]">
              {messageValue || "Sin mensaje."}
            </p>
          </div>
        </div>

        <div className="border-t border-[#D9E5F5] bg-[#F8FBFF] p-5 lg:border-l lg:border-t-0">
          <form action={updateAction}>
            <input type="hidden" name="id" value={item.id} />

            <label className="text-xs font-black uppercase tracking-[0.22em] text-[#52657D]">
              Estado
            </label>
            <select
              name="status"
              defaultValue={item.status}
              className="mt-2 w-full rounded-2xl border-2 border-[#D9E5F5] bg-white px-4 py-3 font-bold outline-none focus:border-[#164B8F]"
            >
              {validStatuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>

            <label className="mt-4 block text-xs font-black uppercase tracking-[0.22em] text-[#52657D]">
              Notas pastorales
            </label>
            <textarea
              name="notes"
              defaultValue={item.notes ?? ""}
              placeholder="Agregar notas privadas de seguimiento..."
              className="mt-2 min-h-24 w-full rounded-2xl border-2 border-[#D9E5F5] bg-white px-4 py-3 font-medium outline-none focus:border-[#164B8F]"
            />

            <button
              type="submit"
              className="mt-4 w-full rounded-full bg-[#071A33] px-4 py-3 text-sm font-black text-white hover:bg-[#164B8F]"
            >
              Guardar cambios
            </button>
          </form>

          <details className="mt-3 overflow-hidden rounded-2xl bg-white">
            <summary className="cursor-pointer px-4 py-3 text-sm font-black text-[#B1182D] hover:bg-[#FFF1F3]">
              Eliminar registro
            </summary>

            <form action={deleteAction} className="border-t border-[#FFE0E6] p-4">
              <input type="hidden" name="id" value={item.id} />

              <p className="text-sm font-bold leading-6 text-[#52657D]">
                Esto elimina el registro del dashboard. Úsalo solo si ya no lo
                necesitas.
              </p>

              <button
                type="submit"
                className="mt-3 w-full rounded-full bg-[#B1182D] px-4 py-3 text-sm font-black text-white hover:bg-[#8F1324]"
              >
                Sí, eliminar
              </button>
            </form>
          </details>
        </div>
      </div>
    </article>
  );
}

function InfoLine({
  label,
  value,
  wide,
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <p className={wide ? "md:col-span-2" : ""}>
      <span className="text-[#071A33]">{label}:</span> {value}
    </p>
  );
}

function StatusBadge({ status }: { status: string }) {
  const className =
    status === "Pendiente"
      ? "bg-[#FFF4D7] text-[#8A5A00]"
      : status === "Contactado"
        ? "bg-[#E5F0FF] text-[#164B8F]"
        : status === "Cerrado"
          ? "bg-[#E6F7ED] text-[#16834A]"
          : status === "Publicado"
            ? "bg-[#E6F7ED] text-[#16834A]"
            : "bg-[#F3F4F6] text-[#52657D]";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black uppercase ${className}`}>
      {status}
    </span>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-[#BBD7FF] bg-white p-8 text-center">
      <p className="text-lg font-bold text-[#52657D]">{text}</p>
    </div>
  );
}

function CreateAnnouncementForm() {
  return (
    <form action={createAnnouncement} className="grid gap-4">
      <h3 className="text-2xl font-black">Crear anuncio</h3>

      <AdminInput name="title" label="Título" required />
      <AdminInput name="category" label="Categoría" />
      <AdminTextarea name="description" label="Descripción" />
      <div className="grid gap-4 md:grid-cols-2">
        <AdminInput name="date_text" label="Fecha" />
        <AdminInput name="time_text" label="Hora" />
      </div>
      <AdminInput name="location" label="Lugar" />
      <AdminFileInput
        name="flyer_file"
        label="Subir volante desde el teléfono"
      />
      <AdminInput name="sort_order" label="Orden" defaultValue="0" />

      <label className="flex items-center gap-3 text-sm font-black">
        <input
          type="checkbox"
          name="is_published"
          defaultChecked
          className="h-5 w-5"
        />
        Publicado
      </label>

      <button
        type="submit"
        className="bg-[#071A33] px-5 py-3 text-sm font-black text-white hover:bg-[#164B8F]"
      >
        Crear anuncio
      </button>
    </form>
  );
}

function AnnouncementEditor({ announcement }: { announcement: any }) {
  return (
    <details className="border border-[#D9E5F5] bg-[#F5F8FC]">
      <summary className="cursor-pointer list-none p-5 hover:bg-[#EEF5FF]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h3 className="text-2xl font-black">
            {announcement.title || "Anuncio sin título"}
          </h3>
          <StatusBadge
            status={announcement.is_published ? "Publicado" : "Borrador"}
          />
        </div>
      </summary>

      <form action={updateAnnouncement} className="grid gap-4 border-t border-[#D9E5F5] p-5">
        <input type="hidden" name="id" value={announcement.id} />

        <div className="grid gap-4 md:grid-cols-2">
          <AdminInput
            name="title"
            label="Título"
            defaultValue={announcement.title}
            required
          />
          <AdminInput
            name="category"
            label="Categoría"
            defaultValue={announcement.category}
          />
          <AdminInput
            name="date_text"
            label="Fecha"
            defaultValue={announcement.date_text}
          />
          <AdminInput
            name="time_text"
            label="Hora"
            defaultValue={announcement.time_text}
          />
          <AdminInput
            name="location"
            label="Lugar"
            defaultValue={announcement.location}
          />
          <input
            type="hidden"
            name="flyer_url"
            value={announcement.flyer_url ?? ""}
          />

          <div className="md:col-span-2">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.25em] text-[#52657D]">
              Volante actual
            </p>

            {announcement.flyer_url ? (
              <img
                src={announcement.flyer_url}
                alt={announcement.title || "Volante del anuncio"}
                className="mb-4 max-h-64 w-full rounded-2xl border border-[#D9E5F5] bg-white object-contain p-2"
              />
            ) : (
              <p className="mb-4 rounded-2xl bg-white p-4 text-sm font-bold text-[#52657D]">
                Este anuncio todavía no tiene volante.
              </p>
            )}

            <AdminFileInput
              name="flyer_file"
              label="Subir nuevo volante desde el teléfono"
            />
          </div>
          <AdminInput
            name="sort_order"
            label="Orden"
            defaultValue={String(announcement.sort_order ?? 0)}
          />
        </div>

        <AdminTextarea
          name="description"
          label="Descripción"
          defaultValue={announcement.description}
        />

        <label className="flex items-center gap-3 text-sm font-black">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={announcement.is_published}
            className="h-5 w-5"
          />
          Publicado
        </label>

        <button
          type="submit"
          className="bg-[#071A33] px-5 py-3 text-sm font-black text-white hover:bg-[#164B8F]"
        >
          Guardar anuncio
        </button>
      </form>

      <details className="mx-5 mb-5 overflow-hidden rounded-2xl bg-white">
        <summary className="cursor-pointer px-4 py-3 text-sm font-black text-[#B1182D] hover:bg-[#FFF1F3]">
          Eliminar anuncio
        </summary>

        <form action={deleteAnnouncement} className="border-t border-[#FFE0E6] p-4">
          <input type="hidden" name="id" value={announcement.id} />

          <p className="text-sm font-bold leading-6 text-[#52657D]">
            Esto elimina el anuncio del dashboard y de la página pública.
          </p>

          <button
            type="submit"
            className="mt-3 rounded-full bg-[#B1182D] px-5 py-3 text-sm font-black text-white hover:bg-[#8F1324]"
          >
            Sí, eliminar anuncio
          </button>
        </form>
      </details>
    </details>
  );
}

function CreateEventForm() {
  return (
    <form action={createEvent} className="grid gap-4">
      <h3 className="text-2xl font-black">Crear evento</h3>

      <AdminInput name="title" label="Título" required />
      <AdminTextarea name="description" label="Descripción" />
      <div className="grid gap-4 md:grid-cols-2">
        <AdminInput name="date_text" label="Fecha" />
        <AdminInput name="time_text" label="Hora" />
      </div>
      <AdminInput name="location" label="Lugar" />
      <AdminInput
        name="flyer_url"
        label="URL del volante"
        placeholder="/todos-los-dias/example.png"
      />
      <AdminInput name="sort_order" label="Orden" defaultValue="0" />

      <label className="flex items-center gap-3 text-sm font-black">
        <input
          type="checkbox"
          name="is_published"
          defaultChecked
          className="h-5 w-5"
        />
        Publicado
      </label>

      <button
        type="submit"
        className="bg-[#071A33] px-5 py-3 text-sm font-black text-white hover:bg-[#164B8F]"
      >
        Crear evento
      </button>
    </form>
  );
}

function EventEditor({ event }: { event: any }) {
  return (
    <details className="border border-[#D9E5F5] bg-[#F5F8FC]">
      <summary className="cursor-pointer list-none p-5 hover:bg-[#EEF5FF]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h3 className="text-2xl font-black">
            {event.title || "Evento sin título"}
          </h3>
          <StatusBadge status={event.is_published ? "Publicado" : "Borrador"} />
        </div>
      </summary>

      <form action={updateEvent} className="grid gap-4 border-t border-[#D9E5F5] p-5">
        <input type="hidden" name="id" value={event.id} />

        <div className="grid gap-4 md:grid-cols-2">
          <AdminInput
            name="title"
            label="Título"
            defaultValue={event.title}
            required
          />
          <AdminInput
            name="date_text"
            label="Fecha"
            defaultValue={event.date_text}
          />
          <AdminInput
            name="time_text"
            label="Hora"
            defaultValue={event.time_text}
          />
          <AdminInput
            name="location"
            label="Lugar"
            defaultValue={event.location}
          />
          <AdminInput
            name="flyer_url"
            label="URL del volante"
            defaultValue={event.flyer_url}
          />
          <AdminInput
            name="sort_order"
            label="Orden"
            defaultValue={String(event.sort_order ?? 0)}
          />
        </div>

        <AdminTextarea
          name="description"
          label="Descripción"
          defaultValue={event.description}
        />

        <label className="flex items-center gap-3 text-sm font-black">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={event.is_published}
            className="h-5 w-5"
          />
          Publicado
        </label>

        <button
          type="submit"
          className="bg-[#071A33] px-5 py-3 text-sm font-black text-white hover:bg-[#164B8F]"
        >
          Guardar evento
        </button>
      </form>
    </details>
  );
}

function AdminInput({
  name,
  label,
  defaultValue,
  placeholder,
  required,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[0.22em] text-[#52657D]">
        {label}
      </span>
      <input
        name={name}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full border-2 border-[#D9E5F5] bg-white px-3 py-3 font-medium outline-none focus:border-[#164B8F]"
      />
    </label>
  );
}

function AdminFileInput({
  name,
  label,
}: {
  name: string;
  label: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.25em] text-[#52657D]">
        {label}
      </span>
      <input
        type="file"
        name={name}
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="w-full border-2 border-[#D9E5F5] bg-white px-4 py-4 text-base font-black outline-none focus:border-[#164B8F]"
      />
      <span className="mt-2 block text-xs font-bold text-[#52657D]">
        Formatos permitidos: JPG, PNG, WEBP o GIF. Máximo 10 MB.
      </span>
    </label>
  );
}

function AdminTextarea({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[0.22em] text-[#52657D]">
        {label}
      </span>
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        className="mt-2 min-h-28 w-full border-2 border-[#D9E5F5] bg-white px-3 py-3 font-medium outline-none focus:border-[#164B8F]"
      />
    </label>
  );
}

async function updateVisitorStatus(formData: FormData) {
  "use server";

  const { supabase, church } = await getChurchAndRequireAdmin();

  await supabase
    .from("visitor_submissions")
    .update({
      status: getStatus(formData),
      notes: getOptionalString(formData, "notes"),
    })
    .eq("id", getString(formData, "id"))
    .eq("church_id", church.id);

  revalidatePath(ADMIN_PATH);
}

async function deleteVisitorSubmission(formData: FormData) {
  "use server";

  const { supabase, church } = await getChurchAndRequireAdmin();

  await supabase
    .from("visitor_submissions")
    .delete()
    .eq("id", getString(formData, "id"))
    .eq("church_id", church.id);

  revalidatePath(ADMIN_PATH);
}

async function updatePrayerStatus(formData: FormData) {
  "use server";

  const { supabase, church } = await getChurchAndRequireAdmin();

  await supabase
    .from("prayer_requests")
    .update({
      status: getStatus(formData),
      notes: getOptionalString(formData, "notes"),
    })
    .eq("id", getString(formData, "id"))
    .eq("church_id", church.id);

  revalidatePath(ADMIN_PATH);
}

async function deletePrayerRequest(formData: FormData) {
  "use server";

  const { supabase, church } = await getChurchAndRequireAdmin();

  await supabase
    .from("prayer_requests")
    .delete()
    .eq("id", getString(formData, "id"))
    .eq("church_id", church.id);

  revalidatePath(ADMIN_PATH);
}

async function updateVolunteerStatus(formData: FormData) {
  "use server";

  const { supabase, church } = await getChurchAndRequireAdmin();

  await supabase
    .from("volunteer_signups")
    .update({
      status: getStatus(formData),
      notes: getOptionalString(formData, "notes"),
    })
    .eq("id", getString(formData, "id"))
    .eq("church_id", church.id);

  revalidatePath(ADMIN_PATH);
}

async function deleteVolunteerSignup(formData: FormData) {
  "use server";

  const { supabase, church } = await getChurchAndRequireAdmin();

  await supabase
    .from("volunteer_signups")
    .delete()
    .eq("id", getString(formData, "id"))
    .eq("church_id", church.id);

  revalidatePath(ADMIN_PATH);
}

async function updateMinistryInterestStatus(formData: FormData) {
  "use server";

  const { supabase, church } = await getChurchAndRequireAdmin();

  await supabase
    .from("ministry_interest_submissions")
    .update({
      status: getStatus(formData),
      notes: getOptionalString(formData, "notes"),
    })
    .eq("id", getString(formData, "id"))
    .eq("church_id", church.id);

  revalidatePath(ADMIN_PATH);
}

async function deleteMinistryInterest(formData: FormData) {
  "use server";

  const { supabase, church } = await getChurchAndRequireAdmin();

  await supabase
    .from("ministry_interest_submissions")
    .delete()
    .eq("id", getString(formData, "id"))
    .eq("church_id", church.id);

  revalidatePath(ADMIN_PATH);
}

async function createAnnouncement(formData: FormData) {
  "use server";

  const { supabase, church } = await getChurchAndRequireAdmin();
  const flyerUrl = await uploadAnnouncementFlyer(formData, supabase);

  await supabase.from("announcements").insert({
    church_id: church.id,
    title: getString(formData, "title"),
    category: getOptionalString(formData, "category"),
    description: getOptionalString(formData, "description"),
    date_text: getOptionalString(formData, "date_text"),
    time_text: getOptionalString(formData, "time_text"),
    location: getOptionalString(formData, "location"),
    flyer_url: flyerUrl,
    sort_order: getSortOrder(formData),
    is_published: formData.get("is_published") === "on",
  });

  revalidatePath(ADMIN_PATH);
  revalidatePath(PUBLIC_PATH);
}

async function updateAnnouncement(formData: FormData) {
  "use server";

  const { supabase, church } = await getChurchAndRequireAdmin();
  const flyerUrl = await uploadAnnouncementFlyer(formData, supabase);

  await supabase
    .from("announcements")
    .update({
      title: getString(formData, "title"),
      category: getOptionalString(formData, "category"),
      description: getOptionalString(formData, "description"),
      date_text: getOptionalString(formData, "date_text"),
      time_text: getOptionalString(formData, "time_text"),
      location: getOptionalString(formData, "location"),
      flyer_url: flyerUrl,
      sort_order: getSortOrder(formData),
      is_published: formData.get("is_published") === "on",
    })
    .eq("id", getString(formData, "id"))
    .eq("church_id", church.id);

  revalidatePath(ADMIN_PATH);
  revalidatePath(PUBLIC_PATH);
}

async function deleteAnnouncement(formData: FormData) {
  "use server";

  const { supabase, church } = await getChurchAndRequireAdmin();

  await supabase
    .from("announcements")
    .delete()
    .eq("id", getString(formData, "id"))
    .eq("church_id", church.id);

  revalidatePath(ADMIN_PATH);
  revalidatePath(PUBLIC_PATH);
}

async function createEvent(formData: FormData) {
  "use server";

  const { supabase, church } = await getChurchAndRequireAdmin();

  await supabase.from("events").insert({
    church_id: church.id,
    title: getString(formData, "title"),
    description: getOptionalString(formData, "description"),
    date_text: getOptionalString(formData, "date_text"),
    time_text: getOptionalString(formData, "time_text"),
    location: getOptionalString(formData, "location"),
    flyer_url: getOptionalString(formData, "flyer_url"),
    sort_order: getSortOrder(formData),
    is_published: formData.get("is_published") === "on",
  });

  revalidatePath(ADMIN_PATH);
  revalidatePath(PUBLIC_PATH);
}

async function updateEvent(formData: FormData) {
  "use server";

  const { supabase, church } = await getChurchAndRequireAdmin();

  await supabase
    .from("events")
    .update({
      title: getString(formData, "title"),
      description: getOptionalString(formData, "description"),
      date_text: getOptionalString(formData, "date_text"),
      time_text: getOptionalString(formData, "time_text"),
      location: getOptionalString(formData, "location"),
      flyer_url: getOptionalString(formData, "flyer_url"),
      sort_order: getSortOrder(formData),
      is_published: formData.get("is_published") === "on",
    })
    .eq("id", getString(formData, "id"))
    .eq("church_id", church.id);

  revalidatePath(ADMIN_PATH);
  revalidatePath(PUBLIC_PATH);
}

async function signOut() {
  "use server";

  const supabase = await createClient();
  await supabase.auth.signOut();

  redirect(LOGIN_PATH);
}
