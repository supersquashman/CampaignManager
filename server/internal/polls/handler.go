package polls

import (
	"encoding/json"
	"errors"
	"net/http"

	"campaign/internal/httpx"
)

type Handler struct{ svc *Service }

func NewHandler(s *Service) *Handler { return &Handler{svc: s} }

func (h *Handler) Register(mux *http.ServeMux) {
	mux.HandleFunc("GET /api/polls/{name}", h.list)
	mux.HandleFunc("POST /api/polls/{name}", h.add)
}

func (h *Handler) list(w http.ResponseWriter, r *http.Request) {
	name := r.PathValue("name")
	if name != MissionInterest {
		httpx.Error(w, http.StatusNotFound, "unknown poll")
		return
	}
	items, err := h.svc.List(r.Context(), name)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not load poll")
		return
	}
	httpx.JSON(w, http.StatusOK, items)
}

func (h *Handler) add(w http.ResponseWriter, r *http.Request) {
	name := r.PathValue("name")
	if name != MissionInterest {
		httpx.Error(w, http.StatusNotFound, "unknown poll")
		return
	}
	var in Response
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid JSON body")
		return
	}
	out, err := h.svc.Add(r.Context(), name, in)
	if errors.Is(err, ErrInvalid) {
		httpx.Error(w, http.StatusUnprocessableEntity, err.Error())
		return
	}
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not save response")
		return
	}
	httpx.JSON(w, http.StatusCreated, out)
}
