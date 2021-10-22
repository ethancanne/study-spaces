// HOME VIEWS.
import LoginView from "./Home/LoginView.js";

/**
* The various possible views that each page can present.
* @author Cameron Burkholder
* @date   10/20/2021
*/
const Views = {
  Home: {
    Login: LoginView,
    ForgotPassword: "Forgot password",
    CreateAccount: "Create account",
    VerificationEmailConfirmation: "Verification email confirmation",
    AccountSetup: "Account setup"
  }
}

export default Views;
