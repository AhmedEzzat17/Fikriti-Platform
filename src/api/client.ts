/**
 * Enterprise API Client for Fikriti Platform.
 * Intercepts requests, attaches Sanctum tokens & locale headers,
 * and handles 404 response errors programmatically.
 */

export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private getHeaders(customHeaders?: HeadersInit): HeadersInit {
    const token = localStorage.getItem("access_token");
    const currentLang = localStorage.getItem("selectedLang") || "en";

    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Accept-Language": currentLang,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...customHeaders,
    };
  }

  public async fetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, headers, ...restOptions } = options;

    let url = endpoint.startsWith("http") ? endpoint : `${this.baseUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined) searchParams.append(key, String(val));
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes("?") ? "&" : "?") + queryString;
      }
    }

    try {
      const response = await fetch(url, {
        ...restOptions,
        headers: this.getHeaders(headers),
      });

      // Handle 401 Unauthorized Interception
      if (response.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        if (!window.location.pathname.startsWith("/login")) {
          window.location.href = "/login";
        }
        throw new Error("HTTP 401 Unauthorized");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP Error ${response.status}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      console.error("API Request Error:", error);
      throw error;
    }
  }

  public get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.fetch<T>(endpoint, { ...options, method: "GET" });
  }

  public post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.fetch<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public patch<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.fetch<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.fetch<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
