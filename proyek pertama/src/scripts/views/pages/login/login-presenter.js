import AuthModel from '../../../models/auth-model';

class LoginPresenter {
  constructor(view) {
    this._view = view;
    this._authModel = new AuthModel();
  }

  async login(email, password) {
    try {
      console.log('Attempting login with:', { email });
      
      const loginResult = await this._authModel.login({ email, password });
      console.log('Login successful:', loginResult);

      // Let the view handle navigation
      this._view.navigateToHome();
      return true;
    } catch (error) {
      console.error('Login error:', error);
      this._view.showError(error.message);
      throw error;
    }
  }

  async logout() {
    try {
      this._authModel.logout();
      this._view.navigateToLogin();
      return true;
    } catch (error) {
      this._view.showError(error.message);
      throw error;
    }
  }
}

export default LoginPresenter; 