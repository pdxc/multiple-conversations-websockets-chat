import * as op from 'object-path';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {setName, setRole, selectContextMessage, newUser, changeCurrentConversation, sendMessage } from './actions';
import './App.css';

class App extends Component {
  constructor(props) {
  	super();
	this.name = React.createRef();
	this.input = React.createRef();
	this.state = {
		role: 'agent',
		message: '',
		time: Date.now(),
	}
  }
  componentDidMount() {
  	this.name.current.focus()
	this.timer = setInterval(() => {
		this.setState((prevState) => {
			return {
				...prevState,
				time: Date.now(),
			}
		})
	}, 1000)
  }
  componentDidUpdate() {
    if (!this.props.name || !this.props.role) {
		this.name.current.focus()
	} else {
		this.input.current.focus()
	}
  }
  render() {
    if (!this.props.name || !this.props.role) {
		return (
		  <div className="App" onClick={() => {
		  	this.name.current.focus()
		  }}>
			<div className="userRegistration">
              <label>Agent</label>
              <input type="radio" onChange={() => {
			  	this.setState((prevState) => {
					return {
						...prevState,
						role: 'agent',
					}
				})
			  }} id="agent" name="userType" value="agent" checked={this.state.role === 'agent'}></input>
              <label>Customer</label>
              <input type="radio" onChange={() => {
			  	this.setState((prevState) => {
					return {
						...prevState,
						role: 'customer',
					}
				})
			  }} id="customer" name="userType" value="customer" checked={this.state.role === 'customer'}></input>
              <h3 className="title">What's your nickname?</h3>
              <input ref={this.name} onKeyPress={(e) => {
			  	if (e.key === 'Enter') {
					this.props.setName(this.name.current.value);
					this.props.setRole(this.state.role);
					if (this.name.current.value && this.state.role) {
						this.props.newUser(this.name.current.value, this.state.role)
					}
				}
			  }} className="usernameInput" type="text" maxLength="15"></input>
			</div>
	      </div>
	    )
	}

    const summary = [];
    Object.keys(this.props.conversations).forEach(conversationId => {
		let context = null
		const messages = op.get(this, ['props', 'conversations', conversationId, 'messages']) || []
		const contextMessageIdx = op.get(this, ['props', 'conversations', conversationId, 'contextMessage']);
		if (contextMessageIdx !== undefined && messages.length > 0) {
			context = messages[contextMessageIdx]
		} else if (messages.length > 0) {
			context = messages[messages.length -1]
		} else {
			context = {name: '', text: ''}
		}

		const lastActivityTime = op.get(this, ['props', 'conversations', conversationId, 'lastAgentActivity']) || 0;
		const staleTime = this.state.time - lastActivityTime;
		let statusColor = 'green';
		if (staleTime > 15000) {
			statusColor = 'orange';
		}
		if (staleTime > 30000) {
			statusColor = 'red';
		}

		summary.push((<div key={conversationId} onClick={() => {
			this.props.changeCurrentConversation(conversationId);
		}} className="conversationSummary">
			<div className="conversationSummaryTitle">{this.props.conversations[conversationId].name}</div>
			<div className="contextMessage" style={{
				display: context.text.length > 0 ? 'block' : 'none',
				borderColor: statusColor,
			}}>{context.text}</div>
			<div className="staleTime">{Math.floor(staleTime/1000)} seconds</div>
		</div>))
	})

	const currentConversation = [];
	try {
		this.props.conversations[this.props.currentConversation].messages.forEach((message, idx) => {
			if (message.name === this.props.name && message.role === this.props.role) {
				currentConversation.push((<div key={idx} onClick={() => {
					this.props.selectContextMessage(this.props.currentConversation, idx)
				}} className="sentMessage">{message.text}</div>))
			} else {
				currentConversation.push((<div key={idx} onClick={() => {
					this.props.selectContextMessage(this.props.currentConversation, idx)
				}} className="receivedMessage">{message.name}: {message.text}</div>))
			}
		})
	} catch (err) {
	}

	const handleMessageSend = (e) => {
		if (this.props.currentConversation && this.state.message) {
			this.props.sendMessage(this.props.currentConversation, this.props.name, this.props.role, this.state.message, this.state.time)
			this.setState((prevState) => {
				return {
					...prevState,
					message: '',
				}
			})
		}
	};

	const convName = op.get(this, ['props', 'conversations', this.props.currentConversation, 'name']) || ''
	
    return (
      <div className="App" onClick={() => {
	  	this.input.current.focus()
	  }}>
		<div className="chat">
		  <span className="conversationsSummary">{summary}</span>
		  <span className="currentConversation"><div className="currentConversationTitle">{convName}</div>{currentConversation}</span>
		</div>
		<div className="inputContainer">
		  <input onChange={(e) => {
			const message = e.target.value;
			this.setState((prevState) => {
				return {
					...prevState,
					message,
				}
			})
		  }} onKeyPress={(e) => {
		  	if (e.key === 'Enter') {
				handleMessageSend(e);
			}
		  }} className="input" ref={this.input} type="text" value={this.state.message}/>
		  <input className="sendMessageButton" onClick={handleMessageSend} type="button" value="Send" />
		</div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
	return state;
}

const mapDispatchToProps = (dispatch, props) => {
	return {
		setName: (name) => dispatch(setName(name)),
		setRole: (role) => dispatch(setRole(role)),
		selectContextMessage: (conversationId, messageIdx) => dispatch(selectContextMessage(conversationId, messageIdx)),
		newUser: (name, role) => dispatch(newUser(name, role)),
		changeCurrentConversation: (conversationId) => dispatch(changeCurrentConversation(conversationId)),
		sendMessage: (currentConversation, name, role, message, timestamp) => dispatch(sendMessage(currentConversation, name, role, message, timestamp)),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
