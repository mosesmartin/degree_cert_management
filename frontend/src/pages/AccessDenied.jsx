import { react } from 'react';

function AccessDenied() {
  return (
    <>
    <div style={{ backgroundColor: 'black',  height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div>
        <h1 style={{ color: 'red' }}><code>Access Denied</code></h1>
        <hr style={{ borderColor: 'white', margin: 'auto', width: '50%' }} />
        <h3 style={{ color: 'white' }}>You don't have permission to view this site.</h3>
        {/* <h3 style={{ color: 'white', animation: 'zoom 1s' }}>🚫🚫🚫🚫</h3> */}
        {/* <h6 style={{ color: 'red', textDecoration: 'underline' }}>Error code: 403 Forbidden</h6> */}
      </div>
    </div>
  </>
  );
}

export default AccessDenied;
