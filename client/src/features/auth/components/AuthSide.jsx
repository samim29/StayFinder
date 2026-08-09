import React from 'react'
import '../auth.scss'
const AuthSide = () => {
  return (
    <div className="auth-side">
      <div className="auth-brand">
        <div className="auth-mark">SF</div>
        <span className="display">StayFinder</span>
      </div>

      <div className="auth-quote-block">
        <h1 className="auth-quote">
          "Booked my PG two weeks before I even landed. Owner had my bed ready on day one."
        </h1>
        <p className="auth-quote-by">- PRIYA S., FIRST-YEAR, PUNE</p>
      </div>

      <div className="auth-footer mono">SF · TERMINAL 01 · WELCOME ABOARD</div>
    </div>
  )
}

export default AuthSide