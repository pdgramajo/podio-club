import { buildWhatsAppMessage } from '../domain/whatsapp'
import type { BuildWhatsAppMessageInput } from '../domain/whatsapp'

/**
 * Builds the wa.me link that opens the WhatsApp chat with the order message
 * ready to send. Constructing the URL is the application-level effect that
 * the domain intentionally leaves out.
 */
export function buildWhatsAppUrl(phone: string, input: BuildWhatsAppMessageInput): string {
  const digitsOnly = phone.replace(/\D/g, '')
  const message = buildWhatsAppMessage(input)
  return `https://wa.me/${digitsOnly}?text=${encodeURIComponent(message)}`
}
