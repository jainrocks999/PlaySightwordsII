import {createSlice} from '@reduxjs/toolkit';
import type {dbData, random} from '../../types';
const initialState = {
  dbData: [] as dbData,
  random: {random: false} as random,
  backSound: {
    word: false,
    find: false,
    memory: false,
    bingo: false,
    home: true,
  },
  page: 'home',
  grade: 'tblWord',
};
const reducer = createSlice({
  name: 'sightwords',
  initialState,
  reducers: {
    getDataFromdb: (state, action: {payload: dbData}) => {
      return {
        ...state,
        dbData: action.payload.filter(item =>
          item?.ID
            ? item
            : {
                Color: '',
                Grade: '',
                ID: -1,
                Word: '',
                Live: '',
                Sentence: '',
                Level: '',
              },
        ),
      };
    },
    setRendom: (state, action) => {
      state.random = action.payload;
      return state;
    },
    backSound: (state, action) => {
      state.backSound = action.payload;
      return state;
    },
    resetbackSound: (state, action) => {
      state.backSound = {
        word: false,
        find: false,
        memory: false,
        bingo: false,
        home: true,
      };

      return state;
    },
    setPageChange: (state, action) => {
      state.page = action.payload;
      return state;
    },
    setGrade: (state, action) => {
      state.grade = action.payload;
      return state;
    },
  },
});
export default reducer.reducer;
