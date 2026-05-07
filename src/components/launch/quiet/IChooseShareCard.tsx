// 9:16 share card renderer — pure canvas, no extra deps.
// Generates 1080x1920 PNG, attempts native share, falls back to download.

export async function generateAndShareIChoose(statement: string, supporterName?: string): Promise<void> {
  const W = 1080;
  const H = 1920;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background gradient (brand teal -> emerald -> orange)
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#0F766E'); // teal
  grad.addColorStop(0.55, '#10B981'); // emerald
  grad.addColorStop(1, '#F97316'); // orange
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Soft white overlay band
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.fillRect(0, H * 0.25, W, H * 0.5);

  // Brand mark
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.font = '600 36px ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto';
  ctx.textAlign = 'center';
  ctx.fillText('MyRhythm', W / 2, 140);

  // Statement — wrap text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 84px Georgia, "Times New Roman", serif';
  ctx.textAlign = 'center';
  const maxWidth = W - 160;
  const words = statement.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);

  const lineHeight = 110;
  const blockH = lines.length * lineHeight;
  let y = (H - blockH) / 2;
  for (const l of lines) {
    ctx.fillText(l, W / 2, y);
    y += lineHeight;
  }

  // Supporter line
  if (supporterName) {
    ctx.font = '500 32px ui-sans-serif, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fillText(`Shared with ${supporterName}`, W / 2, H - 220);
  }

  // Footer
  ctx.font = '500 28px ui-sans-serif, system-ui, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillText('myrhythmapp.com  ·  #IChoose', W / 2, H - 120);

  // Confidentiality footer (3pt-ish)
  ctx.font = '400 14px ui-sans-serif, system-ui, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.fillText('Personal empowerment statement — not medical advice.', W / 2, H - 60);

  // Export
  const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, 'image/png'));
  if (!blob) return;

  const file = new File([blob], 'ichoose.png', { type: 'image/png' });
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean; share?: (d: ShareData) => Promise<void> };
  if (nav.canShare && nav.canShare({ files: [file] }) && nav.share) {
    try {
      await nav.share({ files: [file], title: '#IChoose', text: statement });
      return;
    } catch {/* fall through to download */}
  }

  // Download fallback
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ichoose.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
