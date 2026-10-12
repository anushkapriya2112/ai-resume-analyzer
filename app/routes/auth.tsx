import type { Route } from "./+types/auth";
import { usePuterStore } from "~/lib/puter";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

export const meta = () => [
  { title: "Resumind | Auth" },
  { name: "description", content: "Log into your account" },
];

const Auth = () => {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const navigate = useNavigate();

  const next = new URLSearchParams(location.search).get("next") || "/";

  useEffect(() => {
    if (auth?.isAuthenticated) {
      navigate(next);
    }
  }, [auth?.isAuthenticated, next, navigate]);

  return (
    <main className="bg-[url('/images/bg-auth.svg')] bg-cover bg-no-repeat min-h-screen flex items-center justify-center p-4">
      <div className="gradient-border shadow-xl rounded-3xl p-2 max-w-md w-full">
        <section className="flex flex-col gap-6 bg-white rounded-2xl p-8 sm:p-10 text-center">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-4xl font-extrabold tracking-tight">Welcome</h1>
            <h2 className="text-sm text-gray-500 font-normal">
              Log In To Continue Your Journey
            </h2>
          </div>

          <div className="w-full mt-2">
            {isLoading ? (
              <button className="auth-button animate-pulse" disabled>
                <p>Signing you in...</p>
              </button>
            ) : auth?.isAuthenticated ? (
              <button className="auth-button" onClick={() => auth.signOut()}>
                <p>Log Out</p>
              </button>
            ) : (
              <button className="auth-button" onClick={() => auth.signIn()}>
                <p>Log In</p>
              </button>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Auth;