import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL_API = process.env.NEXT_PUBLIC_BASE_URL_API;

// Create Memo
export const createMemo = createAsyncThunk(
    'appMemo/create',
    async ({ data, token }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${BASE_URL_API}/note`,
                {
                    title: data.title,
                    note: data.description,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log('Create Memo Response:', response.data); // Log the response here
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.error('Unauthorized: Invalid token or session expired.');
            }
            return rejectWithValue(error.response);
        }
    }
);


// Get List of Memos
export const fetchMemos = createAsyncThunk('appMemo/get', async (params, { rejectWithValue }) => {
    try {

        const response = await axios.get(`${BASE_URL_API}/note`, {
            headers: {
                Authorization: `Bearer ${params.token}`
            }
        });

        return response.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

// Delete Memo
export const deleteMemo = createAsyncThunk('appMemo/delete', async ({ id, token }, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`${BASE_URL_API}/note/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const memoSlice = createSlice({
    name: 'appMemo',
    initialState: {
        data: [],
        code: null,
        message: "",
        status: "",
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMemos.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMemos.fulfilled, (state, action) => {
                state.data = action.payload.data || []; // Directly assign the array returned by the API
                state.code = action.payload.code;
                state.message = action.payload.message;
                state.status = action.payload.status;
                state.loading = false;
            })
            .addCase(fetchMemos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createMemo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createMemo.fulfilled, (state, action) => {
                if (action.payload && action.payload.data) {
                    state.data = [...state.data, ...action.payload.data]; // Append the entire list to the current state
                    state.code = "success";
                    state.message = action.payload.message;
                    state.status = "ok";
                } else {
                    state.error = 'Failed to create memo - no data returned';
                    console.error('Failed to create memo - no data returned');
                }
                state.loading = false;
            })
            .addCase(createMemo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteMemo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteMemo.fulfilled, (state, action) => {
                state.data = state.data.filter(memo => memo.id !== action.meta.arg.id);
                state.code = action.payload.code;
                state.message = action.payload.message;
                state.status = action.payload.status;
                state.loading = false;
            })
            .addCase(deleteMemo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default memoSlice.reducer;
