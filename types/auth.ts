// Authentication and Authorization Types
export type Role = 
  | 'role_patient'
  | 'role_doctor' 
  | 'role_coordinator'
  | 'role_hosp_admin'
  | 'role_platform_admin';

export type Scope = 
  | 'patient:read'
  | 'patient:write'
  | 'doctor:read'
  | 'doctor:write'
  | 'admin:read'
  | 'admin:write'
  | 'billing:read'
  | 'billing:write'
  | 'upload:write'
  | 'matching:read'
  | 'matching:write';

export interface User {
  id: string;
  email: string;
  name: string;
  roles: Role[];
  scopes: Scope[];
  sub: string; // Keycloak subject ID
}

export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface KeycloakToken {
  sub: string;
  email: string;
  name: string;
  realm_access: {
    roles: string[];
  };
  resource_access: {
    [clientId: string]: {
      roles: string[];
    };
  };
  scope: string;
  exp: number;
  iat: number;
}

// Role to Scope mapping
export const ROLE_SCOPE_MAP: Record<Role, Scope[]> = {
  role_patient: ['patient:read', 'patient:write', 'upload:write'],
  role_doctor: ['patient:read', 'doctor:read', 'doctor:write', 'matching:read'],
  role_coordinator: ['patient:read', 'patient:write', 'doctor:read', 'matching:read', 'matching:write'],
  role_hosp_admin: ['patient:read', 'doctor:read', 'admin:read', 'billing:read', 'billing:write'],
  role_platform_admin: ['patient:read', 'patient:write', 'doctor:read', 'doctor:write', 'admin:read', 'admin:write', 'billing:read', 'billing:write', 'upload:write', 'matching:read', 'matching:write'],
};

// Route protection configuration
export interface RouteConfig {
  allowedRoles?: Role[];
  requiredScopes?: Scope[];
  public?: boolean;
}

export const ROUTE_CONFIG: Record<string, RouteConfig> = {
  '/': { public: true },
  '/patient': { allowedRoles: ['role_patient'] },
  '/patient/dashboard': { allowedRoles: ['role_patient'] },
  '/patient/upload': { allowedRoles: ['role_patient'], requiredScopes: ['upload:write'] },
  '/patient/documents': { allowedRoles: ['role_patient'] },
  
  '/doctor': { allowedRoles: ['role_doctor'] },
  '/doctor/cases': { allowedRoles: ['role_doctor'] },
  '/doctor/cases/[id]': { allowedRoles: ['role_doctor'] },
  '/doctor/matching': { allowedRoles: ['role_doctor'], requiredScopes: ['matching:read'] },
  
  '/admin': { allowedRoles: ['role_hosp_admin', 'role_platform_admin'] },
  '/admin/cases': { allowedRoles: ['role_hosp_admin', 'role_platform_admin'] },
  '/admin/billing': { allowedRoles: ['role_hosp_admin', 'role_platform_admin'], requiredScopes: ['billing:read', 'billing:write'] },
  '/admin/users': { allowedRoles: ['role_platform_admin'] },
  
  '/coordinator': { allowedRoles: ['role_coordinator'] },
  '/coordinator/cases': { allowedRoles: ['role_coordinator'] },
  '/coordinator/matching': { allowedRoles: ['role_coordinator'], requiredScopes: ['matching:write'] },
};
