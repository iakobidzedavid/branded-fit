// Pica Gmail passthrough email sender
// Reads PICA_API_URL, PICA_SECRET, PICA_GMAIL_CONNECTION_KEY from env.
// Action ID is the stable Pica platform constant for Gmail users.messages.send.

const GMAIL_SEND_ACTION_ID = "conn_mod_def::GJ3odhCpd3I::gujvYoneSk6NFWltse9bGg";
const GMAIL_FROM = "Branded Fit <iakobidze94@gmail.com>";

function buildRawEmail(to: string, subject: string, body: string): string {
  const raw =
    `From: ${GMAIL_FROM}\r\n` +
    `To: ${to}\r\n` +
    `Subject: ${subject}\r\n` +
    `Content-Type: text/plain; charset=utf-8\r\n` +
    `\r\n` +
    body;
  return Buffer.from(raw).toString("base64url");
}

export interface PicaSendResult {
  messageId: string | null;
  error: string | null;
}

export async function sendViaGmail(
  to: string,
  subject: string,
  body: string
): Promise<PicaSendResult> {
  const apiUrl = process.env.PICA_API_URL ?? "https://api.picaos.com";
  const secret = process.env.PICA_SECRET;
  const connectionKey = process.env.PICA_GMAIL_CONNECTION_KEY;

  if (!secret || !connectionKey) {
    return {
      messageId: null,
      error: "PICA_SECRET or PICA_GMAIL_CONNECTION_KEY not set in env",
    };
  }

  const raw = buildRawEmail(to, subject, body);

  try {
    const res = await fetch(
      `${apiUrl}/v1/passthrough/gmail/v1/users/me/messages/send`,
      {
        method: "POST",
        headers: {
          "x-pica-secret": secret,
          "x-pica-connection-key": connectionKey,
          "x-pica-action-id": GMAIL_SEND_ACTION_ID,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ raw }),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      return {
        messageId: null,
        error: `Pica ${res.status}: ${text.slice(0, 200)}`,
      };
    }

    const data = (await res.json()) as { id?: string };
    return { messageId: data.id ?? null, error: null };
  } catch (err) {
    return { messageId: null, error: String(err) };
  }
}
