export function validateEmail(email) {
    var regex = /^[a-zA-Z0-9._%+-]+@(?:ug\.)?bilkent\.edu\.tr$/;
    return regex.test(email);
}