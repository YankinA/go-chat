package models

import (
	"github.com/YankinA/go-chat/config"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	ID   uint   `json:"id" gorm:"primaryKey"`
	Name string `json:"name"`
}

func (u *User) Create() *gorm.DB {
	db := config.GetDB()
	db = db.Create(&u)

	return db
}

func (u *User) GetByName(name string) *gorm.DB {
	db := config.GetDB()
	db = db.Where("Name=?", name).Find(&u)
	return db
}
