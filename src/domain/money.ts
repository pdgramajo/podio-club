/** Formats an integer amount in ARS without decimals: 12000 -> "$12.000" */
export function formatARS(amount: number): string {
  return `$${amount.toLocaleString('es-AR')}`
}
