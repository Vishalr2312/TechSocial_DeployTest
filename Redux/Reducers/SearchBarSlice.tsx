import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchBarState {
  activeSearchBar: boolean;
  searchByPost: boolean;
  searchByUser: boolean;
  searchByAi: boolean;
  searchInput: string;
  results: any;
  loading: boolean;
  post_id: number | null;
}

const initialState: SearchBarState = {
  activeSearchBar: false,
  searchByPost: false,
  searchByUser: false,
  searchByAi: false,
  searchInput: '',
  results: [],
  loading: false,
  post_id: null,
};

const searchBarSlice = createSlice({
  name: 'searchBar',
  initialState,
  reducers: {
    setActiveSearchBar: (state, action: PayloadAction<boolean>) => {
      state.activeSearchBar = action.payload;
    },
    setSearchByPost: (state, action: PayloadAction<boolean>) => {
      state.searchByPost = action.payload;
    },
    setSearchByUser: (state, action: PayloadAction<boolean>) => {
      state.searchByUser = action.payload;
    },
    setSearchByAi: (state, action: PayloadAction<boolean>) => {
      state.searchByAi = action.payload;
    },
    setSearchInput: (state, action: PayloadAction<string>) => {
      state.searchInput = action.payload;
    },
    setSearchResults: (state, action) => {
      state.results = action.payload;
    },
    setSearchLoading: (state, action) => {
      state.loading = action.payload;
    },
    closeSearchBar: (state) => {
      state.activeSearchBar = false;
      state.searchByUser = false;
      state.searchByPost = false;
      state.searchInput = '';
      state.results = [];
    },
    setFeedPostId: (state, action) => {
      state.post_id = action.payload;
    },
  },
});

export const {
  setActiveSearchBar,
  setSearchByPost,
  setSearchByUser,
  setSearchInput,
  setSearchResults,
  setSearchLoading,
  closeSearchBar,
  setSearchByAi,
  setFeedPostId,
} = searchBarSlice.actions;
export default searchBarSlice.reducer;
