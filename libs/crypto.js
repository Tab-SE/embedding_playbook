import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export const jwtEncode = (username, jwt_secret, jwt_secret_id, jwt_client_id) => {
    try {
        const payload = {
            "iss": jwt_client_id,
            "exp": '',
            "jti": '',
            "aud": 'tableau',
            "sub": username,
            "scp": [],
        };

        const header = {
            "kid": jwt_secret_id,
            "iss": jwt_client_id,
        };

        const token = jwt.sign(payload, jwt_secret, { 
            header: header,
            expiresIn: '10m', 
        });
        return token;
      } catch (error) {
        console.error('Error encoding JWT:', error);
        throw error;
      }
}


export const jwtDecode = () => {
    
}

console.log('crypto', crypto.randomBytes(64).toString("hex"));


