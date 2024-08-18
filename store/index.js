// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

import user from 'store/reducers/user.js'
import memo from 'store/reducers/memo.js'

export const store = configureStore({
    reducer: {
        user,
        memo
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false
        })
})