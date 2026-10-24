type HeaderProps = {
  adminUsername: string;
  onLogout: () => void;
  isLoggingOut: boolean;
};

export default function Header({
    adminUsername,
    onLogout,
    isLoggingOut
}: HeaderProps) {
  return (
      <header className="header">
        <div className="header__brand">
          <div className="header__brand-icon">
            JKM
          </div>

          <div className="header__brand-info">
            <h1>JKM Mock System</h1>
            <span>Administration Portal</span>
          </div>
        </div>

        <div className="header__admin">
          <div className="header__avatar">
            {adminUsername.charAt(0).toUpperCase()}
          </div>

          <div className="header__admin-info">
            <span className="header__admin-name">
              {adminUsername}
            </span>

            <span className="header__admin-role">
              System Admin
            </span>
          </div>

          <button
              type="button"
              className="header__logout"
              onClick={onLogout}
              disabled={isLoggingOut}
          >
            {isLoggingOut ? "Logging Out..." : "Logout"}
          </button>
        </div>
      </header>
  );
}
