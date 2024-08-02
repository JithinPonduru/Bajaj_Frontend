import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function handleSubmit(urlpost, setresponseAns, setError, inputVal, setLoading) {
  setLoading(true); // Set loading to true
  try {
    JSON.parse(inputVal); // Validate JSON input
  } catch (e) {
    setError("Invalid JSON format.");
    setresponseAns(""); // Clear previous response
    setLoading(false); // Set loading to false
    return;
  }

  if (!inputVal.trim()) {
    setError("Input cannot be empty.");
    setresponseAns(""); // Clear previous response
    setLoading(false); // Set loading to false
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
      setresponseAns(JSON.stringify(data, null, 2)); // Format JSON response
      setError(""); // Clear any previous errors
    })
    .catch(error => {
      setError('Failed to fetch data. ' + error.message);
      setresponseAns(""); // Clear previous response
      console.error('Error:', error);
    })
    .finally(() => {
      setLoading(false); // Set loading to false
    });
}

function App() {
  const urlpost = "http://localhost:3000/bfhl/post";
  const [inputVal, setInputVal] = useState("");
  const [responseAns, setresponseAns] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // New state for loading
  const ansRef = useRef(null);

  useEffect(() => {
    if (ansRef.current) {
      ansRef.current.style.height = 'auto'; // Reset height
      ansRef.current.style.height = `${ansRef.current.scrollHeight}px`; // Adjust height based on content
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
