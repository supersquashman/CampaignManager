package missions

type Status string

const (
	Open      Status = "open"
	Completed Status = "completed"
)

func ParseStatus(s string) (Status, bool) {
	switch st := Status(s); st {
	case Open, Completed:
		return st, true
	}
	return "", false
}

type Mission struct {
	ID      int    `json:"id"`
	Title   string `json:"title"`
	Summary string `json:"summary"`
	Status  Status `json:"status"`
}
