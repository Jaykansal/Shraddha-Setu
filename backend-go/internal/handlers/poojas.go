package handlers

import (
	"net/http"
	"strings"

	"shraddhasetu-backend/internal/database"
)

type PoojaHandler struct {
	store database.Store
}

func NewPoojaHandler(store database.Store) *PoojaHandler {
	return &PoojaHandler{store: store}
}

func (h *PoojaHandler) List(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	category := r.URL.Query().Get("category")
	search := r.URL.Query().Get("search")

	poojas, err := h.store.ListPoojas(category, search)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]interface{}{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	writeJSON(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"count":   len(poojas),
		"data":    poojas,
	})
}

func (h *PoojaHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	pathParts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(pathParts) < 4 {
		writeJSON(w, http.StatusBadRequest, map[string]interface{}{
			"success": false,
			"message": "Pooja ID required",
		})
		return
	}
	id := pathParts[3]

	pooja, err := h.store.GetPoojaByID(id)
	if err != nil {
		writeJSON(w, http.StatusNotFound, map[string]interface{}{
			"success": false,
			"message": "Pooja not found",
		})
		return
	}

	writeJSON(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"data":    pooja,
	})
}
