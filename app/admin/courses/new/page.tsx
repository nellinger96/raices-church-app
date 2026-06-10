import { courseTemplates } from "@/lib/demo-data";

export default function NewCoursePage() {
  return (
    <main className="min-h-screen bg-[#F7F1E8] text-[#1F2933]">
      <header className="border-b border-[#EFE3D1] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9A7B4F]">
              Crear curso
            </p>
            <h1 className="text-xl font-bold">
              Panel de The Main Place Español
            </h1>
          </div>

          <a
            href="/admin"
            className="rounded-full border border-[#2F5D50] px-5 py-2 text-sm font-semibold text-[#2F5D50] hover:bg-[#F7F1E8]"
          >
            Volver al admin
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-[2rem] bg-[#2F5D50] p-8 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#E6C98B]">
            Constructor de cursos
          </p>

          <h2 className="mt-3 text-4xl font-bold md:text-5xl">
            Crea un curso de discipulado.
          </h2>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-white/80">
            Empieza con una plantilla, edita las lecciones, agrega videos o
            referencias y publica el curso para que los estudiantes puedan
            avanzar paso a paso.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Templates */}
          <section className="rounded-[2rem] bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9A7B4F]">
              Paso 1
            </p>

            <h3 className="mt-3 text-3xl font-bold">Elige una plantilla</h3>

            <p className="mt-3 leading-7 text-[#4B5563]">
              Las plantillas no son doctrina oficial. Son estructuras editables
              para que el pastor agregue la enseñanza de su iglesia.
            </p>

            <div className="mt-6 space-y-4">
              {courseTemplates.map((template, index) => (
                <div
                  key={template.title}
                  className={`rounded-3xl border p-5 ${
                    index === 0
                      ? "border-[#2F5D50] bg-[#F7F1E8]"
                      : "border-[#EFE3D1] bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-xl font-bold">{template.title}</h4>

                      <p className="mt-2 leading-7 text-[#4B5563]">
                        {template.description}
                      </p>

                      <p className="mt-3 text-sm font-semibold text-[#2F5D50]">
                        {template.lessons.length} lecciones sugeridas
                      </p>
                    </div>

                    {index === 0 && (
                      <span className="rounded-full bg-[#2F5D50] px-3 py-1 text-xs font-bold text-white">
                        Seleccionada
                      </span>
                    )}
                  </div>
                </div>
              ))}

              <div className="rounded-3xl border border-dashed border-[#9A7B4F] p-5">
                <h4 className="text-xl font-bold">Curso en blanco</h4>

                <p className="mt-2 leading-7 text-[#4B5563]">
                  Crea un curso desde cero con tus propios títulos, lecciones y
                  contenido.
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-3xl bg-[#2F5D50] p-5 text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E6C98B]">
                Buen uso
              </p>

              <p className="mt-3 leading-7 text-white/80">
                Raíces ayuda con la estructura. La enseñanza bíblica, los videos
                y la aprobación final deben venir del pastor o liderazgo de la
                iglesia.
              </p>
            </div>
          </section>

          {/* Builder form */}
          <section className="rounded-[2rem] bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9A7B4F]">
              Paso 2
            </p>

            <h3 className="mt-3 text-3xl font-bold">Edita el curso</h3>

            <form className="mt-6 space-y-5">
              <div>
                <label className="text-sm font-semibold">Título del curso</label>
                <input
                  defaultValue="Fundamentos de la Biblia"
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2F5D50]"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Descripción</label>
                <textarea
                  defaultValue="Un curso de 6 semanas para ayudar a nuevos creyentes a entender las bases de la fe cristiana."
                  className="mt-2 min-h-24 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2F5D50]"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold">Audiencia</label>
                  <select className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2F5D50]">
                    <option>Nuevos creyentes</option>
                    <option>Nuevos visitantes</option>
                    <option>Miembros</option>
                    <option>Líderes / voluntarios</option>
                    <option>Personas interesadas en bautismo</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold">Estado</label>
                  <select className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2F5D50]">
                    <option>Borrador</option>
                    <option>Publicado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold">
                  Imagen de portada del curso
                </label>

                <input
                  type="file"
                  accept="image/*"
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
                />

                <p className="mt-2 text-sm text-[#4B5563]">
                  Más adelante esta imagen se guardará en Supabase Storage.
                </p>
              </div>

              {/* Lessons */}
              <div className="rounded-3xl bg-[#F7F1E8] p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9A7B4F]">
                      Paso 3
                    </p>

                    <h4 className="mt-2 text-2xl font-bold">
                      Lecciones sugeridas
                    </h4>
                  </div>

                  <button
                    type="button"
                    className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#2F5D50]"
                  >
                    Agregar lección
                  </button>
                </div>

                <p className="mt-3 leading-7 text-[#4B5563]">
                  Cada lección puede tener video del pastor, enlace de YouTube,
                  referencias externas, notas o enseñanza escrita.
                </p>

                <div className="mt-5 space-y-5">
                  {courseTemplates[0].lessons.map((lesson, index) => (
                    <div key={lesson} className="rounded-2xl bg-white p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-[#9A7B4F]">
                            Lección {index + 1}
                          </p>

                          <h5 className="mt-1 text-xl font-bold">
                            Configuración de la lección
                          </h5>
                        </div>

                        <span className="rounded-full bg-[#F7F1E8] px-3 py-1 text-xs font-bold text-[#2F5D50]">
                          Editable
                        </span>
                      </div>

                      <div className="mt-4">
                        <label className="text-sm font-semibold">
                          Título de la lección
                        </label>

                        <input
                          defaultValue={lesson}
                          className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2F5D50]"
                        />
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="text-sm font-semibold">
                            Tipo de contenido
                          </label>

                          <select className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2F5D50]">
                            <option>Video del pastor</option>
                            <option>Enlace de YouTube</option>
                            <option>Referencia externa</option>
                            <option>Solo lectura / enseñanza escrita</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-sm font-semibold">
                            Duración estimada
                          </label>

                          <input
                            placeholder="Ej. 15 min"
                            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2F5D50]"
                          />
                        </div>
                      </div>

                      <div className="mt-4 rounded-2xl border border-dashed border-[#9A7B4F] bg-[#F7F1E8] p-5">
                        <p className="text-sm font-semibold text-[#9A7B4F]">
                          Subir video de la lección
                        </p>

                        <p className="mt-2 text-sm leading-6 text-[#4B5563]">
                          El pastor puede grabarse enseñando esta lección y
                          subir el video directamente al curso. Más adelante
                          conectaremos este campo con Supabase Storage.
                        </p>

                        <input
                          type="file"
                          accept="video/*"
                          className="mt-4 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
                        />
                      </div>

                      <div className="mt-4">
                        <label className="text-sm font-semibold">
                          O pegar enlace de YouTube / referencia
                        </label>

                        <input
                          type="url"
                          placeholder="https://youtube.com/..."
                          className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2F5D50]"
                        />
                      </div>

                      <div className="mt-4">
                        <label className="text-sm font-semibold">
                          Versículo principal
                        </label>

                        <input
                          placeholder="Ej. Efesios 2:8"
                          className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2F5D50]"
                        />
                      </div>

                      <div className="mt-4">
                        <label className="text-sm font-semibold">
                          Enseñanza / notas de la lección
                        </label>

                        <textarea
                          placeholder="Escribe aquí el contenido principal de la lección..."
                          className="mt-2 min-h-28 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2F5D50]"
                        />
                      </div>

                      <div className="mt-4">
                        <label className="text-sm font-semibold">
                          Preguntas de reflexión
                        </label>

                        <textarea
                          placeholder="Ej. ¿Qué aprendiste de esta lección? ¿Cómo puedes aplicarlo esta semana?"
                          className="mt-2 min-h-24 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2F5D50]"
                        />
                      </div>

                      <div className="mt-4 rounded-2xl border border-[#EFE3D1] p-4">
                        <p className="text-sm font-semibold text-[#9A7B4F]">
                          Recursos adicionales
                        </p>

                        <div className="mt-3 grid gap-4 md:grid-cols-2">
                          <input
                            type="url"
                            placeholder="Enlace externo o artículo"
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2F5D50]"
                          />

                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.ppt,.pptx"
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
                          />
                        </div>

                        <p className="mt-2 text-sm text-[#4B5563]">
                          Después podremos guardar PDFs, guías o material de
                          referencia en Supabase Storage.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-[#EFE3D1] p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9A7B4F]">
                  Nota importante
                </p>

                <p className="mt-3 leading-7 text-[#4B5563]">
                  Raíces provee la estructura del curso. El contenido bíblico,
                  enseñanza, interpretación y aprobación final pertenecen al
                  pastor o liderazgo de la iglesia.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <a
                  href="/admin"
                  className="rounded-full bg-[#2F5D50] px-7 py-3 text-center font-semibold text-white hover:bg-[#254A40]"
                >
                  Guardar borrador
                </a>

                <a
                  href="/cursos/fundamentos"
                  className="rounded-full border border-[#2F5D50] px-7 py-3 text-center font-semibold text-[#2F5D50] hover:bg-[#F7F1E8]"
                >
                  Vista previa
                </a>
              </div>
            </form>
          </section>
        </div>
      </section>
    </main>
  );
}