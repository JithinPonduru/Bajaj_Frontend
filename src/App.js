import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function handleSubmit(urlpost, setResponseAns, setError, inputVal, setLoading) {
  setLoading(true); 

  try {
    JSON.parse(inputVal); // Validate JSON format
  } catch (e) {
    setError("Invalid JSON format.");
    setResponseAns("");
    setLoading(false);
    return;
  }

  if (!inputVal.trim()) {
    setError("Input cannot be empty.");
    setResponseAns(""); 
    setLoading(false); 
    return;
  }

  fetch(urlpost, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: JSON.parse(inputVal) }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      return response.json();
    })
    .then(data => {
      setResponseAns(JSON.stringify(data, null, 2));
      setError(""); 
    })
    .catch(error => {
      setError('Failed to fetch data. ' + error.message);
      setResponseAns("");
      console.error('Error:', error);
    })
    .finally(() => {
      setLoading(false);
    });
}

function App() {
  const urlpost = "https://backend-1-c6as.onrender.com/bfhl"; // Adjusted URL
  const [inputVal, setInputVal] = useState("");
  const [responseAns, setResponseAns] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const ansRef = useRef(null);

  useEffect(() => {
    if (ansRef.current) {
      ansRef.current.style.height = 'auto';
      ansRef.current.style.height = `${ansRef.current.scrollHeight}px`;
    }
  }, [responseAns]);

  const handleChange = (e) => {
    setInputVal(e.target.value);
  };

  const handleClick = () => {
    handleSubmit(urlpost, setResponseAns, setError, inputVal, setLoading);
  };

  return (
    <div className="container">
      <textarea
        value={inputVal}
        onChange={handleChange}
        className="input-field"
        placeholder="Enter the JSON object"
        rows={6}
      />
      <button onClick={handleClick} className="submit-button" disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </button>

      <textarea
        ref={ansRef}
        value={responseAns}
        readOnly
        className="input-field ans"
        placeholder="Response will appear here"
        rows={6}
      />
      
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default App;
