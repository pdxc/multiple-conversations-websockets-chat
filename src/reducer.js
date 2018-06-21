const defaultState = {
	name: null,
	role: 'user',
	conversations: {},
	currentConversation: null,
};

const reducer = (state=defaultState, action) => {
	switch (action.type) {
		case 'SET_NAME': {
			return {
				...state,
				name: action.name,
			}
		}
		case 'SET_ROLE': {
			return {
				...state,
				role: action.role,
			}
		}
		case 'SELECT_CONTEXT_MESSAGE': {
			return {
				...state,
				conversations: {
					...state.conversations,
					[action.conversationId]: {
						...state.conversations[action.conversationId],
						contextMessage: action.messageIdx,
					}
				}
			}
		}
		case 'ADD_CONVERSATION': {
			return {
				...state,
				conversations: {
					...state.conversations,
					[action.conversationId]: {
						messages: [],
						lastAgentActivity: action.timestamp,
						name: action.name,
					},
				},
			}
		}
		case 'CHANGE_CURRENT_CONVERSATION': {
			return {
				...state,
				currentConversation: action.conversationId,
			}
		}
		case 'REMOVE_CONVERSATION': {
			const newConversations = {};
			Object.keys(state.conversations).forEach(conversationId => {
				if (conversationId !== action.conversationId) {
					newConversations[conversationId] = state.conversations[conversationId];
				}
			})
			
			return {
				...state,
				conversations: newConversations,
			}
		}
		case 'NEW_MESSAGE': {
			return {
				...state,
				conversations: {
					...state.conversations,
					[action.conversationId]: {
						...state.conversations[action.conversationId],
						messages: state.conversations[action.conversationId].messages.concat([action.message]),
						lastAgentActivity: action.message.role === 'agent' ? action.message.timestamp : state.conversations[action.conversationId].lastAgentActivity,
					},
				}
			}
		}
		case 'NEW_USER_JOINED_CONVERSATION': {
			const updatedConversation = {...state.conversations[action.conversationId]}
			switch (action.role) {
				case 'customer': {
					updatedConversation.customers[action.name] = {}
					break;
				}
				case 'agent': {
					updatedConversation.agents[action.name] = {}
					break;
				}
				default: {
					throw new Error('Invalid new user role: ' + action.role);
				}
			}

			return {
				...state,
				conversations: {
					...state.conversations,
					[action.conversationId]: updatedConversation,
				},
			}
		}
		case 'USER_LEFT_CONVERSATION': {
			const updatedConversation = {}
			switch (action.role) {
				case 'customer': {
					Object.keys(state.conversations[action.conversationId].customers).forEach(name => {
						if (action.name !== name) {
							updatedConversation.customers[name] = state.conversations[action.conversationId].customers[name];
						}
					})
					break;
				}
				case 'agent': {
					Object.keys(state.conversations[action.conversationId].agents).forEach(name => {
						if (action.name !== name) {
							updatedConversation.agents[name] = state.conversations[action.conversationId].agents[name];
						}
					})
					break;
				}
				default: {
					throw new Error('Invalid new user role: ' + action.role);
				}
			}

			return {
				...state,
				conversations: {
					...state.conversations,
					[action.conversationId]: updatedConversation,
				},
			}
		}
		default: {
			return state;
		}
	}
};

export default reducer;

