const findUser = require('./findUser');

module.exports = async (token) => {
    const user = await findUser(token)
    return user.role === 'admin' ? user : false;
}