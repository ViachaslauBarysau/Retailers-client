export function validateLogin(fields) {
    let validationResults = []

    let username = fields.username;
    let password = fields.password;

    (username.trim().length === 0) && validationResults.push("username");
    (password.trim().length === 0) && validationResults.push("password");

    return validationResults;
}