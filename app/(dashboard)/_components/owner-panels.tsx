import Link from "next/link";

type OwnerMetricCardProps = {
  title: string;
  value: string;
  detail: string;
  tone?: "default" | "success" | "warning" | "danger";
  href: string;
  ctaLabel: string;
};

type UrgencyBannerProps = {
  title: string;
  count: number;
  message: string;
  href: string;
  ctaLabel: string;
};

export function OwnerMetricCard({
  title,
  value,
  detail,
  tone = "default",
  href,
  ctaLabel
}: OwnerMetricCardProps) {
  return (
    <article className={`card owner-metric tone-${tone}`}>
      <p className="owner-metric-label">{title}</p>
      <p className="owner-metric-value">{value}</p>
      <p className="muted owner-metric-detail">{detail}</p>
      <Link href={href}>{ctaLabel}</Link>
    </article>
  );
}

export function UrgencyBanner({ title, count, message, href, ctaLabel }: UrgencyBannerProps) {
  return (
    <section className={`card urgency-banner ${count > 0 ? "is-urgent" : ""}`}>
      <div className="urgency-banner-main">
        <p className="urgency-banner-title">
          <span className="pulse-dot" aria-hidden="true" />
          {title}
        </p>
        <h3>
          {count > 0 ? `${count} lead${count === 1 ? "" : "s"} need immediate action` : "No immediate lead alerts"}
        </h3>
        <p className="muted">{message}</p>
      </div>
      <Link href={href} className="button-link">
        {ctaLabel}
      </Link>
    </section>
  );
}
