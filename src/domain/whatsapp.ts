import type { ResolvedCartLine } from './cart'
import { formatARS } from './money'

export interface BuildWhatsAppMessageInput {
  lines: ResolvedCartLine[]
  total: number
}

const GREETING = 'Hola! Quisiera hacer el siguiente pedido:'

/**
 * Builds the order text for WhatsApp (pure domain function).
 * The text is the artifact communicated via WhatsApp; opening the chat is an
 * application-level effect, outside this layer.
 */
export function buildWhatsAppMessage({ lines, total }: BuildWhatsAppMessageInput): string {
  const pricedLines = lines.filter((line) => typeof line.subtotal === 'number')
  const detailLines = pricedLines.map(
    (line) =>
      `${line.quantity} × ${line.product?.name} — ${line.color?.name} / ${line.variant?.size} — ${formatARS(line.subtotal!)}`,
  )

  if (detailLines.length === 0) {
    return `${GREETING}\n\nTotal: ${formatARS(total)}`
  }

  return `${GREETING}\n\n${detailLines.join('\n')}\n\nTotal: ${formatARS(total)}`
}
