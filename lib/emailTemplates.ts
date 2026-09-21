import type { TicketStatus } from "@/lib/types";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const STATUS_PILL: Record<TicketStatus, { bg: string; color: string; label: string }> = {
  open: { bg: "#e6f0ff", color: "#155eef", label: "Open" },
  in_progress: { bg: "#fef3e0", color: "#b25e09", label: "In Progress" },
  resolved: { bg: "#e8f7ef", color: "#138a4b", label: "Resolved" },
  closed: { bg: "#eef1f6", color: "#667085", label: "Closed" },
};

export function appUrl(): string {
  return process.env.APP_URL || "http://localhost:3000";
}

const BASE_STYLE = `
  body { margin: 0; padding: 0; background: #f4f7fb; font-family: Arial, Helvetica, sans-serif; color: #172033; }
  table { border-spacing: 0; border-collapse: collapse; }
  .email-wrapper { width: 100%; background: #f4f7fb; padding: 40px 15px; }
  .email-container { width: 100%; max-width: 680px; margin: 0 auto; background: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 8px 30px rgba(24, 64, 120, 0.08); }
  .header { background: linear-gradient(135deg, #155eef, #2563eb); padding: 25px 35px; }
  .brand { color: #ffffff; font-size: 22px; font-weight: 700; text-decoration: none; }
  .brand-icon { display: inline-block; width: 38px; height: 38px; line-height: 38px; text-align: center; background: rgba(255, 255, 255, 0.16); border-radius: 10px; margin-right: 10px; vertical-align: middle; font-size: 20px; }
  .content { padding: 38px 40px; }
  .eyebrow { color: #2563eb; font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 10px; }
  h1 { margin: 0 0 10px; font-size: 28px; line-height: 1.25; color: #101828; }
  .intro { margin: 0 0 30px; font-size: 15px; line-height: 1.7; color: #667085; }
  .ticket-card { border: 1px solid #e5eaf2; border-radius: 14px; overflow: hidden; margin-bottom: 25px; }
  .ticket-header { background: #f7faff; padding: 18px 22px; border-bottom: 1px solid #e5eaf2; }
  .ticket-id { color: #2563eb; font-size: 13px; font-weight: 700; }
  .status { float: right; display: inline-block; padding: 6px 12px; border-radius: 30px; font-size: 12px; font-weight: 700; }
  .ticket-body { padding: 22px; }
  .ticket-subject { margin: 0 0 20px; font-size: 20px; font-weight: 700; color: #101828; }
  .details { width: 100%; }
  .details td { padding: 12px 0; border-bottom: 1px solid #edf0f5; font-size: 14px; }
  .details tr:last-child td { border-bottom: 0; }
  .label { width: 38%; color: #667085; }
  .value { color: #172033; font-weight: 600; text-align: right; }
  .section-title { margin: 30px 0 12px; font-size: 15px; font-weight: 700; color: #101828; }
  .message-box { background: #f8fafc; border-left: 4px solid #2563eb; padding: 18px 20px; border-radius: 8px; color: #475467; font-size: 14px; line-height: 1.7; }
  .attachment { background: #f7faff; border: 1px solid #e2e8f5; border-radius: 10px; padding: 14px 16px; font-size: 14px; color: #475467; }
  .cta-wrapper { text-align: center; padding: 10px 0 5px; }
  .cta { display: inline-block; background: #155eef; color: #ffffff !important; text-decoration: none; font-size: 14px; font-weight: 700; padding: 13px 25px; border-radius: 9px; }
  .footer { background: #f8fafc; border-top: 1px solid #edf0f5; padding: 25px 35px; text-align: center; }
  .footer-text { margin: 0 0 8px; font-size: 13px; color: #667085; line-height: 1.6; }
  .footer-brand { color: #155eef; font-weight: 700; }
  .tagline { font-size: 12px; color: #98a2b3; font-style: italic; }
  @media only screen and (max-width: 600px) {
    .email-wrapper { padding: 15px 8px; }
    .header { padding: 20px; }
    .content { padding: 28px 20px; }
    h1 { font-size: 24px; }
    .ticket-header, .ticket-body { padding: 17px; }
    .details td { font-size: 13px; }
    .label { width: 45%; }
    .value { text-align: right; word-break: break-word; }
    .footer { padding: 22px 18px; }
    .cta { display: block; }
  }
`;

function baseTemplate({
  title,
  eyebrow,
  heading,
  intro,
  bodyHtml,
  ctaLabel,
  ctaUrl,
  footerNote,
}: {
  title: string;
  eyebrow: string;
  heading: string;
  intro: string;
  bodyHtml: string;
  ctaLabel: string;
  ctaUrl: string;
  footerNote: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style>${BASE_STYLE}</style>
</head>
<body>
<table class="email-wrapper" width="100%">
  <tr>
    <td align="center">
      <table class="email-container" width="100%">
        <tr>
          <td class="header">
            <span class="brand-icon">⚡</span>
            <span class="brand">ShivWebs</span>
          </td>
        </tr>
        <tr>
          <td class="content">
            <div class="eyebrow">${eyebrow}</div>
            <h1>${heading}</h1>
            <p class="intro">${intro}</p>

            ${bodyHtml}

            <div class="cta-wrapper">
              <a href="${ctaUrl}" class="cta">${ctaLabel} &nbsp; →</a>
            </div>
          </td>
        </tr>

        <tr>
          <td class="footer">
            <p class="footer-text">${footerNote}</p>
            <p class="footer-text">
              This is an automated notification. Please do not reply directly to this email.
            </p>
            <div class="tagline">Modern Websites. Reliable Support.</div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

function ticketCard({
  ticketCode,
  status,
  subject,
  detailRows,
  messageLabel,
  message,
  attachmentCount,
}: {
  ticketCode: string;
  status: TicketStatus;
  subject: string;
  detailRows: Array<[string, string]>;
  messageLabel?: string;
  message?: string;
  attachmentCount?: number;
}): string {
  const pill = STATUS_PILL[status];
  const rows = detailRows
    .map(
      ([label, value]) =>
        `<tr><td class="label">${escapeHtml(label)}</td><td class="value">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  const messageSection =
    message !== undefined
      ? `<div class="section-title">${escapeHtml(messageLabel ?? "Message")}</div>
         <div class="message-box">${escapeHtml(message).replace(/\n/g, "<br>")}</div>`
      : "";

  const attachmentSection =
    attachmentCount && attachmentCount > 0
      ? `<div class="section-title">Attachment${attachmentCount > 1 ? "s" : ""}</div>
         <div class="attachment">📎 ${attachmentCount} image${attachmentCount > 1 ? "s" : ""} attached — view in the ticket</div>`
      : "";

  return `<table class="ticket-card" width="100%">
    <tr>
      <td class="ticket-header">
        <span class="ticket-id">#${escapeHtml(ticketCode)}</span>
        <span class="status" style="background:${pill.bg};color:${pill.color};">● ${pill.label}</span>
      </td>
    </tr>
    <tr>
      <td class="ticket-body">
        <h2 class="ticket-subject">${escapeHtml(subject)}</h2>
        <table class="details" width="100%">${rows}</table>
        ${messageSection}
        ${attachmentSection}
      </td>
    </tr>
  </table>`;
}

type TicketEmailInput = {
  ticketId: string;
  ticketCode: string;
  subject: string;
  status: TicketStatus;
  createdAt?: string;
};

export function newTicketAdminEmail({
  ticketId,
  ticketCode,
  subject,
  companyName,
  companyEmail,
  createdAt,
  message,
  attachmentCount,
  status,
}: TicketEmailInput & {
  companyName: string;
  companyEmail: string;
  createdAt: string;
  message: string;
  attachmentCount: number;
}): string {
  return baseTemplate({
    title: "New Support Ticket",
    eyebrow: "Support Notification",
    heading: "New Support Ticket",
    intro:
      "A new support ticket has been submitted and is waiting for your attention. Please review the details below.",
    bodyHtml: ticketCard({
      ticketCode,
      status,
      subject,
      detailRows: [
        ["Submitted by", companyName],
        ["Email", companyEmail],
        ["Ticket ID", `#${ticketCode}`],
        ["Created", createdAt],
      ],
      messageLabel: "Ticket Message",
      message,
      attachmentCount,
    }),
    ctaLabel: "View Ticket",
    ctaUrl: `${appUrl()}/admin/tickets/${ticketId}`,
    footerNote:
      'Please review this ticket and respond through the <span class="footer-brand">ShivWebs Admin Portal</span>.',
  });
}

export function newCommentAdminEmail({
  ticketId,
  ticketCode,
  subject,
  status,
  companyName,
  message,
  attachmentCount,
}: TicketEmailInput & {
  companyName: string;
  message: string;
  attachmentCount: number;
}): string {
  return baseTemplate({
    title: "New Ticket Comment",
    eyebrow: "Support Notification",
    heading: "New Comment on a Ticket",
    intro: `${companyName} replied to a support ticket. Please review the comment below.`,
    bodyHtml: ticketCard({
      ticketCode,
      status,
      subject,
      detailRows: [
        ["Company", companyName],
        ["Ticket ID", `#${ticketCode}`],
      ],
      messageLabel: "Comment",
      message,
      attachmentCount,
    }),
    ctaLabel: "View Ticket",
    ctaUrl: `${appUrl()}/admin/tickets/${ticketId}`,
    footerNote:
      'Please review this ticket and respond through the <span class="footer-brand">ShivWebs Admin Portal</span>.',
  });
}

export function statusUpdateCompanyEmail({
  ticketId,
  ticketCode,
  subject,
  status,
}: TicketEmailInput): string {
  return baseTemplate({
    title: "Ticket Status Updated",
    eyebrow: "Support Notification",
    heading: "Your Ticket Status Changed",
    intro:
      "Our team has updated the status of your support ticket. See the latest status below.",
    bodyHtml: ticketCard({
      ticketCode,
      status,
      subject,
      detailRows: [["Ticket ID", `#${ticketCode}`]],
    }),
    ctaLabel: "View Ticket",
    ctaUrl: `${appUrl()}/dashboard/tickets/${ticketId}`,
    footerNote: 'You can track this ticket anytime from your <span class="footer-brand">ShivWebs Support Portal</span>.',
  });
}

export function newCommentCompanyEmail({
  ticketId,
  ticketCode,
  subject,
  status,
  message,
  attachmentCount,
}: TicketEmailInput & { message: string; attachmentCount: number }): string {
  return baseTemplate({
    title: "New Reply on Your Ticket",
    eyebrow: "Support Notification",
    heading: "Support Replied to Your Ticket",
    intro: "Our support team has posted a new reply on your ticket. See it below.",
    bodyHtml: ticketCard({
      ticketCode,
      status,
      subject,
      detailRows: [["Ticket ID", `#${ticketCode}`]],
      messageLabel: "Reply",
      message,
      attachmentCount,
    }),
    ctaLabel: "View Ticket",
    ctaUrl: `${appUrl()}/dashboard/tickets/${ticketId}`,
    footerNote: 'You can track this ticket anytime from your <span class="footer-brand">ShivWebs Support Portal</span>.',
  });
}

export function accountApprovedEmail({ companyName }: { companyName: string }): string {
  return baseTemplate({
    title: "Account Approved",
    eyebrow: "Account Notification",
    heading: "Your Account Has Been Approved",
    intro: `Hi ${escapeHtml(companyName)}, your company account has been approved. You can now log in and raise support tickets anytime.`,
    bodyHtml: "",
    ctaLabel: "Log In",
    ctaUrl: `${appUrl()}/login`,
    footerNote: 'Welcome aboard from the <span class="footer-brand">ShivWebs Support Portal</span>.',
  });
}

export function accountRejectedEmail({ companyName }: { companyName: string }): string {
  return baseTemplate({
    title: "Account Not Approved",
    eyebrow: "Account Notification",
    heading: "Your Account Request Was Not Approved",
    intro: `Hi ${escapeHtml(companyName)}, your company account request was not approved. Please contact support for more information.`,
    bodyHtml: "",
    ctaLabel: "Contact Support",
    ctaUrl: process.env.ADMIN_EMAIL ? `mailto:${process.env.ADMIN_EMAIL}` : appUrl(),
    footerNote: 'From the <span class="footer-brand">ShivWebs Support Portal</span>.',
  });
}
