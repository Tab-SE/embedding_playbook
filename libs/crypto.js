import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export const jwtEncode = (username, jwt_secret, jwt_secret_id, jwt_client_id, scopes) => {
    // https://help.tableau.com/current/online/en-us/connected_apps_direct.htm#step-3-configure-the-jwt
    try {
        const payload = {
            "iss": jwt_client_id, // Connected App configuration
            "jti": uuidv4(),
            "aud": "tableau",
            "sub": username, // enforces user level permissions on embed and REST APIs
            "scp": scopes, // scopes set by calling function and provided as parameter
        };

        const header = {
            "kid": jwt_secret_id, // Connected App configuration
            "iss": jwt_client_id, // Connected App configuration
            "alg": "HS256",
        };

        const token = jwt.sign(payload, jwt_secret, { 
            header: header,
            expiresIn: '10m', // https://github.com/auth0/node-jsonwebtoken?tab=readme-ov-file#token-expiration-exp-claim
        });
        return token;
    } catch (error) {
        console.error('Error encoding JWT:', error);
        throw error;
    }
}


export const jwtDecode = () => {
    try {
        return 'token';
    } catch (error) {
        console.error('Error verifying JWT:', error);
        throw error;
    }
}

