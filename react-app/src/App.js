import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState('');

  useEffect(() => {
    (async function () {
      const response = await fetch(`/api/message`);
      const text = await response.text();
      setData(text);
    })();
  }, []);

  return <div>{data}</div>;
}

export default App;
