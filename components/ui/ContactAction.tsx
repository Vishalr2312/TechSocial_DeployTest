interface ActionItem {
  label: string;
  icon: string;
  onClick: () => void;
}

const ContactAction = ({
  actionList,
  isSearchBar,
}: {
  actionList: ActionItem[];
  isSearchBar?: boolean;
}) => {
  return (
    <div className="btn-group cus-dropdown dropend">
      <button
        type="button"
        className="d-flex dropdown-btn px-2"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <i className="material-symbols-outlined fs-xxl m-0">more_horiz</i>
      </button>
      <ul
        className={`dropdown-menu p-4 pt-2 ${isSearchBar && 'searchBarPostOptions'}`}
      >
        {/* {actionList?.map(([itm, icon], i) => (
          <li key={i}>
            <button className="droplist d-flex align-items-center gap-2">
              <i className="material-symbols-outlined mat-icon">{icon}</i>
              <span>{itm}</span>
            </button>
          </li>
        ))} */}
        {actionList.map((item, i) => (
          <li key={i}>
            <button
              className="droplist d-flex align-items-center gap-2"
              onClick={item.onClick}
            >
              <i className="material-symbols-outlined mat-icon">{item.icon}</i>
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactAction;
