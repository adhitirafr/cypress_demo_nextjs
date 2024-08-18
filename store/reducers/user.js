import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

import axios from 'axios';

const BASE_URL_API = process.env.NEXT_PUBLIC_BASE_URL_API;

// Register User (Login)
export const loginData = createAsyncThunk('appUser/login', async (params, { rejectWithValue }) => {
    try {

        console.log("BASE_URL_API: " + BASE_URL_API)

        // Sending params in the request body
        const response = await axios.post(`${BASE_URL_API}/user/login`, {
            email: params.email,
            password: params.password
        });

        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const userSlice = createSlice({
    name: 'appUser',
    initialState: {
        data: null,
        code: 200,
        message: "",
        status: "",
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(loginData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginData.fulfilled, (state, action) => {
                state.data = action.payload.data;
                state.code = action.payload.code;
                state.message = action.payload.message;
                state.status = action.payload.status;
                state.loading = false;
            })
            .addCase(loginData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default userSlice.reducer;
