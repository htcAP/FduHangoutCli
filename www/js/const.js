FduHangoutApp
  .constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized',
    openLogin: 'auth-open-login'
  })
  .constant('NOTIFICATION_EVENTS', {
    notificationRefresh: 'notification-refresh'
  });