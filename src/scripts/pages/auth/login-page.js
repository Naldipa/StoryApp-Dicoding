import AuthModel from "../../models/auth-model";

export default class LoginPage {
  async render() {
    return `
      <section class="auth-container">
        <h1 tabindex="0">Login</h1>
        <form id="loginForm" aria-labelledby="loginHeading">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              required
              aria-required="true"
              autocomplete="username"
            >
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              required
              aria-required="true"
              autocomplete="current-password"
            >
          </div>
          <button type="submit" id="loginButton" class="btn btn-primary">
            <span id="loginText">Login</span>
            <span id="loginSpinner" class="loading-spinner" style="display:none"></span>
          </button>
        </form>
        <p>Don't have an account? <a href="#/register">Register here</a></p>
      </section>
    `;
  }

  async afterRender() {
    const authModel = new AuthModel();
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const loginButton = document.getElementById("loginButton");
      const loginText = document.getElementById("loginText");
      const loginSpinner = document.getElementById("loginSpinner");

      try {
        loginButton.disabled = true;
        loginText.textContent = "Logging in...";
        loginSpinner.style.display = "inline-block";

        const { token } = await authModel.login({
          email: document.getElementById("email").value,
          password: document.getElementById("password").value,
        });

        // Use View Transition API if available
        if (document.startViewTransition) {
          document.startViewTransition(() => {
            window.location.hash = "#/";
          });
        } else {
          window.location.hash = "#/";
        }
      } catch (error) {
        alert(`Login failed: ${error.message}`);
      } finally {
        loginButton.disabled = false;
        loginText.textContent = "Login";
        loginSpinner.style.display = "none";
      }
    });
  }
}
