import { createRoot } from 'react-dom/client'
import AppMemoryFirst from './AppMemoryFirst.tsx'
import './index.css'

console.log('🚀 main.tsx: Starting app render');
const rootElement = document.getElementById("root");
console.log('🔍 main.tsx: Root element found:', !!rootElement);

if (rootElement) {
  createRoot(rootElement).render(<AppMemoryFirst />);
  console.log('✅ main.tsx: AppMemoryFirst rendered successfully');
} else {
  console.error('❌ main.tsx: Root element not found!');
}
