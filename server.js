const express = require('express');
const WebSocketServer = require('ws').Server;
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const server = require('http').Server(app);
app.use(express.static(path.join(__dirname, 'build')));

const customers = {};
const agents = {};
const conversations = {};

const getLeastBusyAgent = function(agents) {
	let min = null;
	let leastBusyId = null;
	Object.keys(agents).forEach(agentId => {
		if (leastBusyId === null) {
			leastBusyId = agentId
		} else if (Object.keys(agents[agentId].conversations).length < min) {
			min = Object.keys(agents[agentId].conversations).length;
			leastBusyId = agentId;
		}
	})

	return leastBusyId;
}

const wss = new WebSocketServer({port: 3000})
wss.on('connection', function (ws) {
	ws.on('message', function (message) {
		console.log('received %s', message)
		let data = {};
		try {
			data = JSON.parse(message.data);
		} catch (err) {
			try {
				data = JSON.parse(message)
			} catch (err) {
				data = {}
			}
		}

		switch (data.type) {
			case 'NEW_USER': {
				if (data.role === 'customer') {
					customers[data.name] = {
						conversations: {},
						connection: ws,
					};
				} else if (data.role === 'agent') {
					agents[data.name] = {
						conversations: {},
						connection: ws,
					};
				}
				break;
			}
			case 'REQUEST_CONVERSATION_WITH_AGENT': {
				const id = Date.now();
				const leastBusyAgent = getLeastBusyAgent(agents);
				const name = data.name;
				conversations[id] = {
					agents: {
						[leastBusyAgent]: {},
					},
					customers: {
						[data.name]: {},
					},
				}

				ws.send(JSON.stringify({
					type: 'ADD_CONVERSATION',
					conversationId: id,
					timestamp: Date.now(),
					name: leastBusyAgent,
				}))
				ws.send(JSON.stringify({
					type: 'CHANGE_CURRENT_CONVERSATION',
					conversationId: id,
				}))
				agents[leastBusyAgent].connection.send(JSON.stringify({
					type: 'ADD_CONVERSATION',
					conversationId: id,
					timestamp: Date.now(),
					name: data.name,
				}))
				agents[leastBusyAgent].connection.send(JSON.stringify({
					type: 'CHANGE_CURRENT_CONVERSATION',
					conversationId: id,
				}))
				break;
			}
			case 'NEW_MESSAGE': {
				const { conversationId, message } = data
				const convAgents = conversations[conversationId].agents
				const convCustomers = conversations[conversationId].customers

				try {
					Object.keys(convAgents).forEach(agentId => {
						agents[agentId].connection.send(JSON.stringify({
							type: 'NEW_MESSAGE',
							conversationId,
							message,
						}))
					})
				} catch (err) {
				}
				try {
					Object.keys(convCustomers).forEach(customerId => {
						customers[customerId].connection.send(JSON.stringify({
							type: 'NEW_MESSAGE',
							conversationId,
							message,
						}))
					})
				} catch (err) {
				}
				break;
			}
		}
	})

	// setInterval(function() {ws.send(JSON.stringify({
	// 	type: 'CHANGE_CURRENT_CONVERSATION',
	// 	conversationId: '456',
	// }))}, 1000)
	// setInterval(function() {ws.send(JSON.stringify({
	// 	type: 'CHANGE_CURRENT_CONVERSATION',
	// 	conversationId: '23t',
	// }))}, 1500)
})

app.get('/ping', function (req, res) {
 return res.send('pong');
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT || 8080);
