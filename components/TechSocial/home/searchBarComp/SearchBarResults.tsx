'use client';

import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/Redux/hooks';
import {
  setActiveSearchBar,
  setSearchByPost,
  setSearchByUser,
} from '@/Redux/Reducers/SearchBarSlice';
import Ts_PostFeedsSearchBar from '../PostFeeds/Ts_PostFeedsSearchBar';
import Preloader from '@/components/preloader/Preloader';
import SearchLoader from '../../Loader/SearchLoader';
import Ts_UsersSearchBar from './Ts_UsersSearchBar';

const SearchBarResults = () => {
  const dispatch = useAppDispatch();

  const { results, loading, searchByPost, searchByUser, activeSearchBar } =
    useAppSelector((state) => state.searchBar);

  if (!activeSearchBar) return null;

  return (
    <div className="search-results-dropdown">
      <div className="search-bar-options btn-item d-center gap-3">
        <button
          className={`cmn-btn justify-content-center search-toggle-btn ${searchByPost ? 'fourth' : 'fifth'}`}
          onClick={() => {
            dispatch(setSearchByPost(true));
            dispatch(setSearchByUser(false));
          }}
        >
          Post
          {searchByPost && (
            <span className={`check-icon ${searchByPost ? 'show' : ''}`}>
              ✔
            </span>
          )}
        </button>
        <button
          className={`cmn-btn justify-content-center search-toggle-btn ${searchByUser ? 'fourth' : 'fifth'}`}
          onClick={() => {
            dispatch(setSearchByPost(false));
            dispatch(setSearchByUser(true));
          }}
        >
          User
          {searchByUser && (
            <span className={`check-icon ${searchByUser ? 'show' : ''}`}>
              ✔
            </span>
          )}
        </button>

        {/* <div
          className="close-btn searchBar-close-btn"
          onClick={() => dispatch(setActiveSearchBar(false))}
        >
          <i className="material-symbols-outlined mat-icon">close</i>
        </div> */}
      </div>

      <div className="divider" />

      {loading && <SearchLoader />}

      {!loading && results?.length === 0 && (
        <p className="p-3 d-flex justify-content-center">No results found</p>
      )}

      {activeSearchBar && searchByPost && (
        <Ts_PostFeedsSearchBar clss="p-3 p-sm-5" />
      )}
      {activeSearchBar && searchByUser && <Ts_UsersSearchBar />}
    </div>
  );
};

export default SearchBarResults;
