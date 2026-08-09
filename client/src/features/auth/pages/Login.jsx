import React, {useEffect, useState} from 'react'
import AuthSide from '../components/AuthSide'
import '../auth.scss'
const Login = () => {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')


  const handleSubmit = async (e) => {
    e.preventDefault()
    // Handle login logic here
    console.log('Logging in with:', { identifier, password, role })
  }

  return (
    <main className='auth-page'>
      <AuthSide />
      <section className='auth-panel'>
        <div className='auth-card'>
          <h2>Login to your account</h2>
          <p>Enter your email or phone number to access your dashboard.</p>
          <div className="role-toggle" role="tablist" aria-label="Account type">
            <button
              type="button"
              className={role === 'student' ? 'active' : ''}
              aria-pressed={role === 'student'}
              onClick={() =>{
                setRole('student')
              }}
            >
              I'm a Student
            </button>
            <button
              type="button"
              className={role === 'owner' ? 'active' : ''}
              aria-pressed={role === 'owner'}
              onClick={() => {
                setRole('owner');
              }}
            >
              I'm a PG Owner
            </button>
          </div>
          <p className="role-status">Selected role: {role === 'student' ? 'Student' : 'PG Owner'}</p>
          <form className='auth-form' onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="identifier">EMAIL OR PHONE NUMBER</label>
              <input type="text" name="identifier" id="identifier" placeholder='rohan@email.com or +91 9xxxxxxxxx' value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
            </div>

            <div className="field">
              <label htmlFor="password">PASSWORD</label>
              <input type="password" name="password" id="password" placeholder='••••••••' value={password} onChange={(e) => setPassword(e.target.value)} />
              <div className="field-error">Password must be at least 8 characters.</div>
            </div>
            <button type='submit' className='submit-btn'>Log in</button>
          </form>
          <p className="switch-line">
            Don't have an account? <a href="/register">Sign up</a>
          </p>
        </div>
      </section>
    </main>
  )
}

export default Login