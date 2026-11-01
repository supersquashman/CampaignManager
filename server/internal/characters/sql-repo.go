package characters

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
)

type SqlRepo struct{ db *sql.DB }

func NewSqlRepo(database *sql.DB) *SqlRepo { return &SqlRepo{db: database} }

func (repository *SqlRepo) Create(requestContext context.Context, character Character) (Character, error) {
	classLevels, failure := encodeObject(character.ClassLevels)
	if failure != nil {
		return Character{}, fmt.Errorf("encode class levels: %w", failure)
	}
	preferredMissions, failure := encodeObject(character.PreferredMissions)
	if failure != nil {
		return Character{}, fmt.Errorf("encode preferred missions: %w", failure)
	}
	partyRoles, failure := encodeObject(character.PartyRoles)
	if failure != nil {
		return Character{}, fmt.Errorf("encode party roles: %w", failure)
	}

	failure = repository.db.QueryRowContext(requestContext,
		`INSERT INTO characters
                (name, character_type, class_levels, preferred_mission_types,
                 roles, hometown, starting_town)
         VALUES ($1, $2, $3::jsonb, $4::jsonb, $5::jsonb, $6, $7)
         RETURNING id`,
		character.Name, string(character.CharacterType), classLevels, preferredMissions,
		partyRoles, character.Hometown, character.StartingTown,
	).Scan(&character.ID)
	if failure != nil {
		return Character{}, fmt.Errorf("insert character: %w", failure)
	}
	return character, nil
}

// encodeObject marshals a map to a JSON object string. A nil map becomes "{}"
// instead of "null", which matters for NOT NULL JSONB columns.
func encodeObject(value any) (string, error) {
	encoded, failure := json.Marshal(value)
	if failure != nil {
		return "", failure
	}
	if string(encoded) == "null" {
		return "{}", nil
	}
	return string(encoded), nil
}
