package characters

type Kind string

const (
	PCs      Kind = "pcs"
	NPCs     Kind = "npcs"
	Factions Kind = "factions"
)

func ParseKind(s string) (Kind, bool) {
	switch k := Kind(s); k {
	case PCs, NPCs, Factions:
		return k, true
	}
	return "", false
}

type Character struct {
	ID      int    `json:"id"`
	Name    string `json:"name"`
	Kind    Kind   `json:"kind"`
	Summary string `json:"summary"`
}
