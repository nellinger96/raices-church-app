import {
  adminCourseProgress,
  adminStats,
  announcements,
  visitors,
} from "@/lib/demo-data";

const quickActions = [
  {
    title: "Agregar sermón",
    description: "Pega un enlace de YouTube y muéstralo en la página pública.",
    href: "#",
  },
  {
    title: "Crear anuncio",
    description: "Publica información importante para la congregación.",
    href: "#",
  },
  {
    title: "Agregar evento",
    description: "Crea reuniones, estudios bíblicos y eventos especiales.",
    href: "#",
  },
  {
    title: "Crear curso",
    description: "Usa una plantilla para construir un curso de discipulado.",
    href: "/admin/courses/new",
  },
];

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#F7F1E8] text-[#1F2933]">
      {/* Header */}
      <header className="border-b border-[#EFE3D1] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9A7B4F]">
              Pastor/Admin
            </p>
            <h1 className="text-xl font-bold">
              Panel de The Main Place Español
            </h1>
          </div>

          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <a href="/admin" className="text-[#2F5D50]">
              Dashboard
            </a>
            <a href="/cursos" className="hover:text-[#9A7B4F]">
              Cursos
            </a>
            <a href="/" className="hover:text-[#9A7B4F]">
              Página pública
            </a>
          </nav>

          <a
            href="/"
            className="rounded-full border border-[#2F5D50] px-5 py-2 text-sm font-semibold text-[#2F5D50] hover:bg-[#F7F1E8]"
          >
            Ver página pública
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12">
        {/* Hero */}
        <div className="rounded-[2rem] bg-[#2F5D50] p-8 text-white shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#E6C98B]">
            Dashboard pastoral
          </p>

          <h2 className="mt-3 text-4xl font-bold md:text-5xl">
            Bienvenido, Pastor
          </h2>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-white/80">
            Administra visitantes, peticiones de oración, cursos, sermones,
            eventos y anuncios desde un solo lugar.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              href="#acciones"
              className="rounded-full bg-white px-6 py-3 text-center font-semibold text-[#2F5D50]"
            >
              Crear contenido
            </a>

            <a
              href="#visitantes"
              className="rounded-full border border-white/40 px-6 py-3 text-center font-semibold text-white hover:bg-white/10"
            >
              Ver seguimiento
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {adminStats.map((stat) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              description={stat.description}
            />
          ))}
        </div>

        {/* Main Grid */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          {/* Left side */}
          <div className="space-y-8">
            {/* Visitors */}
            <section
              id="visitantes"
              className="rounded-[2rem] bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9A7B4F]">
                    Seguimiento
                  </p>
                  <h3 className="mt-3 text-3xl font-bold">
                    Visitantes y peticiones recientes
                  </h3>
                </div>

                <button className="rounded-full bg-[#2F5D50] px-5 py-2 text-sm font-semibold text-white hover:bg-[#254A40]">
                  Exportar lista
                </button>
              </div>

              <div className="mt-6 space-y-4">
                {visitors.map((visitor) => (
                  <VisitorCard key={visitor.name} visitor={visitor} />
                ))}
              </div>
            </section>

            {/* Course progress */}
            <section className="rounded-[2rem] bg-white p-6 shadow-sm">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9A7B4F]">
                    Cursos
                  </p>
                  <h3 className="mt-3 text-3xl font-bold">
                    Progreso de discipulado
                  </h3>
                </div>

                <a
                  href="/cursos"
                  className="rounded-full border border-[#2F5D50] px-5 py-2 text-sm font-semibold text-[#2F5D50] hover:bg-[#F7F1E8]"
                >
                  Ver cursos
                </a>
              </div>

              <div className="mt-6 space-y-4">
                {adminCourseProgress.map((course) => (
                  <CourseAdminCard key={course.title} course={course} />
                ))}
              </div>
            </section>
          </div>

          {/* Right side */}
          <aside className="space-y-8">
            {/* Quick actions */}
            <section
              id="acciones"
              className="rounded-[2rem] bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9A7B4F]">
                Acciones rápidas
              </p>

              <h3 className="mt-3 text-3xl font-bold">Administrar contenido</h3>

              <div className="mt-6 space-y-3">
                {quickActions.map((action) => (
                  <a
                    key={action.title}
                    href={action.href}
                    className="block rounded-2xl bg-[#F7F1E8] p-5 hover:bg-[#EFE3D1]"
                  >
                    <h4 className="font-bold">{action.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-[#4B5563]">
                      {action.description}
                    </p>
                  </a>
                ))}
              </div>
            </section>

            {/* Announcements */}
            <section className="rounded-[2rem] bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9A7B4F]">
                Anuncios activos
              </p>

              <h3 className="mt-3 text-3xl font-bold">Página pública</h3>

              <div className="mt-6 space-y-4">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.title}
                    className="rounded-2xl bg-[#F7F1E8] p-5"
                  >
                    <h4 className="font-bold">{announcement.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-[#4B5563]">
                      {announcement.description}
                    </p>
                  </div>
                ))}
              </div>

              <button className="mt-6 w-full rounded-full bg-[#2F5D50] px-5 py-3 text-sm font-semibold text-white hover:bg-[#254A40]">
                Crear nuevo anuncio
              </button>
            </section>

            {/* Reminder */}
            <section className="rounded-[2rem] bg-[#2F5D50] p-6 text-white shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#E6C98B]">
                Recordatorio
              </p>

              <h3 className="mt-3 text-2xl font-bold">
                El contenido pertenece a esta iglesia.
              </h3>

              <p className="mt-3 leading-7 text-white/80">
                Cuando agreguemos Supabase, cada sermón, evento, anuncio, curso
                y visitante se guardará con el ID de The Main Place para que no
                se mezcle con otras iglesias.
              </p>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}

function StatCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-[#9A7B4F]">{label}</p>
      <p className="mt-3 text-4xl font-bold">{value}</p>
      <p className="mt-2 text-sm leading-6 text-[#4B5563]">{description}</p>
    </div>
  );
}

function VisitorCard({
  visitor,
}: {
  visitor: {
    name: string;
    type: string;
    contact: string;
    note: string;
    status: string;
  };
}) {
  return (
    <div className="rounded-2xl border border-[#EFE3D1] p-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h4 className="text-lg font-bold">{visitor.name}</h4>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                visitor.status === "Pendiente"
                  ? "bg-[#F7F1E8] text-[#9A7B4F]"
                  : "bg-[#E6F2ED] text-[#2F5D50]"
              }`}
            >
              {visitor.status}
            </span>
          </div>

          <p className="mt-1 text-sm font-semibold text-[#2F5D50]">
            {visitor.type} · {visitor.contact}
          </p>

          <p className="mt-3 leading-7 text-[#4B5563]">{visitor.note}</p>
        </div>

        <button className="rounded-full bg-[#2F5D50] px-5 py-2 text-sm font-semibold text-white hover:bg-[#254A40]">
          Marcar contactado
        </button>
      </div>
    </div>
  );
}

function CourseAdminCard({
  course,
}: {
  course: {
    title: string;
    students: number;
    completion: number;
    status: string;
  };
}) {
  return (
    <div className="rounded-2xl border border-[#EFE3D1] p-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold text-[#9A7B4F]">
            {course.status}
          </p>
          <h4 className="mt-1 text-xl font-bold">{course.title}</h4>
          <p className="mt-2 text-sm text-[#4B5563]">
            {course.students} estudiantes inscritos
          </p>
        </div>

        <div className="w-full md:w-64">
          <div className="flex justify-between text-sm font-semibold">
            <span>Completado</span>
            <span>{course.completion}%</span>
          </div>

          <div className="mt-2 h-3 overflow-hidden rounded-full bg-[#EFE3D1]">
            <div
              className="h-full rounded-full bg-[#2F5D50]"
              style={{ width: `${course.completion}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}