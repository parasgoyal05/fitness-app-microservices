import { useContext, useEffect, useState } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router";
import { setCredentials } from "./store/authSlice";
import ActivityForm from "./components/ActivityForm";
import ActivityList from "./components/ActivityList";
import ActivityDetail from "./components/ActivityDetail";

const ActivitiesPage = () => (
  <div className="page">
    <ActivityForm onActivityAdded={() => window.location.reload()} />
    <ActivityList />
  </div>
);

function App() {
  const { token, tokenData, logIn, logOut } = useContext(AuthContext);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(setCredentials({ token, user: tokenData }));
    }
  }, [token, tokenData, dispatch]);

  if (!token) {
    return (
      <div className="login-screen">
        <div className="login-card">
          <div className="login-icon">🏋️</div>
          <h1>FitTrack</h1> 
          <p>Log your workouts. Get AI-powered recommendations.</p>
          <button className="btn-primary btn-large" onClick={() => logIn()}>
            Login to Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-layout">
        <header className="navbar">
          <div className="navbar-brand">🏋️ FitTrack</div>
          <div className="navbar-right">
            {tokenData?.given_name && (
              <span className="navbar-user">Hi, {tokenData.given_name}</span>
            )}
            <button className="btn-outline" onClick={logOut}>
              Logout
            </button>
          </div>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/activities/:id" element={<ActivityDetail />} />
            <Route path="/" element={<Navigate to="/activities" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
