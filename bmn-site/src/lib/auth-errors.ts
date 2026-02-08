/**
 * Centralized authentication error mapping for BMN.
 * Converts technical Supabase/Auth errors into clear, actionable, non-technical instructions.
 */

export interface AuthErrorResponse {
  message: string;
  solution?: string;
  technical?: string;
  supportRecommended: boolean;
}

const ERROR_MAP: Record<string, AuthErrorResponse> = {
  'invalid_credentials': {
    message: "The email or password entered doesn't match our records.",
    solution: "Please check your spelling and try again, or reset your password if you've forgotten it.",
    supportRecommended: false
  },
  'email_not_confirmed': {
    message: "Your email hasn't been verified yet.",
    solution: "Please check your inbox (and spam) for the verification link we sent you.",
    supportRecommended: false
  },
  'user_already_exists': {
    message: "An account with this email already exists.",
    solution: "Try logging in instead, or use the 'Forgot Password' link to regain access.",
    supportRecommended: false
  },
  'rate_limit': {
    message: "Too many attempts from your device.",
    solution: "Please wait a few minutes before trying again for security purposes.",
    supportRecommended: false
  },
  'weak_password': {
    message: "Your password is not strong enough.",
    solution: "Please choose a password with at least 6 characters and a mix of letters and numbers.",
    supportRecommended: false
  },
  'invalid_email': {
    message: "The email address you entered is invalid.",
    solution: "Double-check your email format (e.g., name@example.com).",
    supportRecommended: false
  },
  'network_error': {
    message: "We're having trouble connecting to our servers.",
    solution: "Please check your internet connection and try again.",
    supportRecommended: true
  },
  'default': {
    message: 'Something went wrong while processing your request.',
    solution: 'Please try again in a few moments. If the problem persists, our team is ready to help.',
    supportRecommended: true
  }
};

/**
 * Maps a technical error string or Error object to a user-friendly response.
 */
export function getFriendlyAuthError(error: unknown): AuthErrorResponse {
  const errorMessage = typeof error === 'string' 
    ? error.toLowerCase() 
    : (error as Error)?.message?.toLowerCase() || '';

  const response = { ...ERROR_MAP['default'] };

  if (errorMessage.includes('invalid login credentials') || errorMessage.includes('invalid_credentials')) {
    Object.assign(response, ERROR_MAP['invalid_credentials']);
  } else if (errorMessage.includes('email not confirmed') || errorMessage.includes('email_not_confirmed')) {
    Object.assign(response, ERROR_MAP['email_not_confirmed']);
  } else if (errorMessage.includes('user already registered') || errorMessage.includes('already_exists')) {
    Object.assign(response, ERROR_MAP['user_already_exists']);
  } else if (errorMessage.includes('rate limit') || errorMessage.includes('rate_limit')) {
    Object.assign(response, ERROR_MAP['rate_limit']);
  } else if (errorMessage.includes('password should be at least') || errorMessage.includes('weak_password')) {
    Object.assign(response, ERROR_MAP['weak_password']);
  } else if (errorMessage.includes('email') && (errorMessage.includes('invalid') || errorMessage.includes('phone'))) {
    Object.assign(response, ERROR_MAP['invalid_email']);
  } else if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
    Object.assign(response, ERROR_MAP['network_error']);
  }

  // Always include the raw error for support/debugging
  response.technical = errorMessage || String(error);

  // Log unhandled errors for debugging
  if (response.message === ERROR_MAP['default'].message) {
    console.error('Unhandled Auth Error:', error);
  }
  
  return response;
}
