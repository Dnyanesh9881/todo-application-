
function isEmailRgex({ email }) {
    const isEmail =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
            email
        );
    return isEmail;
}

const userDataValidation = ({ name, email, username, password }) => {

        if (!name || !email || !username || !password)
            reject("All Fields required");
        if ((name.length < 3)) return "name should contain atleas 4 characters";
        if (username.length < 3) return "username should contain atleas 4 characters";
        if (password.length < 6) return "password should contain atleas 6 characters";

        if (!isEmailRgex({ email: email })) return ("Email format is incorrect");

        return null;
};

export  {userDataValidation, isEmailRgex};