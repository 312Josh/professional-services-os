import { getCurrentAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage({
  searchParams
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const admin = await getCurrentAdmin();
  if (admin) {
    redirect("/dashboard");
  }

  const error = typeof searchParams?.error === "string" ? searchParams.error : null;

  return (
    <div className="login-wrap">
      <div className="card login-card">
        <h1>BluePipe Plumbing</h1>
        <p className="muted">Admin login for the operations dashboard.</p>
        {error ? <p style={{ color: "#b13a3a" }}>{error}</p> : null}
        <form method="post" action="/api/login">
          <label>
            Email
            <input name="email" type="email" required defaultValue="admin@plumbing.local" />
          </label>
          <label>
            Password
            <input name="password" type="password" required defaultValue="admin123" />
          </label>
          <button type="submit">Sign In</button>
        </form>
        <small>Seed credentials: admin@plumbing.local / admin123</small>
      </div>
    </div>
  );
}