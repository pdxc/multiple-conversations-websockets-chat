export const REQUEST_CONVERSATION_WITH_AGENT = 'REQUEST_CONVERSATION_WITH_AGENT'
export const ADD_CONVERSATION = 'ADD_CONVERSATION'
export const NEW_MESSAGE = 'NEW_MESSAGE'
export const USER_JOINED_CONVERSATION = 'USER_JOINED_CONVERSATION'

export const SET_NAME = 'SET_NAME'
export const setName = (name) => ({
	type: SET_NAME,
	name,
})

export const SET_ROLE = 'SET_ROLE'
export const setRole = (role) => ({
	type: SET_ROLE,
	role,
})

export const SELECT_CONTEXT_MESSAGE = 'SELECT_CONTEXT_MESSAGE'
export const selectContextMessage = (conversationId, messageIdx) => ({
	type: SELECT_CONTEXT_MESSAGE,
	conversationId,
	messageIdx,
})

export const NEW_USER = 'NEW_USER'
export const newUser = (name, role) => dispatch => {
	const ws = new WebSocket('ws://localhost:3000');
	ws.onopen = () => {
		ws.send(JSON.stringify({
			type: NEW_USER,
			name,
			role,
		}))
		if (role === 'customer') {
			ws.send(JSON.stringify({
				type: REQUEST_CONVERSATION_WITH_AGENT,
				name,
			}))
		}

		ws.onmessage = (ev) => {
			const data = JSON.parse(ev.data);
			switch (data.type) {
				case ADD_CONVERSATION: {
					dispatch({
						type: ADD_CONVERSATION,
						conversationId: data.conversationId,
						timestamp: data.timestamp,
						name: data.name,
					})
					break;
				}
				case CHANGE_CURRENT_CONVERSATION: {
					dispatch({
						type: CHANGE_CURRENT_CONVERSATION,
						conversationId: data.conversationId,
					})
					break;
				}
				case USER_JOINED_CONVERSATION: {
					dispatch({
						type: USER_JOINED_CONVERSATION,
						conversationId: data.conversationId,
						name: data.name,
						role: data.role,
					})
				}
				case NEW_MESSAGE: {
					dispatch({
						type: NEW_MESSAGE,
						conversationId: data.conversationId,
						message: data.message,
					})
				}
				default: {
					break;
				}
			}
		}
	}
}

export const CHANGE_CURRENT_CONVERSATION = 'CHANGE_CURRENT_CONVERSATION'
export const changeCurrentConversation = (conversationId) => ({
	type: CHANGE_CURRENT_CONVERSATION,
	conversationId,
})

export const SEND_MESSAGE = 'SEND_MESSAGE'
export const sendMessage = (conversationId, name, role, text, timestamp) => dispatch => {
	const ws = new WebSocket('ws://localhost:3000');
	ws.onopen = () => {
		ws.send(JSON.stringify({
			type: NEW_MESSAGE,
			conversationId,
			message: {
				name,
				role,
				text,
				timestamp,
			},
		}))

		ws.onmessage = (ev) => {
			const data = JSON.parse(ev.data);
			switch (data.type) {
				case ADD_CONVERSATION: {
					dispatch({
						type: ADD_CONVERSATION,
						conversationId: data.conversationId,
						timestamp: data.timestamp,
						name: data.name,
					})
					break;
				}
				case CHANGE_CURRENT_CONVERSATION: {
					dispatch({
						type: CHANGE_CURRENT_CONVERSATION,
						conversationId: data.conversationId,
					})
					break;
				}
				case USER_JOINED_CONVERSATION: {
					dispatch({
						type: USER_JOINED_CONVERSATION,
						conversationId: data.conversationId,
						name: data.name,
						role: data.role,
					})
				}
				case NEW_MESSAGE: {
					dispatch({
						type: NEW_MESSAGE,
						conversationId: data.conversationId,
						message: {
							name: data.name,
							role: data.role,
							text: data.text,
							timestamp: data.timestamp,
						},
					})
				}
				default: {
					break;
				}
			}
		}
	}
}
