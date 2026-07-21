import { readFileSync, writeFileSync } from 'node:fs';

const sourceDir = '/Users/danlyons/Downloads';
const output = new URL('../supabase/migrations/202607200006_import_brisk_finance.sql', import.meta.url);
const canonicalName = (name) => name === 'Hear Better Now LTD' ? 'Hear Better Limited' : name === 'Hair Made Easi LTD' ? 'Hair Made Easi LTD' : name;
const sql = (value) => value == null || value === '' ? 'null' : `'${String(value).replaceAll("'", "''")}'`;
const pence = (value) => {
  const negative = String(value).trim().startsWith('-');
  const number = Number(String(value).replace(/[^0-9.]/g, '') || 0);
  return Math.round(number * 100) * (negative ? -1 : 1);
};
const csv = (path) => {
  const text = readFileSync(path, 'utf8').replace(/^\uFEFF/, '');
  const rows = []; let row = []; let field = ''; let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted && char === '"' && text[i + 1] === '"') { field += '"'; i += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === ',' && !quoted) { row.push(field); field = ''; }
    else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && text[i + 1] === '\n') i += 1;
      row.push(field); field = ''; if (row.some(Boolean)) rows.push(row); row = [];
    } else field += char;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const headers = rows.shift();
  return rows.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] || ''])));
};

const customersRaw = csv(`${sourceDir}/Customers Report.csv`);
const invoices = csv(`${sourceDir}/Invoices Report.csv`).filter(({ Date }) => /^\d{4}-\d{2}-\d{2}$/.test(Date) && Date >= '2025-04-01' && Date <= '2026-07-20');
const payments = csv(`${sourceDir}/Payments Report.csv`).filter(({ Date }) => /^\d{4}-\d{2}-\d{2}$/.test(Date) && Date >= '2025-04-01' && Date <= '2026-07-20');
const customers = new Map();
for (const record of customersRaw) {
  const name = canonicalName(record.Name);
  const existing = customers.get(name);
  if (!existing || (!existing.Address || existing.Address === 'NA') && record.Address && record.Address !== 'NA') customers.set(name, { ...record, Name: name });
  else existing.Balance = String((pence(existing.Balance) + pence(record.Balance)) / 100);
}

const lines = [
  '-- Generated from the three user-supplied Brisk reports. Amounts are intentionally interpreted as GBP.',
  'begin;',
];

for (const record of customers.values()) {
  const key = record.Name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  lines.push(`insert into public.clients (company_name, primary_contact_name, primary_contact_email, status, billing_address, phone, legacy_source, legacy_key, imported_balance_pence)`);
  lines.push(`values (${sql(record.Name)}, ${sql(record.Name)}, null, 'complete', ${sql(record.Address && record.Address !== 'NA' ? record.Address : null)}, ${sql(record.Phone)}, 'brisk', ${sql(key)}, ${pence(record.Balance)})`);
  lines.push(`on conflict (legacy_source, legacy_key) where legacy_source is not null and legacy_key is not null do update set company_name = excluded.company_name, billing_address = excluded.billing_address, phone = excluded.phone, imported_balance_pence = excluded.imported_balance_pence;`);
}

invoices.forEach((record, index) => {
  const clientName = canonicalName(record.Customer);
  const clientKey = clientName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const sourceKey = `${record.Date}|${record.Invoice}|${record.Customer}|${index + 1}`;
  const status = record.Status.toLowerCase() === 'paid' ? 'paid' : record.Status.toLowerCase() === 'overdue' ? 'overdue' : 'sent';
  const raw = JSON.stringify(record).replaceAll("'", "''");
  lines.push(`insert into public.finance_invoices (client_id, display_number, source, source_key, issue_date, status, subtotal_pence, tax_pence, total_pence, currency, description, source_data)`);
  lines.push(`select id, ${sql(record.Invoice)}, 'brisk', ${sql(sourceKey)}, ${sql(record.Date)}::date, ${sql(status)}, ${pence(record.Amount) - pence(record.Tax)}, ${pence(record.Tax)}, ${pence(record.Amount)}, 'GBP', 'Imported Brisk invoice', '${raw}'::jsonb from public.clients where legacy_source = 'brisk' and legacy_key = ${sql(clientKey)}`);
  lines.push(`on conflict (source, source_key) do update set status = excluded.status, subtotal_pence = excluded.subtotal_pence, tax_pence = excluded.tax_pence, total_pence = excluded.total_pence, source_data = excluded.source_data;`);
});

payments.forEach((record, index) => {
  const clientName = canonicalName(record.Customer);
  const clientKey = clientName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const sourceKey = `${record.Date}|${record.Customer}|${record.Invoice}|${record.Amount}|${index + 1}`;
  const raw = JSON.stringify(record).replaceAll("'", "''");
  lines.push(`insert into public.finance_payments (client_id, source, source_key, payment_date, amount_pence, method, reference, currency, source_data)`);
  lines.push(`select id, 'brisk', ${sql(sourceKey)}, ${sql(record.Date)}::date, ${pence(record.Amount)}, ${sql(record.Method)}, ${sql(record.Invoice)}, 'GBP', '${raw}'::jsonb from public.clients where legacy_source = 'brisk' and legacy_key = ${sql(clientKey)}`);
  lines.push(`on conflict (source, source_key) do update set amount_pence = excluded.amount_pence, method = excluded.method, reference = excluded.reference, source_data = excluded.source_data;`);
});

lines.push('commit;', '');
writeFileSync(output, lines.join('\n'));
console.log(`Generated ${customers.size} clients, ${invoices.length} invoices and ${payments.length} payments.`);
