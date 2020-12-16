import validbarcode from "barcode-validator";

export function validateProductCreation(e) {
    let validationResults = []
    let upc = e.target.upc.value;
    let label = e.target.label.value;
    let volume = e.target.units.value;
    let categoryName = e.target.category.value;

    (!validbarcode(upc)) && validationResults.push("upc");
    (label.trim().length === 0 || label.length < 3 || label.length > 30) && validationResults.push("label");
    (categoryName.trim().length === 0 || categoryName.length < 3 || categoryName.length > 30) && validationResults.push("categoryName");
    (!volume || volume < 0) && validationResults.push("volume");

    return validationResults;
}

export function validateProductEditing(product) {
    let validationResults = []
    let label = product.label;
    let categoryName = product.category.name;

    (label.trim().length === 0 || label.length < 3 || label.length > 30) && validationResults.push("label");
    (categoryName.trim().length === 0 || categoryName.length < 3 || categoryName.length > 30) && validationResults.push("categoryName");

    return validationResults;
}
