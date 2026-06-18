import { todosLosDiasChurch } from "@/lib/churches/todos-los-dias";

const mariaBio = "Maria Martinez nació en Apatzingán, Michoacán, México. A los 25 años emigró a los Estados Unidos, donde trabajó arduamente en diversos empleos para poder subsistir junto a su familia. Casada y madre de dos hijos, se vio varias veces al borde de la muerte; después de una cirugía en la columna vertebral que la dejó paralítica, sobrevivió a un cáncer invasivo y más tarde sufrió un derrame cerebral. Sin embargo, estos desafíos de salud no disminuyeron su firme deseo de conocer la Palabra de Dios. Para eso, asistió al Instituto Teológico de Ministerios. Además, se graduó de la Universidad Internacional Mahanaim de Capellanes, de la Escuela de Evangelistas Alberto Mottesi y del Instituto Bíblico Cristo es el Señor.";

const ministryLeaders = [
  {
    ministry: "Evangelismo",
    name: "Por confirmar",
    role: "Líder de ministerio",
    description:
      "Liderazgo enfocado en alcance, servicio y conexión con la comunidad.",
  },
  {
    ministry: "Estudio Bíblico",
    name: "Maria Martinez",
    role: "Maestra de Estudio Bíblico",
    photo: "/todos-los-dias/maria.png",
    href: "/todos-los-dias/ministerios/estudio-biblico",
    description:
      "Lidera el estudio bíblico para ayudar a la congregación a estudiar, meditar y crecer en la Palabra de Dios.",
  },
  {
    ministry: "Mujeres",
    name: "Por confirmar",
    role: "Líder de ministerio",
    description:
      "Liderazgo enfocado en acompañar, animar y fortalecer a las mujeres de la iglesia.",
  },
  {
    ministry: "Escuela Dominical",
    name: "Por confirmar",
    role: "Líder de ministerio",
    description:
      "Liderazgo enfocado en formación bíblica para niños, jóvenes y familias.",
  },
  {
    ministry: "Oración",
    name: "Equipo de Oración",
    role: "Grupo de Oración",
    href: "/todos-los-dias/ministerios/oracion",
    description:
      "Liderazgo enfocado en intercesión, cuidado pastoral y oración por familias alrededor del mundo.",
  },
  {
    ministry: "Jóvenes",
    name: "Por confirmar",
    role: "Líder de ministerio",
    description:
      "Liderazgo enfocado en ayudar a la nueva generación a crecer en fe y propósito.",
  },
  {
    ministry: "Alabanza",
    name: "Por confirmar",
    role: "Líder de ministerio",
    description:
      "Liderazgo enfocado en adoración, música y preparación espiritual de cada servicio.",
  },
];

export default function LiderazgoPage() {
  return (
    <main className="min-h-screen bg-[#F5F8FC] text-[#071A33]">
      <section className="relative overflow-hidden bg-[#071A33] px-4 py-8 text-white sm:px-6">
        <div className="absolute inset-0">
          <img
            src="/todos-los-dias/pastor.png"
            alt="Liderazgo de Iglesia de Todos los Días"
            className="h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(7,26,51,0.98),rgba(7,26,51,0.72),rgba(7,26,51,0.96))]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <header className="flex items-center justify-between">
            <a href="/todos-los-dias" className="flex items-center gap-3">
              <img
                src={todosLosDiasChurch.logo}
                alt={todosLosDiasChurch.name}
                className="h-14 w-14 rounded-full bg-white object-contain p-1"
              />
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[#BBD7FF]">
                  Iglesia de Todos los Días
                </p>
                <p className="font-black">Liderazgo</p>
              </div>
            </a>

            <a
              href="/todos-los-dias"
              className="rounded-full bg-white px-5 py-3 text-sm font-black text-[#071A33] hover:bg-[#BBD7FF]"
            >
              Volver
            </a>
          </header>

          <div className="grid gap-10 py-20 lg:grid-cols-[1fr_0.9fr] lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.35em] text-[#BBD7FF]">
                Liderazgo de la iglesia
              </p>
              <h1 className="mt-5 text-5xl font-black leading-tight sm:text-6xl md:text-8xl">
                Sirviendo a Dios y a la comunidad.
              </h1>
            </div>

            <p className="max-w-2xl text-lg font-medium leading-8 text-white/80 sm:text-xl">
              Conoce al equipo pastoral y a las personas que ayudan a cuidar,
              guiar y servir a Iglesia de Todos los Días.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="relative min-h-[420px] overflow-hidden bg-[#071A33] shadow-xl">
              <img
                src="/todos-los-dias/pastor-wife.png"
                alt="Pastor Socrates y su esposa"
                className="h-full min-h-[420px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071A33]/65 to-transparent" />
            </div>

            <div className="space-y-4">
              <div className="relative min-h-[280px] overflow-hidden bg-[#071A33] shadow-xl">
                <img
                  src="/todos-los-dias/pastor-family.png"
                  alt="Familia del Pastor Socrates"
                  className="h-full min-h-[280px] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071A33]/60 to-transparent" />
              </div>

              <div className="bg-[#071A33] p-7 text-white shadow-xl">
                <p className="text-sm font-black uppercase tracking-[0.3em] text-[#BBD7FF]">
                  Pastor Principal
                </p>
                <h2 className="mt-3 text-3xl font-black">
                  Pastor Socrates Lopez
                </h2>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-[#164B8F]">
              Conoce al Pastor
            </p>

            <h2 className="mt-4 text-5xl font-black leading-tight md:text-7xl">
              Pastor Socrates Lopez
            </h2>

            <p className="mt-6 text-lg font-medium leading-8 text-[#52657D] sm:text-xl sm:leading-9">
              Pastor Socrates sirve a la comunidad con un corazón pastoral,
              familiar y cercano. Su deseo es que cada persona que llegue a
              Iglesia de Todos los Días pueda sentirse bienvenida, amada y
              acompañada en su caminar con Dios.
            </p>

            <p className="mt-5 text-lg font-medium leading-8 text-[#52657D] sm:text-xl sm:leading-9">
              Junto a su familia, busca levantar una iglesia centrada en la
              Palabra de Dios, la oración, la comunidad y el servicio a las
              familias hispanas.
            </p>

            <div className="mt-9 grid gap-4 sm:grid-cols-3">
              <ValueCard title="Fe" text="Guiados por la Palabra de Dios" />
              <ValueCard title="Familia" text="Una iglesia para todas las generaciones" red />
              <ValueCard title="Servicio" text="Amando y sirviendo a la comunidad" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="relative min-h-[430px] overflow-hidden bg-[#071A33] shadow-xl">
              <img
                src="/todos-los-dias/maria.png"
                alt="Maria Martinez"
                className="h-full min-h-[430px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071A33]/70 to-transparent" />
            </div>

            <div className="space-y-4">
              <div className="relative min-h-[280px] overflow-hidden bg-[#071A33] shadow-xl">
                <img
                  src="/todos-los-dias/maria2.png"
                  alt="Maria Martinez enseñando estudio bíblico"
                  className="h-full min-h-[280px] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071A33]/60 to-transparent" />
              </div>

              <div className="bg-[#071A33] p-7 text-white shadow-xl">
                <p className="text-sm font-black uppercase tracking-[0.3em] text-[#BBD7FF]">
                  Estudio Bíblico
                </p>
                <h2 className="mt-3 text-3xl font-black">Maria Martinez</h2>
                <p className="mt-2 font-bold text-white/70">
                  Miércoles 7:00 PM · Sábados 9:00 AM
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-[#164B8F]">
              Maestra de Estudio Bíblico
            </p>

            <h2 className="mt-4 text-5xl font-black leading-tight md:text-7xl">
              Maria Martinez
            </h2>

            <p className="mt-6 text-lg font-medium leading-8 text-[#52657D] sm:text-xl sm:leading-9">
              {mariaBio}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="/todos-los-dias/ministerios/estudio-biblico"
                className="rounded-full bg-[#071A33] px-7 py-4 text-center text-sm font-black text-white hover:bg-[#164B8F]"
              >
                Ver Estudio Bíblico
              </a>

              <a
                href="tel:7144897013"
                className="rounded-full bg-[#F5F8FC] px-7 py-4 text-center text-sm font-black text-[#071A33] hover:bg-[#BBD7FF]"
              >
                Llamar: 714-489-7013
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F5F8FC] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-4xl">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-[#164B8F]">
              Equipo ministerial
            </p>
            <h2 className="mt-3 text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
              Líderes y áreas de servicio
            </h2>
            <p className="mt-5 text-lg font-medium leading-8 text-[#52657D]">
              Esta sección puede crecer conforme la iglesia confirme líderes,
              fotos y horarios de cada ministerio.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {ministryLeaders.map((leader) => (
              <article
                key={leader.ministry}
                className="overflow-hidden border-t-4 border-[#164B8F] bg-white shadow-sm"
              >
                {leader.photo ? (
                  <img
                    src={leader.photo}
                    alt={leader.name}
                    className="h-60 w-full object-cover"
                  />
                ) : null}

                <div className="p-6">
                  <p className="text-sm font-black uppercase tracking-[0.25em] text-[#164B8F]">
                    {leader.ministry}
                  </p>
                  <h3 className="mt-3 text-3xl font-black">{leader.name}</h3>
                  <p className="mt-1 text-sm font-black text-[#52657D]">
                    {leader.role}
                  </p>
                  <p className="mt-4 text-base font-medium leading-7 text-[#52657D]">
                    {leader.description}
                  </p>

                  {leader.href ? (
                    <a
                      href={leader.href}
                      className="mt-5 inline-flex rounded-full bg-[#071A33] px-5 py-3 text-sm font-black text-white hover:bg-[#164B8F]"
                    >
                      Ver ministerio
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#071A33] px-4 py-10 text-white sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <p className="font-black">{todosLosDiasChurch.name}</p>
          <div className="flex flex-wrap gap-3 text-sm font-black">
            <a href="/todos-los-dias" className="bg-white/10 px-4 py-2 hover:bg-white/20">
              Inicio
            </a>
            <a
              href="/todos-los-dias/ministerios/evangelismo"
              className="bg-white/10 px-4 py-2 hover:bg-white/20"
            >
              Ministerios
            </a>
            <a href="/todos-los-dias#donar" className="bg-white/10 px-4 py-2 hover:bg-white/20">
              Donar
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function ValueCard({
  title,
  text,
  red,
}: {
  title: string;
  text: string;
  red?: boolean;
}) {
  return (
    <div
      className={`border-t-4 ${
        red ? "border-[#B1182D]" : "border-[#164B8F]"
      } bg-white p-5 shadow-sm`}
    >
      <p className="text-3xl font-black">{title}</p>
      <p className="mt-2 text-sm font-bold text-[#52657D]">{text}</p>
    </div>
  );
}
