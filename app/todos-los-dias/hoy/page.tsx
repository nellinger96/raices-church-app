"use client";

import { useEffect, useMemo, useState } from "react";
import { todosLosDiasChurch } from "@/lib/churches/todos-los-dias";
import { createClient } from "@/lib/supabase/client";

type FaithStory = {
  id: string;
  title: string;
  caption: string | null;
  verse_reference: string | null;
  verse_text: string | null;
  devotional_text: string | null;
  prayer_focus: string | null;
  media_url: string | null;
  media_type: "video" | "image" | "none";
  expires_at: string | null;
  created_at: string;
};

export default function HoyConDiosPage() {
  const [stories, setStories] = useState<FaithStory[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const activeStory = activeIndex !== null ? stories[activeIndex] : null;

  useEffect(() => {
    async function loadStories() {
      setIsLoading(true);

      const supabase = createClient();

      const { data: church } = await supabase
        .from("churches")
        .select("id")
        .eq("slug", "todos-los-dias")
        .single();

      if (!church) {
        setStories([]);
        setIsLoading(false);
        return;
      }

      const { data } = await supabase
        .from("faith_stories")
        .select(
          "id, title, caption, verse_reference, verse_text, devotional_text, prayer_focus, media_url, media_type, expires_at, created_at",
        )
        .eq("church_id", church.id)
        .eq("story_type", "pastor")
        .eq("status", "approved")
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });

      const now = new Date();

      const activeStories =
        (data as FaithStory[] | null)?.filter((story) => {
          return !story.expires_at || new Date(story.expires_at) > now;
        }) ?? [];

      setStories(activeStories);
      setIsLoading(false);
    }

    loadStories();
  }, []);

  function openStory(index: number) {
    setActiveIndex(index);
  }

  function closeStory() {
    setActiveIndex(null);
  }

  function nextStory() {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex + 1) % stories.length);
  }

  function previousStory() {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex - 1 + stories.length) % stories.length);
  }

  const featuredStory = useMemo(() => stories[0], [stories]);

  return (
    <main className="min-h-screen bg-[#F5F8FC] text-[#071A33]">
      <section className="relative overflow-hidden bg-[#071A33] px-4 py-8 text-white sm:px-6">
        <div className="absolute inset-0">
          <img
            src="/todos-los-dias/worship.png"
            alt="Hoy con Dios"
            className="h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(7,26,51,0.98),rgba(7,26,51,0.75),rgba(7,26,51,0.96))]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <header className="flex items-center justify-between gap-4">
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
                <p className="font-black">Hoy con Dios</p>
              </div>
            </a>

            <a
              href="/todos-los-dias"
              className="rounded-full bg-white px-5 py-3 text-sm font-black text-[#071A33] hover:bg-[#BBD7FF]"
            >
              Inicio
            </a>
          </header>

          <div className="grid gap-10 py-16 lg:grid-cols-[1fr_0.8fr] lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.35em] text-[#BBD7FF]">
                Versículo · Devocional · Enfoque de oración
              </p>

              <h1 className="mt-5 text-5xl font-black leading-tight sm:text-6xl md:text-8xl">
                Hoy con Dios
              </h1>

              <p className="mt-6 max-w-3xl text-lg font-medium leading-8 text-white/80 sm:text-xl">
                Un espacio diario para recibir una palabra breve, una reflexión
                pastoral y un enfoque de oración para tu día.
              </p>
            </div>

            <div className="bg-white/10 p-5 backdrop-blur">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#BBD7FF]">
                Historia destacada
              </p>
              <h2 className="mt-3 text-3xl font-black">
                {featuredStory?.title ?? "Próximamente"}
              </h2>
              <p className="mt-3 text-sm font-bold leading-7 text-white/70">
                {featuredStory?.caption ??
                  "Pastor Socrates podrá subir videos, versículos y devocionales desde su dashboard."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-7xl">
          {isLoading ? (
            <div className="bg-white p-8 text-center shadow-sm">
              <p className="text-lg font-black">Cargando historias...</p>
            </div>
          ) : stories.length ? (
            <>
              <div className="flex gap-4 overflow-x-auto pb-5">
                {stories.map((story, index) => (
                  <button
                    key={story.id}
                    onClick={() => openStory(index)}
                    className="w-28 shrink-0 text-center"
                  >
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#B1182D] via-[#164B8F] to-[#071A33] p-1 shadow-lg">
                      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white">
                        {story.media_type === "image" && story.media_url ? (
                          <img
                            src={story.media_url}
                            alt={story.title}
                            className="h-full w-full object-cover"
                          />
                        ) : story.media_type === "video" && story.media_url ? (
                          <video
                            src={story.media_url}
                            className="h-full w-full object-cover"
                            muted
                            playsInline
                          />
                        ) : (
                          <span className="text-2xl font-black text-[#164B8F]">
                            ✝
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm font-black">
                      {story.title}
                    </p>
                  </button>
                ))}
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
                <div className="bg-white p-6 shadow-sm sm:p-8">
                  <p className="text-sm font-black uppercase tracking-[0.3em] text-[#164B8F]">
                    Última palabra
                  </p>
                  <h2 className="mt-3 text-4xl font-black sm:text-5xl">
                    {featuredStory?.title}
                  </h2>

                  {featuredStory?.verse_reference ? (
                    <p className="mt-5 text-xl font-black text-[#B1182D]">
                      {featuredStory.verse_reference}
                    </p>
                  ) : null}

                  {featuredStory?.verse_text ? (
                    <p className="mt-3 border-l-4 border-[#164B8F] bg-[#F5F8FC] p-4 text-lg font-medium leading-8">
                      “{featuredStory.verse_text}”
                    </p>
                  ) : null}

                  {featuredStory?.devotional_text ? (
                    <p className="mt-5 whitespace-pre-wrap text-lg font-medium leading-8 text-[#52657D]">
                      {featuredStory.devotional_text}
                    </p>
                  ) : null}

                  {featuredStory?.prayer_focus ? (
                    <div className="mt-6 bg-[#071A33] p-5 text-white">
                      <p className="text-xs font-black uppercase tracking-[0.25em] text-[#BBD7FF]">
                        Enfoque de oración
                      </p>
                      <p className="mt-3 text-lg font-medium leading-8">
                        {featuredStory.prayer_focus}
                      </p>
                    </div>
                  ) : null}
                </div>

                <button
                  onClick={() => openStory(0)}
                  className="min-h-[420px] overflow-hidden bg-[#071A33] text-left text-white shadow-xl"
                >
                  {featuredStory?.media_url &&
                  featuredStory.media_type === "video" ? (
                    <video
                      src={featuredStory.media_url}
                      className="h-full min-h-[420px] w-full object-cover opacity-80"
                      muted
                      playsInline
                    />
                  ) : featuredStory?.media_url &&
                    featuredStory.media_type === "image" ? (
                    <img
                      src={featuredStory.media_url}
                      alt={featuredStory.title}
                      className="h-full min-h-[420px] w-full object-cover opacity-80"
                    />
                  ) : (
                    <div className="flex min-h-[420px] items-center justify-center p-8 text-center">
                      <p className="text-4xl font-black">Ver historia</p>
                    </div>
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="bg-white p-8 text-center shadow-sm">
              <p className="text-sm font-black uppercase tracking-[0.3em] text-[#164B8F]">
                Próximamente
              </p>
              <h2 className="mt-3 text-4xl font-black">Historias pastorales</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg font-medium leading-8 text-[#52657D]">
                Cuando Pastor Socrates suba el versículo del día, devocional o
                enfoque de oración, aparecerá aquí.
              </p>
            </div>
          )}
        </div>
      </section>

      {activeStory ? (
        <StoryViewer
          stories={stories}
          activeIndex={activeIndex ?? 0}
          onClose={closeStory}
          onNext={nextStory}
          onPrevious={previousStory}
        />
      ) : null}
    </main>
  );
}

function StoryViewer({
  stories,
  activeIndex,
  onClose,
  onNext,
  onPrevious,
}: {
  stories: FaithStory[];
  activeIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}) {
  const story = stories[activeIndex];

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white">
      <div className="absolute left-0 right-0 top-0 z-20 flex gap-1 p-3">
        {stories.map((item, index) => (
          <div
            key={item.id}
            className={`h-1 flex-1 rounded-full ${
              index <= activeIndex ? "bg-white" : "bg-white/25"
            }`}
          />
        ))}
      </div>

      <button
        onClick={onClose}
        className="absolute right-4 top-8 z-30 rounded-full bg-white/15 px-4 py-2 text-sm font-black backdrop-blur hover:bg-white/25"
      >
        Cerrar
      </button>

      <button
        onClick={onPrevious}
        className="absolute bottom-0 left-0 top-0 z-10 w-1/3"
        aria-label="Historia anterior"
      />

      <button
        onClick={onNext}
        className="absolute bottom-0 right-0 top-0 z-10 w-1/3"
        aria-label="Siguiente historia"
      />

      <div className="flex h-full items-center justify-center">
        <div className="relative h-full w-full max-w-[520px] overflow-hidden bg-[#071A33]">
          {story.media_url && story.media_type === "video" ? (
            <video
              key={story.id}
              src={story.media_url}
              className="h-full w-full object-cover"
              controls
              autoPlay
              playsInline
            />
          ) : story.media_url && story.media_type === "image" ? (
            <img
              src={story.media_url}
              alt={story.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-8 text-center">
              <p className="text-5xl font-black">Hoy con Dios</p>
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/75 to-transparent p-6 pt-28">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#BBD7FF]">
              Hoy con Dios
            </p>
            <h2 className="mt-2 text-3xl font-black">{story.title}</h2>

            {story.verse_reference ? (
              <p className="mt-3 text-lg font-black text-[#BBD7FF]">
                {story.verse_reference}
              </p>
            ) : null}

            {story.caption ? (
              <p className="mt-3 text-base font-medium leading-7 text-white/85">
                {story.caption}
              </p>
            ) : null}

            {story.prayer_focus ? (
              <p className="mt-4 text-sm font-bold leading-6 text-white/75">
                Oración: {story.prayer_focus}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
