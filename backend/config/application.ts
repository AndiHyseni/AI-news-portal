const base = '/api';
export const sftpPath = '/';

export default {
    url: {
        base,
        stage: 'http://localhost:3000'
    },
    email: 'hyseniandi6@gmail.com',
    password: 'Test1234',
    timers: {
        userTokenExpiry: '72h'
    },
    env: {
        // authSecret: process.env.TOKEN_SECRET_KEY || 'M0jUcTURY7'
        authSecret: 'M0jUcTURY7'
    },
    authorizationIgnorePath: []
};
