import { UserManager } from 'oidc-client-ts'

export const oidcClient = new UserManager({
  //authority: import.meta.env.VITE_AUTHENTIK_AUTHORITY,
  authority: import.meta.env.VITE_AUTHENTIK_AUTHORITY,
  client_id: import.meta.env.VITE_AUTHENTIK_CLIENT_ID,

  redirect_uri: window.location.origin + '/callback',
  post_logout_redirect_uri: window.location.origin,

  response_type: 'code',

  scope: import.meta.env.VITE_AUTHENTIK_SCOPE,

  userStore: undefined,

  automaticSilentRenew: true
})