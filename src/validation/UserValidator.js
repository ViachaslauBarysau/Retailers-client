const EIGHTEEN_YEARS_OLD = 568025136000;
const HUNDRED_YEARS_OLD = 3155695200000;

export function validateUserCreation(e) {
    let validationResults = []
    let firstName = e.target.name.value;
    let lastName = e.target.surname.value;
    let city = e.target.city.value;
    let firstAddressLine = e.target.address1.value;
    let email = e.target.email.value;
    let userRole = e.target.role.value;
    let age = new Date(e.target.date_of_birth.value).getTime();
    let login = e.target.login.value;

    (!firstName || (firstName.length < 2 || firstName.length > 20)) && validationResults.push("name");

    (!lastName || lastName.length < 2 || lastName.length > 20) && validationResults.push("surname");

    (!city || city.length < 3 || city.length > 30) && validationResults.push("city");

    (!firstAddressLine || firstAddressLine.length < 5) && validationResults.push("firstAddressLine");

    (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) && validationResults.push("email");

    (userRole != "DIRECTOR" && !e.target.location.value) && validationResults.push("location");

    (new Date() - age < EIGHTEEN_YEARS_OLD || new Date() - age > HUNDRED_YEARS_OLD) && validationResults.push("birthday");

    (!login || login.length < 3) && validationResults.push("login");

    return validationResults;
}

export function validateUserEditingByAdmin(e) {
    let validationResults = []
    let userRole = e.target.role.value;

    (userRole != "DIRECTOR" && !e.target.location.value) && validationResults.push("location");

    return validationResults;
}

export function validateUserEditingByUser(user) {
    let validationResults = []
    let firstName = user.firstName;
    let lastName = user.lastName;
    let city = user.address.city;
    let firstAddressLine = user.address.firstAddressLine;
    let age = new Date(user.birthday).getTime();

    (!firstName || (firstName.length < 2 || firstName.length > 20)) && validationResults.push("name");

    (!lastName || lastName.length < 2 || lastName.length > 20) && validationResults.push("surname");

    (!city || city.length < 3 || city.length > 30) && validationResults.push("city");

    (!firstAddressLine || firstAddressLine.length < 5) && validationResults.push("firstAddressLine");

    (new Date() - age < EIGHTEEN_YEARS_OLD || new Date() - age > HUNDRED_YEARS_OLD) && validationResults.push("birthday");

    return validationResults;
}
