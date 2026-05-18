
interface LoginInterface {
    email: string;
    password: string;
}

export default class Login {

    static async loginPost(data: LoginInterface) {
        if (data.email == "") {
            return { success: false, message: "Email is required" }
        }
        if (data.password == "") {
            return { success: false, message: "Password is required" }
        }
        return { success: true, message: "Login successful", data: data };
    }
}