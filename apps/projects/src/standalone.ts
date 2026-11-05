import { mount } from './entry.ts';
import '@portfolio/ui/styles.css';
import './styles.css';
const host = document.getElementById('root');
if (!host) throw new Error('Missing standalone root.');
const unmount = mount(host);
if (import.meta.hot) import.meta.hot.dispose(unmount);
