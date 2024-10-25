package models

import (
	"time"

	"github.com/YankinA/go-chat/config"
	"gorm.io/gorm"
)

type Message struct {
	gorm.Model
	ID        uint      `json:"id" gorm:"primaryKey"`
	Text      string    `json:"text"`
	CreatedAt time.Time `json:"createdAt" gorm:"autoCreateTime"`
	UserID    uint      `json:"userId"`
	User      User      `json:"user" gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:NO ACTION;"`
	RoomID    uint      `json:"roomId" gorm:"index"`
	Room      Room      `json:"room" gorm:"foreignKey:RoomID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:NO ACTION;"`
}

func (m *Message) Create() (*Message, error) {
	db := config.GetDB()
	if err := db.Create(&m).Error; err != nil {
		return nil, err
	}
	if err := db.Preload("User").Preload("Room").First(&m, m.ID).Error; err != nil {
		return nil, err
	}
	return m, nil
}

// TODO use the "updatedAt" field instead of the id if the message will be editable
func (m *Message) GetAfterID(id uint) ([]Message, error) {
	var messages []Message
	db := config.GetDB()

	err := db.Model(&Message{}).
		Select("*").
		Where("id > ?", id).
		Preload("Room").
		Preload("User").
		Order("id ASC").
		Limit(200).
		Find(&messages).Error

	if err != nil {
		return nil, err
	}
	return messages, nil
}
