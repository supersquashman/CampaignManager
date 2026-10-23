// Package server wires feature packages into one http.Handler.
package server

import (
	"database/sql"
	"net/http"

	"campaign/internal/characters"
	"campaign/internal/config"
	"campaign/internal/httpx"
	"campaign/internal/missions"
	"campaign/internal/polls"
	"campaign/internal/ui"
)

func New(cfg config.Config, db *sql.DB) http.Handler {
	_ = cfg // pass into feature constructors as needed (DB URL, etc.)

	mux := http.NewServeMux()

	missions.NewHandler(missions.NewService(missions.NewMemoryRepo())).Register(mux)
	characters.NewHandler(characters.NewService(characters.NewSqlRepo(db))).Register(mux)
	polls.NewHandler(polls.NewService(polls.NewMemoryRepo())).Register(mux)

	// Unmatched /api paths return JSON 404 instead of the SPA's index.html.
	mux.HandleFunc("/api/", func(w http.ResponseWriter, r *http.Request) {
		httpx.Error(w, http.StatusNotFound, "not found")
	})
	mux.Handle("/", ui.Handler())

	return httpx.Chain(mux, httpx.Recover, httpx.Logging)
}
