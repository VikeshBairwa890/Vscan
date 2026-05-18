
interface SignupInterface {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export default class Signup {

    static async signupPost(data: SignupInterface) {
        if (data.fullName == "") {
            return { success: false, message: "Full name is required" }
        }
        if (data.email == "") {
            return { success: false, message: "Email is required" }
        }
        if (data.password == "") {
            return { success: false, message: "Password is required" }
        }
        if (data.confirmPassword == "") {
            return { success: false, message: "Confirm password is required" }
        }
        if (data.password !== data.confirmPassword) {
            return { success: false, message: "Passwords do not match" }
        }
        return { success: true, message: "Signup successful", data: data };
    }
}