import {createRoot} from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'
import './utils/Dictionary.js';
import './setupAxios.js'

createRoot(document.getElementById('root')).render(
            <App/>
)
