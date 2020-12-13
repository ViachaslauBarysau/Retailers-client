export function validateActCreating(e) {
    let validationResults = []
    let actNumber = e.target.actNumber.value;

    (!actNumber || actNumber < 1 || actNumber > 999999999) && validationResults.push("actNumber");

    return validationResults;
}