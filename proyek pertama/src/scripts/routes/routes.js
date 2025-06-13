import HomePage from '../views/pages/homepage/home-page';
import LoginPage from '../views/pages/login/login-page';
import AddStoryPage from '../views/pages/add-story/add-story-page';
import DetailStoryPage from '../views/pages/detail-story/detail-story-page';
import RegisterPage from '../views/pages/register/register-page';
import LoginPresenter from '../views/pages/login/login-presenter';
import HomePresenter from '../views/pages/homepage/home-presenter';
import DetailStoryPresenter from '../views/pages/detail-story/detail-story-presenter';
import AddStoryPresenter from '../views/pages/add-story/add-story-presenter';
import RegisterPresenter from '../views/pages/register/register-presenter';

const loginPage = new LoginPage();
const loginPresenter = new LoginPresenter(loginPage);
loginPage.setPresenter(loginPresenter);

const homePage = new HomePage();
const homePresenter = new HomePresenter(homePage);
homePage.setPresenter(homePresenter);

const detailStoryPage = new DetailStoryPage();
const detailStoryPresenter = new DetailStoryPresenter(detailStoryPage);
detailStoryPage.setPresenter(detailStoryPresenter);

const addStoryPage = new AddStoryPage();
const addStoryPresenter = new AddStoryPresenter(addStoryPage);
addStoryPage.setPresenter(addStoryPresenter);

const registerPage = new RegisterPage();
const registerPresenter = new RegisterPresenter(registerPage);
registerPage.setPresenter(registerPresenter);

const routes = {
  '/': homePage,
  '/login': loginPage,
  '/stories/add': addStoryPage,
  '/stories/:id': detailStoryPage,
  '/register': registerPage,
  '/404': {
    render: () => '<h2>Page Not Found</h2>',
    afterRender: () => {},
  },
};

export default routes;
