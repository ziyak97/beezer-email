import React, { useState, useEffect } from 'react'
import './form.styles.css'
import Axios from 'axios'

const Form = () => {
  const [strength, setStrength] = useState('')
  const [validations, setValidations] = useState([false, false, false, false])
  const [showPassword, setShowPassword] = useState(false)
  const [passwordsMatch, setPasswordsMatch] = useState(false)

  const handleValidate = (e) => {
    const password = e.target.value

    setValidations([
      password.length > 6,
      password.search(/[A-Z]/) > -1,
      password.search(/[0-9]/) > -1,
      password.search(/[$&+,:;=?@#]/) > -1,
    ])
  }

  useEffect(() => {
    setStrength(validations.reduce((acc, cur) => acc + cur))
  }, [validations])

  const handlePasswordsMatch = (e) => {
    const password = window.document.querySelector('input[name="password"]')
      .value
    const confirmPassword = e.target.value
    console.log(password)
    console.log(confirmPassword)
    if (password === confirmPassword) {
      setPasswordsMatch(true)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const name = window.document.querySelector('input[name="name"]').value
    const email = window.document.querySelector('input[name="email"]').value
    const password = window.document.querySelector('input[name="password"]')
      .value
    const confirmPassword = window.document.querySelector(
      'input[name="confirm-password"]'
    ).value

    if (!name || !email || !password || !confirmPassword) {
      alert('Please fill in all the form fields!')
      return
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match!')
      return
    }

    if (strength !== 4) {
      alert('Password not strong enough!')
      return
    }

    try {
      await Axios.post('/email', { name, email })
      alert('Email sent sucessfully!')
    } catch (err) {
      console.error(err)
      alert('There was a problem sending the email!')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className='field'>
        <input type='name' name='name' className='input' placeholder=' ' />
        <label htmlFor='name' className='label'>
          Name
        </label>
      </div>
      <div className='field'>
        <input type='email' name='email' className='input' placeholder=' ' />
        <label htmlFor='email' className='label'>
          Email
        </label>
      </div>

      <div className='field'>
        <input
          type={showPassword ? 'text' : 'password'}
          name='password'
          className='input'
          placeholder=' '
          onInput={handleValidate}
        />
        <label htmlFor='password' className='label'>
          Password
        </label>
        <span
          className='toggle-password'
          onMouseEnter={() => setShowPassword(true)}
          onMouseLeave={() => setShowPassword(false)}
        >
          {showPassword ? '🙈' : '👁️'}
        </span>
      </div>

      <div className='strength'>
        <span className={`bar bar-1 ${strength > 0 ? 'bar-show' : ''}`}></span>
        <span className={`bar bar-2 ${strength > 1 ? 'bar-show' : ''}`}></span>
        <span className={`bar bar-3 ${strength > 2 ? 'bar-show' : ''}`}></span>
        <span className={`bar bar-4 ${strength > 3 ? 'bar-show' : ''}`}></span>
      </div>

      <ul>
        <li> {validations[0] ? '✅' : '❌'} must be atleast 7 characters</li>
        <li> {validations[1] ? '✅' : '❌'} must contains a capital letter</li>
        <li> {validations[2] ? '✅' : '❌'} must contain a number</li>
        <li> {validations[3] ? '✅' : '❌'} must contain one of $&+,:;=?@#</li>
      </ul>

      <div className='field'>
        <input
          type='password'
          name='confirm-password'
          className='input'
          placeholder=' '
          onInput={handlePasswordsMatch}
        />
        <label htmlFor='confirm-password' className='label'>
          Confirm Password
        </label>
        <span className='passwords-match'>{passwordsMatch ? '✅' : '❌'}</span>
      </div>

      <button type='submit'>Sign Up</button>
    </form>
  )
}

export default Form
