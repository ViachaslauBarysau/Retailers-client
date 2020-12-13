export function validateBillCreating(e) {
    let validationResults = []
    let billNumber = e.target.billNumber.value;

    (!billNumber || billNumber < 1 || billNumber > 999999999) && validationResults.push("billNumber");

    return validationResults;
}