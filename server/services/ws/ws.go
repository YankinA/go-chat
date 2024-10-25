package ws

import (
	rdbclient "github.com/YankinA/go-chat/services/rdblient"
)

type Ws struct {
	connect    chan *Client
	disconnect chan *Client
	clients    map[*Client]bool
	broadcast  chan []byte
}

func NewWs() *Ws {
	return &Ws{
		connect:    make(chan *Client),
		disconnect: make(chan *Client),
		clients:    make(map[*Client]bool),
		broadcast:  make(chan []byte),
	}
}

func (ws *Ws) Run() {
	ws.redisSubConnector()
	for {
		select {
		case client := <-ws.connect:
			ws.clients[client] = true
		case client := <-ws.disconnect:
			if ws.clients[client] {
				delete(ws.clients, client)
				close(client.send)

			}
		case message := <-ws.broadcast:
			ws.runBroadcast(&message)
		}
	}
}

func (ws *Ws) runBroadcast(message *[]byte) {
	for client := range ws.clients {
		select {
		case client.send <- (*message):
		default:
			close(client.send)
			delete(ws.clients, client)

		}
	}
}

func (ws *Ws) redisSubConnector() {
	ch := rdbclient.NewSub()
	go func() {
		for msg := range ch {
			ws.broadcast <- []byte(msg.Payload)
		}
	}()
}
