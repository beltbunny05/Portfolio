import { createMount } from '@portfolio/microfrontend-runtime';
import styles from '@portfolio/ui/styles.css?inline';
import App from './App.tsx';
import appStyles from './styles.css?inline';

export const mount = createMount(App, styles + appStyles);
