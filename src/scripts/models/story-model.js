import CONFIG from "../config";

class StoryModel {
  /**
   * Mendapatkan semua cerita dengan opsi paginasi dan filter lokasi
   * @param {Object} options - Opsi query
   * @param {number} options.page - Nomor halaman
   * @param {number} options.size - Jumlah item per halaman
   * @param {number} options.location - Filter lokasi (1 = dengan lokasi, 0 = semua)
   * @returns {Promise<Object>} Response dari API
   */
  async getAllStories({ page, size, location } = {}) {
    try {
      // Membangun parameter query
      const params = new URLSearchParams();
      if (page) params.append("page", page);
      if (size) params.append("size", size);
      if (location !== undefined) params.append("location", location);

      const response = await fetch(`${CONFIG.BASE_URL}/stories?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return response.json();
    } catch (error) {
      console.error("Error fetching stories:", error);
      throw new Error(error.message || "Failed to fetch stories");
    }
  }

  /**
   * Menambahkan cerita baru
   * @param {Object} storyData - Data cerita
   * @param {string} storyData.description - Deskripsi cerita
   * @param {File} storyData.photo - File gambar
   * @param {number} [storyData.lat] - Latitude (opsional)
   * @param {number} [storyData.lon] - Longitude (opsional)
   * @returns {Promise<Object>} Response dari API
   */
  async addStory({ description, photo, lat, lon }) {
    try {
      const formData = new FormData();
      formData.append("description", description);
      formData.append("photo", photo);

      if (lat && lon) {
        formData.append("lat", lat);
        formData.append("lon", lon);
      }

      const response = await fetch(`${CONFIG.BASE_URL}/stories`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add story");
      }

      return response.json();
    } catch (error) {
      console.error("Error adding story:", error);
      throw new Error(error.message || "Network error. Please try again.");
    }
  }

  /**
   * Mendapatkan detail cerita berdasarkan ID
   * @param {string} storyId - ID cerita
   * @returns {Promise<Object>} Response dari API
   */
  async getStoryDetail(storyId) {
    try {
      const response = await fetch(`${CONFIG.BASE_URL}/stories/${storyId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return response.json();
    } catch (error) {
      console.error("Error fetching story detail:", error);
      throw new Error(error.message || "Failed to fetch story detail");
    }
  }
}

export default StoryModel;
