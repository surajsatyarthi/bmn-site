
export const MOCK_USER_ID = 'd2d4586e-9646-4b16-b363-c301ada79540'; // Matches verified user in DB
export const MOCK_EMAIL = 'mock_bypass@bmn.com';

export const MOCK_USER = {
  id: MOCK_USER_ID,
  aud: 'authenticated',
  role: 'authenticated',
  email: MOCK_EMAIL,
  email_confirmed_at: new Date().toISOString(),
  phone: '',
  confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  app_metadata: {
    provider: 'email',
    providers: ['email'],
  },
  user_metadata: {
    full_name: 'Mock Bypass User',
  },
  identities: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  is_anonymous: false,
};

export const MOCK_SESSION = {
  access_token: 'mock-access-token',
  token_type: 'bearer',
  expires_in: 3600,
  refresh_token: 'mock-refresh-token',
  user: MOCK_USER,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
};

export const MOCK_USER_UNCONFIRMED = {
  ...MOCK_USER,
  email_confirmed_at: null,
  confirmed_at: null,
};

export const MOCK_SESSION_UNCONFIRMED = {
  ...MOCK_SESSION,
  user: MOCK_USER_UNCONFIRMED,
};
