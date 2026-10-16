package handlers

import (
	"encoding/json"
	"net/http"
	"strings"

	"golang.org/x/crypto/bcrypt"
	"shraddhasetu-backend/internal/config"
	"shraddhasetu-backend/internal/database"
	"shraddhasetu-backend/internal/middleware"
	"shraddhasetu-backend/internal/models"
)

type AuthHandler struct {
	cfg   *config.Config
	store database.Store
}

func NewAuthHandler(cfg *config.Config, store database.Store) *AuthHandler {
	return &AuthHandler{cfg: cfg, store: store}
}

func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req models.RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]interface{}{
			"success": false,
			"message": "Invalid request body",
		})
		return
	}

	if req.Name == "" || req.Email == "" || req.Phone == "" || req.Password == "" || req.City == "" {
		writeJSON(w, http.StatusBadRequest, map[string]interface{}{
			"success": false,
			"message": "Please provide all required fields (Name, Email, Phone, Password, City)",
		})
		return
	}

	role := strings.ToUpper(req.Role)
	if role == "" {
		role = models.RoleClient
	}

	// Hash password with bcrypt
	hashed, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]interface{}{
			"success": false,
			"message": "Error securing password",
		})
		return
	}

	u := &models.User{
		Name:         req.Name,
		Email:        strings.ToLower(req.Email),
		Phone:        req.Phone,
		PasswordHash: string(hashed),
		Role:         role,
		City:         req.City,
		Rating:       5.0,
	}

	if role == models.RolePandit {
		u.Gurukul = req.Gurukul
		if u.Gurukul == "" {
			u.Gurukul = "Kashi Veda Vidyapeeth, Varanasi"
		}
		u.VedicSpecialization = req.Specialization
		if u.VedicSpecialization == "" {
			u.VedicSpecialization = "Karmakand, Havan & Vedic Anushthan"
		}
		u.ExperienceYears = req.Experience
		if u.ExperienceYears == 0 {
			u.ExperienceYears = 5
		}
		u.Languages = []string{"Hindi", "Sanskrit"}
		u.IsVerified = false // Needs verification in admin
		u.PoojasConducted = 0
	}

	createdUser, err := h.store.CreateUser(u)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]interface{}{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	// Generate JWT
	token, _ := middleware.GenerateToken(h.cfg, &middleware.JWTClaims{
		UserID: createdUser.ID,
		Email:  createdUser.Email,
		Role:   createdUser.Role,
		Name:   createdUser.Name,
		City:   createdUser.City,
	})

	var msg string
	if role == models.RolePandit {
		msg = "Vedic Pandit registered successfully! Profile created for Acharya Portal."
	} else {
		msg = "Devotee account registered successfully! Welcome to ShraddhaSetu."
	}

	writeJSON(w, http.StatusCreated, models.AuthResponse{
		Success: true,
		Message: msg,
		Token:   token,
		User:    createdUser,
	})
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req models.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]interface{}{
			"success": false,
			"message": "Invalid request body",
		})
		return
	}

	if req.Email == "" || req.Password == "" {
		writeJSON(w, http.StatusBadRequest, map[string]interface{}{
			"success": false,
			"message": "Please provide email and password",
		})
		return
	}

	user, err := h.store.GetUserByEmail(req.Email)
	if err != nil {
		writeJSON(w, http.StatusUnauthorized, map[string]interface{}{
			"success": false,
			"message": "Invalid email or credentials",
		})
		return
	}

	// Check role enforcement if requested
	if req.RequestedRole != "" && !strings.EqualFold(user.Role, req.RequestedRole) {
		portalName := "Devotee"
		if user.Role == models.RolePandit {
			portalName = "Pandit"
		}
		writeJSON(w, http.StatusForbidden, map[string]interface{}{
			"success": false,
			"message": "This account is registered as " + user.Role + ". Please switch to the " + portalName + " tab to sign in.",
		})
		return
	}

	// Verify bcrypt password (with fallback for demo plain-text passwords)
	if bcryptErr := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); bcryptErr != nil {
		if user.PasswordHash != req.Password {
			writeJSON(w, http.StatusUnauthorized, map[string]interface{}{
				"success": false,
				"message": "Incorrect password",
			})
			return
		}
	}

	token, err := middleware.GenerateToken(h.cfg, &middleware.JWTClaims{
		UserID: user.ID,
		Email:  user.Email,
		Role:   user.Role,
		Name:   user.Name,
		City:   user.City,
	})
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]interface{}{
			"success": false,
			"message": "Could not generate auth token",
		})
		return
	}

	writeJSON(w, http.StatusOK, models.AuthResponse{
		Success: true,
		Message: "Welcome back, " + user.Name + "!",
		Token:   token,
		User:    user,
	})
}

func (h *AuthHandler) Me(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userID, ok := r.Context().Value(middleware.UserContextKey).(string)
	if !ok || userID == "" {
		writeJSON(w, http.StatusUnauthorized, map[string]interface{}{
			"success": false,
			"message": "Not authenticated",
		})
		return
	}

	user, err := h.store.GetUserByID(userID)
	if err != nil {
		writeJSON(w, http.StatusNotFound, map[string]interface{}{
			"success": false,
			"message": "User not found",
		})
		return
	}

	writeJSON(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"user":    user,
	})
}

func writeJSON(w http.ResponseWriter, statusCode int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	_ = json.NewEncoder(w).Encode(data)
}
