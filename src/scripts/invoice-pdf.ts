import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib';

type LineItem = { description: string; quantity: number; unit_pence: number };
type InvoicePdfData = {
  invoice_number: string; status: string; issue_date: string; due_date: string;
  client_name: string; client_company?: string | null; line_items: LineItem[];
  subtotal_pence: number; vat_rate: number; vat_pence: number; total_pence: number;
  notes?: string | null; bank_details?: { account_name?: string; sort_code?: string; account_number?: string; reference?: string } | null;
};

const A4: [number, number] = [595.28, 841.89];
const ink = rgb(0.09, 0.09, 0.10); const muted = rgb(0.40, 0.39, 0.42); const line = rgb(0.86, 0.85, 0.87); const lavender = rgb(0.76, 0.70, 0.84); const pale = rgb(0.97, 0.96, 0.98); const white = rgb(1, 1, 1);
const money = (pence: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2 }).format(pence / 100);
const date = (value: string) => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${value}T12:00:00`));
const safe = (value: unknown) => String(value ?? '').replace(/[–—]/g, '-').replace(/[^\x20-\x7E£]/g, '');
const textRight = (page: PDFPage, value: string, right: number, y: number, size: number, font: PDFFont, color = ink) => page.drawText(safe(value), { x: right - font.widthOfTextAtSize(safe(value), size), y, size, font, color });
const wrap = (value: string, font: PDFFont, size: number, width: number) => {
  const words = safe(value).split(/\s+/); const lines: string[] = []; let current = '';
  words.forEach((word) => { const next = current ? `${current} ${word}` : word; if (font.widthOfTextAtSize(next, size) <= width) current = next; else { if (current) lines.push(current); current = word; } });
  if (current) lines.push(current); return lines;
};

export const downloadInvoicePdf = async (invoice: InvoicePdfData) => {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`Invoice ${safe(invoice.invoice_number)} | CNVRT`); pdf.setAuthor('CNVRT'); pdf.setCreator('CNVRT Client Hub'); pdf.setProducer('CNVRT');
  const regular = await pdf.embedFont(StandardFonts.Helvetica); const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const logoBytes = await fetch('/brand/cnvrt-logo.png').then((response) => response.arrayBuffer()); const logo = await pdf.embedPng(logoBytes);
  const margin = 48; const right = A4[0] - margin;
  const addPage = (continuation = false) => {
    const page = pdf.addPage(A4); const height = page.getHeight();
    page.drawRectangle({ x: 0, y: height - 128, width: A4[0], height: 128, color: ink });
    page.drawImage(logo, { x: margin, y: height - 66, width: 92, height: 23 });
    page.drawText('WEBSITES. COMMERCE. GROWTH.', { x: margin, y: height - 90, size: 7, font: bold, color: rgb(.68,.66,.70) });
    textRight(page, continuation ? 'INVOICE CONTINUED' : 'INVOICE', right, height - 49, 8, regular, rgb(.68,.66,.70));
    textRight(page, invoice.invoice_number, right, height - 70, 17, bold, white);
    if (!continuation) { const status = safe(invoice.status).toUpperCase(); const width = bold.widthOfTextAtSize(status, 7) + 14; page.drawRectangle({ x: right - width, y: height - 96, width, height: 17, color: lavender }); textRight(page, status, right - 7, height - 91, 7, bold, ink); }
    page.drawRectangle({ x: margin, y: height - 130, width: right - margin, height: 3, color: lavender });
    return page;
  };
  let page = addPage(); let y = 675;
  const label = (value: string, x: number, atY: number) => page.drawText(value, { x, y: atY, size: 7, font: bold, color: muted });
  label('FROM', margin, y); label('BILL TO', 226, y); label('DATES', 430, y);
  page.drawText('CNVRT', { x: margin, y: y - 24, size: 10, font: bold, color: ink }); page.drawText('Manchester, UK', { x: margin, y: y - 41, size: 8.5, font: regular, color: muted }); page.drawText('hello@cnvrtdigital.co.uk', { x: margin, y: y - 57, size: 8.5, font: regular, color: muted });
  page.drawText(safe(invoice.client_name), { x: 226, y: y - 24, size: 10, font: bold, color: ink }); if (invoice.client_company) page.drawText(safe(invoice.client_company), { x: 226, y: y - 41, size: 8.5, font: regular, color: muted });
  page.drawText(`Issued ${date(invoice.issue_date)}`, { x: 430, y: y - 24, size: 8.5, font: regular, color: muted }); page.drawText(`Due ${date(invoice.due_date)}`, { x: 430, y: y - 41, size: 8.5, font: regular, color: muted });
  y -= 96;
  const tableHeader = () => { label('DESCRIPTION', margin, y); label('QTY', 365, y); label('RATE', 415, y); label('AMOUNT', 505, y); page.drawLine({ start: { x: margin, y: y - 10 }, end: { x: right, y: y - 10 }, thickness: 1, color: line }); y -= 33; };
  tableHeader();
  for (const item of invoice.line_items) {
    if (y < 170) { page = addPage(true); y = 670; tableHeader(); }
    const descriptionLines = wrap(item.description, regular, 9, 285).slice(0, 2); descriptionLines.forEach((entry, index) => page.drawText(entry, { x: margin, y: y - index * 12, size: 9, font: regular, color: ink }));
    textRight(page, String(item.quantity), 383, y, 9, regular); textRight(page, money(item.unit_pence), 471, y, 9, regular); textRight(page, money(item.quantity * item.unit_pence), right, y, 9, regular);
    const rowHeight = Math.max(35, descriptionLines.length * 12 + 15); page.drawLine({ start: { x: margin, y: y - rowHeight + 10 }, end: { x: right, y: y - rowHeight + 10 }, thickness: .7, color: line }); y -= rowHeight;
  }
  if (y < 285) { page = addPage(true); y = 670; }
  y -= 18;
  const totalsX = 350; page.drawText('Subtotal', { x: totalsX, y, size: 9, font: regular, color: muted }); textRight(page, money(invoice.subtotal_pence), right, y, 9, regular); y -= 25;
  if (Number(invoice.vat_rate) > 0) { page.drawText(`VAT (${Number(invoice.vat_rate)}%)`, { x: totalsX, y, size: 9, font: regular, color: muted }); textRight(page, money(invoice.vat_pence), right, y, 9, regular); y -= 25; }
  page.drawLine({ start: { x: totalsX, y: y + 15 }, end: { x: right, y: y + 15 }, thickness: 1.4, color: ink }); page.drawText('Total', { x: totalsX, y, size: 13, font: bold, color: ink }); textRight(page, money(invoice.total_pence), right, y, 13, bold); y -= 42;
  if (invoice.notes) { const noteLines = wrap(invoice.notes, regular, 8.5, right - margin); noteLines.slice(0, 3).forEach((entry, index) => page.drawText(entry, { x: margin, y: y - index * 12, size: 8.5, font: regular, color: muted })); y -= noteLines.slice(0, 3).length * 12 + 18; }
  const bank = invoice.bank_details || {}; if (bank.account_name || bank.sort_code || bank.account_number) {
    const boxHeight = 96; if (y - boxHeight < 55) { page = addPage(true); y = 670; }
    page.drawRectangle({ x: margin, y: y - boxHeight, width: right - margin, height: boxHeight, color: pale, borderColor: lavender, borderWidth: 1 }); page.drawRectangle({ x: margin, y: y - boxHeight, width: 3, height: boxHeight, color: lavender });
    page.drawText('PAY BY BANK TRANSFER', { x: margin + 16, y: y - 20, size: 7, font: bold, color: muted });
    const entries: Array<[string, string | undefined]> = [['Account name', bank.account_name], ['Sort code', bank.sort_code], ['Account number', bank.account_number], ['Reference', bank.reference || invoice.invoice_number]]; entries.forEach(([key, value], index) => { const rowY = y - 39 - index * 14; page.drawText(key, { x: margin + 16, y: rowY, size: 8, font: regular, color: muted }); textRight(page, value || '', right - 16, rowY, 8, bold); });
  }
  const pages = pdf.getPages(); pages.forEach((current, index) => { current.drawLine({ start: { x: margin, y: 42 }, end: { x: right, y: 42 }, thickness: .7, color: line }); current.drawText('Questions? hello@cnvrtdigital.co.uk', { x: margin, y: 25, size: 7.5, font: regular, color: muted }); textRight(current, `Page ${index + 1} of ${pages.length}`, right, 25, 7.5, regular, muted); });
  const bytes = await pdf.save(); const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `${safe(invoice.invoice_number).replace(/[^A-Za-z0-9-]/g, '-')}.pdf`; document.body.appendChild(link); link.click(); link.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 2000);
};
