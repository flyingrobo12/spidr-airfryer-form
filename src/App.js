import React, { useState } from 'react';

export default function App() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    guess: '',
    code: '',
    phoneNumber: '',
  });

  const [touched, setTouched] = useState({});
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'code') {
      formattedValue = value.replace(/[^0-9]/g, '').slice(0, 16);
      formattedValue = formattedValue.replace(/(.{4})/g, '$1-').slice(0, 19);
      if (formattedValue.endsWith('-')) formattedValue = formattedValue.slice(0, -1);
    } else if (name === 'phoneNumber') {
      formattedValue = value.replace(/[^0-9]/g, '').slice(0, 10);
      if (formattedValue.length > 6) {
        formattedValue = formattedValue.replace(/(\d{3})(\d{3})(\d{1,4})/, '$1-$2-$3');
      } else if (formattedValue.length > 3) {
        formattedValue = formattedValue.replace(/(\d{3})(\d{1,3})/, '$1-$2');
      }
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const isValid = {
    firstName: formData.firstName.trim().length >= 2,
    lastName: formData.lastName.trim().length >= 2,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
    guess: !isNaN(formData.guess) && formData.guess.trim() !== '',
    code: /^\d{4}-\d{4}-\d{4}-\d{4}$/.test(formData.code),
    phoneNumber: /^\d{3}-\d{3}-\d{4}$/.test(formData.phoneNumber),
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const invalid = Object.keys(isValid).filter((field) => !isValid[field]);
    if (invalid.length > 0) {
      const touchedFields = {};
      invalid.forEach((field) => (touchedFields[field] = true));
      setTouched((prev) => ({ ...prev, ...touchedFields }));
      setShowErrorModal(true);
      return;
    }

    console.log('Submitted Form Data:', formData);
    alert('Form submitted successfully!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <form className="bg-[#111] p-6 rounded-md max-w-md w-full space-y-4" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold text-center text-[#319dad]">Spidr Air Fryer Interest Form</h1>

        {['firstName', 'lastName', 'email', 'guess', 'code', 'phoneNumber'].map((field, index) => (
          <div key={index}>
            <label className="block text-sm font-medium">
              {field === 'guess' ? "Guess the Air Fryer’s Cost ($)" :
               field === 'code' ? '16-Digit Code' :
               field === 'phoneNumber' ? 'Phone Number' :
               field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
            </label>
            <input
              type={field === 'guess' ? 'number' : 'text'}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className={`w-full p-3 rounded-md bg-[#0E0E0E] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#319dad] mt-1 border 
                ${touched[field] && isValid[field] ? 'border-green-500' : ''}
                ${touched[field] && !isValid[field] ? 'border-red-500' : 'border-gray-700'}`}
              placeholder={
                field === 'code' ? '####-####-####-####' :
                field === 'phoneNumber' ? '###-###-####' : ''
              }
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-[#319dad] text-white font-bold py-2 px-4 rounded hover:bg-[#2b8691] transition"
        >
          Submit
        </button>
      </form>

      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#319dad] p-6 rounded-lg text-center max-w-sm w-full">
            <p className="text-white font-semibold mb-4 text-lg">Please fix the highlighted fields.</p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="bg-white text-[#319dad] font-bold py-2 px-6 rounded hover:bg-gray-100"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
