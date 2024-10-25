import { render } from 'preact';
import { Provider } from 'react-redux';  
import App from './App';
import store from './store';



render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
);
