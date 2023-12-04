const usersData = require('../persistence/usersData');

function getAllUsers() {
    return usersData.getAllUsers();
}

function createUser(newUser) {
    usersData.createUser(newUser);
}

module.exports = {
    getAllUsers,
    createUser,
};