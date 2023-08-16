export function sortArray(data) {
    // Define a function to convert the elements to numeric values
    const convertToNumeric = (element) => {
        if (element === "N/A") {
            return Infinity; // Assign a very large value for "N/A"
        } else if (element.endsWith("oz")) {
            const fraction = element.split("/")[0] || "0";
            return parseFloat(fraction) / 32; // Convert ounces to grams
        } else {
            return parseFloat(element);
        }
    };

    // Sort the array in ascending order
    return data.sort((a, b) => convertToNumeric(a) - convertToNumeric(b));
}

export function sortArrayStateAlphabetically(data) {
    if (data && Array.isArray(data) && data?.length > 0) {
        let temp = [...data];
        return temp.sort((a, b) => a.name.localeCompare(b.name));
    }
}

export function sortArrayStateAlphabeticallyAfterFilter(data) {
    if (data && Array.isArray(data) && data?.length > 0) {
        let temp = [...data];
        return temp.sort((a, b) => a.localeCompare(b));
    }
}

export function sortArrayAlphabetically(data, checkElasticSearch) {
    // when elastic search , this time skip sorting alphabetically
    // console.log('checkElasticSearch', checkElasticSearch)
    if (checkElasticSearch) {
        return data;
    } else {
        return [...data].sort((a, b) => {
            const nameA = a.name.toLowerCase().replace(/\W+/g, ' - ');
            const nameB = b.name.toLowerCase().replace(/\W+/g, ' - ');
            return nameA.localeCompare(nameB);
        });
    }
}
