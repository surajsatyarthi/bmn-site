/**
 * Centralized authentication error mapping for BMN.
 * Converts technical Supabase/Auth errors into clear, actionable, non-technical instructions.
 */

export interface AuthErrorResponse {
  message: string;
  solution?: string;
}

const ERROR_MAP: Record<string, AuthErrorResponse> = {
  'invalid_credentials': {
    message: 'The email or password entered doesn\'t match our records.',
    solution: 'Please check your spelling and try again, or reset your password if you\'ve forgotten it.'
  },
  'email_not_confirmed': {
    message: 'Your email address hasn\'t been verified yet.',
    solution: 'Please check your inbox (and spam folder) for the verification link we sent. If you can\'t find it, you can request a new one.'
  },
  'user_already_exists': {
    message: 'An account with this email address already exists.',
    solution: 'Try logging in instead, or use the "Forgot Password" link if you can\'t access your account.'
  },
  'rate_limit': {
    message: 'You\'ve made too many requests in a short time.',
    solution: 'For your security, please wait a few minutes before trying again.'
  },
  'weak_password': {
    message: 'The password you chose isn\'t strong enough.',
    solution: 'Please use at least 6 characters with a mix of letters and numbers to keep your account safe.'
  },
  'invalid_email': {
    message: 'The email address provided doesn\'t look correct.',
    solution: 'Please enter a valid email address like "name@company.com".'
  },
  'network_error': {
    message: 'We\'re having trouble connecting to our servers.',
    solution: 'Please check your internet connection and try refreshing the page.'
  },
  'default': {
    message: 'Something went wrong while processing your request.',
    solution: 'Please try again in a few moments. If the problem persists, contact our support team.'
  }
};

/**
 * Maps a technical error string or Error object to a user-friendly response.
 */
export function getFriendlyAuthError(error: unknown): AuthErrorResponse {
  const errorMessage = typeof error === 'string' 
    ? error.toLowerCase() 
    : (error as Error)?.message?.toLowerCase() || '';

  if (errorMessage.includes('invalid login credentials') || errorMessage.includes('invalid_credentials')) {
    return ERROR_MAP['invalid_credentials'];
  }
  
  if (errorMessage.includes('email not confirmed') || errorMessage.includes('email_not_confirmed')) {
    return ERROR_MAP['email_not_confirmed'];
  }
  
  if (errorMessage.includes('user already registered') || errorMessage.includes('already_exists')) {
    return ERROR_MAP['user_already_exists'];
  }
  
  if (errorMessage.includes('rate limit') || errorMessage.includes('rate_limit')) {
    return ERROR_MAP['rate_limit'];
  }
  
  if (errorMessage.includes('password should be at least') || errorMessage.includes('weak_password')) {
    return ERROR_MAP['weak_password'];
  }
  
  if (errorMessage.includes('email') && (errorMessage.includes('invalid') || errorMessage.includes('phone'))) {
    return ERROR_MAP['invalid_email'];
  }

  if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
    return ERROR_MAP['network_error'];
  }

  return ERROR_MAP['default'];
}
