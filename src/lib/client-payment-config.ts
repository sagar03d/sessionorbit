export const CLIENT_PAYMENT_CONFIG = {
    env: (process.env.NEXT_PUBLIC_DODO_PAYMENTS_ENV || 'test_mode') as 'test_mode' | 'live_mode',

    productIds: {
        get pro() {
            return CLIENT_PAYMENT_CONFIG.env === 'live_mode'
                ? process.env.NEXT_PUBLIC_DODO_PRODUCT_ID_PRO_LIVE
                : process.env.NEXT_PUBLIC_DODO_PRODUCT_ID_PRO_TEST;
        },
        get starter() {
            return CLIENT_PAYMENT_CONFIG.env === 'live_mode'
                ? process.env.NEXT_PUBLIC_DODO_PRODUCT_ID_STARTER_LIVE
                : process.env.NEXT_PUBLIC_DODO_PRODUCT_ID_STARTER_TEST;
        }
    }
};
