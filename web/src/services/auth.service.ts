import { authApi } from "../apis/auth.api";

export const authService = {
  async me(): Promise<IUserResponse> {
    const res = await authApi.me();

    return res.data;
  },

  async signin(data: IAuthSignInRequest): Promise<IAuthResponse> {
    const res = await authApi.signin(data);

    return res.data;
  },

  async signup(data: IAuthSignupRequest) {
    const res = await authApi.signup(data);

    return res.data;
  },

  async verifyAccount(data: IAuthVerifyEmailRequest) {
    const res = await authApi.verifyAccount(data);

    return res;
  },

  async resendVerifyEmail(email: string) {
    await authApi.resendVerifyEmail(email);
  },

  async logout() {
    await authApi.logout();

    return true;
  },
};
