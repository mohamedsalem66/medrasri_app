declare global {
    namespace NodeJS {
        interface ProcessEnv {
            ENVIRONMENT: 'development' | 'production' | 'staging' | 'integration',
            MARSA_DRIVE: string
            GG_ANDROID_CLIENT_ID: string
            GG_IOS_CLIENT_ID: string
        }
    }
}
export {};
