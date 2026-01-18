import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import PrototypeView from './pages/PrototypeView';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="nav">
          <div className="container">
            <Link to="/" className="logo">
              User Test Project
            </Link>
            <div className="nav-links">
              <Link to="/">Home</Link>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/prototypes/:id" element={<PrototypeView />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
