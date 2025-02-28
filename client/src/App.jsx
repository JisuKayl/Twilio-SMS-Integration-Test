import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    to: "",
    message: "",
  });
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/sms-status");
      if (response.data.success) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/send-sms",
        formData
      );
      if (response.data.success) {
        setStatus("Message sent successfully!");
        setFormData({ to: "", message: "" });
        fetchMessages();
      }
    } catch (error) {
      setStatus(`Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Twilio SMS Service</h1>
      </header>
      <div className="content-wrapper">
        <div className="form-container">
          <form onSubmit={handleSubmit} className="sms-form">
            <div className="form-group">
              <label htmlFor="to">Phone Number (with country code)</label>
              <input
                type="text"
                id="to"
                name="to"
                value={formData.to}
                onChange={handleChange}
                placeholder="+1234567890"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Enter your message here"
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send SMS"}
            </button>
            {status && <div className="status-message">{status}</div>}
          </form>
        </div>

        <div className="history-container">
          <h2>Recent Messages</h2>
          <div className="message-list">
            {messages.length > 0 ? (
              <ul>
                {messages.map((msg) => (
                  <li key={msg.sid}>
                    <strong>To: {msg.to}</strong>
                    <p>{msg.body}</p>
                    <span>Status: {msg.status}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No messages found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
