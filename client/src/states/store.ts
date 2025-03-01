import { configureStore } from '@reduxjs/toolkit'
import userReducer from './reducers/userSlice'
import themeReducer from './reducers/themeSlice'
import { useDispatch, useSelector } from 'react-redux'
// import storage from 'redux-persist/lib/storage'
// import { persistReducer } from 'redux-persist'

// const persistConfig = {
//   key: 'root',
//   version: 1,
//   storage
// }

// const reducers = combineReducers({
//   user: userReducer,
//   theme: themeReducer,
//   // features: featuresReducer,
//   // tiers: tiersReducer
// })

// const persistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({
  reducer: {
    user: userReducer,
    theme: themeReducer
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()