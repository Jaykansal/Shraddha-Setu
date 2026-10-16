package handlers

import (
	"encoding/json"
	"net/http"
	"strings"

	"shraddhasetu-backend/internal/database"
	"shraddhasetu-backend/internal/middleware"
	"shraddhasetu-backend/internal/models"
)

type BookingHandler struct {
	store database.Store
}

func NewBookingHandler(store database.Store) *BookingHandler {
	return &BookingHandler{store: store}
}

func (h *BookingHandler) HandleBookings(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		h.List(w, r)
	case http.MethodPost:
		h.Create(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func (h *BookingHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req models.CreateBookingRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]interface{}{
			"success": false,
			"message": "Invalid request body",
		})
		return
	}

	if req.ClientName == "" || req.ClientPhone == "" || req.PoojaID == "" || req.City == "" {
		writeJSON(w, http.StatusBadRequest, map[string]interface{}{
			"success": false,
			"message": "Please provide Name, Phone, Pooja, and City",
		})
		return
	}

	pooja, err := h.store.GetPoojaByID(req.PoojaID)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]interface{}{
			"success": false,
			"message": "Selected Pooja ritual not found",
		})
		return
	}

	// Calculate prices with or without samagri
	basePrice := pooja.PriceWithoutSamagri
	samagriPrice := 0
	if req.WithSamagri {
		samagriPrice = pooja.SamagriCost
	}
	totalAmount := basePrice + samagriPrice

	// Determine client ID if authenticated
	clientID := "guest"
	if uid, ok := r.Context().Value(middleware.UserContextKey).(string); ok && uid != "" {
		clientID = uid
	}

	b := &models.Booking{
		ClientID:     clientID,
		ClientName:   req.ClientName,
		ClientPhone:  req.ClientPhone,
		ClientEmail:  req.ClientEmail,
		PoojaID:      pooja.ID,
		PoojaTitle:   pooja.Title,
		WithSamagri:  req.WithSamagri,
		BasePrice:    basePrice,
		SamagriPrice: samagriPrice,
		TotalAmount:  totalAmount,
		BookingDate:  req.BookingDate,
		TimeSlot:     req.TimeSlot,
		City:         req.City,
		Occasion:     req.Occasion,
		SpecialNotes: req.SpecialNotes,
		Status:       models.StatusConfirmed,
	}

	if b.TimeSlot == "" {
		b.TimeSlot = "Morning Auspicious Muhurat (09:00 AM)"
	}
	if b.Occasion == "" {
		b.Occasion = "Devotional Puja"
	}

	saved, err := h.store.CreateBooking(b)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]interface{}{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	samagriLabel := "With Pure Vedic Samagri Kit"
	if !b.WithSamagri {
		samagriLabel = "Pandit Only (Without Samagri)"
	}

	writeJSON(w, http.StatusCreated, map[string]interface{}{
		"success": true,
		"message": "Pooja booking confirmed successfully (" + samagriLabel + ")! Booking Code: " + saved.BookingCode,
		"booking": saved,
	})
}

func (h *BookingHandler) List(w http.ResponseWriter, r *http.Request) {
	// Query parameters
	clientID := r.URL.Query().Get("clientId")
	panditID := r.URL.Query().Get("panditId")
	city := r.URL.Query().Get("city")

	// If authenticated context exists, prioritize it
	if role, ok := r.Context().Value(middleware.RoleContextKey).(string); ok {
		uid, _ := r.Context().Value(middleware.UserContextKey).(string)
		if role == models.RoleClient && clientID == "" {
			clientID = uid
		} else if role == models.RolePandit && panditID == "" {
			panditID = uid
		}
	}

	var bookings []*models.Booking
	var err error

	if panditID != "" {
		bookings, err = h.store.GetBookingsForPandit(panditID, city)
	} else if clientID != "" {
		bookings, err = h.store.GetBookingsByClientID(clientID)
	} else {
		bookings, err = h.store.GetAllBookings()
	}

	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]interface{}{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	writeJSON(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"count":   len(bookings),
		"data":    bookings,
	})
}

func (h *BookingHandler) UpdateStatus(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPatch && r.Method != http.MethodPut && r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	pathParts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	// /api/v1/bookings/:id/status
	if len(pathParts) < 4 {
		writeJSON(w, http.StatusBadRequest, map[string]interface{}{
			"success": false,
			"message": "Booking ID required",
		})
		return
	}
	id := pathParts[3]

	var req models.UpdateBookingStatusRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]interface{}{
			"success": false,
			"message": "Invalid request body",
		})
		return
	}

	var panditName, panditPhone string
	if req.PanditID != "" {
		pandit, err := h.store.GetUserByID(req.PanditID)
		if err == nil {
			panditName = pandit.Name
			panditPhone = pandit.Phone
		}
	}

	updated, err := h.store.UpdateBookingStatus(id, req.Status, req.PanditID, panditName, panditPhone)
	if err != nil {
		writeJSON(w, http.StatusNotFound, map[string]interface{}{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	writeJSON(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"message": "Booking status updated to " + req.Status,
		"booking": updated,
	})
}
