import React from 'react';
import SearchBarContact from './SearchBarContact';

const Ts_UsersSearchBar = () => {
  return (
    <div className="px-3 pb-3 mb-2">
      <SearchBarContact isSearchBar={true}>
        <div className="mb-4"></div>
      </SearchBarContact>
    </div>
  );
};

export default Ts_UsersSearchBar;
