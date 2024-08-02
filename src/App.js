import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function handleSubmit(urlpost, setresponseAns, setError, inputVal, setLoading) {
  setLoading(true); 
  try {
    JSON.parse(inputVal); 
  } catch (e) {
    setError("Invalid JSON format.");
    setresponseAns("");
    setLoading(false);
    return;
  }

  if (!inputVal.trim()) {
    setError("Input cannot be empty.");
    setresponseAns(""); 
    setLoading(false); 
    return;
  }

  return fetch(urlpost, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: inputVal }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      return response.json();
    })
    .then(data => {
      setresponseAns(JSON.stringify(data, null, 2));
      setError("");
    })
    .catch(error => {
      setError('Failed to fetch data. ' + error.message);
      setresponseAns("");
      console.error('Error:', error);
    })
    .finally(() => {
      setLoading(false); 
    });
}

function App() {
  const urlpost = "https://bajaj-backend-ap0p.onrender.com/bfhl/post";
  const [inputVal, setInputVal] = useState("");
  const [responseAns, setresponseAns] = useState("");
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
    handleSubmit(urlpost, setresponseAns, setError, inputVal, setLoading);
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
