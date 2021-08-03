import React from 'react';
import { BrowserRouter, Redirect, Route, Switch, RouteProps, RouteComponentProps} from 'react-router-dom';
import { Home } from './pages/Home'
import { AuthContextProvider } from './contexts/AuthContext';
import { Admin } from './pages/Admin';
import { useAuth } from './hooks/useAuth';


function App() {

  const PrivateRoute: React.FC<RouteProps> = ({ component: Component, ...props }) => {

    const { user } = useAuth();
    if (!Component) return null;
    return (

        <Route
            {...props}
            render={ () => user
                ? <Component {...props as RouteComponentProps} />
                : <Redirect to='/' /> 
            }
        />
    )
}

  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Switch>
          <Route path="/" exact component={Home} />
          <PrivateRoute path="/admin" component={Admin} />
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
    
    );
}

export default App;

