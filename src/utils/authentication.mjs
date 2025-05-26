import bcrypt from 'bcryptjs'

export function hashPassword(password){
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt);
}

export function comparePassword(raw, hash){
    return bcrypt.compareSync(raw, hash);
}