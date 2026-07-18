import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const agentId = searchParams.get('agentId') || ''

  const jsContent = `
(function() {
  const script = document.currentScript;
  const baseUrl = script ? new URL(script.src).origin : '${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}';
  const agentId = '${agentId}';

  if (!agentId) return;

  const container = document.createElement('div');
  container.id = 'agentflow-voice-widget';
  container.style.position = 'fixed';
  container.style.bottom = '20px';
  container.style.right = '20px';
  container.style.zIndex = '999999';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'flex-end';

  const iframe = document.createElement('iframe');
  iframe.src = baseUrl + '/widget-demo?agentId=' + agentId;
  iframe.style.width = '380px';
  iframe.style.height = '520px';
  iframe.style.border = 'none';
  iframe.style.borderRadius = '16px';
  iframe.style.boxShadow = '0 8px 32px rgba(15, 37, 71, 0.15)';
  iframe.style.display = 'none';
  iframe.style.background = 'transparent';
  iframe.allow = 'microphone';

  const button = document.createElement('button');
  button.innerHTML = '💬 Ask Agent';
  button.style.background = '#2563eb';
  button.style.color = '#ffffff';
  button.style.border = 'none';
  button.style.borderRadius = '50px';
  button.style.padding = '12px 24px';
  button.style.fontSize = '14px';
  button.style.fontWeight = 'bold';
  button.style.cursor = 'pointer';
  button.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
  button.style.transition = 'transform 0.15s ease';
  button.style.marginTop = '10px';

  button.onmouseover = () => button.style.transform = 'scale(1.05)';
  button.onmouseout = () => button.style.transform = 'scale(1)';

  let isOpen = false;
  button.onclick = () => {
    isOpen = !isOpen;
    if (isOpen) {
      iframe.style.display = 'block';
      button.innerHTML = '✕ Close';
      button.style.background = '#0f2547';
    } else {
      iframe.style.display = 'none';
      button.innerHTML = '💬 Ask Agent';
      button.style.background = '#2563eb';
    }
  };

  container.appendChild(iframe);
  container.appendChild(button);
  document.body.appendChild(container);
})();
`

  return new NextResponse(jsContent, {
    headers: {
      'Content-Type': 'application/javascript',
    },
  })
}
