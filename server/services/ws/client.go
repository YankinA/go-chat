package ws

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/YankinA/go-chat/models"
	rdbclient "github.com/YankinA/go-chat/services/rdblient"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

const (
	// Time allowed to write a message to the peer.
	writeWait = 10 * time.Second

	// Time allowed to read the next pong message from the peer.
	pongWait = 60 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10

	// Maximum message size allowed from peer.
	maxMessageSize = 512
)

type Client struct {
	userId uint
	ws     *Ws
	conn   *websocket.Conn
	send   chan []byte
}

func (c *Client) read() {
	defer func() {
		c.ws.disconnect <- c
		c.conn.Close()
		//  TODO create dynamic unsubscribe
		//  redisclient.RemoveSub("room_id")
	}()

	for {
		_, msg, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				fmt.Printf("error: %v", err)
			}
			break
		}

		parsedMsg, err := parseMsg(&msg)

		if err != nil {
			fmt.Printf("parsing error %v", err)
			return
		}

		handleMsg(parsedMsg)

	}

}

func handleMsg(msgData map[string]interface{}) {
	dataInterface, ok := msgData["data"]
	if !ok || dataInterface == nil {
		fmt.Println("Missing or invalid 'data' field in message")
		return
	}

	msg, ok := dataInterface.(map[string]interface{})
	if !ok {
		fmt.Println("'data' field is not a map")
		return
	}

	switch msgData["type"] {
	case "message":
		handleMessage(msg)
	case "messages":
		handleMessages(msg)
	case "room":
		handleRoom(msg)

	default:
		fmt.Printf("unexpected message type %s", msg["type"])
	}
}

func handleMessage(msg map[string]interface{}) {

	text := msg["text"].(string)
	userId := uint(msg["userId"].(float64))
	roomId := uint(msg["roomId"].(float64))

	m := models.Message{Text: text, UserID: userId, RoomID: roomId}
	result, err := m.Create()
	if err != nil {
		fmt.Println("Failed to create message:", err)
		return
	}

	jsonData, err := createMessage("message", result)
	if err != nil {
		fmt.Println("Failed to marshal room to JSON:", err)
		return
	}
	pubChannel := "room_" + strconv.Itoa(int(roomId))
	rdbclient.Pub(pubChannel, jsonData)
}

func handleMessages(msg map[string]interface{}) {

	lastMessageId := uint(msg["lastMessageId"].(float64))
	m := &models.Message{}
	result, err := m.GetAfterID(lastMessageId)
	if err != nil {
		fmt.Println("Failed to create message:", err)
		return
	}

	jsonData, err := createMessage("messages", result)
	if err != nil {
		fmt.Println("Failed to marshal room to JSON:", err)
		return
	}

	rdbclient.Pub("messages", jsonData)
}

func handleRoom(msg map[string]interface{}) {
	nameInterface, ok := msg["name"]
	if !ok || nameInterface == nil {
		fmt.Println("Missing or invalid 'name' field in message")
		return
	}

	name, ok := nameInterface.(string)
	if !ok {
		fmt.Println("'name' field is not a string")
		return
	}

	r := models.Room{Name: name}
	result := r.Create()
	if result.Error != nil {
		fmt.Println("Failed to create room:", result.Error)
		return
	}

	jsonData, err := createMessage("room", r)
	if err != nil {
		fmt.Println("Failed to marshal room to JSON:", err)
		return
	}

	rdbclient.Pub("room", jsonData)
}

func createMessage(messageType string, data interface{}) ([]byte, error) {
	finalMessage := map[string]interface{}{
		"type": messageType,
		"data": data,
	}

	return json.Marshal(finalMessage)
}

func parseMsg(msg *[]byte) (map[string]interface{}, error) {
	(*msg) = bytes.TrimSpace(bytes.Replace((*msg), []byte{'\n'}, []byte{' '}, -1))
	var parsed map[string]interface{}

	if err := json.Unmarshal((*msg), &parsed); err != nil {
		return nil, err
	}
	return parsed, nil
}

func (c *Client) write() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()

	for {
		select {
		case message, open := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !open {
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			n := len(c.send)
			for i := 0; i < n; i++ {
				w.Write([]byte{'\n'})
				w.Write(<-c.send)
			}

			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

func ServeWs(ws *Ws, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println(err)
		return
	}

	userId := getUserIdFromRequest(r)

	client := &Client{ws: ws, conn: conn, send: make(chan []byte, 256), userId: userId}
	client.ws.connect <- client

	//  TODO create dynamic subscription
	//  redisclient.AddSub("room_id")

	go client.read()
	go client.write()

}

func getUserIdFromRequest(r *http.Request) uint {
	userIdStr := r.URL.Query().Get("userId")
	userId, err := strconv.ParseUint(userIdStr, 10, 32)
	if err != nil {
		return 0
	}
	return uint(userId)
}

func (ws *Ws) SendMessageToClient(userId uint, message []byte) {
	for client := range ws.clients {
		if client.userId == userId {
			select {
			case client.send <- message:
			default:
				close(client.send)
				delete(ws.clients, client)
			}
		}
	}
}
