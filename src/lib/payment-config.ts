export const PAYMENT_CONFIG = {
    env: (process.env.NEXT_PUBLIC_DODO_PAYMENTS_ENV || 'test_mode') as 'test_mode' | 'live_mode',

    get apiKey() {
        return this.env === 'live_mode'
            ? process.env.DODO_PAYMENTS_API_KEY_LIVE
            : process.env.DODO_PAYMENTS_API_KEY_TEST;
    },

    get webhookKey() {
        return this.env === 'live_mode'
            ? process.env.DODO_PAYMENTS_WEBHOOK_KEY_LIVE
            : process.env.DODO_PAYMENTS_WEBHOOK_KEY_TEST;
    },

    productIds: {
        get pro() {
            return PAYMENT_CONFIG.env === 'live_mode'
                ? process.env.NEXT_PUBLIC_DODO_PRODUCT_ID_PRO_LIVE
                : process.env.NEXT_PUBLIC_DODO_PRODUCT_ID_PRO_TEST;
        },
        get starter() {
            return PAYMENT_CONFIG.env === 'live_mode'
                ? process.env.NEXT_PUBLIC_DODO_PRODUCT_ID_STARTER_LIVE
                : process.env.NEXT_PUBLIC_DODO_PRODUCT_ID_STARTER_TEST;
        },
        get squad() {
            return PAYMENT_CONFIG.env === 'live_mode'
                ? process.env.NEXT_PUBLIC_DODO_PRODUCT_ID_SQUAD_LIVE
                : process.env.NEXT_PUBLIC_DODO_PRODUCT_ID_SQUAD_TEST;
        }
    }
};
