import { useEffect, useMemo, useState } from "react";
import { burgersApi } from "./api";

function App() {
  const [burgers, setBurgers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [burgerName, setBurgerName] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [busyIds, setBusyIds] = useState({});

  const readyToEat = useMemo(
    () => burgers.filter((burger) => !burger.devoured),
    [burgers]
  );

  const devoured = useMemo(
    () => burgers.filter((burger) => burger.devoured),
    [burgers]
  );

  useEffect(() => {
    let cancelled = false;

    async function loadBurgers() {
      try {
        const response = await burgersApi.list();
        if (!cancelled) {
          setBurgers(response);
        }
      } catch (apiError) {
        if (!cancelled) {
          setError(apiError.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadBurgers();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleCreateBurger(event) {
    event.preventDefault();
    setError("");

    const trimmed = burgerName.trim();
    if (!trimmed) {
      setFormError("Burger name is required.");
      return;
    }

    setFormError("");
    setSubmitting(true);

    try {
      const created = await burgersApi.create(trimmed);
      setBurgers((current) => [...current, created]);
      setBurgerName("");
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDevour(id) {
    setError("");
    setBusyIds((current) => ({ ...current, [id]: true }));

    try {
      const updated = await burgersApi.devour(id, true);
      setBurgers((current) =>
        current.map((burger) => (burger.id === id ? updated : burger))
      );
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setBusyIds((current) => ({ ...current, [id]: false }));
    }
  }

  async function handleDelete(id) {
    setError("");
    setBusyIds((current) => ({ ...current, [id]: true }));

    try {
      await burgersApi.remove(id);
      setBurgers((current) => current.filter((burger) => burger.id !== id));
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setBusyIds((current) => ({ ...current, [id]: false }));
    }
  }

  async function handleReset() {
    setError("");
    setResetting(true);

    try {
      const payload = await burgersApi.reset();
      setBurgers(payload.burgers);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setResetting(false);
    }
  }

  return (
    <div className="app-shell">
      <div className="background-grid" aria-hidden="true" />
      <header className="hero">
        <p className="hero-kicker">Diner Queue</p>
        <h1>Eat-Da-Burger</h1>
        <p className="hero-subtitle">
          Track every burger order from craving to devoured bliss.
        </p>
        <button
          type="button"
          className="secondary-btn"
          onClick={handleReset}
          disabled={resetting}
        >
          {resetting ? "Resetting..." : "Reset to Seed"}
        </button>
      </header>

      <main className="content-layout">
        <section className="panel form-panel" aria-labelledby="new-burger-heading">
          <h2 id="new-burger-heading">Add a Burger</h2>
          <form onSubmit={handleCreateBurger} className="create-form">
            <label htmlFor="burger-name-input">Burger name</label>
            <input
              id="burger-name-input"
              name="burger_name"
              value={burgerName}
              onChange={(event) => setBurgerName(event.target.value)}
              placeholder="Example: Jalapeno Crunch"
              maxLength={120}
            />
            {formError ? (
              <p className="inline-error" role="alert">
                {formError}
              </p>
            ) : null}
            <button type="submit" className="primary-btn" disabled={submitting}>
              {submitting ? "Adding..." : "Add Burger"}
            </button>
          </form>
          {error ? (
            <p className="api-error" role="alert">
              {error}
            </p>
          ) : null}
        </section>

        <section className="panel lists-panel" aria-live="polite">
          {loading ? <p className="loading-copy">Loading burgers...</p> : null}
          <div className="list-columns">
            <article className="burger-column" aria-label="Ready to Eat">
              <h2>Ready to Eat</h2>
              <ul>
                {readyToEat.map((burger) => (
                  <li key={burger.id} data-testid={`burger-${burger.id}`}>
                    <div>
                      <p className="burger-name">{burger.burger_name}</p>
                      <span className="burger-meta">Order #{burger.id}</span>
                    </div>
                    <div className="burger-actions">
                      <button
                        type="button"
                        onClick={() => handleDevour(burger.id)}
                        disabled={Boolean(busyIds[burger.id])}
                      >
                        {busyIds[burger.id] ? "Working..." : "Devour"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(burger.id)}
                        disabled={Boolean(busyIds[burger.id])}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
                {!readyToEat.length && !loading ? (
                  <li className="empty-state">No burgers waiting right now.</li>
                ) : null}
              </ul>
            </article>

            <article className="burger-column" aria-label="Devoured">
              <h2>Devoured</h2>
              <ul>
                {devoured.map((burger) => (
                  <li key={burger.id} data-testid={`burger-${burger.id}`}>
                    <div>
                      <p className="burger-name">{burger.burger_name}</p>
                      <span className="burger-meta">Order #{burger.id}</span>
                    </div>
                    <div className="burger-actions">
                      <button
                        type="button"
                        onClick={() => handleDelete(burger.id)}
                        disabled={Boolean(busyIds[burger.id])}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
                {!devoured.length && !loading ? (
                  <li className="empty-state">Nothing devoured yet.</li>
                ) : null}
              </ul>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
