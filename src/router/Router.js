import React from 'react'
import { HashRouter, Routes,Route } from 'react-router-dom'
import IuseIndex from '../iuseIndex/IuseIndex'
import NormalLoginForm from '../login/Login'

export default function Register() {
  return (
      <>
          <HashRouter>
              <Routes>
                  <Route path="/" element={<IuseIndex />} />
                  <Route path="login" element={<NormalLoginForm />} />
                  <Route path='register' element={<Register />} />
              </Routes>
        </HashRouter>
      </>
  )
}
