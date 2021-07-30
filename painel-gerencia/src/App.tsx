import { BrowserRouter, Route, Switch} from 'react-router-dom';
import { Home } from './pages/Home'
import { AuthContextProvider } from './contexts/AuthContext';
import { Admin } from './pages/Admin';



function App() {

  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/admin" component={Admin} />
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
    
    );
}

export default App;

