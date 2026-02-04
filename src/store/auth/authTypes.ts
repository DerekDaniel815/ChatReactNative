export type RegisterRequest = {
  email: string;
  username: string;
  password: string;
};

// Esto debe calzar con tu Nest:
// { user: { id, email, username }, accessToken, refreshToken }
export type AuthResponse = {
  user: { id: string; email: string; username: string };
  accessToken: string;
  refreshToken: string;
};

export type LoginRequest = {
  identifier: string; // email o username
  password: string;
};
