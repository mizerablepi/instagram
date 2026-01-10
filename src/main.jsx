import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import InstagramLogin from './instagramLogin'
import AccountLogin from './accountLogin'
import SnapchatLogin from './snapchatLogin'
import SnapchatPassword from './snapchatPassword'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <InstagramLogin/> */}
    <AccountLogin/>
    {/* <SnapchatLogin/> */}
    {/* <SnapchatPassword/> */}
  </StrictMode>,
)
