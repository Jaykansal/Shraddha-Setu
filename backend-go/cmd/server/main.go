package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"shraddhasetu-backend/internal/config"
	"shraddhasetu-backend/internal/database"
	"shraddhasetu-backend/internal/handlers"
	"shraddhasetu-backend/internal/middleware"
)

func main() {
	log.Println("ॐ नमः शिवाय | Starting ShraddhaSetu Backend Service (Golang + PostgreSQL)...")

	// 1. Load Config
	cfg := config.Load()

	// 2. Initialize Database Store (PostgreSQL with in-memory fallback)
	store, err := database.InitDB(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Fatal: Database initialization failed: %v", err)
	}

	// 3. Initialize Handlers
	authHandler := handlers.NewAuthHandler(cfg, store)
	poojaHandler := handlers.NewPoojaHandler(store)
	panditHandler := handlers.NewPanditHandler(store)
	bookingHandler := handlers.NewBookingHandler(store)
	statsHandler := handlers.NewStatsHandler(store)

	// 4. Setup Routes
	mux := http.NewServeMux()

	// Health & Stats
	mux.HandleFunc("/health", statsHandler.Health)
	mux.HandleFunc("/api/health", statsHandler.Health)
	mux.HandleFunc("/api/v1/stats", statsHandler.GetStats)

	// Auth Endpoints
	mux.HandleFunc("/api/v1/auth/register", authHandler.Register)
	mux.HandleFunc("/api/v1/auth/login", authHandler.Login)
	mux.HandleFunc("/api/v1/auth/me", middleware.AuthMiddleware(cfg, authHandler.Me))

	// Backward Compatibility with existing frontend endpoints
	mux.HandleFunc("/api/auth/register", authHandler.Register)
	mux.HandleFunc("/api/auth/login", authHandler.Login)

	// Pooja Endpoints
	mux.HandleFunc("/api/v1/poojas", poojaHandler.List)
	mux.HandleFunc("/api/v1/poojas/", poojaHandler.GetByID)
	mux.HandleFunc("/api/poojas", poojaHandler.List)

	// Pandit Endpoints
	mux.HandleFunc("/api/v1/pandits", panditHandler.List)
	mux.HandleFunc("/api/v1/pandits/", panditHandler.GetByID)
	mux.HandleFunc("/api/pandits", panditHandler.List)

	// Booking Endpoints
	mux.HandleFunc("/api/v1/bookings", bookingHandler.HandleBookings)
	mux.HandleFunc("/api/v1/bookings/", func(w http.ResponseWriter, r *http.Request) {
		if len(r.URL.Path) > len("/api/v1/bookings/") && r.URL.Path[len(r.URL.Path)-7:] == "/status" {
			bookingHandler.UpdateStatus(w, r)
			return
		}
		bookingHandler.HandleBookings(w, r)
	})
	mux.HandleFunc("/api/bookings", bookingHandler.HandleBookings)

	// Wrap root with CORS and Logger
	handler := middleware.CORS(cfg, middleware.Logger(mux))

	server := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      handler,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Start server in background goroutine
	go func() {
		fmt.Printf("🚀 ShraddhaSetu Golang API listening on http://localhost:%s\n", cfg.Port)
		if store.IsPostgres() {
			fmt.Println("🐘 PostgreSQL backend: Active and Connected.")
		} else {
			fmt.Println("💡 In-Memory Seeded Store: Active (Set DATABASE_URL to connect to live PostgreSQL).")
		}
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server Listen error: %v", err)
		}
	}()

	// Graceful shutdown on SIGINT / SIGTERM
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down server gracefully...")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}
	log.Println("Server exited cleanly.")
}
