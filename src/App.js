import React, { Suspense }  from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { store, persistor } from "./redux/store";
import error from "./assets/404.png";
import { Button } from "react-bootstrap";
import logo from './logo.svg'
import './App.css'
import Nastha from "./components/nastha";

const notFound = () => {
  return (
    <div className="container">
      <div className="d-flex justify-content-center">
        <img src={error} alt="notFound" height={550} width={900} />
      </div>
      <div className="col text-center">
        <Link to="/">
          <Button variant="outline-primary">Back To Home</Button>
        </Link>
      </div>
    </div>
  );
}; 
 
function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Suspense fallback={
          <div className='container-fluid' > 
              <img style={{ height: '150px'}} src={logo} alt='Loading....' />
              <p>Loading...</p>
          </div>}>
          <Router>
            <Switch>  
              <Route exact path="/" component={Nastha} />
              <Route component={notFound} />
            </Switch>
          </Router>
        </Suspense>
      </PersistGate>
    </Provider>
  );
}

export default App;
