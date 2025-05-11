import StoryModel from "../../models/story-model";
import StoryView from "../../views/story-view";
import StoryPresenter from "../../presenters/story-presenter";

export default class HomePage {
  async render() {
    return `
      <section class="container">
        <h1>Story List</h1>
        <div class="auth-buttons">
          ${
            localStorage.getItem("token")
              ? `<a href="#/add" class="add-button">Add New Story</a>
               <button id="logoutButton" class="logout-button">Logout</button>`
              : `<a href="#/login" class="login-button">Login</a>
               <a href="#/register" class="register-button">Register</a>`
          }
        </div>
        <div id="storiesContainer"></div>
      </section>
    `;
  }

  async afterRender() {
    const model = new StoryModel();
    const view = new StoryView();
    this.presenter = new StoryPresenter(model, view);

    await this.presenter.displayStories();

    if (localStorage.getItem("token")) {
      document.getElementById("logoutButton").addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.hash = "#/";
      });
    }
  }
}
