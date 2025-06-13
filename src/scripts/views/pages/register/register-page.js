export default class RegisterPage {
  constructor() {
    this._presenter = null;
  }

  async render() {
    return `
      <div class="register-container">
        <div class="register-card">
          <h2 class="register-title">Register</h2>
          <form id="registerForm" class="register-form">
            <div class="form-group">
              <label for="name" class="form-label">Name</label>
              <input type="text" class="form-input" id="name" required>
            </div>
            <div class="form-group">
              <label for="email" class="form-label">Email</label>
              <input type="email" class="form-input" id="email" required>
            </div>
            <div class="form-group">
              <label for="password" class="form-label">Password</label>
              <input type="password" class="form-input" id="password" required>
            </div>
            <button type="submit" class="register-button">Register</button>
          </form>
          <p class="login-link">
            Already have an account? <a href="#/login">Login here</a>
          </p>
        </div>
      </div>
    `;
  }

  async afterRender() {
    const form = document.getElementById('registerForm');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      const userData = {
        name,
        email,
        password,
      };

      try {
        await this._presenter.register(userData);
      } catch (error) {
        this.showError(error.message);
      }
    });

    // Add click handler for login link
    const loginLink = document.querySelector('.login-link a');
    if (loginLink) {
      loginLink.addEventListener('click', (event) => {
        event.preventDefault();
        this.navigateToLogin();
      });
    }
  }

  setPresenter(presenter) {
    this._presenter = presenter;
  }

  // Navigation methods
  navigateToLogin() {
    window.location.hash = '#/login';
  }

  // UI feedback methods
  showError(message) {
    alert(message); // You might want to replace this with a more sophisticated UI component
  }

  showSuccess(message) {
    alert(message); // You might want to replace this with a more sophisticated UI component
  }
} 