import React, {useState}from 'react'
import AuthSide from '../components/AuthSide'
import '../auth.scss'
const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Registering with:', { name, email, phone, password, role });
  }

  return (
    <main className='auth-page'>
      <AuthSide />
      <section className='auth-panel'>
        <div className='auth-card'>
          <h2>Create your account</h2>
          <p>Tell us who you are so we can get you to the right dashboard.</p>
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
              <label htmlFor="name">FULL NAME</label>
              <input type="text" name="name" id="name" placeholder='Rohan Mehta' value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="email">EMAIL</label>
              <input type="email" name="email" id="email" placeholder='rohan@email.com' value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="phone">PHONE</label>
              <input type="text" name="phone" id="phone" placeholder='+91 9xxxxxxxxx' value={phone} onChange={(e) => setPhone(e.target.value)}   />
            </div>
            <div className="field">
              <label htmlFor="password">PASSWORD</label>
              <input type="password" name="password" id="password" placeholder='••••••••' value={password} onChange={(e) => setPassword(e.target.value)} />
              <div className="field-error">Password must be at least 8 characters.</div>
            </div>
            <button type='submit' className='submit-btn'>Create account</button>
          </form>
          <p className="switch-line">
            Already have an account? <a href="/login">Log in</a>
          </p>
        </div>
      </section>
    </main>
  )
}

export default Register