package models

import "time"

// User roles
const (
	RoleClient = "CLIENT"
	RolePandit = "PANDIT"
	RoleAdmin  = "ADMIN"
)

// Booking statuses
const (
	StatusPending    = "PENDING"
	StatusConfirmed  = "CONFIRMED"
	StatusAssigned   = "ASSIGNED"
	StatusInProgress = "IN_PROGRESS"
	StatusCompleted  = "COMPLETED"
	StatusCancelled  = "CANCELLED"
)

// User represents both Devotee (Client) and Vedic Pandit
type User struct {
	ID                  string    `json:"id"`
	Name                string    `json:"name"`
	Email               string    `json:"email"`
	Phone               string    `json:"phone"`
	PasswordHash        string    `json:"-"`
	Role                string    `json:"role"` // CLIENT, PANDIT, ADMIN
	City                string    `json:"city"`
	// Pandit Specific Profile Fields
	Gurukul             string    `json:"gurukul,omitempty"`
	VedicSpecialization string    `json:"vedicSpecialization,omitempty"`
	ExperienceYears     int       `json:"experienceYears,omitempty"`
	Languages           []string  `json:"languages,omitempty"`
	IsVerified          bool      `json:"isVerified"`
	Rating              float64   `json:"rating"`
	PoojasConducted     int       `json:"poojasConducted"`
	CreatedAt           time.Time `json:"createdAt"`
	UpdatedAt           time.Time `json:"updatedAt"`
}

// PoojaService represents an authentic ritual package
type PoojaService struct {
	ID                     string   `json:"id"`
	Title                  string   `json:"title"`
	Subtitle               string   `json:"subtitle"`
	PriceWithoutSamagri    int      `json:"priceWithoutSamagri"`
	SamagriCost            int      `json:"samagriCost"`
	PriceWithSamagri       int      `json:"priceWithSamagri"`
	FormattedWithoutSamagri string  `json:"formattedWithoutSamagri"`
	FormattedWithSamagri   string   `json:"formattedWithSamagri"`
	Duration               string   `json:"duration"`
	Deity                  string   `json:"deity"`
	Category               string   `json:"category"`
	SamagriIncluded        bool     `json:"samagriIncluded"`
	Image                  string   `json:"image"`
	SamagriKit             []string `json:"samagriKit"`
	Description            string   `json:"description"`
}

// Booking represents a scheduled sacred ritual
type Booking struct {
	ID                  string    `json:"id"`
	BookingCode         string    `json:"bookingCode"`
	ClientID            string    `json:"clientId"`
	ClientName          string    `json:"clientName"`
	ClientPhone         string    `json:"clientPhone"`
	ClientEmail         string    `json:"clientEmail"`
	PoojaID             string    `json:"poojaId"`
	PoojaTitle          string    `json:"poojaTitle"`
	WithSamagri         bool      `json:"withSamagri"`
	BasePrice           int       `json:"basePrice"`
	SamagriPrice        int       `json:"samagriPrice"`
	TotalAmount         int       `json:"totalAmount"`
	BookingDate         string    `json:"bookingDate"`
	TimeSlot            string    `json:"timeSlot"`
	City                string    `json:"city"`
	Occasion            string    `json:"occasion"`
	SpecialNotes        string    `json:"specialNotes"`
	Status              string    `json:"status"` // CONFIRMED, ASSIGNED, COMPLETED, CANCELLED
	AssignedPanditID    string    `json:"assignedPanditId,omitempty"`
	AssignedPanditName  string    `json:"assignedPanditName,omitempty"`
	AssignedPanditPhone string    `json:"assignedPanditPhone,omitempty"`
	CreatedAt           time.Time `json:"createdAt"`
	UpdatedAt           time.Time `json:"updatedAt"`
}

// Request and Response DTOs

type RegisterRequest struct {
	Name           string `json:"name"`
	Email          string `json:"email"`
	Phone          string `json:"phone"`
	Password       string `json:"password"`
	Role           string `json:"role"` // CLIENT or PANDIT
	City           string `json:"city"`
	Gurukul        string `json:"gurukul,omitempty"`
	Specialization string `json:"specialization,omitempty"`
	Experience     int    `json:"experience,omitempty"`
}

type LoginRequest struct {
	Email          string `json:"email"`
	Password       string `json:"password"`
	RequestedRole  string `json:"requestedRole"` // CLIENT or PANDIT
}

type AuthResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Token   string `json:"token,omitempty"`
	User    *User  `json:"user,omitempty"`
}

type CreateBookingRequest struct {
	ClientName   string `json:"clientName"`
	ClientPhone  string `json:"clientPhone"`
	ClientEmail  string `json:"clientEmail,omitempty"`
	PoojaID      string `json:"poojaId"`
	WithSamagri  bool   `json:"withSamagri"`
	BookingDate  string `json:"bookingDate"`
	TimeSlot     string `json:"timeSlot,omitempty"`
	City         string `json:"city"`
	Occasion     string `json:"occasion,omitempty"`
	SpecialNotes string `json:"specialNotes,omitempty"`
}

type UpdateBookingStatusRequest struct {
	Status   string `json:"status"` // ASSIGNED, COMPLETED, CANCELLED
	PanditID string `json:"panditId,omitempty"`
}

type StatsResponse struct {
	TotalBookings   int `json:"totalBookings"`
	TotalPandits    int `json:"totalPandits"`
	TotalDevotees   int `json:"totalDevotees"`
	CitiesCount     int `json:"citiesCount"`
	PoojaCatalogSize int `json:"poojaCatalogSize"`
}
