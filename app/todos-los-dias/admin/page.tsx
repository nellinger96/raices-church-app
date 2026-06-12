import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const CHURCH_SLUG = "todos-los-dias";
const ADMIN_PATH = "/todos-los-dias/admin";
const LOGIN_PATH = "/todos-los-dias/login";

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
  const announcements = announcementsResult.data ?? [];
  const events = eventsResult.data ?? [];

  const pendingVisitors = visitors.filter((item) => item.status === "Pendiente");
  const pendingPrayers = prayers.filter((item) => item.status === "Pendiente");
  const pendingVolunteers = volunteers.filter(
    (item) => item.status === "Pendiente",
  );

  return (
    <main className="min-h-screen bg-[#F5F8FC] text-[#071A33]">
      <header className="bg-[#071A33] px-6 py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-[#BBD7FF]">
              Raíces Pastor Dashboard
            </p>
            <h1 className="mt-3 text-5xl font-black leading-tight">
              {church.display_name ?? church.name}
            </h1>
            <p className="mt-3 text-sm font-bold text-white/65">
              Logged in as {admin.full_name ?? user.email} · Role: {admin.role}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/todos-los-dias"
              className="bg-white px-5 py-3 text-sm font-black text-[#071A33] hover:bg-[#BBD7FF]"
            >
              View Public Page
            </a>

            <form action={signOut}>
              <button
                type="submit"
                className="border border-white/30 px-5 py-3 text-sm font-black text-white hover:bg-white/10"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      <section className="px-6 py-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          <DashboardStat
            label="New Visitors"
            value={visitors.length}
            subtext={`${pendingVisitors.length} pending`}
          />

          <DashboardStat
            label="Prayer Requests"
            value={prayers.length}
            subtext={`${pendingPrayers.length} pending`}
          />

          <DashboardStat
            label="Volunteers"
            value={volunteers.length}
            subtext={`${pendingVolunteers.length} pending`}
          />
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto grid max-w-7xl gap-8">
          <DashboardPanel
            id="visitors"
            eyebrow="Soy Nuevo"
            title="New Visitor Forms"
            description="People who filled out the Soy Nuevo form on the public church page."
          >
            {visitors.length ? (
              <div className="grid gap-4">
                {visitors.map((submission) => (
                  <SubmissionCard
                    key={submission.id}
                    type="visitor"
                    item={submission}
                    updateAction={updateVisitorStatus}
                    messageLabel="Message"
                    messageValue={submission.message}
                  />
                ))}
              </div>
            ) : (
              <EmptyState text="No visitor forms yet." />
            )}
          </DashboardPanel>

          <DashboardPanel
            id="prayer"
            eyebrow="Pedir Oración"
            title="Prayer Requests"
            description="Private prayer requests submitted from the church page."
          >
            {prayers.length ? (
              <div className="grid gap-4">
                {prayers.map((request) => (
                  <SubmissionCard
                    key={request.id}
                    type="prayer"
                    item={request}
                    updateAction={updatePrayerStatus}
                    messageLabel="Prayer Request"
                    messageValue={request.prayer_request}
                  />
                ))}
              </div>
            ) : (
              <EmptyState text="No prayer requests yet." />
            )}
          </DashboardPanel>

          <DashboardPanel
            id="volunteers"
            eyebrow="Servir"
            title="Volunteer Signups"
            description="People who want to help serve in the church."
          >
            {volunteers.length ? (
              <div className="grid gap-4">
                {volunteers.map((volunteer) => (
                  <SubmissionCard
                    key={volunteer.id}
                    type="volunteer"
                    item={volunteer}
                    updateAction={updateVolunteerStatus}
                    messageLabel={`Area: ${volunteer.area ?? "Not selected"}`}
                    messageValue={volunteer.message}
                  />
                ))}
              </div>
            ) : (
              <EmptyState text="No volunteer signups yet." />
            )}
          </DashboardPanel>

          <DashboardPanel
            id="announcements"
            eyebrow="Public Page"
            title="Announcements"
            description="Create and update announcements. Published items appear on the public church page after we connect the homepage reader."
          >
            <CreateAnnouncementForm />

            <div className="mt-6 grid gap-4">
              {announcements.length ? (
                announcements.map((announcement) => (
                  <AnnouncementEditor
                    key={announcement.id}
                    announcement={announcement}
                  />
                ))
              ) : (
                <EmptyState text="No announcements yet." />
              )}
            </div>
          </DashboardPanel>

          <DashboardPanel
            id="events"
            eyebrow="Church Calendar"
            title="Events"
            description="Create and update events for this church."
          >
            <CreateEventForm />

            <div className="mt-6 grid gap-4">
              {events.length ? (
                events.map((event) => (
                  <EventEditor key={event.id} event={event} />
                ))
              ) : (
                <EmptyState text="No events yet." />
              )}
            </div>
          </DashboardPanel>
        </div>
      </section>
    </main>
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
    <div className="bg-white p-6 shadow-sm">
      <p className="text-sm font-black uppercase tracking-[0.25em] text-[#164B8F]">
        {label}
      </p>
      <p className="mt-3 text-5xl font-black">{value}</p>
      <p className="mt-2 text-sm font-bold text-[#52657D]">{subtext}</p>
    </div>
  );
}

function DashboardPanel({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="bg-white p-6 shadow-sm md:p-8">
      <div className="mb-6">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-[#164B8F]">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-4xl font-black">{title}</h2>
        <p className="mt-3 max-w-3xl text-lg font-medium leading-8 text-[#52657D]">
          {description}
        </p>
      </div>

      {children}
    </section>
  );
}

function SubmissionCard({
  item,
  updateAction,
  messageLabel,
  messageValue,
}: {
  type: "visitor" | "prayer" | "volunteer";
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
  messageLabel: string;
  messageValue: string | null;
}) {
  return (
    <article className="border border-[#D9E5F5] bg-[#F5F8FC] p-5">
      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-2xl font-black">{item.full_name}</h3>
            <StatusBadge status={item.status} />
          </div>

          <div className="mt-3 grid gap-2 text-sm font-bold text-[#52657D] md:grid-cols-2">
            <p>Phone: {item.phone || "—"}</p>
            <p>Email: {item.email || "—"}</p>
            <p className="md:col-span-2">
              Submitted: {new Date(item.created_at).toLocaleString()}
            </p>
          </div>

          <div className="mt-4 border-l-4 border-[#164B8F] bg-white p-4">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#164B8F]">
              {messageLabel}
            </p>
            <p className="mt-2 whitespace-pre-wrap text-base font-medium leading-7 text-[#071A33]">
              {messageValue || "No message provided."}
            </p>
          </div>
        </div>

        <form action={updateAction} className="bg-white p-4">
          <input type="hidden" name="id" value={item.id} />

          <label className="text-xs font-black uppercase tracking-[0.22em] text-[#52657D]">
            Status
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
            Pastor Notes
          </label>
          <textarea
            name="notes"
            defaultValue={item.notes ?? ""}
            placeholder="Add private follow-up notes..."
            className="mt-2 min-h-24 w-full border-2 border-[#D9E5F5] bg-white px-3 py-3 font-medium outline-none focus:border-[#164B8F]"
          />

          <button
            type="submit"
            className="mt-4 w-full bg-[#071A33] px-4 py-3 text-sm font-black text-white hover:bg-[#164B8F]"
          >
            Save
          </button>
        </form>
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
        : "bg-[#E6F7ED] text-[#16834A]";

  return (
    <span className={`px-3 py-1 text-xs font-black uppercase ${className}`}>
      {status}
    </span>
  );
}

function CreateAnnouncementForm() {
  return (
    <form action={createAnnouncement} className="grid gap-4 bg-[#F5F8FC] p-5">
      <h3 className="text-2xl font-black">Create Announcement</h3>

      <AdminInput name="title" label="Title" required />
      <AdminInput name="category" label="Category" />
      <AdminTextarea name="description" label="Description" />
      <AdminInput name="date_text" label="Date Text" />
      <AdminInput name="time_text" label="Time Text" />
      <AdminInput name="location" label="Location" />
      <AdminInput
        name="flyer_url"
        label="Flyer URL"
        placeholder="/todos-los-dias/example.png"
      />
      <AdminInput name="sort_order" label="Sort Order" defaultValue="0" />

      <label className="flex items-center gap-3 text-sm font-black">
        <input
          type="checkbox"
          name="is_published"
          defaultChecked
          className="h-5 w-5"
        />
        Published
      </label>

      <button
        type="submit"
        className="bg-[#071A33] px-5 py-3 text-sm font-black text-white hover:bg-[#164B8F]"
      >
        Create Announcement
      </button>
    </form>
  );
}

function AnnouncementEditor({ announcement }: { announcement: any }) {
  return (
    <article className="border border-[#D9E5F5] bg-[#F5F8FC] p-5">
      <form action={updateAnnouncement} className="grid gap-4">
        <input type="hidden" name="id" value={announcement.id} />

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h3 className="text-2xl font-black">
            {announcement.title || "Untitled Announcement"}
          </h3>
          <StatusBadge
            status={announcement.is_published ? "Published" : "Draft"}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <AdminInput
            name="title"
            label="Title"
            defaultValue={announcement.title}
            required
          />
          <AdminInput
            name="category"
            label="Category"
            defaultValue={announcement.category}
          />
          <AdminInput
            name="date_text"
            label="Date Text"
            defaultValue={announcement.date_text}
          />
          <AdminInput
            name="time_text"
            label="Time Text"
            defaultValue={announcement.time_text}
          />
          <AdminInput
            name="location"
            label="Location"
            defaultValue={announcement.location}
          />
          <AdminInput
            name="flyer_url"
            label="Flyer URL"
            defaultValue={announcement.flyer_url}
          />
          <AdminInput
            name="sort_order"
            label="Sort Order"
            defaultValue={String(announcement.sort_order ?? 0)}
          />
        </div>

        <AdminTextarea
          name="description"
          label="Description"
          defaultValue={announcement.description}
        />

        <label className="flex items-center gap-3 text-sm font-black">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={announcement.is_published}
            className="h-5 w-5"
          />
          Published
        </label>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="bg-[#071A33] px-5 py-3 text-sm font-black text-white hover:bg-[#164B8F]"
          >
            Save Announcement
          </button>
        </div>
      </form>
    </article>
  );
}

function CreateEventForm() {
  return (
    <form action={createEvent} className="grid gap-4 bg-[#F5F8FC] p-5">
      <h3 className="text-2xl font-black">Create Event</h3>

      <AdminInput name="title" label="Title" required />
      <AdminTextarea name="description" label="Description" />
      <AdminInput name="date_text" label="Date Text" />
      <AdminInput name="time_text" label="Time Text" />
      <AdminInput name="location" label="Location" />
      <AdminInput
        name="flyer_url"
        label="Flyer URL"
        placeholder="/todos-los-dias/example.png"
      />
      <AdminInput name="sort_order" label="Sort Order" defaultValue="0" />

      <label className="flex items-center gap-3 text-sm font-black">
        <input
          type="checkbox"
          name="is_published"
          defaultChecked
          className="h-5 w-5"
        />
        Published
      </label>

      <button
        type="submit"
        className="bg-[#071A33] px-5 py-3 text-sm font-black text-white hover:bg-[#164B8F]"
      >
        Create Event
      </button>
    </form>
  );
}

function EventEditor({ event }: { event: any }) {
  return (
    <article className="border border-[#D9E5F5] bg-[#F5F8FC] p-5">
      <form action={updateEvent} className="grid gap-4">
        <input type="hidden" name="id" value={event.id} />

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h3 className="text-2xl font-black">
            {event.title || "Untitled Event"}
          </h3>
          <StatusBadge status={event.is_published ? "Published" : "Draft"} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <AdminInput
            name="title"
            label="Title"
            defaultValue={event.title}
            required
          />
          <AdminInput
            name="date_text"
            label="Date Text"
            defaultValue={event.date_text}
          />
          <AdminInput
            name="time_text"
            label="Time Text"
            defaultValue={event.time_text}
          />
          <AdminInput
            name="location"
            label="Location"
            defaultValue={event.location}
          />
          <AdminInput
            name="flyer_url"
            label="Flyer URL"
            defaultValue={event.flyer_url}
          />
          <AdminInput
            name="sort_order"
            label="Sort Order"
            defaultValue={String(event.sort_order ?? 0)}
          />
        </div>

        <AdminTextarea
          name="description"
          label="Description"
          defaultValue={event.description}
        />

        <label className="flex items-center gap-3 text-sm font-black">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={event.is_published}
            className="h-5 w-5"
          />
          Published
        </label>

        <button
          type="submit"
          className="bg-[#071A33] px-5 py-3 text-sm font-black text-white hover:bg-[#164B8F]"
        >
          Save Event
        </button>
      </form>
    </article>
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
  revalidatePath("/todos-los-dias");
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
  revalidatePath("/todos-los-dias");
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
  revalidatePath("/todos-los-dias");
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
  revalidatePath("/todos-los-dias");
}

async function signOut() {
  "use server";

  const supabase = await createClient();
  await supabase.auth.signOut();

  redirect(LOGIN_PATH);
}
