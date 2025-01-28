import axios from "../axios"

export const apiRegister = (data) => axios({
    url: '/user/register',
    method: 'POST',
    data,
    withCredentials: true,
})

export const apiLogin = (data) => axios({
    url: '/user/login',
    method: 'POST',
    data
})

export const apiForgotPassword = (data) => axios({
    url: '/user/forgotpassword',
    method: 'POST',
    data
})

export const apiResetPassword = (data) => axios({
    url: '/user/resetpassword',
    method: 'PUT',
    data
})

export const apigetCurrent = () => axios({
    url: '/user/current',
    method: 'GET',
})

export const apigetUsers = () => axios({
    url: '/user/getUsers',
    method: 'GET',
})

export const apiUpdateUsers = (uid, data) => axios({
    url: `/user/updateUserByAdmin/${uid}`,
    method: 'PUT',
    data
})

export const apiDeleteUser = (uid) => axios({
    url: `/user/deleteuser/${uid}`,
    method: 'DELETE',
})

export const apiBlockUser = async (uid, isBlocked) => axios({
    url: `/user/blockuserbyadmin/${uid}`,
    method: 'PUT',
    data: {isBlocked}
});

export const apiUpdateUser = async (data) => axios({
    url: "/user/current",
    method: 'PUT',
    data
});

export const apiUpdateCart = async (data) => axios({
    url: "/user/cart",
    method: 'PUT',
    data
});

export const apiDeleteCart = async (pid) => axios({
    url: "/user/remove-cart/" + pid,
    method: 'DELETE',
});




