export function validatePassword(e) {
    let validationResults = []
    let password = e.target.password.value;
    let confirmedPassword = e.target.confirmedPassword.value;

    (password.trim().length === 0 || !password || password.length < 6 || password.includes(" ")) && validationResults.push("password");
    (validationResults.length === 0 &&  password !== confirmedPassword) && validationResults.push("confirmedPassword");

    return validationResults;
}