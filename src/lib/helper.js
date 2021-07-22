const bcrypt = require('bcryptjs');
const passport = require('passport');


const helpers = {};
//Encriptar a senha 
helpers.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};
//pega a senha que esta sendo escrita e compara com a senha salva. 
helpers.matchPassword = async (password, savePassoword) => {
    try {
        return await bcrypt.compare(password, savePassoword);
    } catch (e) {
        console.log(e)
    }
}



module.exports = helpers;
