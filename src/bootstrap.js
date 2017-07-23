// global css
import './theme/theme.scss';
// classes you want to use immediately
import {App} from './app';

/**
 * entrance code for SPA
 */
function main() {
  document.title = 'Loading...';

  return new App();
}

document.addEventListener('DOMContentLoaded', main);
