// Fixed user.js
export default class User {
    constructor(email, password) {  // Fixed parameter names
        this.email = email;        // Fixed: was assigning to undefined 'username'
        this.password = password;
    }
}