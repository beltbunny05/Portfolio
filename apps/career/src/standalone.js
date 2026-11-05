import { mount } from './entry.js';
import '@portfolio/ui/styles.css';
const unmount = mount(document.getElementById('root'));
if (import.meta.hot) import.meta.hot.dispose(unmount);
