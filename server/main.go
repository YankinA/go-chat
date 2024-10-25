package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/YankinA/go-chat/config"
	"github.com/YankinA/go-chat/controllers"
	"github.com/YankinA/go-chat/models"
	rdbclient "github.com/YankinA/go-chat/services/rdblient"
	"github.com/YankinA/go-chat/services/ws"
	"github.com/joho/godotenv"
)

func serveHome(w http.ResponseWriter, r *http.Request) {
	enableCors(w)
	if r.URL.Path != "/" {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	http.ServeFile(w, r, "home.html")
}

func enableCors(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
}

func main() {
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error loading .env file")
	}

	config.ConnDB()
	db := config.GetDB()

	db.AutoMigrate(&models.User{}, &models.Room{}, &models.Message{})

	rdbclient.CoonDB()

	wsInst := ws.NewWs()
	go wsInst.Run()

	http.HandleFunc("/", serveHome)
	http.HandleFunc("/api/user", func(w http.ResponseWriter, r *http.Request) {
		enableCors(w)
		controllers.CreateUser(w, r)
	})

	http.HandleFunc("/api/room",
		func(w http.ResponseWriter, r *http.Request) {
			enableCors(w)
			controllers.CreateRoom(w, r)
		})

	http.HandleFunc("/api/rooms",
		func(w http.ResponseWriter, r *http.Request) {
			enableCors(w)
			controllers.GetAllRooms(w, r)
		})

	http.HandleFunc("/api/message",
		func(w http.ResponseWriter, r *http.Request) {
			enableCors(w)
			controllers.CreateMessage(w, r)
		})

	http.HandleFunc("/api/messages/:id",
		func(w http.ResponseWriter, r *http.Request) {
			enableCors(w)
			controllers.GetMessageAfterID(w, r)
		})

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		enableCors(w)
		ws.ServeWs(wsInst, w, r)
	})

	host := os.Getenv("HOST")
	port := os.Getenv("PORT")
	addr := host + ":" + port
	http.ListenAndServe(addr, nil)
}
