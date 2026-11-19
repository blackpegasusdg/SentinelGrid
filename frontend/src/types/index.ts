// ============================================================
// SentinelGrid — TypeScript Type Definitions
// Mirrored from FastAPI/Pydantic schemas
// ============================================================

// ---- Tenant ------------------------------------------------
export interface Tenant {
  id: number;
  name: string;
  created_at: string;
}

export interface TenantCreate {
  name: string;
}

// ---- User --------------------------------------------------
export interface User {
  id: number;
  name: string;
  email: string;
  tenant_id: number;
}

export interface UserCreate {
  name: string;
  email: string;
  password: string;
  tenant_id: number;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: 'bearer';
}

// ---- Asset -------------------------------------------------
export type AssetType = 'domain' | 'ip_address' | 'web_application';

export interface Asset {
  id: number;
  name: string;
  asset_type: AssetType;
  value: string;
  description: string | null;
  tenant_id: number;
  created_at: string;
  verified_at: string | null;
}

export interface AssetCreate {
  name: string;
  asset_type: AssetType;
  value: string;
  description?: string;
}

export interface AssetUpdate {
  name?: string;
  asset_type?: AssetType;
  value?: string;
  description?: string | null;
}

export interface VerificationTokenResponse {
  message: string;
  asset_id: number;
  domain: string;
  record_type: string;
  record_name: string;
  record_value: string;
}

export interface VerificationStatusResponse {
  asset_id: number;
  asset_name: string;
  asset_value: string;
  verified: boolean;
  verified_at: string | null;
  scan_eligible: boolean;
}

export interface VerifyOwnershipResponse {
  message: string;
  asset_id: number;
  domain: string;
  verified: boolean;
  verified_at: string;
}

// ---- Scan --------------------------------------------------
export type ScanType = 'asset_inventory' | 'tls_configuration' | 'http_security_headers';
export type ScanStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface Scan {
  id: number;
  asset_id: number;
  tenant_id: number;
  scan_type: ScanType;
  status: ScanStatus;
  scope_description: string | null;
  requested_at: string;
  started_at: string | null;
  completed_at: string | null;
}

export interface ScanCreate {
  asset_id: number;
  scan_type: ScanType;
}

// ---- API Errors --------------------------------------------
export interface ApiError {
  detail: string;
}

// ---- Dashboard Stats (derived) ----------------------------
export interface DashboardStats {
  totalAssets: number;
  verifiedAssets: number;
  pendingVerification: number;
  totalScans: number;
  pendingScans: number;
  assetsByType: { type: string; count: number }[];
}
