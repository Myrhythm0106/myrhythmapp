import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { SecurityHeaders } from './utils/security/securityHeaders'

// Apply security headers early
SecurityHeaders.applySecurityHeaders();

console.log('🚀 main.tsx: Starting app render');
const rootElement = document.getElementById("root");
console.log('🔍 main.tsx: Root element found:', !!rootElement);

if (rootElement) {
  createRoot(rootElement).render(<App />);
  console.log('✅ main.tsx: App rendered successfully');
} else {
  console.error('❌ main.tsx: Root element not found!');
}
