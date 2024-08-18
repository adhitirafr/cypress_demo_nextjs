"use client";

import { Provider } from 'react-redux';
import { store } from '../store/index.js'; // Adjust the path to your store


export default function ReduxProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}