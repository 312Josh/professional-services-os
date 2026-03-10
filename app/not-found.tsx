import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="login-wrap">
      <div className="card login-card">
        <h1>Not Found</h1>
        <p className="muted">The requested record was not found.</p>
        <Link href="/dashboard">Back to dashboard</Link>
      </div>
    </div>
  );
}
