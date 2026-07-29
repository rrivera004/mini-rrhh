import Header from './layout/Header';
import EmployeesPage from './pages/EmployeesPage';

function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Header />
      <EmployeesPage />
    </div>
  );
}

export default App;