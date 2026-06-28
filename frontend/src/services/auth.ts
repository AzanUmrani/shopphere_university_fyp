import { apiService, type ApiResponse } from "./api";

export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  newsletter?: boolean;
  acceptTerms?: boolean;
}

export interface AuthResponse {
  user: any;
  token: string;
  refreshToken: string;
}

export interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface GoogleLoginData {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

class AuthService {
  // Authentication endpoints
  async login(data: LoginData): Promise<ApiResponse<AuthResponse>> {
    const response = await apiService.post<AuthResponse>("/auth/login", data);

    if (response.success && response.data?.token) {
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("refreshToken", response.data.refreshToken);
    }

    return response;
  }

  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    const response = await apiService.post<AuthResponse>(
      "/auth/register",
      data
    );

    if (response.success && response.data?.token) {
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("refreshToken", response.data.refreshToken);
    }

    return response;
  }

  async googleLogin(data: GoogleLoginData): Promise<ApiResponse<AuthResponse>> {
    const response = await apiService.post<AuthResponse>("/auth/google", data);

    if (response.success && response.data?.token) {
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("refreshToken", response.data.refreshToken);
    }

    return response;
  }

  async logout(): Promise<ApiResponse> {
    try {
      const response = await apiService.post("/auth/logout", {});

      // Clear local storage regardless of response
      this.clearTokens();

      return response;
    } catch (error) {
      // Clear tokens even if logout request fails
      this.clearTokens();
      throw error;
    }
  }

  async refreshToken(): Promise<
    ApiResponse<{ token: string; refreshToken: string }>
  > {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await apiService.post<{
      token: string;
      refreshToken: string;
    }>("/auth/refresh", { refreshToken });

    if (response.success && response.data) {
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("refreshToken", response.data.refreshToken);
    }

    return response;
  }

  async getProfile(): Promise<ApiResponse<{ user: any }>> {
    return apiService.get("/auth/profile");
  }

  async validateToken(): Promise<ApiResponse<{ user: any }>> {
    const token = this.getToken();
    if (!token) {
      throw new Error("No token available");
    }
    return this.getProfile();
  }

  async updateProfile(
    data: ProfileUpdateData
  ): Promise<ApiResponse<{ user: any }>> {
    return apiService.put("/auth/profile", data);
  }

  async changePassword(data: ChangePasswordData): Promise<ApiResponse> {
    return apiService.post("/auth/change-password", data);
  }

  async forgotPassword(email: string): Promise<ApiResponse> {
    return apiService.post("/auth/forgot-password", { email });
  }

  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<ApiResponse> {
    return apiService.post("/auth/reset-password", { token, newPassword });
  }

  async verifyEmail(token: string): Promise<ApiResponse> {
    return apiService.get(`/auth/verify-email/${token}`);
  }

  // Utility methods
  clearTokens(): void {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
  }

  getToken(): string | null {
    return localStorage.getItem("authToken");
  }

  getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
