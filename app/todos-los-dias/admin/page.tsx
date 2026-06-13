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

  return (
    <main className="min-h-screen bg-[#F5F8FC] text-[#071A33]">
      <header className="bg-[#071A33] px-4 py-8 text-white sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.35em] text-[#BBD7FF] sm:text-sm">
              Panel Pastoral Raíces
            </p>
            <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">
              {church.display_name ?? church.name}
            </h1>
            <p className="mt-3 text-sm font-bold text-white/65">
              Sesión iniciada como {admin.full_name ?? user.email} · Rol:{" "}
              {admin.role}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={PUBLIC_PATH}
              className="bg-white px-5 py-3 text-sm font-black text-[#071A33] hover:bg-[#BBD7FF]"
            >
              Ver página pública
            </a>

            <form action={signOut}>
              <button
                type="submit"
                className="border border-white/30 px-5 py-3 text-sm font-black text-white hover:bg-white/10"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </header>

      <section className="px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold leading-7 text-[#52657D]">
            Usa este panel para revisar formularios, dar seguimiento, cambiar
            estados, agregar notas y eliminar registros que ya no necesites.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <AdminNavLink href="#soy-nuevo" label="Soy Nuevo" />
            <AdminNavLink href="#oracion" label="Oración" />
            <AdminNavLink href="#servir" label="Servir" />
            <AdminNavLink href="#ministerios" label="Ministerios" />
            <AdminNavLink href="#anuncios" label="Anuncios" />
            <AdminNavLink href="#eventos" label="Eventos" />
          </div>
        </div>
      </section>

      <section className="px-4 pb-8 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardStat
            label="Visitantes nuevos"
            value={visitors.length}
            subtext={`${pendingVisitors.length} pendientes`}
          />

          <DashboardStat
            label="Peticiones de oración"
            value={prayers.length}
            subtext={`${pendingPrayers.length} pendientes`}
          />

          <DashboardStat
            label="Voluntarios"
            value={volunteers.length}
            subtext={`${pendingVolunteers.length} pendientes`}
          />

          <DashboardStat
            label="Intereses ministeriales"
            value={ministryInterests.length}
            subtext={`${pendingMinistryInterests.length} pendientes`}
          />
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-4">
          <AccordionPanel
            id="soy-nuevo"
            eyebrow="Soy Nuevo"
            title="Formularios de visitantes"
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
          </AccordionPanel>

          <AccordionPanel
            id="oracion"
            eyebrow="Pedir Oración"
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
          </AccordionPanel>

          <AccordionPanel
            id="servir"
            eyebrow="Servir"
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
          </AccordionPanel>

          <AccordionPanel
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
          </AccordionPanel>

          <AccordionPanel
            id="anuncios"
            eyebrow="Página pública"
            title="Anuncios"
            count={announcements.length}
            pendingCount={announcements.filter((item) => item.is_published).length}
            pendingLabel="publicados"
            description="Crea y actualiza anuncios. Los publicados pueden aparecer en la página pública."
          >
            <details className="mb-4 border border-[#D9E5F5] bg-[#F5F8FC]">
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
          </AccordionPanel>

          <AccordionPanel
            id="eventos"
            eyebrow="Calendario"
            title="Eventos"
            count={events.length}
            pendingCount={events.filter((item) => item.is_published).length}
            pendingLabel="publicados"
            description="Crea y actualiza eventos para la iglesia."
          >
            <details className="mb-4 border border-[#D9E5F5] bg-[#F5F8FC]">
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
          </AccordionPanel>
        </div>
      </section>
    </main>
  );
}

function AdminNavLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#071A33] shadow-sm hover:bg-[#BBD7FF]"
    >
      {label}
    </a>
  );
}

function DashboardStat({
  label,
  value,
  subtext,
}: {
  label: string;
  value: number;
  subtext: string;
}) {
  return (
    <div className="bg-white p-5 shadow-sm sm:p-6">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-[#164B8F] sm:text-sm">
        {label}
      </p>
      <p className="mt-3 text-4xl font-black sm:text-5xl">{value}</p>
      <p className="mt-2 text-sm font-bold text-[#52657D]">{subtext}</p>
    </div>
  );
}

function AccordionPanel({
  id,
  eyebrow,
  title,
  count,
  pendingCount,
  pendingLabel = "pendientes",
  description,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  count: number;
  pendingCount: number;
  pendingLabel?: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <details id={id} className="scroll-mt-6 bg-white shadow-sm">
      <summary className="cursor-pointer list-none p-5 hover:bg-[#EEF5FF] sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#164B8F] sm:text-sm">
              {eyebrow}
            </p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">{title}</h2>
            <p className="mt-2 max-w-3xl text-sm font-medium leading-7 text-[#52657D] sm:text-base">
              {description}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="bg-[#F5F8FC] px-4 py-3 text-center">
              <p className="text-3xl font-black">{count}</p>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#52657D]">
                total
              </p>
            </div>

            <div className="bg-[#FFF4D7] px-4 py-3 text-center text-[#8A5A00]">
              <p className="text-3xl font-black">{pendingCount}</p>
              <p className="text-xs font-black uppercase tracking-[0.18em]">
                {pendingLabel}
              </p>
            </div>

            <div className="hidden bg-[#071A33] px-4 py-3 text-sm font-black text-white sm:block">
              Abrir
            </div>
          </div>
        </div>
      </summary>

      <div className="border-t border-[#D9E5F5] p-5 sm:p-6">{children}</div>
    </details>
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
    <article className="border border-[#D9E5F5] bg-[#F5F8FC] p-4 sm:p-5">
      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-2xl font-black">{item.full_name}</h3>
            <StatusBadge status={item.status} />
          </div>

          <div className="mt-3 grid gap-2 text-sm font-bold text-[#52657D] md:grid-cols-2">
            <p>Teléfono: {item.phone || "—"}</p>
            <p>Correo: {item.email || "—"}</p>
            {sourceLabel ? (
              <p className="md:col-span-2">
                {sourceLabel}: {sourceValue || "—"}
              </p>
            ) : null}
            <p className="md:col-span-2">
              Enviado: {new Date(item.created_at).toLocaleString()}
            </p>
          </div>

          <div className="mt-4 border-l-4 border-[#164B8F] bg-white p-4">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#164B8F]">
              {messageLabel}
            </p>
            <p className="mt-2 whitespace-pre-wrap text-base font-medium leading-7 text-[#071A33]">
              {messageValue || "Sin mensaje."}
            </p>
          </div>
        </div>

        <div className="grid gap-3">
          <form action={updateAction} className="bg-white p-4">
            <input type="hidden" name="id" value={item.id} />

            <label className="text-xs font-black uppercase tracking-[0.22em] text-[#52657D]">
              Estado
            </label>
            <select
              name="status"
              defaultValue={item.status}
              className="mt-2 w-full border-2 border-[#D9E5F5] bg-white px-3 py-3 font-bold outline-none focus:border-[#164B8F]"
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
              className="mt-2 min-h-24 w-full border-2 border-[#D9E5F5] bg-white px-3 py-3 font-medium outline-none focus:border-[#164B8F]"
            />

            <button
              type="submit"
              className="mt-4 w-full bg-[#071A33] px-4 py-3 text-sm font-black text-white hover:bg-[#164B8F]"
            >
              Guardar
            </button>
          </form>

          <details className="bg-white">
            <summary className="cursor-pointer px-4 py-3 text-sm font-black text-[#B1182D] hover:bg-[#FFF1F3]">
              Eliminar este registro
            </summary>

            <form action={deleteAction} className="border-t border-[#FFE0E6] p-4">
              <input type="hidden" name="id" value={item.id} />

              <p className="text-sm font-bold leading-6 text-[#52657D]">
                Esta acción elimina el registro del dashboard. Úsalo solo si ya
                no necesitas esta solicitud.
              </p>

              <button
                type="submit"
                className="mt-3 w-full bg-[#B1182D] px-4 py-3 text-sm font-black text-white hover:bg-[#8F1324]"
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
    <span className={`px-3 py-1 text-xs font-black uppercase ${className}`}>
      {status}
    </span>
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
          <AdminInput
            name="flyer_url"
            label="URL del volante"
            defaultValue={announcement.flyer_url}
          />
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

function EmptyState({ text }: { text: string }) {
  return (
    <div className="border border-dashed border-[#BBD7FF] bg-[#F5F8FC] p-8 text-center">
      <p className="text-lg font-bold text-[#52657D]">{text}</p>
    </div>
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

  await supabase.from("announcements").insert({
    church_id: church.id,
    title: getString(formData, "title"),
    category: getOptionalString(formData, "category"),
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

async function updateAnnouncement(formData: FormData) {
  "use server";

  const { supabase, church } = await getChurchAndRequireAdmin();

  await supabase
    .from("announcements")
    .update({
      title: getString(formData, "title"),
      category: getOptionalString(formData, "category"),
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
