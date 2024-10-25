package controllers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/YankinA/go-chat/models"
)

func CreateUser(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var user models.User
	err = json.Unmarshal(body, &user)
	if err != nil {
		fmt.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	result := user.Create()
	if result.Error != nil {
		http.Error(w, result.Error.Error(), http.StatusInternalServerError)
		return
	}

	fmt.Println(user)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user)
}
