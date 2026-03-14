type EmailStatus = "pending" | "sent" | "failed";

const STATUS_STYLES: Record<EmailStatus, string> = {
  pending: "bg-muted text-muted-foreground",
  sent: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const STATUS_LABELS: Record<EmailStatus, string> = {
  pending: "Pending",
  sent: "Sent",
  failed: "Failed",
};

type EmailStatusBadgeProps = {
  status: EmailStatus;
};

export function EmailStatusBadge({ status }: EmailStatusBadgeProps) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
