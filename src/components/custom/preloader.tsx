import React from 'react';

const Preloader = () => {
  return (
    <div id="preloaders" style={{ position: 'fixed', inset: '0px', zIndex: 9999, height: '100vh', width: '100vw', backdropFilter: 'blur(5px)', display: 'block' }}>
      <div className="svg-frame">
        <div className="logo-frame">
          <img alt="" src="https://picatekpol.my.id/interface/images/logo_n4.png" />
        </div>
        {/* SVG dan animasi lainnya */}
      </div>
    </div>
  );
};

export default Preloader;