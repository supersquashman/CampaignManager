package characters

import (
	"strconv"
	"strings"

	"campaign/internal/validation"
)

type Kind string
type CharacterType string

const (
	// PC            Kind          = "pc"
	// NPC           Kind          = "npc"
	// Faction       Kind          = "faction"
	// Minion        Kind          = "minion"
	TypePlayer    CharacterType = "pc"
	TypeNonPlayer CharacterType = "npc"
	TypeMinion    CharacterType = "minion"
)

// func ParseKind(s string) (CharacterType, bool) {
// 	switch k := Kind(s); k {
// 	case PC, NPC, Faction:
// 		return k, true
// 	}
// 	return "", false
// }

func ParseType(raw string) (CharacterType, bool) {
	switch kind := CharacterType(raw); kind {
	case TypePlayer, TypeNonPlayer, TypeMinion:
		return kind, true
	}
	return "", false
}

// type CharacterLevels struct {
// 	Class string
// 	Level int
// }

type Character struct {
	ID            int            `json:"id"`
	Name          string         `json:"name"`
	ClassLevels   map[string]int `json:"ClassLevels"`
	CharacterType CharacterType  `json:"characterType"`
	// PreferredMissions string `json:"PreferredMissions"`
	// PartyRoles        string `json:"PartyRoles"`
	PreferredMissions map[string]any `json:"PreferredMissions"`
	PartyRoles        map[string]any `json:"PartyRoles"`
	Hometown          string         `json:"hometown,omitempty"`
	StartingTown      string         `json:"starting_town,omitempty"`
}

// validate trims input in place and reports per-field problems.
func (character *Character) validate() error {
	problems := validation.Problems{}

	character.Name = strings.TrimSpace(character.Name)
	if character.Name == "" {
		problems["name"] = "Name is required."
	}
	if _, recognized := ParseType(string(character.CharacterType)); !recognized {
		problems["characterType"] = "Choose pc, npc or minion."
	}

	if len(character.ClassLevels) == 0 {
		problems["classLevels"] = "Add at least one class and level."
	}
	for className, level := range character.ClassLevels {
		if strings.TrimSpace(className) == "" || level < 1 {
			problems["classLevels"] = "Each class needs a name and a level of 1 or more."
			break
		}
	}

	for rank := range character.PreferredMissions {
		if number, parseFailure := strconv.Atoi(rank); parseFailure != nil || number < 1 {
			problems["preferredMissions"] = "Rankings must be whole numbers starting at 1."
			break
		}
	}

	if len(problems) > 0 {
		return problems
	}
	return nil
}
