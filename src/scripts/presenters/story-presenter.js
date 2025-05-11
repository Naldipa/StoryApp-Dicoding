import StoryModel from "../models/story-model";
import StoryView from "../views/story-view";

class StoryPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.marker = null;
    this.map = null;
    this.initMap();
  }

  async displayStories() {
    try {
      // Check authentication first
      if (!localStorage.getItem("token")) {
        throw new Error("401: Please login first");
      }

      const mainContent = document.querySelector("#main-content");
      mainContent.innerHTML = '<div class="loading-spinner"></div>';

      const { data: stories } = await this.model.getAllStories();
      const storiesElement = this.view.displayStories(stories);

      mainContent.innerHTML = "";
      mainContent.appendChild(storiesElement);

      this.initAllMaps();
    } catch (error) {
      console.error("Error displaying stories:", error);
      const mainContent = document.querySelector("#main-content");

      if (error.message.includes("401")) {
        mainContent.innerHTML = `
          <div class="auth-required">
            <i class="fas fa-exclamation-triangle"></i>
            <h2>Session Expired</h2>
            <p>Please login to view stories</p>
            <a href="#/login" class="btn btn-primary">Login</a>
          </div>
        `;
      } else {
        mainContent.innerHTML = `
          <div class="error-message">
            <i class="fas fa-times-circle"></i>
            <h2>Failed to Load Stories</h2>
            <p>${error.message || "Please try again later"}</p>
            <button id="retryButton" class="btn btn-primary">
              <i class="fas fa-sync-alt"></i> Retry
            </button>
          </div>
        `;

        document.getElementById("retryButton").addEventListener("click", () => {
          this.displayStories();
        });
      }
    }
  }

  initMap() {
    if (typeof L !== "undefined") {
      this.map = L.map("map").setView([-6.1754, 106.8272], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(this.map);

      // Try to get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            this.updateLocation(latitude, longitude);
            this.map.setView([latitude, longitude], 13);
          },
          (error) => {
            console.log("Geolocation error:", error);
          },
          { timeout: 10000 }
        );
      }

      this.map.on("click", (e) => {
        this.updateLocation(e.latlng.lat, e.latlng.lng);
      });
    }
  }

  updateLocation(lat, lon) {
    const latInput = document.getElementById("lat");
    const lonInput = document.getElementById("lon");

    if (latInput && lonInput) {
      latInput.value = lat;
      lonInput.value = lon;

      if (this.marker) {
        this.map.removeLayer(this.marker);
      }

      this.marker = L.marker([lat, lon])
        .addTo(this.map)
        .bindPopup(
          `
          <b>Selected Location</b><br>
          Latitude: ${lat.toFixed(4)}<br>
          Longitude: ${lon.toFixed(4)}
        `
        )
        .openPopup();
    }
  }

  initAllMaps() {
    if (typeof L !== "undefined") {
      document.querySelectorAll('[id^="map-"]').forEach((mapElement) => {
        const lat = parseFloat(mapElement.dataset.lat);
        const lon = parseFloat(mapElement.dataset.lon);

        if (!isNaN(lat) && !isNaN(lon)) {
          const storyMap = L.map(mapElement, {
            zoomControl: false,
            dragging: false,
            scrollWheelZoom: false,
          }).setView([lat, lon], 13);

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(storyMap);

          L.marker([lat, lon]).addTo(storyMap).bindPopup(`
              <b>Story Location</b><br>
              ${lat.toFixed(4)}, ${lon.toFixed(4)}
            `);
        }
      });
    }
  }

  async handleFormSubmit(event) {
    event.preventDefault();

    if (!localStorage.getItem("token")) {
      alert("Please login first");
      window.location.hash = "#/login";
      return;
    }

    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');

    try {
      submitButton.disabled = true;
      submitButton.innerHTML =
        '<span class="loading-spinner"></span> Submitting...';

      const formData = {
        description: form.description.value,
        photo: form.photo.files[0],
        lat: form.lat.value || null,
        lon: form.lon.value || null,
      };

      const response = await this.model.addStory(formData);
      alert("Story added successfully!");

      if (document.startViewTransition) {
        document.startViewTransition(() => {
          window.location.hash = "#/";
        });
      } else {
        window.location.hash = "#/";
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert(`Failed to add story: ${error.message}`);
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = "Submit Story";
    }
  }
}

export default StoryPresenter;
