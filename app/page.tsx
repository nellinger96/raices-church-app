import ScriptureTooltip from "@/components/ScriptureTooltip";
import { announcements, church, courses, events, sermons } from "@/lib/demo-data";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F7F1E8] text-[#1F2933]">
      {/* Navbar */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9A7B4F]">
            Raíces
          </p>
          <h1 className="text-xl font-bold">{church.name}</h1>
        </div>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <a href="#vision" className="hover:text-[#9A7B4F]">
            Visión
          </a>
          <a href="#sermones" className="hover:text-[#9A7B4F]">
            Sermones
          </a>
          <a href="#eventos" className="hover:text-[#9A7B4F]">
            Eventos
          </a>
          <a href="#cursos" className="hover:text-[#9A7B4F]">
            Cursos
          </a>
          <a href="#soy-nuevo" className="hover:text-[#9A7B4F]">
            Soy Nuevo
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="/admin"
            className="hidden rounded-full border border-[#9A7B4F] px-5 py-2 text-sm font-semibold text-[#9A7B4F] hover:bg-white lg:inline-flex"
          >
            Pastor/Admin
          </a>

          <a
            href="/login"
            className="hidden rounded-full border border-[#2F5D50] px-5 py-2 text-sm font-semibold text-[#2F5D50] hover:bg-white sm:inline-flex"
          >
            Iniciar sesión
          </a>

          <a
            href="/signup"
            className="hidden rounded-full bg-[#2F5D50] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#254A40] md:inline-flex"
          >
            Crear perfil
          </a>

          <a
            href="#soy-nuevo"
            className="rounded-full bg-[#2F5D50] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#254A40] md:hidden"
          >
            Soy Nuevo
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2">
        <div>
          <p className="mb-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-medium text-[#2F5D50] shadow-sm">
            {church.tagline}
          </p>

          <h2 className="text-5xl font-bold leading-tight tracking-tight md:text-6xl">
            {church.heroTitle}
          </h2>

          <p className="mt-6 max-w-xl text-lg leading-8 text-[#4B5563]">
            {church.heroDescription}
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <a
              href="#soy-nuevo"
              className="rounded-full bg-[#2F5D50] px-7 py-3 text-center font-semibold text-white hover:bg-[#254A40]"
            >
              Soy Nuevo
            </a>

            <a
              href="/signup"
              className="rounded-full border border-[#2F5D50] px-7 py-3 text-center font-semibold text-[#2F5D50] hover:bg-white"
            >
              Crear perfil
            </a>

            <a
              href="/admin"
              className="rounded-full border border-[#9A7B4F] px-7 py-3 text-center font-semibold text-[#9A7B4F] hover:bg-white"
            >
              Acceso Pastor/Admin
            </a>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-6 shadow-xl">
          <div className="rounded-[1.5rem] bg-[#F7F1E8] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#9A7B4F]">
              Curso destacado
            </p>

            <h3 className="mt-4 text-3xl font-bold">Fundamentos de la Biblia</h3>

            <p className="mt-4 text-[#4B5563]">
              Un camino de 6 semanas para nuevos creyentes y personas que desean
              entender las bases de la fe cristiana.
            </p>

            <div className="mt-6 space-y-3">
              {[
                "¿Qué es la Biblia?",
                "¿Quién es Jesús?",
                "¿Qué es la salvación?",
                "La oración y la vida diaria",
              ].map((lesson) => (
                <div
                  key={lesson}
                  className="flex items-center justify-between rounded-xl bg-white px-4 py-3"
                >
                  <span className="font-medium">{lesson}</span>
                  <span className="text-sm text-[#2F5D50]">Lección</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section id="vision" className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9A7B4F]">
              Base bíblica
            </p>
            <h2 className="mt-3 text-4xl font-bold">
              Nuestra visión nace de la Palabra.
            </h2>
            <p className="mt-4 text-lg leading-8 text-[#4B5563]">
              Cada parte de nuestra visión apunta a lo que Jesús hizo, enseñó y
              nos llamó a vivir.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <VisionCard
              title="Formamos discípulos"
              description="Jesús llamó a sus discípulos para estar con Él, aprender de Él y ser enviados por Él."
              scriptures={[
                {
                  reference: "Mateo 28:19–20",
                  text: "Por tanto, id, y doctrinad a todos los Gentiles, bautizándolos en el nombre del Padre, y del Hijo, y del Espíritu Santo: enseñándoles que guarden todas las cosas que os he mandado: y he aquí, yo estoy con vosotros todos los días, hasta el fin del mundo. Amén.",
                },
                {
                  reference: "Marcos 3:13–14",
                  text: "Y subió al monte, y llamó a sí a los que él quiso; y vinieron a él. Y estableció doce, para que estuviesen con él, y para enviarlos a predicar.",
                },
                {
                  reference: "Lucas 6:40",
                  text: "El discípulo no es sobre su maestro; mas cualquiera que fuere como el maestro, será perfecto.",
                },
              ]}
            />

            <VisionCard
              title="Transformamos vidas"
              description="Creemos que Jesús cambia vidas desde adentro hacia afuera, dando nueva identidad, libertad y propósito."
              scriptures={[
                {
                  reference: "2 Corintios 5:17",
                  text: "De modo que si alguno está en Cristo, nueva criatura es: las cosas viejas pasaron; he aquí todas son hechas nuevas.",
                },
                {
                  reference: "Juan 8:36",
                  text: "Así que, si el Hijo os libertare, seréis verdaderamente libres.",
                },
                {
                  reference: "Lucas 19:8–10",
                  text: "Entonces Zaqueo, puesto en pie, dijo al Señor: He aquí, Señor, la mitad de mis bienes doy a los pobres; y si en algo he defraudado a alguno, lo vuelvo con el cuatro tanto. Y Jesús le dijo: Hoy ha venido la salvación a esta casa; por cuanto él también es hijo de Abraham. Porque el Hijo del hombre vino a buscar y a salvar lo que se había perdido.",
                },
              ]}
            />

            <VisionCard
              title="Impactamos generaciones"
              description="Nuestras decisiones pueden dejar una huella de fe, obediencia y bendición para las próximas generaciones."
              scriptures={[
                {
                  reference: "Deuteronomio 5:9–10",
                  text: "No te encorvarás a ellas ni les servirás: porque yo soy Jehová tu Dios, fuerte, celoso, que visito la maldad de los padres sobre los hijos, y sobre la tercera, y sobre la cuarta generación, a los que me aborrecen; y que hago misericordia a millares a los que me aman, y guardan mis mandamientos.",
                },
                {
                  reference: "Salmo 145:4",
                  text: "Generación a generación narrará tus obras, y anunciarán tus valentías.",
                },
                {
                  reference: "2 Timoteo 1:5",
                  text: "Trayendo a la memoria la fe no fingida que hay en ti, la cual residió primero en tu abuela Loida, y en tu madre Eunice; y estoy cierto que en ti también.",
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Sermons */}
      <section id="sermones" className="bg-[#F7F1E8] px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9A7B4F]">
                Sermones
              </p>
              <h2 className="mt-3 text-4xl font-bold">
                Mensajes recientes para fortalecer tu fe.
              </h2>
              <p className="mt-4 text-lg leading-8 text-[#4B5563]">
                Mira enseñanzas, predicaciones y mensajes recientes de nuestra
                iglesia directamente desde nuestro canal de YouTube.
              </p>
            </div>

            <a
              href={church.youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-[#2F5D50] px-6 py-3 text-center font-semibold text-[#2F5D50] hover:bg-white"
            >
              Ver canal de YouTube
            </a>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {sermons.map((sermon) => (
              <SermonCard
                key={sermon.title}
                title={sermon.title}
                description={sermon.description}
                videoUrl={sermon.videoUrl}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Events and Announcements */}
      <section id="eventos" className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9A7B4F]">
                Eventos
              </p>

              <h2 className="mt-3 text-4xl font-bold">
                Próximos eventos de la iglesia.
              </h2>

              <p className="mt-4 max-w-2xl text-lg leading-8 text-[#4B5563]">
                Mantente conectado con reuniones, estudios bíblicos, noches de
                oración, eventos familiares y oportunidades para servir.
              </p>

              <div className="mt-10 space-y-5">
                {events.map((event) => (
                  <EventCard
                    key={event.title}
                    date={event.date}
                    title={event.title}
                    location={event.location}
                    description={event.description}
                  />
                ))}
              </div>
            </div>

            <aside className="rounded-[2rem] bg-[#F7F1E8] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9A7B4F]">
                Anuncios
              </p>

              <h3 className="mt-3 text-3xl font-bold">
                Información importante.
              </h3>

              <div className="mt-8 space-y-4">
                {announcements.map((announcement) => (
                  <AnnouncementCard
                    key={announcement.title}
                    title={announcement.title}
                    description={announcement.description}
                  />
                ))}
              </div>

              <a
                href="#soy-nuevo"
                className="mt-8 inline-flex rounded-full bg-[#2F5D50] px-6 py-3 font-semibold text-white hover:bg-[#254A40]"
              >
                Quiero conectarme
              </a>
            </aside>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section id="cursos" className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9A7B4F]">
            Cursos
          </p>
          <h2 className="mt-3 text-4xl font-bold">Camina tu próximo paso.</h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {courses.map((course) => (
              <div key={course.title} className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-[#9A7B4F]">
                  {course.level}
                </p>

                <h3 className="mt-3 text-2xl font-bold">{course.title}</h3>

                <p className="mt-3 text-[#4B5563]">{course.description}</p>

                <p className="mt-5 text-sm font-semibold text-[#2F5D50]">
                  {course.lessons} lecciones
                </p>

                <a
                  href={course.href}
                  className="mt-6 inline-flex rounded-full bg-[#2F5D50] px-5 py-2 text-sm font-semibold text-white"
                >
                  Ver curso
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Soy Nuevo */}
      <section id="soy-nuevo" className="bg-[#2F5D50] px-6 py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#E6C98B]">
              Soy Nuevo
            </p>
            <h2 className="mt-3 text-4xl font-bold">
              Queremos conocerte y caminar contigo.
            </h2>
            <p className="mt-4 text-lg leading-8 text-white/80">
              Si eres nuevo, tienes una petición de oración o deseas saber más
              sobre la iglesia, déjanos tu información y alguien del equipo se
              comunicará contigo.
            </p>
          </div>

          <form className="rounded-3xl bg-white p-6 text-[#1F2933] shadow-xl">
            <div className="grid gap-4">
              <input
                className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2F5D50]"
                placeholder="Nombre completo"
              />
              <input
                className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2F5D50]"
                placeholder="Teléfono"
              />
              <input
                className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2F5D50]"
                placeholder="Correo electrónico"
              />
              <textarea
                className="min-h-28 rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#2F5D50]"
                placeholder="¿Cómo podemos orar por ti?"
              />
              <button className="rounded-full bg-[#2F5D50] px-6 py-3 font-semibold text-white hover:bg-[#254A40]">
                Enviar
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

function VisionCard({
  title,
  description,
  scriptures,
}: {
  title: string;
  description: string;
  scriptures: {
    reference: string;
    text: string;
  }[];
}) {
  return (
    <div className="rounded-3xl border border-[#EFE3D1] bg-[#F7F1E8] p-6">
      <h3 className="text-2xl font-bold">{title}</h3>

      <p className="mt-4 leading-7 text-[#4B5563]">{description}</p>

      <div className="mt-6 flex flex-wrap gap-x-2 gap-y-2 text-sm">
        {scriptures.map((scripture, index) => (
          <span key={scripture.reference}>
            <ScriptureTooltip
              reference={scripture.reference}
              text={scripture.text}
            />
            {index < scriptures.length - 1 && (
              <span className="ml-2 text-[#9A7B4F]">·</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

function SermonCard({
  title,
  description,
  videoUrl,
}: {
  title: string;
  description: string;
  videoUrl: string;
}) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
      <div className="aspect-video w-full bg-black">
        <iframe
          className="h-full w-full"
          src={videoUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div className="p-6">
        <p className="text-sm font-semibold text-[#9A7B4F]">Mensaje reciente</p>
        <h3 className="mt-2 text-2xl font-bold">{title}</h3>
        <p className="mt-3 leading-7 text-[#4B5563]">{description}</p>
      </div>
    </div>
  );
}

function EventCard({
  date,
  title,
  location,
  description,
}: {
  date: string;
  title: string;
  location: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-[#EFE3D1] bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9A7B4F]">
        {date}
      </p>
      <h3 className="mt-3 text-2xl font-bold">{title}</h3>
      <p className="mt-2 font-medium text-[#2F5D50]">{location}</p>
      <p className="mt-3 leading-7 text-[#4B5563]">{description}</p>
    </div>
  );
}

function AnnouncementCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <h4 className="font-bold">{title}</h4>
      <p className="mt-2 leading-7 text-[#4B5563]">{description}</p>
    </div>
  );
}