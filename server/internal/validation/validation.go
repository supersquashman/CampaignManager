// Package validation carries per-field problems from services to HTTP handlers.
package validation

import "fmt"

// Problems maps a JSON field name to a human-readable message.
type Problems map[string]string

func (problems Problems) Error() string {
	return fmt.Sprintf("%d invalid field(s)", len(problems))
}
