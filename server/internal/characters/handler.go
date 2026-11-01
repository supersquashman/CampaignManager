package characters

import (
	"net/http"

	"campaign/internal/httpx"
)

type Handler struct{ service *Service }

func NewHandler(service *Service) *Handler { return &Handler{service: service} }

func (handler *Handler) Register(router *http.ServeMux) {
	router.HandleFunc("GET /api/characters/{characterType}", handler.list)
	router.HandleFunc("POST /api/characters", handler.create)
}

//	func (h *Handler) list(w http.ResponseWriter, r *http.Request) {
//		k, ok := ParseKind(r.PathValue("kind"))
//		if !ok {
//			httpx.Error(w, http.StatusNotFound, "unknown character kind")
//			return
//		}
//		items, err := h.service.List(r.Context(), k)
//		if err != nil {
//			httpx.Error(w, http.StatusInternalServerError, "could not load characters")
//			return
//		}
//		httpx.JSON(w, http.StatusOK, items)
//	}
func (handler *Handler) list(writer http.ResponseWriter, request *http.Request) {
	kind, recognized := ParseType(request.PathValue("characterType"))
	if !recognized {
		httpx.Error(writer, http.StatusNotFound, "unknown character type")
		return
	}
	items, failure := handler.service.List(request.Context(), kind)
	if failure != nil {
		httpx.WriteFailure(writer, failure)
		return
	}
	httpx.JSON(writer, http.StatusOK, items)
}

func (handler *Handler) create(writer http.ResponseWriter, request *http.Request) {
	var draft Character
	if failure := httpx.DecodeJSON(writer, request, &draft); failure != nil {
		httpx.Error(writer, http.StatusBadRequest, "invalid JSON body")
		return
	}
	created, failure := handler.service.Create(request.Context(), draft)
	if failure != nil {
		httpx.WriteFailure(writer, failure)
		return
	}
	httpx.JSON(writer, http.StatusCreated, created)
}
