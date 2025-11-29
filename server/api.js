import axios from "axios";

const API = axios.create({
    baseURL: "https://vedaro.in/api",
    timeout: 10000,
});

API.interceptors.request.use(async (config) => {
    const token = global.authToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const loginStaff = (data) => API.post("/staff/login", data);
export const logoutStaff = () => API.post("/staff/logout");

export const getProfile = () => API.get("/staff/profile");

export const addToCart = (identifier, qty) =>
    API.post(`/staff/cart/add/${identifier}`, { qty });

export const getCartData = () => API.get("/staff/cart");

export const increaseCartItem = (cart_id) =>
    API.post(`/cart/increase/${cart_id}`);

export const decreaseCartItem = (cart_id) =>
    API.post(`/cart/decrease/${cart_id}`);

export const checkout = (data) => API.post("/staff/checkout", data);

export const getCustomerByPhone = (phone) =>
    API.post(`/checkout/customer/${phone}`);

export const getPendingInvoices = () => API.get("/pending-invoices");

export const scanProduct = (qrCode) => API.post(`/scan-product/${qrCode}`);

export const createPendingInvoice = (payload) =>
    API.post("/pending-invoices", payload);


export const invoiceItemsHistory = () => API.get("/invoice-items/history");

export default API;
