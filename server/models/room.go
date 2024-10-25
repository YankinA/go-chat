package models

import (
	"github.com/YankinA/go-chat/config"
	"gorm.io/gorm"
)

type Room struct {
	gorm.Model
	ID   uint   `json:"id" gorm:"primaryKey"`
	Name string `json:"name"`
}

type RoomWithLastMessage struct {
	ID          uint    `json:"id"`
	Name        string  `json:"name"`
	LastMessage Message `json:"lastMessage" gorm:"foreignKey:RoomID"`
}

func (r *Room) Create() *gorm.DB {
	db := config.GetDB()
	db = db.Create(&r)
	return db
}

func (r *RoomWithLastMessage) GetAll() ([]RoomWithLastMessage, error) {
	var rooms []RoomWithLastMessage
	db := config.GetDB()

	subQuery := db.Model(&Message{}).
		Select("id").
		Where("room_id = rooms.id").
		Order("id DESC").
		Limit(1)

	err := db.Model(&Room{}).
		Select("rooms.id, rooms.name").
		Joins("LEFT JOIN messages ON messages.id = (?)", subQuery).
		Preload("LastMessage").
		Preload("LastMessage.User").
		Find(&rooms).Error

	if err != nil {
		return nil, err
	}
	return rooms, nil
}
