package missions

import (
	"net/http"

	"campaign/internal/httpx"
)

type Handler struct{ svc *Service }

func NewHandler(s *Service) *Handler { return &Handler{svc: s} }

func (h *Handler) Register(mux *http.ServeMux) {
	mux.HandleFunc("GET /api/missions/{status}", h.list)
}

func (h *Handler) list(w http.ResponseWriter, r *http.Request) {
	st, ok := ParseStatus(r.PathValue("status"))
	if !ok {
		httpx.Error(w, http.StatusNotFound, "unknown mission status")
		return
	}
	items, err := h.svc.List(r.Context(), st)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not load missions")
		return
	}
	httpx.JSON(w, http.StatusOK, items)
}
