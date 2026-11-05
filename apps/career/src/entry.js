import { createMount } from '@portfolio/microfrontend-runtime';
import styles from '@portfolio/ui/styles.css?inline';
import App from './App.jsx';

export const mount = createMount(App, styles);
