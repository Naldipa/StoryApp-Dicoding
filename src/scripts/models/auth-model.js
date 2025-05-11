import CONFIG from "../config";

class AuthModel {
  async register({ name, email, password }) {
    try {
      const response = await fetch(`${CONFIG.BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Registration failed");
      }

      return {
        success: true,
        message: "Registration successful! Please login",
      };
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  async login({ email, password }) {
    try {
      const response = await fetch(`${CONFIG.BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Login failed");
      }

      // Dicoding API returns token in loginResult.token
      const token = responseData.loginResult?.token;
      if (!token) {
        throw new Error("Token not found in response");
      }

      localStorage.setItem("token", token);
      return { token };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }
}

export default AuthModel;
