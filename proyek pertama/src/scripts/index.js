// CSS imports
import '../styles/styles.css';
import '../styles/pages/home.css';
import '../styles/pages/login.css';
import '../styles/pages/register.css';
import '../styles/pages/add-story.css';
import '../styles/pages/detail-story.css';


import routes from './routes/routes';
import { parseActiveUrlWithCombiner } from './routes/url-parser';
import AuthModel from './models/auth-model';

class App {
  constructor({ content, drawerButton, navigationDrawer }) {
    this._content = content;
    this._drawerButton = drawerButton;
    this._navigationDrawer = navigationDrawer;
    this._authModel = new AuthModel();

    this._initialAppShell();
  }

  _initialAppShell() {
    if (this._drawerButton) {
      this._drawerButton.addEventListener('click', (event) => {
        this._navigationDrawer.classList.toggle('open');
        event.stopPropagation();
      });
    }

    if (this._navigationDrawer) {
      this._navigationDrawer.addEventListener('click', (event) => {
        event.stopPropagation();
      });

      document.addEventListener('click', () => {
        this._navigationDrawer.classList.remove('open');
      });
    }
  }

  async renderPage() {
    const url = parseActiveUrlWithCombiner();
    const page = routes[url] || routes['/404'];
    if (url !== '/login' && url !== '/register' && !this._authModel.isLoggedIn()) {
      window.location.hash = '#/login';
      return;
    }
     if ((url === '/login' || url === '/register') && this._authModel.isLoggedIn()) {
         window.location.hash = '#/';
         return;
     }

    // Use View Transition API if supported
    if (document.startViewTransition) {
      document.startViewTransition(async () => {
        try {
          this._content.innerHTML = await page.render();
          if (typeof page.afterRender === 'function') {
              await page.afterRender();
          }
        } catch (error) {
          console.error('Error rendering page with transition:', error);
          this._content.innerHTML = '<h2>Error loading page</h2>';
        }
      });
    } else {
      try {
        this._content.innerHTML = await page.render();
        if (typeof page.afterRender === 'function') {
            await page.afterRender();
        }
      } catch (error) {
        console.error('Error rendering page without transition:', error);
        this._content.innerHTML = '<h2>Error loading page</h2>';
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });
  await app.renderPage();

  // Universal skip link handler
  document.body.addEventListener('click', function (event) {
    if (event.target.classList.contains('skip-link')) {
      event.preventDefault();
      const mainContent = document.querySelector('#main-content');
      event.target.blur();
      if (mainContent) {
        mainContent.setAttribute('tabindex', '-1');
        mainContent.focus();
        mainContent.scrollIntoView();
      }
    }
  });

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });
});
