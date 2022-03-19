/**
 * The various possible views and popups that each page can present.
 * @author Cameron Burkholder and Ethan Cannelongo
 * @date   10/20/2021
 */
const Views = {
    Home: {
        Login: "Login",
        ForgotPassword: "Forgot password",
        CreateAccount: "Create account",
        VerificationEmailConfirmation: "Verification email confirmation",
        AccountSetup: "Account setup"
    },
    Popup: {
        StudyGroup: {
            Join: "Join Study Group",
            Create: "Create Study Group",
            Edit: "Edit Study Group",
            CreateMeeting: "Create Meeting",
            CreatePost: "Create Post",
            ViewPost: "View Post",
            ViewMeetings: "View Meetings",
            ViewMember: "View Member"
        },
        Input: "Input Information",
        Confirmation: "Confirm"
    }
};

export default Views;
