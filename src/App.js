import React from 'react';

import DLayout from "./pages/dlayout/dlayout.component";
import DSessionTimeout from './components/dsession-timeout/dsession-timeout';

import './App.css';

// import Background1 from '../src/background1.PNG';


function App() {
  return (
    <div className="App" 
    // style={{
    //   background: `url(${Background1})`,
    //   backgroundRepeat: `round`,
      
  
    // }}
    >
     
      <DSessionTimeout />
      <DLayout />
    </div>
  );
}

export default App;

