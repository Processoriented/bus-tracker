import React from 'react';

// import Trip from './components/Trip';
// import Route from './components/Route';
import { RouteMap } from './components/RouteMap';
import './App.scss';

function App() {

  return (
    <div className="App">
      <RouteMap style={{ height: '100%', width: '100%' }} />
    </div>
  );
}

export default App;
