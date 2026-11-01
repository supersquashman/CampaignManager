package characters

import (
	"context"
	"encoding/json"
	"fmt"
	"sync"
)

type Repository interface {
	ListByType(requestContext context.Context, cType CharacterType) ([]Character, error)
	Create(requestContext context.Context, character Character) (Character, error)
}

type Service struct{ repository Repository }

func NewService(r Repository) *Service { return &Service{repository: r} }

func (service *Service) List(requestContext context.Context, cType CharacterType) ([]Character, error) {
	return service.repository.ListByType(requestContext, cType)
}

func (service *Service) Create(requestContext context.Context, character Character) (Character, error) {
	if failure := character.validate(); failure != nil {
		return Character{}, failure
	}
	return service.repository.Create(requestContext, character)
}

type MemoryRepo struct {
	// mu    sync.RWMutex
	// items []Character
	lock   sync.RWMutex
	nextID int
	items  []Character
}

// type SqlRepo struct {
// 	db *sql.DB
// }

// Create implements [Repository].
// func (repo *SqlRepo) Create(requestContext context.Context, character Character) (Character, error) {
// 	panic("unimplemented")
// }

func NewMemoryRepo() *MemoryRepo {
	return &MemoryRepo{items: []Character{
		// {ID: 1, Name: "Wren Halloway", Kind: PCs, Summary: "Disgraced cartographer."},
		// {ID: 2, Name: "Brother Tuck", Kind: PCs, Summary: "Travelling surgeon."},
		// {ID: 3, Name: "Captain Ilse Vorn", Kind: NPCs, Summary: "Harbor watch commander."},
		// {ID: 4, Name: "The Ledger Guild", Kind: Factions, Summary: "Controls trade records along the coast."},
	}}
}

// func NewSqlRepo(db *sql.DB) *SqlRepo {
// 	return &SqlRepo{db: db}
// }

func (repo *SqlRepo) ListByType(ctx context.Context, cType CharacterType) ([]Character, error) {
	rows, err := repo.db.QueryContext(ctx,
		`SELECT id, name, class_levels as ClassLevels, preferred_mission_types as PreferredMissions, roles as PartyRoles
           FROM characters
          WHERE character_type=$1
          ORDER BY name`, string(cType))
	if err != nil {
		return nil, fmt.Errorf("query characters: %w", err)
	}
	defer rows.Close()

	fmt.Println(rows)

	out := []Character{} // non-nil so JSON is [] rather than null
	// 	for rows.Next() {
	// 		var c Character
	// 		fmt.Println(c)
	// 		if c.PartyRoles == "" {
	// 			c.PartyRoles = "none selected"
	// 		}
	// 		if err := rows.Scan(&c.ID, &c.Name, &c.ClassLevels, &c.PreferredMissions, &c.PartyRoles); err != nil {
	// 			return nil, fmt.Errorf("scan character: %w", err)
	// 		}
	// 		out = append(out, c)
	// 	}
	// 	if err := rows.Err(); err != nil { // catches errors that ended iteration early
	// 		return nil, fmt.Errorf("iterate characters: %w", err)
	// 	}
	// 	return out, nil
	// }

	for rows.Next() {
		var (
			c                          Character
			cLevels, pMissions, pRoles []byte // raw JSONB
		)
		// if err := rows.Scan(
		//     &c.ID, &c.Name, &c.Kind, &c.Race, &c.Class, &c.PreferredMissionType,
		//     &c.Summary, &c.Backstory, &likes, &dislikes,
		// ); err != nil {
		//     return nil, fmt.Errorf("scan character: %w", err)
		// }
		fmt.Println(c)
		fmt.Println(string(cLevels))
		if err := rows.Scan(&c.ID, &c.Name, &cLevels, &pMissions, &pRoles); err != nil {
			fmt.Println("scan character: %w", err)
			return nil, fmt.Errorf("scan character: %w", err)
		}
		if c.ClassLevels, err = decodeLevelMap(cLevels); err != nil {
			fmt.Printf("decode class_levels (id %d): %s", c.ID, err)
			return nil, fmt.Errorf("decode class_levels (id %d): %w\r", c.ID, err)
		}
		fmt.Println("C.Classlevels:")
		fmt.Println(c.ClassLevels)
		fmt.Println("clevels")
		fmt.Println(cLevels)
		if c.PreferredMissions, err = decodeMap(pMissions); err != nil {
			return nil, fmt.Errorf("decode preferred_mission_types (id %d): %w", c.ID, err)
		}
		if c.PartyRoles, err = decodeMap(pRoles); err != nil {
			return nil, fmt.Errorf("decode preferred_mission_types (id %d): %w", c.ID, err)
		}
		out = append(out, c)
	}
	return out, rows.Err()
}

// decodeStrings turns a JSONB array like ["a","b"] into []string.
// NULL or empty input yields nil, which the json tag's omitempty drops.
func decodeMap(raw []byte) (map[string]any, error) {
	if len(raw) == 0 {
		fmt.Println("raw length was zero?")
		return nil, nil
	}
	var m map[string]any
	if err := json.Unmarshal(raw, &m); err != nil {
		return nil, err
	}
	fmt.Println("decoded map?")
	fmt.Println(m)
	return m, nil
}

func decodeLevelMap(raw []byte) (map[string]int, error) {
	if len(raw) == 0 {
		fmt.Println("raw length was zero?")
		return nil, nil
	}
	var m map[string]int
	if err := json.Unmarshal(raw, &m); err != nil {
		return nil, err
	}
	fmt.Println("decoded map?")
	fmt.Println(m)
	return m, nil
}

// func (m *MemoryRepo) ListByKind(_ context.Context, k Kind) ([]Character, error) {
// 	m.mu.RLock()
// 	defer m.mu.RUnlock()
// 	out := []Character{}
// 	for _, it := range m.items {
// 		if it.Kind == k {
// 			out = append(out, it)
// 		}
// 	}
// 	return out, nil
// }

func (memory *MemoryRepo) Create(_ context.Context, character Character) (Character, error) {
	memory.lock.Lock()
	defer memory.lock.Unlock()
	character.ID = memory.nextID
	memory.nextID++
	memory.items = append(memory.items, character)
	return character, nil
}
