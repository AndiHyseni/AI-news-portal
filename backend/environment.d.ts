declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'local' | 'development' | 'production';
            PORT: number;
            SHOPWARE_API_URL: string;

            // DB
            DB_HOSTNAME: string;
            DB_PASSWORD: string;
            DB_PORT: number;
            DB_USERNAME: string;
            DB_NAME: string;
            DB_DIALECT: string;

            // JWT
            JWT_ALGORITHM: string;
            JWT_SECRET: string;
            JWT_EXPIRES_IN: string;

            // MAIL
            MAIL_DRIVER: string;
            MAIL_HOST: string;
            MAIL_PORT: number;
            MAIL_USERNAME: string;
            MAIL_PASSWORD: string;
            MAIL_FROM_NAME: string;
            MAIL_FROM_ADDRESS: string;
        }
    }
}

export {};
