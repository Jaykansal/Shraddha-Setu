package handlers

import (
	"net/http"

	"shraddhasetu-backend/internal/database"
)

type StatsHandler struct {
	store database.Store
}

func NewStatsHandler(store database.Store) *StatsHandler {
	return &StatsHandler{store: store}
}

func (h *StatsHandler) GetStats(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	stats, err := h.store.GetStats()
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]interface{}{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	writeJSON(w, http.StatusOK, map[string]interface{}{
		"success":  true,
		"postgres": h.store.IsPostgres(),
		"data":     stats,
	})
}

func (h *StatsHandler) Health(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]interface{}{
		"status":   "ok",
		"service":  "shraddhasetu-backend-go",
		"postgres": h.store.IsPostgres(),
		"version":  "1.0.0",
	})
}
