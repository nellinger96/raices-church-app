"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function TodosLosDiasLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);
    setStatus("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setStatus(error.message);
      setIsLoading(false);
      return;
    }

    router.refresh();
    router.push("/todos-los-dias/admin");
  }

  return (
    <main className="min-h-screen bg-[#071A33] px-6 py-12 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden bg-white shadow-2xl lg:grid-cols-[0.9fr_1.1fr]">
          <section className="bg-[#071A33] p-8 text-white md:p-12">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-[#BBD7FF]">
              Raíces Dashboard
            </p>

            <h1 className="mt-4 text-5xl font-black leading-tight md:text-6xl">
              Pastor Login
            </h1>

            <p className="mt-6 text-lg font-medium leading-8 text-white/75">
              Access for Iglesia de Todos los Días leadership only. This
              dashboard is where visitor forms, prayer requests, volunteers,
              announcements, and events will be managed.
            </p>

            <div className="mt-10 border border-white/15 bg-white/10 p-5">
              <p className="text-sm font-black uppercase tracking-[0.25em] text-[#BBD7FF]">
                Church
              </p>
              <p className="mt-2 text-2xl font-black">
                Iglesia de Todos los Días
              </p>
            </div>
          </section>

          <section className="p-8 text-[#071A33] md:p-12">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-[#164B8F]">
              Sign in
            </p>

            <h2 className="mt-3 text-4xl font-black">Welcome back</h2>

            <form onSubmit={handleLogin} className="mt-8 space-y-5">
              <div>
                <label className="text-sm font-black uppercase tracking-[0.2em] text-[#52657D]">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 w-full border-2 border-[#D9E5F5] px-4 py-4 text-lg font-medium outline-none focus:border-[#164B8F]"
                  placeholder="pastor@email.com"
                />
              </div>

              <div>
                <label className="text-sm font-black uppercase tracking-[0.2em] text-[#52657D]">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-2 w-full border-2 border-[#D9E5F5] px-4 py-4 text-lg font-medium outline-none focus:border-[#164B8F]"
                  placeholder="••••••••"
                />
              </div>

              {status ? (
                <div className="border-l-4 border-[#B1182D] bg-[#FFF1F3] p-4 text-sm font-bold text-[#B1182D]">
                  {status}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#071A33] px-6 py-4 text-lg font-black text-white hover:bg-[#164B8F] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Signing in..." : "Sign in to dashboard"}
              </button>
            </form>

            <p className="mt-6 text-sm font-medium leading-6 text-[#52657D]">
              No public account creation is available. Pastor access is created
              by Raíces only.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}