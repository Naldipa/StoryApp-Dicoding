import StoryModel from "../../models/story-model";
import StoryView from "../../views/story-view";
import StoryPresenter from "../../presenters/story-presenter";

export default class AddPage {
  async render() {
    const view = new StoryView();
    return view.getAddStoryForm();
  }

  async afterRender() {
    const model = new StoryModel();
    const view = new StoryView();
    this.presenter = new StoryPresenter(model, view);

    document
      .getElementById("storyForm")
      .addEventListener("submit", (e) => this.presenter.handleFormSubmit(e));
  }
}
