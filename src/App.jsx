import { useState } from 'react'
import { UsMap } from './UsMap';

function App() {

  return (
    <>
      <div style={{ height: '60px', width: '100%', display: 'flex', position: 'relative'}}>
        <div style={{ padding: '10px', display: 'flex', width: '100%', flexDirection:'row'}}>
          <h1 style={{ margin: 0, padding: 0}}>US Census 2020</h1>
          <div style={{ display: 'flex', justifyContent: 'flex-end', flexGrow: 1, marginTop: '5px'}}>
            <a href="https://github.com/keller-mark/us-maps">Source</a>
          </div>
        </div>
      </div>
      <div style={{ height: 'calc(100vh - 60px)', width: '100%', display: 'flex', position: 'relative'}}>
        <UsMap />
      </div>
    </>
  )
}

export default App
