export const users = {
    INFO: 'users/info',
    GET_DEF_PRICE: '/users/get-default-price',
    GET_PRICE: '/users/get-price',
    GET_USER_PRICE: (user_id) => `/users/${user_id}/get-price`,
    GET_CLIENTS: 'users/get-clients',
    SET_PRICE: (user_id) => `/users/${user_id}/set-price`,
    SET_DEF_PRICE: `/users/set-price`,
    ADD_BALANCE: (user_id) => `/users/${user_id}/balance-add`
}
