import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export const jwtSign = (sub, jwt_options, scopes) => {
    // https://help.tableau.com/current/online/en-us/connected_apps_direct.htm#step-3-configure-the-jwt
    try {
        const payload = {
            'iss': jwt_options.jwt_client_id, // Connected App configuration
            'jti': uuidv4(),
            'aud': 'tableau',
            'sub': sub, // enforces user level permissions on embed and REST APIs
            'scp': scopes, // scopes set by calling function and provided as parameter
        };

        const header = {
            'kid': jwt_options.jwt_secret_id, // Connected App configuration
            'iss': jwt_options.jwt_client_id, // Connected App configuration
            'alg': 'HS256',
        };

        // sign the JWT with provided header, payload and secret
        const token = jwt.sign(payload, jwt_options.jwt_secret, { 
            header: header,
            expiresIn: '9m', // https://github.com/auth0/node-jsonwebtoken?tab=readme-ov-file#token-expiration-exp-claim
        });
        return token;
    } catch (error) {
        console.error('Error encoding JWT:', error);
        throw error;
    }
}


export const jwtVerify = (token, username, jwt_secret, jwt_client_id) => {
    try {
        // decode and validate the JWT making sure it matches the following
        const valid = jwt.verify(token, jwt_secret, {
            'algorithms': ['HS256'],
            'audience': 'tableau',
            'issuer': jwt_client_id,
            'subject': username,
            'maxAge': '10m',
            'clockTimestamp': Math.floor(Date.now() / 1000), // current time in seconds since the epoch
        });
        return valid;
    } catch (error) {
        console.error('Error verifying JWT:', error);
        throw error;
    }
}

