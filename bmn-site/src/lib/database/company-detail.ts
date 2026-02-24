export interface ShipmentSummary {
  exportCount: number;
  importCount: number;
  lastShipmentDate: string | null;
  topHsCodes: Array<{ code: string; weight: number }>;
}

/**
 * Replaces email or phone details with masked versions.
 * Discloses the domain of an email but masks the local part.
 * Masks a phone number.
 */
export function maskContactField(contact: string, type: 'email' | 'phone'): string {
  if (!contact) return '';

  if (type === 'email') {
    const parts = contact.split('@');
    if (parts.length !== 2) return ''; // Invalid email
    
    const [local, domain] = parts;
    const maskedLocal = '•'.repeat(Math.min(local.length, 6)); // Mask up to 6 chars
    return `${maskedLocal}@${domain}`;
  }

  // Basic phone masking - replacing digits with dots
  return contact.replace(/\d/g, '•').replace(/[\+\s\(\)-]/g, (match) => {
     if(match === '+') return '+';
     if(match === ' ') return ' ';
     return match;
  });
}


/**
 * Converts numeric representations into exact dollar formatted strings with commas.
 * formatTradeValue(12400) -> '$12,400'
 */
export function formatTradeValue(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) return '—';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}


/**
 * Mock shipment summary query.
 * For ENTRY-15.0 this will be wired up to trade_shipments table.
 */
export async function getShipmentSummary(_companyId: string, _direction: 'export' | 'import'): Promise<ShipmentSummary> {
  // Empty state until trade_shipments exists
  return {
    exportCount: 0,
    importCount: 0,
    lastShipmentDate: null,
    topHsCodes: []
  };
}
