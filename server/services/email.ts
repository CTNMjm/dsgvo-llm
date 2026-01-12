import nodemailer from 'nodemailer';

// Email configuration - uses environment variables
const getTransporter = () => {
  // Check if SMTP credentials are configured
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || '587');
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  
  if (!smtpHost || !smtpUser || !smtpPass) {
    console.warn('[Email] SMTP not configured - emails will be logged only');
    return null;
  }
  
  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
};

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@llm-vergleich.de';
const SITE_NAME = 'LLM-Plattform Vergleich';
const SITE_URL = process.env.SITE_URL || 'https://llm-vergleich.de';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const transporter = getTransporter();
  
  // Log email for debugging
  console.log(`[Email] Sending to: ${options.to}`);
  console.log(`[Email] Subject: ${options.subject}`);
  
  if (!transporter) {
    // If no SMTP configured, just log the email content
    console.log(`[Email] Content (logged only - SMTP not configured):`);
    console.log(options.text || options.html);
    return true; // Return true so the app continues to work
  }
  
  try {
    await transporter.sendMail({
      from: `"${SITE_NAME}" <${FROM_EMAIL}>`,
      ...options,
    });
    console.log(`[Email] Successfully sent to ${options.to}`);
    return true;
  } catch (error) {
    console.error('[Email] Failed to send:', error);
    return false;
  }
}

// ============================================
// Notification Templates
// ============================================

export async function notifyNewLead(lead: {
  name: string;
  email: string;
  company?: string | null;
  platformName?: string | null;
  interest?: string | null;
  message?: string | null;
}) {
  const interestLabels: Record<string, string> = {
    demo: 'Live Demo',
    quote: 'Angebot',
    trial: 'Testzugang',
    info: 'Informationen'
  };
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0F172A; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; }
        .label { font-weight: 600; color: #64748b; font-size: 12px; text-transform: uppercase; }
        .value { font-size: 16px; margin-bottom: 16px; }
        .highlight { background: #f97316; color: white; padding: 2px 8px; border-radius: 4px; font-size: 14px; }
        .footer { margin-top: 20px; font-size: 12px; color: #94a3b8; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 20px;">🎯 Neuer Lead eingegangen</h1>
        </div>
        <div class="content">
          <p class="label">Kontakt</p>
          <p class="value"><strong>${lead.name}</strong><br>${lead.email}</p>
          
          ${lead.company ? `<p class="label">Firma</p><p class="value">${lead.company}</p>` : ''}
          
          ${lead.platformName ? `<p class="label">Interessiert an</p><p class="value"><span class="highlight">${lead.platformName}</span></p>` : ''}
          
          ${lead.interest ? `<p class="label">Art der Anfrage</p><p class="value">${interestLabels[lead.interest] || lead.interest}</p>` : ''}
          
          ${lead.message ? `<p class="label">Nachricht</p><p class="value">${lead.message}</p>` : ''}
          
          <div class="footer">
            <p>Diese Benachrichtigung wurde automatisch von ${SITE_NAME} gesendet.</p>
            <p><a href="${SITE_URL}/admin">Zum Admin-Dashboard →</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
Neuer Lead eingegangen

Kontakt: ${lead.name} (${lead.email})
${lead.company ? `Firma: ${lead.company}` : ''}
${lead.platformName ? `Plattform: ${lead.platformName}` : ''}
${lead.interest ? `Interesse: ${interestLabels[lead.interest] || lead.interest}` : ''}
${lead.message ? `Nachricht: ${lead.message}` : ''}

---
${SITE_NAME}
${SITE_URL}/admin
  `.trim();
  
  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `[Lead] Neue Anfrage von ${lead.name}${lead.platformName ? ` für ${lead.platformName}` : ''}`,
    html,
    text
  });
}

export async function notifyNewReview(review: {
  authorName: string;
  rating: number;
  title?: string | null;
  content?: string | null;
  platformName?: string;
}) {
  const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0F172A; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; }
        .stars { color: #f97316; font-size: 24px; letter-spacing: 2px; }
        .label { font-weight: 600; color: #64748b; font-size: 12px; text-transform: uppercase; }
        .value { font-size: 16px; margin-bottom: 16px; }
        .quote { background: white; border-left: 4px solid #f97316; padding: 12px 16px; margin: 16px 0; font-style: italic; }
        .footer { margin-top: 20px; font-size: 12px; color: #94a3b8; }
        .badge { background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 16px; font-size: 12px; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 20px;">⭐ Neue Bewertung zur Moderation</h1>
        </div>
        <div class="content">
          <p class="stars">${stars}</p>
          
          <p class="label">Bewerter</p>
          <p class="value">${review.authorName}</p>
          
          ${review.platformName ? `<p class="label">Plattform</p><p class="value">${review.platformName}</p>` : ''}
          
          ${review.title ? `<p class="label">Titel</p><p class="value"><strong>${review.title}</strong></p>` : ''}
          
          ${review.content ? `<div class="quote">"${review.content}"</div>` : ''}
          
          <p><span class="badge">⏳ Wartet auf Freischaltung</span></p>
          
          <div class="footer">
            <p>Diese Bewertung muss im Admin-Dashboard freigeschaltet werden.</p>
            <p><a href="${SITE_URL}/admin">Zur Moderation →</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
Neue Bewertung zur Moderation

Bewertung: ${stars} (${review.rating}/5)
Von: ${review.authorName}
${review.platformName ? `Plattform: ${review.platformName}` : ''}
${review.title ? `Titel: ${review.title}` : ''}
${review.content ? `Inhalt: "${review.content}"` : ''}

Status: Wartet auf Freischaltung

---
${SITE_NAME}
${SITE_URL}/admin
  `.trim();
  
  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `[Bewertung] ${review.rating}★ von ${review.authorName}${review.platformName ? ` für ${review.platformName}` : ''}`,
    html,
    text
  });
}

export async function notifyNewComment(comment: {
  authorName: string;
  content: string;
  postTitle?: string;
}) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0F172A; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; }
        .label { font-weight: 600; color: #64748b; font-size: 12px; text-transform: uppercase; }
        .value { font-size: 16px; margin-bottom: 16px; }
        .quote { background: white; border-left: 4px solid #3b82f6; padding: 12px 16px; margin: 16px 0; }
        .footer { margin-top: 20px; font-size: 12px; color: #94a3b8; }
        .badge { background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 16px; font-size: 12px; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 20px;">💬 Neuer Kommentar zur Moderation</h1>
        </div>
        <div class="content">
          <p class="label">Autor</p>
          <p class="value">${comment.authorName}</p>
          
          ${comment.postTitle ? `<p class="label">Artikel</p><p class="value">${comment.postTitle}</p>` : ''}
          
          <p class="label">Kommentar</p>
          <div class="quote">${comment.content}</div>
          
          <p><span class="badge">⏳ Wartet auf Freischaltung</span></p>
          
          <div class="footer">
            <p>Dieser Kommentar muss im Admin-Dashboard freigeschaltet werden.</p>
            <p><a href="${SITE_URL}/admin">Zur Moderation →</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
Neuer Kommentar zur Moderation

Von: ${comment.authorName}
${comment.postTitle ? `Artikel: ${comment.postTitle}` : ''}

Kommentar:
"${comment.content}"

Status: Wartet auf Freischaltung

---
${SITE_NAME}
${SITE_URL}/admin
  `.trim();
  
  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `[Kommentar] Neuer Kommentar von ${comment.authorName}${comment.postTitle ? ` zu "${comment.postTitle}"` : ''}`,
    html,
    text
  });
}

export async function notifyNewSuggestion(suggestion: {
  type: string;
  platformName?: string | null;
  description: string;
  submitterEmail?: string | null;
}) {
  const typeLabels: Record<string, string> = {
    new_platform: 'Neuer Anbieter',
    correction: 'Korrekturvorschlag',
    feature_request: 'Feature-Wunsch'
  };
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0F172A; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; }
        .label { font-weight: 600; color: #64748b; font-size: 12px; text-transform: uppercase; }
        .value { font-size: 16px; margin-bottom: 16px; }
        .type-badge { background: #f3e8ff; color: #7c3aed; padding: 4px 12px; border-radius: 16px; font-size: 12px; font-weight: 600; }
        .footer { margin-top: 20px; font-size: 12px; color: #94a3b8; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 20px;">💡 Neuer Vorschlag eingegangen</h1>
        </div>
        <div class="content">
          <p><span class="type-badge">${typeLabels[suggestion.type] || suggestion.type}</span></p>
          
          ${suggestion.platformName ? `<p class="label">Anbieter</p><p class="value">${suggestion.platformName}</p>` : ''}
          
          <p class="label">Beschreibung</p>
          <p class="value">${suggestion.description}</p>
          
          ${suggestion.submitterEmail ? `<p class="label">Kontakt</p><p class="value">${suggestion.submitterEmail}</p>` : ''}
          
          <div class="footer">
            <p><a href="${SITE_URL}/admin">Im Admin-Dashboard ansehen →</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
Neuer Vorschlag eingegangen

Typ: ${typeLabels[suggestion.type] || suggestion.type}
${suggestion.platformName ? `Anbieter: ${suggestion.platformName}` : ''}
Beschreibung: ${suggestion.description}
${suggestion.submitterEmail ? `Kontakt: ${suggestion.submitterEmail}` : ''}

---
${SITE_NAME}
${SITE_URL}/admin
  `.trim();
  
  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `[Vorschlag] ${typeLabels[suggestion.type] || suggestion.type}${suggestion.platformName ? `: ${suggestion.platformName}` : ''}`,
    html,
    text
  });
}

export async function notifyNewSubscriber(subscriber: {
  email: string;
  name?: string | null;
}) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0F172A; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; }
        .label { font-weight: 600; color: #64748b; font-size: 12px; text-transform: uppercase; }
        .value { font-size: 16px; margin-bottom: 16px; }
        .footer { margin-top: 20px; font-size: 12px; color: #94a3b8; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 20px;">📬 Neuer Newsletter-Abonnent</h1>
        </div>
        <div class="content">
          <p class="label">E-Mail</p>
          <p class="value">${subscriber.email}</p>
          
          ${subscriber.name ? `<p class="label">Name</p><p class="value">${subscriber.name}</p>` : ''}
          
          <div class="footer">
            <p><a href="${SITE_URL}/admin">Abonnenten verwalten →</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `[Newsletter] Neuer Abonnent: ${subscriber.email}`,
    html,
    text: `Neuer Newsletter-Abonnent: ${subscriber.email}${subscriber.name ? ` (${subscriber.name})` : ''}`
  });
}
