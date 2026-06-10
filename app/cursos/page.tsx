import { courses } from "@/lib/demo-data";

export default function CoursesPage() {
  return (
    <main className="min-h-screen bg-[#F7F1E8] text-[#1F2933]">
      <header className="border-b border-[#EFE3D1] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9A7B4F]">
              Raíces
            </p>
            <h1 className="text-xl font-bold">Cursos</h1>
          </div>

          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <a href="/dashboard" className="hover:text-[#9A7B4F]">
              Dashboard
            </a>
            <a href="/cursos" className="text-[#2F5D50]">
              Cursos
            </a>
            <a href="/" className="hover:text-[#9A7B4F]">
              Página pública
            </a>
          </nav>

          <a
            href="/dashboard"
            className="rounded-full bg-[#2F5D50] px-5 py-2 text-sm font-semibold text-white hover:bg-[#254A40]"
          >
            Mi dashboard
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9A7B4F]">
            Biblioteca de discipulado
          </p>

          <h2 className="mt-3 text-5xl font-bold tracking-tight">
            Cursos para caminar tu próximo paso.
          </h2>

          <p className="mt-5 text-lg leading-8 text-[#4B5563]">
            Explora cursos creados por la iglesia para ayudarte a crecer en la
            fe, aprender la Palabra y vivir como discípulo de Jesús.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {courses.map((course) => (
            <div key={course.title} className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-[#9A7B4F]">
                {course.level}
              </p>

              <h3 className="mt-3 text-2xl font-bold">{course.title}</h3>

              <p className="mt-3 leading-7 text-[#4B5563]">
                {course.description}
              </p>

              <div className="mt-6 flex items-center justify-between text-sm font-semibold">
                <span>{course.lessons} lecciones</span>
                <span className="text-[#2F5D50]">{course.progress}%</span>
              </div>

              <div className="mt-2 h-3 overflow-hidden rounded-full bg-[#EFE3D1]">
                <div
                  className="h-full rounded-full bg-[#2F5D50]"
                  style={{ width: `${course.progress}%` }}
                />
              </div>

              <a
                href={course.href}
                className="mt-6 inline-flex rounded-full bg-[#2F5D50] px-5 py-2 text-sm font-semibold text-white hover:bg-[#254A40]"
              >
                Ver curso
              </a>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}