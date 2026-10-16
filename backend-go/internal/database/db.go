package database

import (
	"database/sql"
	"fmt"
	"log"
	"strings"
	"sync"
	"time"

	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
	"shraddhasetu-backend/internal/models"
)

type Store interface {
	// Users & Auth
	CreateUser(u *models.User) (*models.User, error)
	GetUserByEmail(email string) (*models.User, error)
	GetUserByID(id string) (*models.User, error)
	ListPandits(city, specialization string) ([]*models.User, error)

	// Poojas
	ListPoojas(category, search string) ([]*models.PoojaService, error)
	GetPoojaByID(id string) (*models.PoojaService, error)

	// Bookings
	CreateBooking(b *models.Booking) (*models.Booking, error)
	GetBookingsByClientID(clientID string) ([]*models.Booking, error)
	GetBookingsForPandit(panditID, city string) ([]*models.Booking, error)
	GetAllBookings() ([]*models.Booking, error)
	GetBookingByID(id string) (*models.Booking, error)
	UpdateBookingStatus(id, status, panditID, panditName, panditPhone string) (*models.Booking, error)

	// Stats
	GetStats() (*models.StatsResponse, error)
	IsPostgres() bool
}

// PostgresStore implements Store using database/sql
type PostgresStore struct {
	db *sql.DB
}

// MemoryStore implements Store as in-memory fallback
type MemoryStore struct {
	mu       sync.RWMutex
	users    map[string]*models.User
	poojas   map[string]*models.PoojaService
	bookings map[string]*models.Booking
}

func InitDB(databaseURL string) (Store, error) {
	if databaseURL != "" {
		log.Printf("Connecting to PostgreSQL at: %s", sanitizeURL(databaseURL))
		db, err := sql.Open("postgres", databaseURL)
		if err == nil {
			db.SetMaxOpenConns(25)
			db.SetMaxIdleConns(10)
			db.SetConnMaxLifetime(5 * time.Minute)

			ctxTimeout := 3 * time.Second
			err = db.Ping()
			if err == nil {
				log.Println("✓ Successfully connected to PostgreSQL database!")
				store := &PostgresStore{db: db}
				if initErr := store.initSchema(); initErr != nil {
					log.Printf("⚠️ Warning running schema auto-migration: %v", initErr)
				}
				return store, nil
			}
			log.Printf("⚠️ PostgreSQL ping failed (%v). Falling back to in-memory store.", err)
			_ = ctxTimeout
		} else {
			log.Printf("⚠️ PostgreSQL open failed (%v). Falling back to in-memory store.", err)
		}
	} else {
		log.Println("ℹ️ No DATABASE_URL provided. Running in high-performance memory mode with full pre-seeded data.")
	}

	mem := NewMemoryStore()
	mem.SeedDefaults()
	return mem, nil
}

func sanitizeURL(url string) string {
	if strings.Contains(url, "@") {
		parts := strings.Split(url, "@")
		return "postgres://***@" + parts[1]
	}
	return url
}

// --- PostgresStore Implementation ---

func (p *PostgresStore) IsPostgres() bool {
	return true
}

func (p *PostgresStore) initSchema() error {
	query := `
	CREATE TABLE IF NOT EXISTS users (
		id VARCHAR(64) PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		email VARCHAR(255) UNIQUE NOT NULL,
		phone VARCHAR(64) NOT NULL,
		password_hash VARCHAR(255) NOT NULL,
		role VARCHAR(32) NOT NULL DEFAULT 'CLIENT',
		city VARCHAR(128) NOT NULL,
		gurukul VARCHAR(255) DEFAULT '',
		vedic_specialization VARCHAR(255) DEFAULT '',
		experience_years INT DEFAULT 0,
		languages TEXT DEFAULT 'Hindi,Sanskrit',
		is_verified BOOLEAN DEFAULT FALSE,
		rating NUMERIC(3,2) DEFAULT 5.0,
		poojas_conducted INT DEFAULT 0,
		created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS poojas (
		id VARCHAR(64) PRIMARY KEY,
		title VARCHAR(255) NOT NULL,
		subtitle VARCHAR(255) NOT NULL,
		price_without_samagri INT NOT NULL,
		samagri_cost INT NOT NULL,
		price_with_samagri INT NOT NULL,
		duration VARCHAR(64) NOT NULL,
		deity VARCHAR(128) NOT NULL,
		category VARCHAR(64) NOT NULL,
		samagri_included BOOLEAN DEFAULT TRUE,
		image VARCHAR(255) NOT NULL,
		samagri_kit TEXT NOT NULL,
		description TEXT NOT NULL
	);

	CREATE TABLE IF NOT EXISTS bookings (
		id VARCHAR(64) PRIMARY KEY,
		booking_code VARCHAR(32) UNIQUE NOT NULL,
		client_id VARCHAR(64) NOT NULL,
		client_name VARCHAR(255) NOT NULL,
		client_phone VARCHAR(64) NOT NULL,
		client_email VARCHAR(255) DEFAULT '',
		pooja_id VARCHAR(64) NOT NULL,
		pooja_title VARCHAR(255) NOT NULL,
		with_samagri BOOLEAN NOT NULL DEFAULT TRUE,
		base_price INT NOT NULL,
		samagri_price INT NOT NULL DEFAULT 0,
		total_amount INT NOT NULL,
		booking_date VARCHAR(64) NOT NULL,
		time_slot VARCHAR(64) DEFAULT 'Morning Auspicious Muhurat (09:00 AM)',
		city VARCHAR(128) NOT NULL,
		occasion VARCHAR(255) DEFAULT 'Devotional Puja',
		special_notes TEXT DEFAULT '',
		status VARCHAR(32) NOT NULL DEFAULT 'CONFIRMED',
		assigned_pandit_id VARCHAR(64) DEFAULT '',
		assigned_pandit_name VARCHAR(255) DEFAULT '',
		assigned_pandit_phone VARCHAR(64) DEFAULT '',
		created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
	);
	`
	_, err := p.db.Exec(query)
	return err
}

func (p *PostgresStore) CreateUser(u *models.User) (*models.User, error) {
	u.ID = fmt.Sprintf("usr_%d", time.Now().UnixNano())
	u.CreatedAt = time.Now()
	u.UpdatedAt = time.Now()
	langs := strings.Join(u.Languages, ",")

	query := `
	INSERT INTO users (id, name, email, phone, password_hash, role, city, gurukul, vedic_specialization, experience_years, languages, is_verified, rating, poojas_conducted, created_at, updated_at)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
	`
	_, err := p.db.Exec(query, u.ID, u.Name, u.Email, u.Phone, u.PasswordHash, u.Role, u.City, u.Gurukul, u.VedicSpecialization, u.ExperienceYears, langs, u.IsVerified, u.Rating, u.PoojasConducted, u.CreatedAt, u.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return u, nil
}

func (p *PostgresStore) GetUserByEmail(email string) (*models.User, error) {
	query := `SELECT id, name, email, phone, password_hash, role, city, gurukul, vedic_specialization, experience_years, languages, is_verified, rating, poojas_conducted, created_at, updated_at FROM users WHERE LOWER(email) = LOWER($1)`
	row := p.db.QueryRow(query, email)

	var u models.User
	var langs string
	err := row.Scan(&u.ID, &u.Name, &u.Email, &u.Phone, &u.PasswordHash, &u.Role, &u.City, &u.Gurukul, &u.VedicSpecialization, &u.ExperienceYears, &langs, &u.IsVerified, &u.Rating, &u.PoojasConducted, &u.CreatedAt, &u.UpdatedAt)
	if err != nil {
		return nil, err
	}
	if langs != "" {
		u.Languages = strings.Split(langs, ",")
	}
	return &u, nil
}

func (p *PostgresStore) GetUserByID(id string) (*models.User, error) {
	query := `SELECT id, name, email, phone, password_hash, role, city, gurukul, vedic_specialization, experience_years, languages, is_verified, rating, poojas_conducted, created_at, updated_at FROM users WHERE id = $1`
	row := p.db.QueryRow(query, id)

	var u models.User
	var langs string
	err := row.Scan(&u.ID, &u.Name, &u.Email, &u.Phone, &u.PasswordHash, &u.Role, &u.City, &u.Gurukul, &u.VedicSpecialization, &u.ExperienceYears, &langs, &u.IsVerified, &u.Rating, &u.PoojasConducted, &u.CreatedAt, &u.UpdatedAt)
	if err != nil {
		return nil, err
	}
	if langs != "" {
		u.Languages = strings.Split(langs, ",")
	}
	return &u, nil
}

func (p *PostgresStore) ListPandits(city, specialization string) ([]*models.User, error) {
	query := `SELECT id, name, email, phone, role, city, gurukul, vedic_specialization, experience_years, languages, is_verified, rating, poojas_conducted, created_at, updated_at FROM users WHERE role = 'PANDIT'`
	rows, err := p.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []*models.User
	for rows.Next() {
		var u models.User
		var langs string
		if err := rows.Scan(&u.ID, &u.Name, &u.Email, &u.Phone, &u.Role, &u.City, &u.Gurukul, &u.VedicSpecialization, &u.ExperienceYears, &langs, &u.IsVerified, &u.Rating, &u.PoojasConducted, &u.CreatedAt, &u.UpdatedAt); err == nil {
			if langs != "" {
				u.Languages = strings.Split(langs, ",")
			}
			list = append(list, &u)
		}
	}
	return list, nil
}

func (p *PostgresStore) ListPoojas(category, search string) ([]*models.PoojaService, error) {
	query := `SELECT id, title, subtitle, price_without_samagri, samagri_cost, price_with_samagri, duration, deity, category, samagri_included, image, samagri_kit, description FROM poojas`
	rows, err := p.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []*models.PoojaService
	for rows.Next() {
		var s models.PoojaService
		var kit string
		if err := rows.Scan(&s.ID, &s.Title, &s.Subtitle, &s.PriceWithoutSamagri, &s.SamagriCost, &s.PriceWithSamagri, &s.Duration, &s.Deity, &s.Category, &s.SamagriIncluded, &s.Image, &kit, &s.Description); err == nil {
			s.FormattedWithoutSamagri = fmt.Sprintf("₹%d", s.PriceWithoutSamagri)
			s.FormattedWithSamagri = fmt.Sprintf("₹%d", s.PriceWithSamagri)
			if kit != "" {
				s.SamagriKit = strings.Split(kit, "|")
			}
			list = append(list, &s)
		}
	}
	return list, nil
}

func (p *PostgresStore) GetPoojaByID(id string) (*models.PoojaService, error) {
	query := `SELECT id, title, subtitle, price_without_samagri, samagri_cost, price_with_samagri, duration, deity, category, samagri_included, image, samagri_kit, description FROM poojas WHERE id = $1`
	row := p.db.QueryRow(query, id)

	var s models.PoojaService
	var kit string
	err := row.Scan(&s.ID, &s.Title, &s.Subtitle, &s.PriceWithoutSamagri, &s.SamagriCost, &s.PriceWithSamagri, &s.Duration, &s.Deity, &s.Category, &s.SamagriIncluded, &s.Image, &kit, &s.Description)
	if err != nil {
		return nil, err
	}
	s.FormattedWithoutSamagri = fmt.Sprintf("₹%d", s.PriceWithoutSamagri)
	s.FormattedWithSamagri = fmt.Sprintf("₹%d", s.PriceWithSamagri)
	if kit != "" {
		s.SamagriKit = strings.Split(kit, "|")
	}
	return &s, nil
}

func (p *PostgresStore) CreateBooking(b *models.Booking) (*models.Booking, error) {
	b.ID = fmt.Sprintf("bkg_%d", time.Now().UnixNano())
	b.BookingCode = fmt.Sprintf("SS-%04d", time.Now().Unix()%10000)
	b.CreatedAt = time.Now()
	b.UpdatedAt = time.Now()
	if b.Status == "" {
		b.Status = models.StatusConfirmed
	}

	query := `
	INSERT INTO bookings (id, booking_code, client_id, client_name, client_phone, client_email, pooja_id, pooja_title, with_samagri, base_price, samagri_price, total_amount, booking_date, time_slot, city, occasion, special_notes, status, assigned_pandit_id, assigned_pandit_name, assigned_pandit_phone, created_at, updated_at)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
	`
	_, err := p.db.Exec(query, b.ID, b.BookingCode, b.ClientID, b.ClientName, b.ClientPhone, b.ClientEmail, b.PoojaID, b.PoojaTitle, b.WithSamagri, b.BasePrice, b.SamagriPrice, b.TotalAmount, b.BookingDate, b.TimeSlot, b.City, b.Occasion, b.SpecialNotes, b.Status, b.AssignedPanditID, b.AssignedPanditName, b.AssignedPanditPhone, b.CreatedAt, b.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return b, nil
}

func (p *PostgresStore) GetBookingsByClientID(clientID string) ([]*models.Booking, error) {
	query := `SELECT id, booking_code, client_id, client_name, client_phone, client_email, pooja_id, pooja_title, with_samagri, base_price, samagri_price, total_amount, booking_date, time_slot, city, occasion, special_notes, status, assigned_pandit_id, assigned_pandit_name, assigned_pandit_phone, created_at, updated_at FROM bookings WHERE client_id = $1 ORDER BY created_at DESC`
	rows, err := p.db.Query(query, clientID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []*models.Booking
	for rows.Next() {
		var b models.Booking
		if err := rows.Scan(&b.ID, &b.BookingCode, &b.ClientID, &b.ClientName, &b.ClientPhone, &b.ClientEmail, &b.PoojaID, &b.PoojaTitle, &b.WithSamagri, &b.BasePrice, &b.SamagriPrice, &b.TotalAmount, &b.BookingDate, &b.TimeSlot, &b.City, &b.Occasion, &b.SpecialNotes, &b.Status, &b.AssignedPanditID, &b.AssignedPanditName, &b.AssignedPanditPhone, &b.CreatedAt, &b.UpdatedAt); err == nil {
			list = append(list, &b)
		}
	}
	return list, nil
}

func (p *PostgresStore) GetBookingsForPandit(panditID, city string) ([]*models.Booking, error) {
	query := `SELECT id, booking_code, client_id, client_name, client_phone, client_email, pooja_id, pooja_title, with_samagri, base_price, samagri_price, total_amount, booking_date, time_slot, city, occasion, special_notes, status, assigned_pandit_id, assigned_pandit_name, assigned_pandit_phone, created_at, updated_at FROM bookings WHERE assigned_pandit_id = $1 OR (assigned_pandit_id = '' AND status = 'CONFIRMED') ORDER BY created_at DESC`
	rows, err := p.db.Query(query, panditID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []*models.Booking
	for rows.Next() {
		var b models.Booking
		if err := rows.Scan(&b.ID, &b.BookingCode, &b.ClientID, &b.ClientName, &b.ClientPhone, &b.ClientEmail, &b.PoojaID, &b.PoojaTitle, &b.WithSamagri, &b.BasePrice, &b.SamagriPrice, &b.TotalAmount, &b.BookingDate, &b.TimeSlot, &b.City, &b.Occasion, &b.SpecialNotes, &b.Status, &b.AssignedPanditID, &b.AssignedPanditName, &b.AssignedPanditPhone, &b.CreatedAt, &b.UpdatedAt); err == nil {
			list = append(list, &b)
		}
	}
	return list, nil
}

func (p *PostgresStore) GetAllBookings() ([]*models.Booking, error) {
	query := `SELECT id, booking_code, client_id, client_name, client_phone, client_email, pooja_id, pooja_title, with_samagri, base_price, samagri_price, total_amount, booking_date, time_slot, city, occasion, special_notes, status, assigned_pandit_id, assigned_pandit_name, assigned_pandit_phone, created_at, updated_at FROM bookings ORDER BY created_at DESC LIMIT 100`
	rows, err := p.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []*models.Booking
	for rows.Next() {
		var b models.Booking
		if err := rows.Scan(&b.ID, &b.BookingCode, &b.ClientID, &b.ClientName, &b.ClientPhone, &b.ClientEmail, &b.PoojaID, &b.PoojaTitle, &b.WithSamagri, &b.BasePrice, &b.SamagriPrice, &b.TotalAmount, &b.BookingDate, &b.TimeSlot, &b.City, &b.Occasion, &b.SpecialNotes, &b.Status, &b.AssignedPanditID, &b.AssignedPanditName, &b.AssignedPanditPhone, &b.CreatedAt, &b.UpdatedAt); err == nil {
			list = append(list, &b)
		}
	}
	return list, nil
}

func (p *PostgresStore) GetBookingByID(id string) (*models.Booking, error) {
	query := `SELECT id, booking_code, client_id, client_name, client_phone, client_email, pooja_id, pooja_title, with_samagri, base_price, samagri_price, total_amount, booking_date, time_slot, city, occasion, special_notes, status, assigned_pandit_id, assigned_pandit_name, assigned_pandit_phone, created_at, updated_at FROM bookings WHERE id = $1`
	row := p.db.QueryRow(query, id)

	var b models.Booking
	err := row.Scan(&b.ID, &b.BookingCode, &b.ClientID, &b.ClientName, &b.ClientPhone, &b.ClientEmail, &b.PoojaID, &b.PoojaTitle, &b.WithSamagri, &b.BasePrice, &b.SamagriPrice, &b.TotalAmount, &b.BookingDate, &b.TimeSlot, &b.City, &b.Occasion, &b.SpecialNotes, &b.Status, &b.AssignedPanditID, &b.AssignedPanditName, &b.AssignedPanditPhone, &b.CreatedAt, &b.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &b, nil
}

func (p *PostgresStore) UpdateBookingStatus(id, status, panditID, panditName, panditPhone string) (*models.Booking, error) {
	query := `
	UPDATE bookings
	SET status = $1, assigned_pandit_id = COALESCE(NULLIF($2, ''), assigned_pandit_id), assigned_pandit_name = COALESCE(NULLIF($3, ''), assigned_pandit_name), assigned_pandit_phone = COALESCE(NULLIF($4, ''), assigned_pandit_phone), updated_at = CURRENT_TIMESTAMP
	WHERE id = $5
	RETURNING id, booking_code, client_id, client_name, client_phone, client_email, pooja_id, pooja_title, with_samagri, base_price, samagri_price, total_amount, booking_date, time_slot, city, occasion, special_notes, status, assigned_pandit_id, assigned_pandit_name, assigned_pandit_phone, created_at, updated_at
	`
	row := p.db.QueryRow(query, status, panditID, panditName, panditPhone, id)
	var b models.Booking
	err := row.Scan(&b.ID, &b.BookingCode, &b.ClientID, &b.ClientName, &b.ClientPhone, &b.ClientEmail, &b.PoojaID, &b.PoojaTitle, &b.WithSamagri, &b.BasePrice, &b.SamagriPrice, &b.TotalAmount, &b.BookingDate, &b.TimeSlot, &b.City, &b.Occasion, &b.SpecialNotes, &b.Status, &b.AssignedPanditID, &b.AssignedPanditName, &b.AssignedPanditPhone, &b.CreatedAt, &b.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &b, nil
}

func (p *PostgresStore) GetStats() (*models.StatsResponse, error) {
	var totalB, totalP, totalD int
	_ = p.db.QueryRow(`SELECT COUNT(*) FROM bookings`).Scan(&totalB)
	_ = p.db.QueryRow(`SELECT COUNT(*) FROM users WHERE role = 'PANDIT'`).Scan(&totalP)
	_ = p.db.QueryRow(`SELECT COUNT(*) FROM users WHERE role = 'CLIENT'`).Scan(&totalD)

	return &models.StatsResponse{
		TotalBookings:    totalB + 10450,
		TotalPandits:     totalP + 520,
		TotalDevotees:    totalD + 100000,
		CitiesCount:      500,
		PoojaCatalogSize: 6,
	}, nil
}

// --- MemoryStore Implementation ---

func NewMemoryStore() *MemoryStore {
	return &MemoryStore{
		users:    make(map[string]*models.User),
		poojas:   make(map[string]*models.PoojaService),
		bookings: make(map[string]*models.Booking),
	}
}

func (m *MemoryStore) IsPostgres() bool {
	return false
}

func (m *MemoryStore) CreateUser(u *models.User) (*models.User, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	for _, existing := range m.users {
		if strings.EqualFold(existing.Email, u.Email) {
			return nil, fmt.Errorf("user with email %s already exists", u.Email)
		}
	}

	u.ID = fmt.Sprintf("usr_%d", time.Now().UnixNano())
	u.CreatedAt = time.Now()
	u.UpdatedAt = time.Now()
	m.users[u.ID] = u
	return u, nil
}

func (m *MemoryStore) GetUserByEmail(email string) (*models.User, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	for _, u := range m.users {
		if strings.EqualFold(u.Email, email) {
			return u, nil
		}
	}
	return nil, fmt.Errorf("user not found")
}

func (m *MemoryStore) GetUserByID(id string) (*models.User, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	u, exists := m.users[id]
	if !exists {
		return nil, fmt.Errorf("user not found")
	}
	return u, nil
}

func (m *MemoryStore) ListPandits(city, specialization string) ([]*models.User, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	var list []*models.User
	for _, u := range m.users {
		if u.Role == models.RolePandit {
			list = append(list, u)
		}
	}
	return list, nil
}

func (m *MemoryStore) ListPoojas(category, search string) ([]*models.PoojaService, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	var list []*models.PoojaService
	for _, p := range m.poojas {
		if category != "" && category != "ALL" && !strings.EqualFold(p.Category, category) {
			continue
		}
		if search != "" {
			term := strings.ToLower(search)
			if !strings.Contains(strings.ToLower(p.Title), term) && !strings.Contains(strings.ToLower(p.Deity), term) {
				continue
			}
		}
		list = append(list, p)
	}
	return list, nil
}

func (m *MemoryStore) GetPoojaByID(id string) (*models.PoojaService, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	p, exists := m.poojas[id]
	if !exists {
		// Try case-insensitive matching
		for _, item := range m.poojas {
			if strings.EqualFold(item.ID, id) || strings.EqualFold(item.Title, id) {
				return item, nil
			}
		}
		return nil, fmt.Errorf("pooja not found")
	}
	return p, nil
}

func (m *MemoryStore) CreateBooking(b *models.Booking) (*models.Booking, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	b.ID = fmt.Sprintf("bkg_%d", time.Now().UnixNano())
	b.BookingCode = fmt.Sprintf("SS-%04d", (time.Now().Unix()%9000)+1000)
	b.CreatedAt = time.Now()
	b.UpdatedAt = time.Now()
	if b.Status == "" {
		b.Status = models.StatusConfirmed
	}
	m.bookings[b.ID] = b
	return b, nil
}

func (m *MemoryStore) GetBookingsByClientID(clientID string) ([]*models.Booking, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	var list []*models.Booking
	for _, b := range m.bookings {
		if b.ClientID == clientID || clientID == "" {
			list = append(list, b)
		}
	}
	return list, nil
}

func (m *MemoryStore) GetBookingsForPandit(panditID, city string) ([]*models.Booking, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	var list []*models.Booking
	for _, b := range m.bookings {
		// Include assigned to this pandit OR available unassigned bookings
		if b.AssignedPanditID == panditID || (b.AssignedPanditID == "" && b.Status == models.StatusConfirmed) {
			list = append(list, b)
		}
	}
	return list, nil
}

func (m *MemoryStore) GetAllBookings() ([]*models.Booking, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	var list []*models.Booking
	for _, b := range m.bookings {
		list = append(list, b)
	}
	return list, nil
}

func (m *MemoryStore) GetBookingByID(id string) (*models.Booking, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	b, exists := m.bookings[id]
	if !exists {
		return nil, fmt.Errorf("booking not found")
	}
	return b, nil
}

func (m *MemoryStore) UpdateBookingStatus(id, status, panditID, panditName, panditPhone string) (*models.Booking, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	b, exists := m.bookings[id]
	if !exists {
		return nil, fmt.Errorf("booking not found")
	}

	b.Status = status
	if panditID != "" {
		b.AssignedPanditID = panditID
	}
	if panditName != "" {
		b.AssignedPanditName = panditName
	}
	if panditPhone != "" {
		b.AssignedPanditPhone = panditPhone
	}
	b.UpdatedAt = time.Now()
	return b, nil
}

func (m *MemoryStore) GetStats() (*models.StatsResponse, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	return &models.StatsResponse{
		TotalBookings:    len(m.bookings) + 10450,
		TotalPandits:     4,
		TotalDevotees:    100000,
		CitiesCount:      500,
		PoojaCatalogSize: len(m.poojas),
	}, nil
}

// SeedDefaults populates master poojas, verified pandits and demo logins
func (m *MemoryStore) SeedDefaults() {
	passHash, _ := bcrypt.GenerateFromPassword([]byte("shree108"), bcrypt.DefaultCost)
	hashedPassword := string(passHash)

	// 1. Seed Demo Users
	clientUser := &models.User{
		ID:           "usr_client_demo",
		Name:         "Rameshwar Devotee",
		Email:        "devotee@shraddhasetu.com",
		Phone:        "+91 98765 43210",
		PasswordHash: hashedPassword,
		Role:         models.RoleClient,
		City:         "Varanasi",
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}
	m.users[clientUser.ID] = clientUser

	adminUser := &models.User{
		ID:           "usr_admin_demo",
		Name:         "Mandir Samiti Master Admin",
		Email:        "admin@shraddhasetu.com",
		Phone:        "+91 12345 67890",
		PasswordHash: hashedPassword,
		Role:         models.RoleAdmin,
		City:         "Varanasi",
		IsVerified:   true,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}
	m.users[adminUser.ID] = adminUser

	panditUser := &models.User{
		ID:                  "usr_pandit_demo",
		Name:                "Acharya Vidyadhar Shastri",
		Email:               "pandit@shraddhasetu.com",
		Phone:               "+91 98234 56789",
		PasswordHash:        hashedPassword,
		Role:                models.RolePandit,
		City:                "Varanasi / Delhi NCR",
		Gurukul:             "Sampurnanand Sanskrit University, Varanasi",
		VedicSpecialization: "Navagraha Shanti, Rudrabhishek & Griha Pravesh",
		ExperienceYears:     18,
		Languages:           []string{"Hindi", "Sanskrit", "Bhojpuri"},
		IsVerified:          true,
		Rating:              4.95,
		PoojasConducted:     1420,
		CreatedAt:           time.Now(),
		UpdatedAt:           time.Now(),
	}
	m.users[panditUser.ID] = panditUser

	// Additional Pandits
	m.users["usr_p2"] = &models.User{
		ID:                  "usr_p2",
		Name:                "Pt. Rameshwar Dwivedi",
		Email:               "rameshwar@shraddhasetu.com",
		Phone:               "+91 98111 22233",
		Role:                models.RolePandit,
		City:                "Mumbai / Pune",
		Gurukul:             "Maharshi Sandipani Rashtriya Veda Vidya Pratishthan",
		VedicSpecialization: "Maha Mrityunjaya Jaap & Vastu Shanti",
		ExperienceYears:     14,
		Languages:           []string{"Hindi", "Sanskrit", "Marathi"},
		IsVerified:          true,
		Rating:              4.92,
		PoojasConducted:     980,
	}

	m.users["usr_p3"] = &models.User{
		ID:                  "usr_p3",
		Name:                "Pt. Devnarayan Joshi",
		Email:               "devnarayan@shraddhasetu.com",
		Phone:               "+91 98444 55566",
		Role:                models.RolePandit,
		City:                "Ahmedabad / Jaipur",
		Gurukul:             "Kashi Vedic Math, Haridwar",
		VedicSpecialization: "Satyanarayan Katha, Lakshmi Pujan & Chandi Path",
		ExperienceYears:     12,
		Languages:           []string{"Hindi", "Sanskrit", "Gujarati"},
		IsVerified:          true,
		Rating:              4.98,
		PoojasConducted:     850,
	}

	// 2. Seed Poojas
	poojasList := []*models.PoojaService{
		{
			ID:                     "grah-shanti",
			Title:                  "Grah Shanti Pooja",
			Subtitle:               "For peace & domestic harmony",
			PriceWithoutSamagri:    1500,
			SamagriCost:            600,
			PriceWithSamagri:       2100,
			Duration:               "2 - 3 Hours",
			Deity:                  "Lord Ganesha & Navagraha",
			Category:               "DOSHA SHANTI",
			SamagriIncluded:        true,
			Image:                  "/images/pooja_grah_shanti.png",
			SamagriKit:             []string{"Pure Desi Cow Ghee (500g)", "Navagraha Havan Samidha Sticks", "Gangajal & Gulab Jal", "Roli, Kumkum, Chandan, Akshat", "Pooja Supari, Clove, Cardamom", "Dhoop Cones & Pure Bhimseni Camphor"},
			Description:            "Brings peace, harmonizes domestic energies, and pacifies planetary obstacles from your household.",
		},
		{
			ID:                     "maha-mrityunjaya",
			Title:                  "Maha Mrityunjaya Pooja",
			Subtitle:               "For health & protection",
			PriceWithoutSamagri:    1800,
			SamagriCost:            700,
			PriceWithSamagri:       2500,
			Duration:               "3 - 4 Hours",
			Deity:                  "Lord Shiva",
			Category:               "HEALTH",
			SamagriIncluded:        true,
			Image:                  "/images/pooja_mrityunjaya.png",
			SamagriKit:             []string{"Pure Belpatra & Dhatura Kit", "Bhasma & Vibhuti", "Panchamrit Samagri", "Maha Mrityunjaya Havan Herbs", "Black Sesame (Kala Til) & Jau", "Rudraksha Japamala for Sankalp"},
			Description:            "Powerful Vedic mantra jaap and havan dedicated to Mahadev for health, protection, and overcoming distress.",
		},
		{
			ID:                     "lakshmi-pooja",
			Title:                  "Lakshmi Pooja",
			Subtitle:               "For wealth & prosperity",
			PriceWithoutSamagri:    1300,
			SamagriCost:            500,
			PriceWithSamagri:       1800,
			Duration:               "2 Hours",
			Deity:                  "Mata Lakshmi & Lord Kuber",
			Category:               "WEALTH",
			SamagriIncluded:        true,
			Image:                  "/images/pooja_lakshmi.png",
			SamagriKit:             []string{"Kamal Gatta & Lotus Seeds", "Kuber Kauri & Gomti Chakra", "Pure Desi Ghee & Cotton Wicks", "Rakt Chandan & Ashtagandha", "Dry Fruits & Prasad Bhog Kit", "Yellow Cloth & Mauli Dhaga"},
			Description:            "Spiritual invocations for wealth, financial stability, and auspicious abundance in home or business.",
		},
		{
			ID:                     "satyanarayan-katha",
			Title:                  "Satyanarayan Katha",
			Subtitle:               "For happiness & well-being",
			PriceWithoutSamagri:    1600,
			SamagriCost:            700,
			PriceWithSamagri:       2300,
			Duration:               "2.5 Hours",
			Deity:                  "Lord Vishnu (Satyanarayan)",
			Category:               "HAVAN",
			SamagriIncluded:        true,
			Image:                  "/images/pooja_satyanarayan.png",
			SamagriKit:             []string{"Panchamrit & Tulsi Patra Kit", "Panjiri Bhog & Prasad Samagri", "Banana Leaves & Wooden Chowki Cloth", "Havan Wood (Mango Wood Samidha)", "Janeu Pairs & Supari", "Pure Camphor & Deepam Oil"},
			Description:            "Sacred chapter-wise katha recitation of Bhagwan Satyanarayan followed by divine aarti and prasad.",
		},
		{
			ID:                     "navagraha-shanti",
			Title:                  "Navagraha Shanti",
			Subtitle:               "For planetary balance",
			PriceWithoutSamagri:    2200,
			SamagriCost:            900,
			PriceWithSamagri:       3100,
			Duration:               "3 Hours",
			Deity:                  "Nine Planetary Deities (Navagraha)",
			Category:               "DOSHA SHANTI",
			SamagriIncluded:        true,
			Image:                  "/images/pooja_navagraha.png",
			SamagriKit:             []string{"9 Planetary Grain Samagri (Navadhanya)", "9 Colored Clothes for Navagraha", "Navagraha Yantra & Havan Herb Blend", "Pure Ghee & Guggal", "Kusha Grass & Janeu", "Chandan & Til"},
			Description:            "Pacifies adverse planetary transits, strengthens beneficial planets, and promotes overall peace and clarity.",
		},
		{
			ID:                     "griha-pravesh",
			Title:                  "Griha Pravesh Pooja",
			Subtitle:               "For auspicious new home",
			PriceWithoutSamagri:    2500,
			SamagriCost:            1000,
			PriceWithSamagri:       3500,
			Duration:               "4 Hours",
			Deity:                  "Vastu Purush & Ganesha",
			Category:               "VASTU",
			SamagriIncluded:        true,
			Image:                  "/images/pooja_griha_pravesh.png",
			SamagriKit:             []string{"Copper Kalash with Nariyal & Mango Leaves", "Vastu Yantra & Toran (Bandanwar)", "Complete Havan Kund Wood & Herbs", "Cow Dung Cakes & Hawan Samidha", "Pure Desi Ghee (1kg)", "Roli, Chawal, Haldi, Supari, Janeu"},
			Description:            "Grand housewarming rituals including Vastu Shanti, Gauri-Ganesh Pujan, and Navagraha Havan.",
		},
	}

	for _, p := range poojasList {
		p.FormattedWithoutSamagri = fmt.Sprintf("₹%d", p.PriceWithoutSamagri)
		p.FormattedWithSamagri = fmt.Sprintf("₹%d", p.PriceWithSamagri)
		m.poojas[p.ID] = p
	}

	// 3. Seed Sample Bookings
	demoBkg1 := &models.Booking{
		ID:                  "bkg_demo_1",
		BookingCode:         "SS-1081",
		ClientID:            clientUser.ID,
		ClientName:          clientUser.Name,
		ClientPhone:         clientUser.Phone,
		ClientEmail:         clientUser.Email,
		PoojaID:             "griha-pravesh",
		PoojaTitle:          "Griha Pravesh Pooja",
		WithSamagri:         true,
		BasePrice:           2500,
		SamagriPrice:        1000,
		TotalAmount:         3500,
		BookingDate:         time.Now().Add(48 * time.Hour).Format("2006-01-02"),
		TimeSlot:            "Morning Auspicious Muhurat (08:30 AM)",
		City:                "Varanasi",
		Occasion:            "Housewarming",
		SpecialNotes:        "Kashyapa Gotra Sankalp. Family of four.",
		Status:              models.StatusConfirmed,
		AssignedPanditID:    panditUser.ID,
		AssignedPanditName:  panditUser.Name,
		AssignedPanditPhone: panditUser.Phone,
		CreatedAt:           time.Now().Add(-2 * time.Hour),
		UpdatedAt:           time.Now(),
	}
	m.bookings[demoBkg1.ID] = demoBkg1

	demoBkg2 := &models.Booking{
		ID:                  "bkg_demo_2",
		BookingCode:         "SS-1082",
		ClientID:            clientUser.ID,
		ClientName:          clientUser.Name,
		ClientPhone:         clientUser.Phone,
		ClientEmail:         clientUser.Email,
		PoojaID:             "maha-mrityunjaya",
		PoojaTitle:          "Maha Mrityunjaya Pooja",
		WithSamagri:         false, // Pandit Only
		BasePrice:           1800,
		SamagriPrice:        0,
		TotalAmount:         1800,
		BookingDate:         time.Now().Add(5 * 24 * time.Hour).Format("2006-01-02"),
		TimeSlot:            "Evening Pradosh Kaal (05:30 PM)",
		City:                "Delhi NCR",
		Occasion:            "Health & Well-being",
		SpecialNotes:        "Devotee will arrange own samagri as per checklist.",
		Status:              models.StatusConfirmed,
		CreatedAt:           time.Now().Add(-1 * time.Hour),
		UpdatedAt:           time.Now(),
	}
	m.bookings[demoBkg2.ID] = demoBkg2
}
