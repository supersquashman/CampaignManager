package httpx

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"

	"campaign/internal/validation"
)

// DecodeJSON reads a size-limited body and rejects unknown fields.
func DecodeJSON(writer http.ResponseWriter, request *http.Request, target any) error {
	request.Body = http.MaxBytesReader(writer, request.Body, 1<<20)
	decoder := json.NewDecoder(request.Body)
	decoder.DisallowUnknownFields()
	return decoder.Decode(target)
}

// WriteFailure answers 422 with per-field messages for validation problems, otherwise 500.
func WriteFailure(writer http.ResponseWriter, failure error) {
	var problems validation.Problems
	if errors.As(failure, &problems) {
		JSON(writer, http.StatusUnprocessableEntity, map[string]any{"errors": problems})
		return
	}
	log.Printf("request failed: %v", failure)
	Error(writer, http.StatusInternalServerError, "internal error")
}
