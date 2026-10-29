export const FALLBACK_PRODUCT_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%"><rect width="400" height="400" fill="%23F8FAFC"/><rect x="130" y="70" width="140" height="30" rx="8" fill="%23E2E8F0"/><rect x="150" y="45" width="100" height="25" rx="6" fill="%23CBD5E1"/><rect x="110" y="100" width="180" height="240" rx="24" fill="%23FFFFFF" stroke="%23E2E8F0" stroke-width="4"/><rect x="130" y="145" width="140" height="150" rx="14" fill="%23ECFDF5" stroke="%23A7F3D0" stroke-width="2"/><rect x="185" y="190" width="30" height="60" rx="4" fill="%2310B981"/><rect x="170" y="205" width="60" height="30" rx="4" fill="%2310B981"/><circle cx="200" cy="220" r="7" fill="%23FFFFFF"/><rect x="145" y="310" width="110" height="8" rx="4" fill="%23E2E8F0"/></svg>`

export function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement
  if (target && target.src !== FALLBACK_PRODUCT_IMAGE) {
    target.src = FALLBACK_PRODUCT_IMAGE
  }
}

