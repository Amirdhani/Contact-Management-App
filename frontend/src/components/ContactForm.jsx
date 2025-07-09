import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ContactForm = () => {
  const [contact, setContact] = useState({
    firstName: '',
    lastName: '',
    address: '',
    email: '',
    phone: '',
  });

  const [contacts, setContacts] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editedContact, setEditedContact] = useState({});

  // Load contacts on mount
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/contacts');
        setContacts(res.data);
      } catch (err) {
        toast.error('Failed to load contacts', { duration: 2000 });
      }
    };
    fetchContacts();
  }, []);

  // Input change
  const handleChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!/^\d{10}$/.test(contact.phone)) {
      toast.error('Phone number must be exactly 10 digits', { duration: 2000 });
      return;
    }

    if (!contact.email.endsWith('@gmail.com')) {
      toast.error('Email must end with @gmail.com', { duration: 2000 });
      return;
    }

    const duplicate = contacts.some(
      (c) => c.email === contact.email || c.phone === contact.phone
    );
    if (duplicate) {
      toast.error('Email or phone already exists', { duration: 2000 });
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/contacts', contact);
      setContacts((prev) => [...prev, res.data]);
      setContact({ firstName: '', lastName: '', address: '', email: '', phone: '' });
      toast.success('Contact added successfully!', { duration: 1500 });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to add contact', { duration: 2000 });
    }
  };

  // Delete contact
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/contacts/${id}`);
      setContacts((prev) => prev.filter((c) => c._id !== id));
      toast.success('Contact deleted!', { duration: 1500 });
    } catch {
      toast.error('Failed to delete', { duration: 2000 });
    }
  };

  // Edit
  const handleEditClick = (contact, index) => {
    setEditIndex(index);
    setEditedContact({ ...contact });
  };

  const handleEditChange = (e) => {
    setEditedContact({ ...editedContact, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (id) => {
    if (!/^\d{10}$/.test(editedContact.phone)) {
      toast.error('Phone number must be exactly 10 digits', { duration: 2000 });
      return;
    }

    if (!editedContact.email.endsWith('@gmail.com')) {
      toast.error('Email must end with @gmail.com', { duration: 2000 });
      return;
    }

    try {
      const res = await axios.put(`http://localhost:5000/api/contacts/${id}`, editedContact);
      const updatedContacts = [...contacts];
      updatedContacts[editIndex] = res.data;
      setContacts(updatedContacts);
      setEditIndex(null);
      toast.success('Contact updated!', { duration: 1500 });
    } catch (err) {
      toast.error('Update failed', { duration: 2000 });
    }
  };

  return (
    <div className="min-h-screen bg-blue-950 text-white px-4 py-10 flex flex-col items-center">
      <h2 className="text-4xl font-bold mb-10 text-center">📇 Contact Management App</h2>

      {/* Form */}
      <div className="w-full max-w-xl bg-white text-black p-8 rounded-2xl shadow-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {['firstName', 'lastName', 'address', 'email', 'phone'].map((field) => (
            <input
              key={field}
              name={field}
              placeholder={field}
              value={contact[field]}
              onChange={handleChange}
              required
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
          <button
            type="submit"
            className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition font-semibold"
          >
            ➕ Add Contact
          </button>
        </form>
      </div>

      {/* Saved Contacts Table */}
      {contacts.length > 0 && (
        <div className="mt-10 w-full max-w-6xl bg-white text-black p-6 rounded-xl shadow-xl">
          <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">📜 Saved Contacts</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm sm:text-base">
              <thead>
                <tr className="bg-gray-100 text-center">
                  <th className="border px-4 py-2">First Name</th>
                  <th className="border px-4 py-2">Last Name</th>
                  <th className="border px-4 py-2">Address</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Phone</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((c, index) => (
                  <tr key={c._id} className="text-center hover:bg-gray-50">
                    {editIndex === index ? (
                      <>
                        {['firstName', 'lastName', 'address', 'email', 'phone'].map((field) => (
                          <td key={field} className="border px-2 py-1">
                            <input
                              name={field}
                              value={editedContact[field]}
                              onChange={handleEditChange}
                              className="p-1 border border-gray-300 rounded w-full"
                            />
                          </td>
                        ))}
                        <td className="border px-2 py-1">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleUpdate(c._id)}
                              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditIndex(null)}
                              className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="border px-4 py-2">{c.firstName}</td>
                        <td className="border px-4 py-2">{c.lastName}</td>
                        <td className="border px-4 py-2">{c.address}</td>
                        <td className="border px-4 py-2">{c.email}</td>
                        <td className="border px-4 py-2">{c.phone}</td>
                        <td className="border px-4 py-2">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleEditClick(c, index)}
                              className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(c._id)}
                              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactForm;