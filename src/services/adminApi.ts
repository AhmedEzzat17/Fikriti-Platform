import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import { API_BASE_URL } from "../api/client";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor: Attach Authorization Bearer token automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token") || localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const currentLang = localStorage.getItem("selectedLang") || "en";
    config.headers["Accept-Language"] = currentLang;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global Error & Token Expiry Handling
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("access_token");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ─── TypeScript Domain Interfaces ─────────────────────────────────────────
export interface ClientProject {
  id: number;
  title: string;
  description?: string;
  client_id: number;
  service_id?: number | null;
  service_name?: string;
  total_cost: string | number;
  amount_paid: string | number;
  remaining_balance: number;
  currency: string;
  status: "pending" | "active" | "on_hold" | "completed" | "delivered";
  start_date?: string | null;
  deadline?: string | null;
  is_allowed_access: boolean;
  blocked_message?: string | null;
  client?: {
    id: number;
    company_name?: string;
    industry?: string;
    phone?: string;
    country?: string;
    user?: { name: string; email: string };
  };
}

export interface ServiceTranslation {
  title: string;
  slug?: string;
  short_description?: string;
  description?: string;
}

export interface ServiceItem {
  id: number;
  icon?: string | null;
  is_active: boolean;
  sort_order: number;
  title?: string;
  slug?: string;
  short_description?: string;
  description?: string;
  translations?: Record<string, ServiceTranslation> | Array<{
    locale: string;
    title: string;
    slug?: string;
    short_description?: string;
    description?: string;
  }>;
  created_at?: string;
}

export interface ServicePayload {
  icon?: string;
  is_active: boolean;
  sort_order: number;
  translations: {
    en: ServiceTranslation;
    ar: ServiceTranslation;
  };
}

export interface BlogPostTranslation {
  title: string;
  slug?: string;
  excerpt?: string;
  body: string;
}

export interface BlogPostItem {
  id: number;
  user_id?: number;
  category_id?: number | null;
  thumbnail?: string | null;
  is_published: boolean;
  is_featured: boolean;
  published_at?: string | null;
  title?: string;
  slug?: string;
  excerpt?: string;
  body?: string;
  translations?: Record<string, BlogPostTranslation> | Array<{
    locale: string;
    title: string;
    slug?: string;
    excerpt?: string;
    body: string;
  }>;
  created_at?: string;
}

export interface BlogPostPayload {
  category_id?: number | null;
  thumbnail?: string | null;
  is_published: boolean;
  is_featured: boolean;
  translations: {
    en: BlogPostTranslation;
    ar: BlogPostTranslation;
  };
}

export interface PortfolioTranslation {
  title: string;
  slug?: string;
  short_description?: string; // maps to solution_summary in DB (brief overview / hero text)
  details_body?: string;      // maps to problem_statement in DB (full descriptive content)
  client_name?: string;
  live_url?: string;
}

export interface PortfolioPayload {
  is_published: boolean;
  is_featured?: boolean;
  year?: string | number;
  category_name?: string;
  service_name?: string;
  categories?: string[];
  media_type?: "image" | "gallery" | "video";
  thumbnail?: string;
  video_url?: string;
  gallery?: string[];
  translations: {
    en: PortfolioTranslation;
    ar: PortfolioTranslation;
  };
}

export interface PortfolioItem {
  id: number;
  is_published: boolean;
  is_featured?: boolean;
  year?: string | number;
  category_name?: string;
  service_name?: string;
  categories?: string[];
  technologies?: string[];
  media_type?: "image" | "gallery" | "video";
  thumbnail?: string;
  video_url?: string;
  gallery?: string[];
  title?: string;
  slug?: string;
  short_description?: string; // solution_summary
  details_body?: string;      // problem_statement
  client_name?: string;
  live_url?: string;
  translations?: {
    en?: PortfolioTranslation;
    ar?: PortfolioTranslation;
  };
  services?: Array<{ id: number; name?: string; title?: string }>;
  tags?: Array<{ id: number; name?: string; title?: string }>;
  created_at?: string;
}

export interface ContactLead {
  id: number;
  full_name: string;
  name?: string; // backward compat alias
  email: string;
  phone?: string;
  subject?: string;
  message?: string;
  service?: { id: number; title?: string } | null;
  status: "new" | "in_progress" | "closed" | "spam" | string;
  is_read?: boolean;
  is_new?: boolean;
  created_at?: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  job_title?: string;
  role: string;
  status?: string;
  notes?: string;
  joinDate?: string;
  created_at?: string;
}

export interface LoginGateSettings {
  enabled: boolean;
  password?: string;
  message?: string;
}

// ─── API Methods (CQRS / DDD Aligned) ─────────────────────────────────────
export const adminApi = {
  // ── Authentication
  getMe: () => axiosInstance.get<{ user: { id: number; name: string; email: string; role: string } }>("/auth/me"),
  logout: () => axiosInstance.post("/auth/logout"),

  // ── User / Administrator Management (CRUD)
  getUsers: (params?: { page?: number; search?: string; role?: string }) =>
    axiosInstance.get<{ data: AdminUser[]; total?: number }>("/admin/users", { params }),

  getUser: (id: number) =>
    axiosInstance.get<{ data: AdminUser }>(`/admin/users/${id}`),

  createUser: (payload: Record<string, any>) =>
    axiosInstance.post<{ data: AdminUser; message?: string }>("/admin/users", payload),

  updateUser: (id: number, payload: Record<string, any>) =>
    axiosInstance.patch<{ data: AdminUser; message?: string }>(`/admin/users/${id}`, payload),

  deleteUser: (id: number) =>
    axiosInstance.delete(`/admin/users/${id}`),

  // ── Services Management (CRUD)
  getServices: (params?: { search?: string; is_active?: boolean }) =>
    axiosInstance.get<{ data: ServiceItem[] }>("/admin/services", { params }),

  createService: (payload: ServicePayload | Record<string, any>) =>
    axiosInstance.post<{ data: ServiceItem; message?: string }>("/admin/services", payload),

  updateService: (id: number, payload: Record<string, any>) =>
    axiosInstance.patch<{ data: ServiceItem; message?: string }>(`/admin/services/${id}`, payload),

  deleteService: (id: number) =>
    axiosInstance.delete(`/admin/services/${id}`),

  // ── Blog Posts Management (CRUD)
  getBlogPosts: (params?: { search?: string; is_published?: boolean }) =>
    axiosInstance.get<{ data: BlogPostItem[] }>("/admin/blog-posts", { params }),

  createBlogPost: (payload: BlogPostPayload | Record<string, any>) =>
    axiosInstance.post<{ data: BlogPostItem; message?: string }>("/admin/blog-posts", payload),

  updateBlogPost: (id: number, payload: Record<string, any>) =>
    axiosInstance.patch<{ data: BlogPostItem; message?: string }>(`/admin/blog-posts/${id}`, payload),

  deleteBlogPost: (id: number) =>
    axiosInstance.delete(`/admin/blog-posts/${id}`),

  uploadBlogImage: (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return axiosInstance.post<{ url: string; path: string }>("/admin/blog-posts/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // ── Client Projects & Access Control
  getClientProjects: (params?: { page?: number; per_page?: number }) => 
    axiosInstance.get<{ data: ClientProject[]; total?: number }>("/admin/client-projects", { params }),

  createClientProject: (payload: Record<string, any>) =>
    axiosInstance.post<{ data: ClientProject }>("/admin/client-projects", payload),

  updateClientProject: (id: number, payload: Record<string, any>) =>
    axiosInstance.patch<{ data: ClientProject }>(`/admin/client-projects/${id}`, payload),

  deleteClientProject: (id: number) =>
    axiosInstance.delete(`/admin/client-projects/${id}`),

  toggleProjectAccess: (id: number, payload: { is_allowed_access: boolean; blocked_message?: string }) =>
    axiosInstance.patch(`/admin/client-projects/${id}/access`, payload),

  updateProjectStatus: (id: number, status: string) =>
    axiosInstance.patch(`/admin/client-projects/${id}/status`, { status }),

  // ── Portfolios Management
  getPortfolios: (params?: { page?: number; search?: string; per_page?: number }) =>
    axiosInstance.get<{ data: PortfolioItem[]; total?: number; meta?: any }>("/admin/portfolios", { params }),

  // POST /admin/portfolios — create new portfolio (supports multipart/form-data for file uploads)
  createPortfolio: (payload: FormData) =>
    axiosInstance.post<{ data: PortfolioItem; message?: string }>("/admin/portfolios", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // POST /admin/portfolios/{id}/save — update portfolio (POST route bypasses PHP PATCH multipart limitation)
  updatePortfolio: (id: number, payload: FormData) =>
    axiosInstance.post<{ data: PortfolioItem; message?: string }>(`/admin/portfolios/${id}/save`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  deletePortfolio: (id: number) =>
    axiosInstance.delete(`/admin/portfolios/${id}`),

  publishPortfolio:   (id: number) => axiosInstance.patch(`/admin/portfolios/${id}/publish`),
  unpublishPortfolio: (id: number) => axiosInstance.patch(`/admin/portfolios/${id}/unpublish`),

  // ── Contacts / Consultations (Lead Management)
  getContacts: (params?: { status?: string; is_read?: boolean; page?: number; search?: string; per_page?: number }) =>
    axiosInstance.get<{ data: ContactLead[]; meta?: any }>("/admin/contacts", { params }),

  getUnreadContactsCount: () =>
    axiosInstance.get<{ unread_count: number }>("/admin/contacts/unread-count"),

  updateContactStatus: (id: number, status: "new" | "in_progress" | "closed" | "spam" | string) =>
    axiosInstance.patch(`/admin/contacts/${id}/status`, { status }),

  deleteContact: (id: number) =>
    axiosInstance.delete(`/admin/contacts/${id}`),

  // ── Login Gate System Security Settings
  getLoginGateSettings: () =>
    axiosInstance.get<LoginGateSettings>("/admin/settings/login-gate"),

  updateLoginGateSettings: (payload: { enabled: boolean; password?: string }) =>
    axiosInstance.patch<LoginGateSettings>("/admin/settings/login-gate", payload),

  // ── Technologies Management
  getTechnologies: () =>
    axiosInstance.get<{ data: TechnologyItem[] }>("/admin/technologies"),

  createTechnology: (payload: FormData | Record<string, any>) =>
    axiosInstance.post<{ data: TechnologyItem }>("/admin/technologies", payload, {
      headers: payload instanceof FormData ? { "Content-Type": "multipart/form-data" } : {},
    }),

  updateTechnology: (id: number, payload: FormData | Record<string, any>) =>
    axiosInstance.patch<{ data: TechnologyItem }>(`/admin/technologies/${id}`, payload, {
      headers: payload instanceof FormData ? { "Content-Type": "multipart/form-data" } : {},
    }),

  deleteTechnology: (id: number) =>
    axiosInstance.delete(`/admin/technologies/${id}`),
};

export interface TechnologyItem {
  id: number;
  name: string;
  icon?: string;
  image_url?: string | null;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert" | string;
  color?: string;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export default adminApi;
