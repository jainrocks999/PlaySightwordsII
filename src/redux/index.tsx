import {configureStore} from '@reduxjs/toolkit';
import reducers from './reducers';
export const sightStore = configureStore({
  reducer: {
    data: reducers,
  },
});
export type rootState = ReturnType<typeof sightStore.getState>;
