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

// type CharacterLevels struct {
// 	Class string
// 	Level int
// }

type Character struct {
	ID                int    `json:"id"`
	Name              string `json:"name"`
	ClassLevels       string `json:"ClassLevels"`
	PreferredMissions string `json:"PreferredMissions"`
	PartyRoles        string `json:"PartyRoles"`
}
