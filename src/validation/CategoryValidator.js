export function validateCategoryEditing(category) {
    let validationResults = []
    let name = category.name;
    let tax = category.categoryTax;

    (name.trim().length === 0 || name.length < 3 || name.length > 30) && validationResults.push("name");
    (tax < 0) && validationResults.push("tax");

    return validationResults;
}
