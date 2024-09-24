import axios from "axios";
import { useState } from "react";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/contact', {
        name,
        email,
        message,
      });
      alert('Message sent successfully');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      alert('Error sending message');
      console.error(error);
    }
  };




  return (
    <div className="min-h-screen p-4">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl mb-4">Contact Us</h2>
        <div className="mb-4">
          <label className="block mb-1">Name</label>
          <input
            type="text"
            placeholder="Name"
            className="w-full border rounded p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            type="email"
             placeholder="Email"
            className="w-full border rounded p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Message</label>
          <textarea
            className="w-full border rounded p-2"
             placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-28">Submit</button>
      </form>
    </div>
  );
}

export default Contact;
