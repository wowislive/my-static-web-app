import React, { useState, useEffect } from 'react';

function App() {
  const [textData, setTextData] = useState('');
  const [jsonMessage, setJsonMessage] = useState('');
  const [healthStatus, setHealthStatus] = useState('');
  const [dbValue, setDbValue] = useState('');

  useEffect(() => {
    // Fetch health check data on page load
    (async function () {
      try {
        const response = await fetch(`/api/healthCheck`);
        const data = await response.json();
        setHealthStatus(data.text);
      } catch (error) {
        console.error('Error fetching health check:', error);
        setHealthStatus('Error loading health status');
      }
    })();
  }, []);

  const fetchTextMessage = async () => {
    try {
      const response = await fetch(`/api/message`);
      const text = await response.text();
      setTextData(text);
    } catch (error) {
      console.error('Error fetching text message:', error);
      setTextData('Error loading text message');
    }
  };

  const fetchJsonMessage = async () => {
    try {
      const response = await fetch(`/api/messageJson`);
      const jsonData = await response.json();
      setJsonMessage(jsonData.message);
    } catch (error) {
      console.error('Error fetching JSON message:', error);
      setJsonMessage('Error loading JSON message');
    }
  };

  const fetchDbValue = async () => {
    try {
      const response = await fetch(`/api/fetchFromDb`);
      const data = await response.json();
      if (data.value) {
        setDbValue(data.value);
      } else {
        setDbValue(data.error || 'No value found');
      }
    } catch (error) {
      console.error('Error fetching DB value:', error);
      setDbValue('Error loading DB value');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3>Health Status (loaded on page load):</h3>
        <div>{healthStatus}</div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Text Message:</h3>
        <button onClick={fetchTextMessage} style={{ marginBottom: '10px' }}>
          Fetch Text Message
        </button>
        <div>{textData}</div>
      </div>

      <div>
        <h3>JSON Message:</h3>
        <button onClick={fetchJsonMessage} style={{ marginBottom: '10px' }}>
          Fetch JSON Message
        </button>
        <div>{jsonMessage}</div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Database Value:</h3>
        <button onClick={fetchDbValue} style={{ marginBottom: '10px' }}>
          Fetch DB Value
        </button>
        <div>{dbValue}</div>
      </div>
    </div>
  );
}

export default App;
