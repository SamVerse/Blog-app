import jwt from 'jsonwebtoken';

const secret = '$2a$10$1Q7Zz'

function createTokenForUser(user){
    const payload = {
        _id: user._id,
        name: user.fullName,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role: user.role
    };

    const token = jwt.sign(payload, secret, {
        expiresIn: '1d'
    });

    return token;
};

function validateToken(token){
    try {
        const payload = jwt.verify(token, secret);
        return payload;
    } catch (error) {
        console.log(error);
    }
}

export {createTokenForUser, validateToken};