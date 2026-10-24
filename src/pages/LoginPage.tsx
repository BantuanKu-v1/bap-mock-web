import { useState } from "react";
import { login } from "../services/authService";

type LoginPageProps = {
  onLoginSuccess: () => Promise<void>;
};

export default function LoginPage({
    onLoginSuccess
}: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
      event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isLoggingIn) return;

    setIsLoggingIn(true);
    setError("");

    try {
      await login(username, password);
      await onLoginSuccess();
    } catch (error) {
      setError(
          error instanceof Error
              ? error.message
              : "Failed to log in"
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-card__brand">
            <div className="login-card__icon">
              JKM
            </div>

            <h1>JKM Mock System</h1>
            <p>Administration Portal</p>
          </div>

          <form
              className="login-card__form"
              onSubmit={handleSubmit}
          >
            <div className="login-card__field">
              <label htmlFor="username">
                Username
              </label>

              <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  autoComplete="username"
                  required
                  disabled={isLoggingIn}
              />
            </div>

            <div className="login-card__field">
              <label htmlFor="password">
                Password
              </label>

              <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                  disabled={isLoggingIn}
              />
            </div>

            {error && (
                <div className="login-card__error" role="alert">
                  {error}
                </div>
            )}

            <button
                type="submit"
                className="login-card__submit"
                disabled={isLoggingIn}
            >
              {isLoggingIn ? "Logging In..." : "Login"}
            </button>
          </form>

          <div className="login-card__footer">
            For Academic Demonstration Only
          </div>
        </div>
      </div>
  );
}
