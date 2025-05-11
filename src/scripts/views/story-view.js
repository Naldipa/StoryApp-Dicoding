class StoryView {
  constructor() {
    this.storyListElement = document.createElement("div");
    this.storyListElement.className = "story-list";
  }

  displayStories(stories) {
    this.storyListElement.innerHTML = stories
      .map(
        (story) => `
        <article class="story-card">
          <img src="${story.photoUrl}" alt="${
          story.description
        }" class="story-image">
          <div class="story-content">
            <h3>${story.name}</h3>
            <p>${story.description}</p>
            <p>Created at: ${new Date(story.createdAt).toLocaleDateString()}</p>
            <div class="story-map" id="map-${story.id}" data-lat="${
          story.lat
        }" data-lon="${story.lon}"></div>
          </div>
        </article>
      `
      )
      .join("");

    return this.storyListElement;
  }

  getAddStoryForm() {
    return `
        <section class="add-story-form container">
          <h2>Add New Story</h2>
          <form id="storyForm">
            <div class="form-group">
              <label for="description">Description</label>
              <textarea id="description" name="description" required></textarea>
            </div>
            <div class="form-group">
              <label for="photo">Photo</label>
              <input type="file" id="photo" name="photo" accept="image/*" capture="environment" required>
            </div>
            <div class="form-group">
              <label>Location</label>
              <div id="map" style="height: 300px;"></div>
              <input type="hidden" id="lat" name="lat">
              <input type="hidden" id="lon" name="lon">
            </div>
            <button type="submit">Submit</button>
          </form>
        </section>
      `;
  }
}

export default StoryView;
