import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import mainReducer from './reducer';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(mainReducer, composeEnhancers(
	applyMiddleware(thunk)
));

// const ws = new WebSocket('ws://localhost:3000');
// ws.onopen = () => {
// 	console.log('websocket is connected');
// 
// 	ws.send('connected')
// }
// ws.onmessage = (ev) => {
// 	const data = JSON.parse(ev.data);
// 	console.log(data)
// 	switch (data.type) {
// 		case 'ADD_CONVERSATION': {
// 			store.dispatch({
// 				type: 'ADD_CONVERSATION',
// 				conversationId: data.conversationId,
// 			})
// 			break;
// 		}
// 		case 'CHANGE_CURRENT_CONVERSATION': {
// 			store.dispatch({
// 				type: 'CHANGE_CURRENT_CONVERSATION',
// 				conversationId: data.conversationId,
// 			})
// 			break;
// 		}
// 		case 'USER_JOINED_CONVERSATION': {
// 			store.dispatch({
// 				type: 'USER_JOINED_CONVERSATION',
// 				conversationId: data.conversationId,
// 				name: data.name,
// 				role: data.role,
// 			})
// 		}
// 		case 'NEW_MESSAGE': {
// 			store.dispatch({
// 				type: 'NEW_MESSAGE',
// 				conversationId: data.conversationId,
// 				message: {
// 					name: data.name,
// 					role: data.role,
// 					text: data.text,
// 				},
// 			})
// 		}
// 		default: {
// 			break;
// 		}
// 	}
// }

// store.dispatch({
// 	type: 'SET_NAME',
// 	name: 'Toby',
// })
// store.dispatch({
// 	type: 'SET_ROLE',
// 	role: 'agent',
// })
// store.dispatch({
// 	type: 'ADD_CONVERSATION',
// 	conversationId: '456',
// })
// store.dispatch({
// 	type: 'ADD_CONVERSATION',
// 	conversationId: '23t',
// })
// store.dispatch({
// 	type: 'CHANGE_CURRENT_CONVERSATION',
// 	conversationId: '23t',
// })
// store.dispatch({
// 	type: 'USER_JOINED_CONVERSATION',
// 	conversationId: '23t',
// 	name: 'Mark',
// 	role: 'customer',
// })
// store.dispatch({
// 	type: 'NEW_MESSAGE',
// 	conversationId: '23t',
// 	message: {
// 		name: 'Toby',
// 		role: 'agent',
// 		text: 'Hi, my name is Toby!',
// 	},
// })
// store.dispatch({
// 	type: 'NEW_MESSAGE',
// 	conversationId: '23t',
// 	message: {
// 		name: 'Toby',
// 		role: 'agent',
// 		text: 'What can I help you with today?',
// 	},
// })
// store.dispatch({
// 	type: 'NEW_MESSAGE',
// 	conversationId: '23t',
// 	message: {
// 		name: 'Mark',
// 		role: 'agent',
// 		text: 'Hello Toby. Can I get a refund please?',
// 	},
// })

ReactDOM.render((<Provider store={store}><App /></Provider>), document.getElementById('root'));
// registerServiceWorker();
