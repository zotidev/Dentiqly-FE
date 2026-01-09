import { apiClient } from "../lib/api-client"
import type { AuthResponse, AuthUser, LoginData, RegisterData, ApiResponse } from "../types"

export const authApi = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>("/auth/login", data)

    if (response.data?.token) {
      apiClient.setToken(response.data.token)
      return response.data
    }

    throw new Error("Invalid login response")
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>("/auth/register", data)

    if (response.data) {
      return response.data
    }

    throw new Error("Invalid register response")
  },

  async me(): Promise<AuthUser> {
    const response = await apiClient.get<ApiResponse<AuthUser>>("/auth/me")

    if (response.data) {
      return response.data
    }

    throw new Error("Invalid user data response")
  },

  logout() {
    apiClient.clearToken()
  },
}
