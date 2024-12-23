import React from 'react'
import { useEffect } from 'react'
import './404.css' // Đảm bảo đúng đường dẫn tới tệp CSS

const NotFound = () => {
  return <>
    <div className="permission_denied" >
      <div id="tsparticles"></div>
      <div className="denied__wrapper" >
        <h1>404</h1>
        <h3>
          LOST IN <span>SPACE</span>? Hmm, looks like that page doesn't exist.
        </h3>
        <img id="astronaut" src="/astronaut.svg" alt="Astronaut" />
        <img id="planet" src="/planet.svg" alt="Planet" />
        <a href="/">
          <button className="denied__link">Go Home</button>
        </a>
      </div>
    </div>
  </>
}

export default NotFound
