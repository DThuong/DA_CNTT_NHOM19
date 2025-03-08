import axios from "../axios"

export const apigetProduct = (params) => axios({
    url: '/product/',
    method: 'GET',
    params
})

export const apigetProductById = (pid) => axios({
    url: '/product/' + pid,
    method: 'GET',
})

export const apiRatings = (data) => axios({
    url: '/product/ratings',
    method: 'PUT',
    data
})