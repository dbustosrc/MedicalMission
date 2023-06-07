import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const EthnicGroupCreateForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: ''
  });

  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Resetear el formulario
    setFormData({
      name: ''
    });
  };

  return (
    <div>
      <h2>Ingresar información de grupo étnico</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Nombre:</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        <button type="submit">Guardar</button>
      </form>
    </div>
  );
};

export default EthnicGroupCreateForm;
