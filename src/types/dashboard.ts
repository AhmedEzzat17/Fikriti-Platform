export const DASHBOARD_TYPES_VERSION = '1.0';

export type UserRole = 'admin' | 'editor' | 'client';
export type UserStatus = 'active' | 'suspended' | 'pending';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  job_title?: string | null;
  role: UserRole;
  status: UserStatus;
  notes?: string | null;
  created_at: string;
}

export type ProjectStatus = 'pending' | 'active' | 'on_hold' | 'completed' | 'delivered';

export interface ClientProject {
  id: number;
  client_id: number;
  service_id?: number | null;
  title: string;
  description?: string | null;
  total_cost: number | string;
  amount_paid: number | string;
  remaining_balance: number;
  has_pending_payment: boolean;
  currency: string;
  status: ProjectStatus;
  start_date?: string | null;
  deadline?: string | null;
  is_allowed_access: boolean;
  blocked_message?: string | null;
  client?: {
    id: number;
    company_name?: string | null;
    user?: {
      name: string;
      email: string;
    };
  };
  service?: {
    id: number;
    title: string;
    slug?: string;
  } | null;
  created_at?: string;
  updated_at?: string;
}

export type ContactStatus = 'new' | 'in_progress' | 'closed' | 'spam';

export interface Contact {
  id: number;
  service_id?: number | null;
  full_name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  status: ContactStatus;
  is_read: boolean;
  is_new: boolean;
  created_at: string;
  service?: {
    id: number;
    title: string;
  } | null;
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

export interface PortfolioTranslation {
  title: string;
  slug: string;
  client_name?: string;
  problem_statement: string;
  solution_summary: string;
  live_url?: string;
}

export interface PortfolioPayload {
  user_id?: number;
  thumbnail?: string;
  is_published: boolean;
  is_featured: boolean;
  sort_order?: number;
  service_ids: number[];
  tag_ids: number[];
  translations: {
    en: PortfolioTranslation;
    ar: PortfolioTranslation;
  };
}

export interface PortfolioItem {
  id: number;
  user_id?: number;
  thumbnail?: string | null;
  is_published: boolean;
  is_featured: boolean;
  sort_order: number;
  title?: string;
  slug?: string;
  translations?: Record<string, PortfolioTranslation>;
  created_at?: string;
}

export interface LoginGateSettings {
  enabled: boolean;
  password?: string;
}

export interface ClientDashboardAccessibleResponse {
  status: 'accessible';
  project: ClientProject;
}

export interface ClientDashboardBlockedResponse {
  status: 'blocked';
  message: string;
}

export type ClientDashboardResponse = ClientDashboardAccessibleResponse | ClientDashboardBlockedResponse;
