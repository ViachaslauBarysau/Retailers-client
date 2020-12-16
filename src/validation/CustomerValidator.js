
export function validateCustomerCreation(e) {
    let validationResults = []
    let name = e.target.name.value;
    let email = e.target.email.value;

    (name.trim().length === 0 || name.length < 4 || name.length > 40) && validationResults.push("name");
    (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) && validationResults.push("email");

    return validationResults;
}

export function validateCustomerEdition(customer) {
    let validationResults = []
    let name = customer.name;

    (name.trim().length === 0 || name.length < 4 || name.length > 40) && validationResults.push("name");

    return validationResults;
}