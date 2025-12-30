import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import InstagramLogin from './instagramLogin'
import AccountLogin from './accountLogin'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <InstagramLogin/>
    {/* <AccountLogin/> */}
  </StrictMode>,
)
