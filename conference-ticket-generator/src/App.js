import React, { useState, useEffect } from 'react';
import './App.css';

function ConferenceTicketGenerator() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    avatarUrl: '',
  });
  const [errors, setErrors] = useState({});
  const [ticket, setTicket] = useState(null);

  // Load form data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('ticketFormData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ticketFormData', JSON.stringify(formData));
  }, [formData]);

  // Validate form fields
  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.avatarUrl.trim()) {
      newErrors.avatarUrl = 'Avatar URL is required';
    } else if (!isValidImageUrl(formData.avatarUrl)) {
      newErrors.avatarUrl = 'Please enter a valid image URL (jpg, jpeg, png, or gif)';
    }
    return newErrors;
  };

  // Utility function to validate a URL and check for common image extensions
  const isValidImageUrl = (url) => {
    try {
      new URL(url);
      return /\.(jpeg|jpg|gif|png)$/i.test(url);
    } catch (err) {
      return false;
    }
  };

  // Update form state on field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTicket(null);
    } else {
      setErrors({});
      setTicket(formData);
      // (Optionally) You could also clear the form after generating a ticket:
      // setFormData({ fullName: '', email: '', avatarUrl: '' });
    }
  };

  return (
    <div className="container">
      <h1>Conference Ticket Generator</h1>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="fullName">
            Full Name <span aria-hidden="true">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            aria-invalid={errors.fullName ? "true" : "false"}
            aria-describedby="fullNameError"
            required
          />
          {errors.fullName && (
            <div className="error" id="fullNameError">
              {errors.fullName}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">
            Email Address <span aria-hidden="true">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby="emailError"
            required
          />
          {errors.email && (
            <div className="error" id="emailError">
              {errors.email}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="avatarUrl">
            Avatar URL <span aria-hidden="true">*</span>
          </label>
          <input
            type="url"
            id="avatarUrl"
            name="avatarUrl"
            value={formData.avatarUrl}
            onChange={handleChange}
            aria-invalid={errors.avatarUrl ? "true" : "false"}
            aria-describedby="avatarUrlError"
            required
          />
          {errors.avatarUrl && (
            <div className="error" id="avatarUrlError">
              {errors.avatarUrl}
            </div>
          )}
        </div>

        <button type="submit" className="submit-button">
          Generate Ticket
        </button>
      </form>

      {/* Display the generated ticket only if the form passes validation */}
      {ticket && (
        <div className="ticket">
          <h2>Your Conference Ticket</h2>
          <div className="ticket-content">
            <img
              src={ticket.avatarUrl}
              alt={`Avatar for ${ticket.fullName}`}
            />
            <div className="ticket-info">
              <p>
                <strong>Name:</strong> {ticket.fullName}
              </p>
              <p>
                <strong>Email:</strong> {ticket.email}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConferenceTicketGenerator;
