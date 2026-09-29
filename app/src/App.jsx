import { useState } from 'react';

function App() {
  const [formData, setFormData] = useState({ fio: '', phone: '', email: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Отправка...');
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setStatus('Данные успешно сохранены в JSON и отправлены в БД!');
        setFormData({ fio: '', phone: '', email: '' });
      } else {
        setStatus('Ошибка при сохранении.');
      }
    } catch (error) {
      setStatus('Ошибка сети.');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>Ввод данных пользователя</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px' }}>
        <input 
          placeholder="ФИО" 
          value={formData.fio} 
          onChange={e => setFormData({...formData, fio: e.target.value})} 
          required 
        />
        <input 
          placeholder="Телефон" 
          value={formData.phone} 
          onChange={e => setFormData({...formData, phone: e.target.value})} 
          required 
        />
        <input 
          placeholder="Email" 
          type="email"
          value={formData.email} 
          onChange={e => setFormData({...formData, email: e.target.value})} 
          required 
        />
        <button type="submit">Отправить</button>
      </form>
      {status && <p style={{ marginTop: '1rem', color: status.includes('Ошибка') ? 'red' : 'green' }}>{status}</p>}
    </div>
  );
}

export default App;