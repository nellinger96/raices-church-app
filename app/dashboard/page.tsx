import { courses, nextSteps } from "@/lib/demo-data";

export default function DashboardPage() {
  const totalCourses = courses.length;
  const totalCompletedLessons = courses.reduce(
    (total, course) => total + course.lessonsCompleted,
    0,
  );

  const totalLessons = courses.reduce(
    (total, course) => total + course.totalLessons,
    0,
  );

  const overallProgress = Math.round(
    (totalCompletedLessons / totalLessons) * 100,
  );

  return (
    <main className="min-h-screen bg-[#F7F1E8] text-[#1F2933]">
      {/* Header */}
      <header className="border-b border-[#EFE3D1] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9A7B4F]">
              Raíces
            </p>
            <h1 className="text-xl font-bold">Mi discipulado</h1>
          </div>

          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <a href="/dashboard" className="text-[#2F5D50]">
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
            Salir
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12">
        {/* Welcome */}
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-[2rem] bg-[#2F5D50] p-8 text-white shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#E6C98B]">
              Bienvenido
            </p>

            <h2 className="mt-3 text-4xl font-bold md:text-5xl">Hola, Juan</h2>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-white/80">
              Continúa tus cursos, revisa tu progreso y da tu próximo paso en tu
              caminar con Jesús.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="/cursos/fundamentos"
                className="rounded-full bg-white px-6 py-3 text-center font-semibold text-[#2F5D50]"
              >
                Continuar lección
              </a>

              <a
                href="/cursos"
                className="rounded-full border border-white/40 px-6 py-3 text-center font-semibold text-white hover:bg-white/10"
              >
                Ver cursos
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9A7B4F]">
              Próximo paso
            </p>

            <h3 className="mt-3 text-2xl font-bold">
              Sigue creciendo esta semana
            </h3>

            <div className="mt-6 space-y-3">
              {nextSteps.map((step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-3 rounded-2xl bg-[#F7F1E8] p-4"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2F5D50] text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <p className="font-medium">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-10 grid gap-6 md:grid-cols-4">
          <StatCard label="Cursos asignados" value={String(totalCourses)} />
          <StatCard
            label="Lecciones completadas"
            value={String(totalCompletedLessons)}
          />
          <StatCard label="Progreso general" value={`${overallProgress}%`} />
          <StatCard label="Días activo" value="12" />
        </div>

        {/* Main content */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          {/* Courses */}
          <section>
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9A7B4F]">
                  Mis cursos
                </p>
                <h2 className="mt-3 text-3xl font-bold">
                  Continúa aprendiendo
                </h2>
              </div>

              <a
                href="/cursos"
                className="hidden rounded-full bg-[#2F5D50] px-5 py-2 text-sm font-semibold text-white md:inline-flex"
              >
                Ver todos
              </a>
            </div>

            <div className="mt-8 space-y-5">
              {courses.map((course) => (
                <CourseProgressCard key={course.title} course={course} />
              ))}
            </div>
          </section>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-[2rem] bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9A7B4F]">
                Versículo de la semana
              </p>

              <blockquote className="mt-4 text-xl font-semibold leading-8">
                “Lámpara es a mis pies tu palabra, y lumbrera a mi camino.”
              </blockquote>

              <p className="mt-4 font-semibold text-[#2F5D50]">
                Salmo 119:105
              </p>
            </div>

            <div className="rounded-[2rem] bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9A7B4F]">
                Oración
              </p>

              <h3 className="mt-3 text-2xl font-bold">¿Necesitas oración?</h3>

              <p className="mt-3 leading-7 text-[#4B5563]">
                Puedes enviar una petición y alguien del equipo pastoral podrá
                orar por ti y darte seguimiento.
              </p>

              <a
                href="/#soy-nuevo"
                className="mt-6 inline-flex rounded-full bg-[#2F5D50] px-5 py-2 text-sm font-semibold text-white"
              >
                Pedir oración
              </a>
            </div>

            <div className="rounded-[2rem] bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9A7B4F]">
                Actividad reciente
              </p>

              <div className="mt-5 space-y-4 text-sm">
                <ActivityItem text="Completaste: ¿Qué es la Biblia?" />
                <ActivityItem text="Comenzaste Fundamentos de la Biblia" />
                <ActivityItem text="Guardaste una reflexión personal" />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-[#9A7B4F]">{label}</p>
      <p className="mt-3 text-4xl font-bold">{value}</p>
    </div>
  );
}

function CourseProgressCard({
  course,
}: {
  course: {
    title: string;
    description: string;
    progress: number;
    nextLesson: string;
    status: string;
    lessonsCompleted: number;
    totalLessons: number;
    href: string;
  };
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="max-w-xl">
          <p className="text-sm font-semibold text-[#9A7B4F]">
            {course.status}
          </p>

          <h3 className="mt-2 text-2xl font-bold">{course.title}</h3>

          <p className="mt-2 leading-7 text-[#4B5563]">
            {course.description}
          </p>

          <p className="mt-3 text-sm font-medium text-[#2F5D50]">
            Próxima lección: {course.nextLesson}
          </p>
        </div>

        <div className="w-full md:w-80">
          <div className="flex justify-between text-sm font-semibold">
            <span>
              {course.lessonsCompleted}/{course.totalLessons} lecciones
            </span>
            <span>{course.progress}%</span>
          </div>

          <div className="mt-2 h-3 overflow-hidden rounded-full bg-[#EFE3D1]">
            <div
              className="h-full rounded-full bg-[#2F5D50]"
              style={{ width: `${course.progress}%` }}
            />
          </div>

          <a
            href={course.href}
            className="mt-5 inline-flex rounded-full bg-[#2F5D50] px-5 py-2 text-sm font-semibold text-white"
          >
            Continuar
          </a>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ text }: { text: string }) {
  return (
    <div className="rounded-2xl bg-[#F7F1E8] p-4">
      <p className="font-medium">{text}</p>
      <p className="mt-1 text-[#4B5563]">Hace poco</p>
    </div>
  );
}