import { getStories } from '../../../data/api';
import { setUser } from '../../../utils/auth';
import Auth from '../../../utils/auth';

class HomePresenter {
  constructor(view) {
    this._view = view;
  }

  async getStories() {
    try {
      const stories = await getStories();
      this._view.displayStories(stories);
      this._view.initializeMapWithStories(stories);
      return stories;
    } catch (error) {
      this._view.showError(error.message);
      throw error;
    }
  }

  async logout() {
    try {
      setUser(null);
      Auth.removeToken();
      this._view.navigateToLogin();
      return true;
    } catch (error) {
      this._view.showError(error.message);
      throw error;
    }
  }
}

export default HomePresenter; 