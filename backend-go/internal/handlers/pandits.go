package handlers

import (
	"net/http"
	"strings"

	"shraddhasetu-backend/internal/database"
)

type PanditHandler struct {
	store database.Store
}

func NewPanditHandler(store database.Store) *PanditHandler {
	return &PanditHandler{store: store}
}

func (h *PanditHandler) List(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	city := r.URL.Query().Get("city")
	spec := r.URL.Query().Get("specialization")

	pandits, err := h.store.ListPandits(city, spec)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]interface{}{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	writeJSON(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"count":   len(pandits),
		"data":    pandits,
	})
}

func (h *PanditHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	pathParts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(pathParts) < 4 {
		writeJSON(w, http.StatusBadRequest, map[string]interface{}{
			"success": false,
			"message": "Pandit ID required",
		})
		return
	}
	id := pathParts[3]

	pandit, err := h.store.GetUserByID(id)
	if err != nil || pandit.Role != "PANDIT" {
		writeJSON(w, http.StatusNotFound, map[string]interface{}{
			"success": false,
			"message": "Vedic Pandit not found",
		})
		return
	}

	writeJSON(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"data":    pandit,
	})
}
