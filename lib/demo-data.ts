export const church = {
  name: "The Main Place Español",
  platformName: "Raíces",
  tagline: "Plataforma de discipulado para la iglesia local",
  heroTitle:
    "Formamos discípulos. Transformamos vidas. Impactamos generaciones.",
  heroDescription:
    "Un espacio digital para ayudar a nuestra comunidad a crecer en la fe, tomar cursos bíblicos, conectarse con la iglesia y dar su próximo paso con Jesús.",
  youtubeUrl: "https://www.youtube.com",
};

export const sermons = [
  {
    title: "Jesús transforma vidas",
    description:
      "Un mensaje sobre el poder de Cristo para traer libertad, identidad y nuevo comienzo.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    title: "Formados para seguir a Jesús",
    description:
      "Una enseñanza sobre el discipulado y el llamado de caminar con Cristo cada día.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    title: "Una fe que impacta generaciones",
    description:
      "Un mensaje sobre la influencia espiritual que dejamos en nuestra familia y comunidad.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
];

export const events = [
  {
    date: "Domingo · 10:00 AM",
    title: "Servicio Familiar",
    location: "The Main Place",
    description:
      "Un tiempo de adoración, enseñanza bíblica y comunidad para toda la familia.",
  },
  {
    date: "Miércoles · 7:00 PM",
    title: "Estudio Bíblico",
    location: "Salón principal",
    description:
      "Crecemos juntos en la Palabra con conversación, oración y aplicación práctica.",
  },
  {
    date: "Sábado · 9:00 AM",
    title: "Alcance Comunitario",
    location: "Punto de reunión por confirmar",
    description:
      "Servimos a nuestra comunidad con amor, oración y apoyo práctico.",
  },
];

export const announcements = [
  {
    title: "Inscripciones abiertas",
    description: "Ya puedes registrarte para el curso Fundamentos de la Biblia.",
  },
  {
    title: "Petición de oración",
    description:
      "Si necesitas oración, llena el formulario Soy Nuevo y nuestro equipo se comunicará contigo.",
  },
  {
    title: "Voluntarios",
    description:
      "Estamos formando equipos para bienvenida, multimedia y alcance comunitario.",
  },
];

export const courses = [
  {
    title: "Fundamentos de la Biblia",
    description:
      "Un curso de 6 semanas para entender las bases de la fe cristiana.",
    lessons: 6,
    totalLessons: 6,
    lessonsCompleted: 4,
    level: "Principiante",
    status: "En progreso",
    nextLesson: "¿Qué es la salvación?",
    progress: 67,
    href: "/cursos/fundamentos",
  },
  {
    title: "Nuevo Creyente",
    description:
      "Un camino sencillo para personas que están comenzando su relación con Jesús.",
    lessons: 5,
    totalLessons: 5,
    lessonsCompleted: 1,
    level: "Principiante",
    status: "En progreso",
    nextLesson: "Tu nueva identidad en Cristo",
    progress: 25,
    href: "/cursos/fundamentos",
  },
  {
    title: "Preparación para Bautismo",
    description:
      "Aprende el significado bíblico del bautismo y cómo prepararte para este próximo paso.",
    lessons: 4,
    totalLessons: 4,
    lessonsCompleted: 0,
    level: "Próximo paso",
    status: "No iniciado",
    nextLesson: "¿Qué significa el bautismo?",
    progress: 0,
    href: "/cursos/fundamentos",
  },
];

export const courseLessons = [
  {
    number: 1,
    title: "¿Qué es la Biblia?",
    completed: true,
  },
  {
    number: 2,
    title: "¿Quién es Dios?",
    completed: true,
  },
  {
    number: 3,
    title: "¿Quién es Jesús?",
    completed: true,
  },
  {
    number: 4,
    title: "¿Qué es la salvación?",
    completed: false,
  },
  {
    number: 5,
    title: "La oración y la vida diaria",
    completed: false,
  },
  {
    number: 6,
    title: "La iglesia y mi próximo paso",
    completed: false,
  },
];

export const courseTemplates = [
  {
    title: "Fundamentos de la Biblia",
    description: "Curso base para nuevos creyentes y personas aprendiendo la fe.",
    lessons: [
      "¿Qué es la Biblia?",
      "¿Quién es Dios?",
      "¿Quién es Jesús?",
      "¿Qué es la salvación?",
      "La oración y la vida diaria",
      "La iglesia y mi próximo paso",
    ],
  },
  {
    title: "Nuevo Creyente",
    description: "Un camino sencillo para personas comenzando su vida en Cristo.",
    lessons: [
      "Mi nueva identidad en Cristo",
      "Cómo leer la Biblia",
      "Cómo orar",
      "La importancia de la iglesia",
      "Mis próximos pasos",
    ],
  },
  {
    title: "Preparación para Bautismo",
    description: "Curso para explicar el significado bíblico del bautismo.",
    lessons: [
      "¿Qué significa el bautismo?",
      "¿Por qué nos bautizamos?",
      "El testimonio personal",
      "Preparación para el día del bautismo",
    ],
  },
];

export const adminStats = [
  {
    label: "Visitantes nuevos",
    value: "12",
    description: "Personas que llenaron Soy Nuevo",
  },
  {
    label: "Peticiones de oración",
    value: "5",
    description: "Solicitudes pendientes de seguimiento",
  },
  {
    label: "Estudiantes activos",
    value: "38",
    description: "Personas tomando cursos",
  },
  {
    label: "Cursos publicados",
    value: "3",
    description: "Cursos disponibles para la iglesia",
  },
];

export const visitors = [
  {
    name: "María González",
    type: "Soy Nuevo",
    contact: "maria@email.com",
    note: "Quiere información sobre estudios bíblicos.",
    status: "Pendiente",
  },
  {
    name: "Carlos Ramírez",
    type: "Oración",
    contact: "(909) 555-0192",
    note: "Pidió oración por su familia.",
    status: "Pendiente",
  },
  {
    name: "Ana López",
    type: "Bautismo",
    contact: "ana@email.com",
    note: "Interesada en preparación para bautismo.",
    status: "Contactada",
  },
];

export const adminCourseProgress = [
  {
    title: "Fundamentos de la Biblia",
    students: 24,
    completion: 67,
    status: "Publicado",
  },
  {
    title: "Nuevo Creyente",
    students: 11,
    completion: 35,
    status: "Publicado",
  },
  {
    title: "Preparación para Bautismo",
    students: 6,
    completion: 10,
    status: "Borrador",
  },
];

export const nextSteps = [
  "Completar la próxima lección",
  "Escribir una reflexión personal",
  "Enviar una petición de oración",
];