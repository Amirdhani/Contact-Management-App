import { Toaster } from 'react-hot-toast';
import ContactForm from './components/ContactForm';

const App = () => (
  <div className="container">

    <Toaster position="top-right" />

    <ContactForm />
  </div>
);

export default App;
