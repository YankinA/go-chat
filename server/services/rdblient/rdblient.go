package rdbclient

import (
	"context"
	"fmt"
	"os"

	"github.com/redis/go-redis/v9"
)

var (
	db  *redis.Client
	sub *redis.PubSub
)

func CoonDB() {
	host := os.Getenv("REDIS_HOST")
	port := os.Getenv("REDIS_PORT")
	addr := fmt.Sprintf("%s:%s", host, port)
	db = redis.NewClient(&redis.Options{Addr: addr})
}

func NewSub() <-chan *redis.Message {
	sub = db.PSubscribe(context.Background(), "message", "messages", "room_*", "room", "rooms")
	return sub.Channel()
}

func AddSub(pattern string) {
	sub.PSubscribe(context.Background(), pattern)
}

func RemoveSub(pattern string) {
	sub.PUnsubscribe(context.Background(), pattern)
}

func Pub(chanel string, msg []byte) {
	db.Publish(context.Background(), chanel, msg)
}
