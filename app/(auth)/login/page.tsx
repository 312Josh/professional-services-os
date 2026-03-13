import { getCurrentAdmin, sanitizeRedirectPath } from "@/lib/auth";
import { appConfig } from "@/lib/app-config";
import { redirect } from "next/navigation";

export default async function LoginPage({
  searchParams
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const nextPath = sanitizeRedirectPath(typeof searchParams?.next === "string" ? searchParams.next : null);
  const admin = await getCurrentAdmin();
  if (admin) {
    redirect(nextPath || "/dashboard");
  }

  const error = typeof searchParams?.error === "string" ? searchParams.error : null;

  return (
    <div className="login-wrap">
      <div className="card login-card">
        <h1>{appConfig.brand.businessName}</h1>
        <p className="muted">{appConfig.copy.loginSubtitle}</p>
        {error ? <p style={{ color: "#b13a3a" }}>{error}</p> : null}
        <form method="post" action="/api/login">
          {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}
          <label>
            Email
            <input name="email" type="email" required defaultValue={appConfig.auth.demoAdminEmail} />
          </label>
          <label>
            Password
            <input name="password" type="password" required defaultValue={appConfig.auth.demoAdminPassword} />
          </label>
          <button type="submit">Sign In</button>
        </form>
        <small>
          Seed credentials: {appConfig.auth.demoAdminEmail} / {appConfig.auth.demoAdminPassword}
        </small>
      </div>
    </div>
  );
}
