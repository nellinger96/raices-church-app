import { courseLessons } from "@/lib/demo-data";

const reflectionQuestions = [
  "¿Qué significa para ti que la Biblia sea una guía para tu vida?",
  "¿Qué área de tu vida necesita más dirección de Dios?",
  "¿Cómo puedes comenzar a leer la Biblia de forma constante esta semana?",
];

export default function CourseDetailPage() {
  return (
    <main className="min-h-screen bg-[#F7F1E8] text-[#1F2933]">
      {/* Header */}
      <header className="border-b border-[#EFE3D1] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9A7B4F]">
              Curso
            </p>
            <h1 className="text-xl font-bold">Fundamentos de la Biblia</h1>
          </div>

          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <a href="/dashboard" className="hover:text-[#9A7B4F]">
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
            href="/dashboard"
            className="rounded-full border border-[#2F5D50] px-5 py-2 text-sm font-semibold text-[#2F5D50] hover:bg-[#F7F1E8]"
          >
            Volver
          </a>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[0.8fr_1.4fr]">
        {/* Lesson sidebar */}
        <aside className="h-fit rounded-[2rem] bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9A7B4F]">
            Progreso del curso
          </p>

          <h2 className="mt-3 text-2xl font-bold">4 de 6 lecciones</h2>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#EFE3D1]">
            <div className="h-full w-[67%] rounded-full bg-[#2F5D50]" />
          </div>

          <div className="mt-8 space-y-3">
            {courseLessons.map((lesson) => (
              <button
                key={lesson.number}
                className={`w-full rounded-2xl px-4 py-4 text-left transition ${
                  lesson.number === 4
                    ? "bg-[#2F5D50] text-white"
                    : "bg-[#F7F1E8] text-[#1F2933] hover:bg-[#EFE3D1]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">
                      Lección {lesson.number}
                    </p>
                    <p className="mt-1 font-medium">{lesson.title}</p>
                  </div>

                  <span
                    className={`rounded-full px-2 py-1 text-xs font-bold ${
                      lesson.completed
                        ? "bg-white text-[#2F5D50]"
                        : lesson.number === 4
                          ? "bg-white/20 text-white"
                          : "bg-white text-[#9A7B4F]"
                    }`}
                  >
                    {lesson.completed ? "✓" : lesson.number === 4 ? "Actual" : ""}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Lesson content */}
        <article className="rounded-[2rem] bg-white p-8 shadow-sm">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9A7B4F]">
                Lección 4
              </p>

              <h2 className="mt-3 text-4xl font-bold">¿Qué es la salvación?</h2>

              <p className="mt-4 max-w-2xl text-lg leading-8 text-[#4B5563]">
                En esta lección aprenderemos qué significa ser salvo, por qué
                necesitamos a Jesús y cómo la gracia de Dios transforma nuestra
                vida.
              </p>
            </div>

            <span className="rounded-full bg-[#F7F1E8] px-4 py-2 text-sm font-semibold text-[#2F5D50]">
              15 min
            </span>
          </div>

          {/* Video placeholder */}
          <div className="mt-8 overflow-hidden rounded-3xl bg-[#1F2933]">
            <div className="flex aspect-video items-center justify-center px-6 text-center text-white">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#E6C98B]">
                  Video de la lección
                </p>
                <h3 className="mt-3 text-3xl font-bold">
                  Aquí irá el video del pastor
                </h3>
                <p className="mt-3 max-w-xl text-white/70">
                  Más adelante el pastor podrá pegar un enlace de YouTube o subir
                  el contenido de la lección desde el panel administrativo.
                </p>
              </div>
            </div>
          </div>

          {/* Scripture */}
          <div className="mt-8 rounded-3xl bg-[#F7F1E8] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9A7B4F]">
              Versículo clave
            </p>

            <blockquote className="mt-4 text-2xl font-semibold leading-9">
              “Porque por gracia sois salvos por medio de la fe; y esto no de
              vosotros, pues es don de Dios.”
            </blockquote>

            <p className="mt-4 font-semibold text-[#2F5D50]">Efesios 2:8</p>
          </div>

          {/* Lesson body */}
          <section className="mt-8 space-y-6 leading-8 text-[#4B5563]">
            <p>
              La salvación es el regalo de Dios para la humanidad. No se gana por
              buenas obras, esfuerzo personal o religión, sino por la gracia de
              Dios recibida por medio de la fe en Jesucristo.
            </p>

            <p>
              Jesús vino a buscar y salvar lo que se había perdido. A través de
              su muerte y resurrección, Él abrió el camino para que podamos ser
              perdonados, reconciliados con Dios y recibir una nueva vida.
            </p>

            <p>
              Ser salvo no significa solamente ir al cielo algún día. También
              significa comenzar una vida nueva con Dios hoy: una vida guiada por
              Su Palabra, Su Espíritu y Su amor.
            </p>
          </section>

          {/* Reflection */}
          <section className="mt-10 rounded-3xl border border-[#EFE3D1] p-6">
            <h3 className="text-2xl font-bold">Preguntas de reflexión</h3>

            <div className="mt-5 space-y-4">
              {reflectionQuestions.map((question, index) => (
                <div key={question}>
                  <label className="font-semibold">
                    {index + 1}. {question}
                  </label>

                  <textarea
                    className="mt-2 min-h-24 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2F5D50]"
                    placeholder="Escribe tu respuesta..."
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Quiz */}
          <section className="mt-10 rounded-3xl bg-[#F7F1E8] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9A7B4F]">
              Pregunta rápida
            </p>

            <h3 className="mt-3 text-2xl font-bold">
              Según Efesios 2:8, ¿cómo somos salvos?
            </h3>

            <div className="mt-5 space-y-3">
              {[
                "Por nuestras buenas obras",
                "Por gracia, por medio de la fe",
                "Por asistir a la iglesia",
                "Por saber mucho de la Biblia",
              ].map((answer) => (
                <label
                  key={answer}
                  className="flex cursor-pointer items-center gap-3 rounded-2xl bg-white p-4 font-medium"
                >
                  <input type="radio" name="quiz" />
                  {answer}
                </label>
              ))}
            </div>
          </section>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button className="rounded-full bg-[#2F5D50] px-7 py-3 font-semibold text-white hover:bg-[#254A40]">
              Marcar lección como completada
            </button>

            <a
              href="/dashboard"
              className="rounded-full border border-[#2F5D50] px-7 py-3 text-center font-semibold text-[#2F5D50] hover:bg-[#F7F1E8]"
            >
              Guardar y salir
            </a>
          </div>
        </article>
      </section>
    </main>
  );
}