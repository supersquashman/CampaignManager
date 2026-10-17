package characters

import (
	"net/http"

	"campaign/internal/httpx"
)

type Handler struct{ svc *Service }

func NewHandler(s *Service) *Handler { return &Handler{svc: s} }

func (h *Handler) Register(mux *http.ServeMux) {
	mux.HandleFunc("GET /api/characters/{kind}", h.list)
}

func (h *Handler) list(w http.ResponseWriter, r *http.Request) {
	k, ok := ParseKind(r.PathValue("kind"))
	if !ok {
		httpx.Error(w, http.StatusNotFound, "unknown character kind")
		return
	}
	items, err := h.svc.List(r.Context(), k)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not load characters")
		return
	}
	httpx.JSON(w, http.StatusOK, items)
}
