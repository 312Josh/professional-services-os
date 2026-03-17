import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

/**
 * Twilio Inbound SMS Webhook
 * POST /api/sms/inbound
 *
 * Receives incoming SMS replies from prospects, logs them,
 * updates lead status, and creates activity entries.
 *
 * Returns TwiML XML response.
 */

function validateTwilioSignature(url: string, params: Record<string, string>, signature: string, authToken: string): boolean {
  // Build the data string per Twilio's spec
  const data = url + Object.keys(params).sort().map((key) => key + params[key]).join("");
  const expected = crypto.createHmac("sha1", authToken).update(data).digest("base64");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export async function POST(request: Request) {
  try {
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const formData = await request.formData();

    // Extract Twilio params
    const params: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      params[key] = value.toString();
    }

    const from = params.From || "";
    const to = params.To || "";
    const body = params.Body || "";
    const messageSid = params.MessageSid || "";

    // Validate Twilio signature if auth token is configured
    if (authToken) {
      const signature = request.headers.get("x-twilio-signature") || "";
      const url = request.url;
      if (!validateTwilioSignature(url, params, signature, authToken)) {
        console.error("[sms/inbound] Invalid Twilio signature");
        return new Response("<Response></Response>", {
          status: 403,
          headers: { "Content-Type": "text/xml" },
        });
      }
    }

    // Normalize phone number for lookup (strip +1 prefix)
    const normalizedPhone = from.replace(/^\+1/, "").replace(/\D/g, "");
    const phoneVariants = [
      from,
      `+1${normalizedPhone}`,
      normalizedPhone,
      `(${normalizedPhone.slice(0, 3)}) ${normalizedPhone.slice(3, 6)}-${normalizedPhone.slice(6)}`,
    ];

    // Look up lead by phone number
    const lead = await prisma.lead.findFirst({
      where: {
        phone: { in: phoneVariants },
      },
      orderBy: { createdAt: "desc" },
    });

    // Log the SMS
    const smsLog = await prisma.smsLog.create({
      data: {
        leadId: lead?.id || null,
        direction: "inbound",
        fromNumber: from,
        toNumber: to,
        body,
        providerMessageId: messageSid,
        provider: "twilio",
      },
    });

    // Update lead status if found
    if (lead) {
      // Only update if lead is in a state where a reply matters
      if (["new", "contacted"].includes(lead.status)) {
        await prisma.lead.update({
          where: { id: lead.id },
          data: { status: "contacted" },
        });
      }

      // Create activity log entry
      const preview = body.length > 80 ? body.slice(0, 80) + "…" : body;
      await prisma.activity.create({
        data: {
          type: "sms_reply",
          message: `📱 ${lead.name} replied via SMS: "${preview}"`,
          leadId: lead.id,
        },
      });

      console.log(`[sms/inbound] Reply from ${lead.name} (${from}): ${preview}`);
    } else {
      // Log unmatched SMS
      await prisma.activity.create({
        data: {
          type: "sms_reply",
          message: `📱 Inbound SMS from ${from}: "${body.slice(0, 80)}" (no matching lead)`,
        },
      });
      console.log(`[sms/inbound] Unmatched SMS from ${from}: ${body.slice(0, 50)}`);
    }

    // Return valid TwiML
    return new Response("<Response></Response>", {
      status: 200,
      headers: { "Content-Type": "text/xml" },
    });
  } catch (error: any) {
    console.error("[sms/inbound] Error:", error.message);
    return new Response("<Response></Response>", {
      status: 200,
      headers: { "Content-Type": "text/xml" },
    });
  }
}
