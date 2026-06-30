import { resend, emailConfigured } from '../config/resend';
import { env } from '../config/env';

const RESTAURANT = {
  name: 'GRINDHOUSE',
  tagline: 'No shortcuts. No apologies.',
  address: '247 West 14th St, New York, NY 10011',
  phone: '+1 (212) 555-0147',
};

const RED = '#E63312';
const BLACK = '#0D0D0D';
const YELLOW = '#FFD600';

/**
 * Demo email mode. There is no verified Resend domain for grindhouse.com, so
 * we send from Resend's shared sender (`onboarding@resend.dev`) and route every
 * message to the owner's inbox — making the full confirmation/notification flow
 * visible end-to-end. The original intended recipient is shown in the subject.
 *
 * For real delivery to actual customers: verify a domain in Resend, set
 * EMAIL_FROM to an address on it, and flip DEMO_MODE to false.
 */
const DEMO_MODE = true;
const DEMO_TO = process.env.EMAIL_DEMO_TO || 'waxent@sasuke.ru';
const DEMO_FROM = 'GRINDHOUSE <onboarding@resend.dev>';

interface ReservationEmailData {
  name: string;
  email: string;
  phone: string;
  dateLabel: string; // already formatted, e.g. "Saturday, June 21, 2026"
  time: string;
  guests: number;
  notes?: string | null;
}

interface ContactEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/* ---------- low level send helper (degrades gracefully) ---------- */

async function send(opts: {
  to: string | string[];
  subject: string;
  html: string;
}): Promise<{ sent: boolean; id?: string; error?: string }> {
  if (!emailConfigured || !resend) {
    // eslint-disable-next-line no-console
    console.log(`[email:skipped] "${opts.subject}" -> ${opts.to} (RESEND_API_KEY not set)`);
    return { sent: false };
  }

  const intended = Array.isArray(opts.to) ? opts.to.join(', ') : opts.to;
  const from = DEMO_MODE ? DEMO_FROM : `${RESTAURANT.name} <${env.emailFrom}>`;
  const to = DEMO_MODE ? DEMO_TO : opts.to;
  const subject = DEMO_MODE ? `[Demo → ${intended}] ${opts.subject}` : opts.subject;

  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html: opts.html,
    });
    if (error) {
      // eslint-disable-next-line no-console
      console.error('[email:error]', error);
      return { sent: false, error: error.message };
    }
    return { sent: true, id: data?.id };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[email:exception]', err);
    return { sent: false, error: err instanceof Error ? err.message : 'unknown error' };
  }
}

/* ---------- shared layout ---------- */

function shell(innerHtml: string): string {
  return `
  <div style="margin:0;padding:0;background:${BLACK};font-family:'Helvetica Neue',Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:${BLACK};">
      <div style="background:${RED};padding:28px 32px;">
        <div style="font-size:34px;font-weight:900;letter-spacing:3px;color:#fff;text-transform:uppercase;">
          ${RESTAURANT.name}
        </div>
        <div style="font-size:12px;letter-spacing:2px;color:#fff;opacity:.85;text-transform:uppercase;margin-top:4px;">
          ${RESTAURANT.tagline}
        </div>
      </div>
      <div style="padding:32px;color:#F5F5F0;">
        ${innerHtml}
      </div>
      <div style="padding:24px 32px;border-top:2px solid ${RED};color:#888;font-size:12px;line-height:1.7;">
        <div style="color:${YELLOW};letter-spacing:2px;text-transform:uppercase;font-size:11px;margin-bottom:6px;">Find us</div>
        ${RESTAURANT.address}<br/>
        ${RESTAURANT.phone}
      </div>
    </div>
  </div>`;
}

function detailRow(label: string, value: string): string {
  return `
  <tr>
    <td style="padding:10px 0;border-bottom:1px solid #222;color:#888;font-size:12px;letter-spacing:1px;text-transform:uppercase;width:40%;">${label}</td>
    <td style="padding:10px 0;border-bottom:1px solid #222;color:#F5F5F0;font-size:15px;font-weight:700;">${value}</td>
  </tr>`;
}

/* ---------- public API ---------- */

/** Confirmation email sent to the customer after booking. */
export async function sendReservationConfirmation(data: ReservationEmailData) {
  const inner = `
    <div style="font-size:13px;letter-spacing:2px;color:${RED};text-transform:uppercase;">Reservation received</div>
    <h1 style="font-size:30px;margin:8px 0 4px;color:#fff;text-transform:uppercase;letter-spacing:1px;">You're booked.</h1>
    <p style="color:#bbb;font-size:15px;line-height:1.6;margin:0 0 24px;">
      Hey ${data.name}, your table at GRINDHOUSE is locked in. Here are the details:
    </p>
    <table style="width:100%;border-collapse:collapse;">
      ${detailRow('Name', data.name)}
      ${detailRow('Date', data.dateLabel)}
      ${detailRow('Time', data.time)}
      ${detailRow('Guests', String(data.guests))}
      ${data.notes ? detailRow('Notes', data.notes) : ''}
    </table>
    <p style="color:#bbb;font-size:14px;line-height:1.6;margin:24px 0 0;">
      See you soon. Come hungry. If anything changes, reply to this email or call us at ${RESTAURANT.phone}.
    </p>`;
  return send({
    to: data.email,
    subject: 'Reservation confirmed — GRINDHOUSE',
    html: shell(inner),
  });
}

/** Internal notification to the restaurant about a new booking. */
export async function sendReservationNotification(data: ReservationEmailData) {
  const inner = `
    <div style="font-size:13px;letter-spacing:2px;color:${YELLOW};text-transform:uppercase;">New reservation</div>
    <h1 style="font-size:26px;margin:8px 0 16px;color:#fff;text-transform:uppercase;">Table request</h1>
    <table style="width:100%;border-collapse:collapse;">
      ${detailRow('Name', data.name)}
      ${detailRow('Email', data.email)}
      ${detailRow('Phone', data.phone)}
      ${detailRow('Date', data.dateLabel)}
      ${detailRow('Time', data.time)}
      ${detailRow('Guests', String(data.guests))}
      ${data.notes ? detailRow('Notes', data.notes) : ''}
    </table>`;
  return send({
    to: env.restaurantEmail,
    subject: `New reservation — ${data.name}, ${data.dateLabel} @ ${data.time}`,
    html: shell(inner),
  });
}

/** Confirmation sent to customer when admin confirms their booking. */
export async function sendReservationStatusEmail(
  data: ReservationEmailData,
  status: 'CONFIRMED' | 'CANCELLED',
) {
  const confirmed = status === 'CONFIRMED';
  const inner = `
    <div style="font-size:13px;letter-spacing:2px;color:${confirmed ? RED : '#888'};text-transform:uppercase;">
      Reservation ${confirmed ? 'confirmed' : 'cancelled'}
    </div>
    <h1 style="font-size:30px;margin:8px 0 4px;color:#fff;text-transform:uppercase;letter-spacing:1px;">
      ${confirmed ? "You're confirmed." : 'Booking cancelled'}
    </h1>
    <p style="color:#bbb;font-size:15px;line-height:1.6;margin:0 0 24px;">
      ${
        confirmed
          ? `Hey ${data.name}, your table is officially confirmed. We can't wait to feed you.`
          : `Hey ${data.name}, your reservation has been cancelled. Hope to see you another time — walk-ins are always welcome.`
      }
    </p>
    <table style="width:100%;border-collapse:collapse;">
      ${detailRow('Date', data.dateLabel)}
      ${detailRow('Time', data.time)}
      ${detailRow('Guests', String(data.guests))}
    </table>`;
  return send({
    to: data.email,
    subject: confirmed
      ? 'Reservation confirmed — GRINDHOUSE'
      : 'Reservation cancelled — GRINDHOUSE',
    html: shell(inner),
  });
}

/** Internal notification to the restaurant about a new contact message. */
export async function sendContactNotification(data: ContactEmailData) {
  const inner = `
    <div style="font-size:13px;letter-spacing:2px;color:${YELLOW};text-transform:uppercase;">New message</div>
    <h1 style="font-size:26px;margin:8px 0 16px;color:#fff;text-transform:uppercase;">${data.subject}</h1>
    <table style="width:100%;border-collapse:collapse;">
      ${detailRow('From', data.name)}
      ${detailRow('Email', data.email)}
    </table>
    <p style="color:#F5F5F0;font-size:15px;line-height:1.7;margin:20px 0 0;white-space:pre-wrap;">${data.message}</p>`;
  return send({
    to: env.restaurantEmail,
    subject: `Contact form: ${data.subject}`,
    html: shell(inner),
  });
}
