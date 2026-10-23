package characters

import (
	"context"
	"database/sql"
	"fmt"
	"sync"
)

type Repository interface {
	ListByKind(ctx context.Context, k Kind) ([]Character, error)
}

type Service struct{ repo Repository }

func NewService(r Repository) *Service { return &Service{repo: r} }

func (s *Service) List(ctx context.Context, k Kind) ([]Character, error) {
	return s.repo.ListByKind(ctx, k)
}

type MemoryRepo struct {
	mu    sync.RWMutex
	items []Character
}

type SqlRepo struct {
	db *sql.DB
}

func NewMemoryRepo() *MemoryRepo {
	return &MemoryRepo{items: []Character{
		// {ID: 1, Name: "Wren Halloway", Kind: PCs, Summary: "Disgraced cartographer."},
		// {ID: 2, Name: "Brother Tuck", Kind: PCs, Summary: "Travelling surgeon."},
		// {ID: 3, Name: "Captain Ilse Vorn", Kind: NPCs, Summary: "Harbor watch commander."},
		// {ID: 4, Name: "The Ledger Guild", Kind: Factions, Summary: "Controls trade records along the coast."},
	}}
}

func NewSqlRepo(db *sql.DB) *SqlRepo {
	return &SqlRepo{db: db}
}

func (repo *SqlRepo) ListByKind(ctx context.Context, k Kind) ([]Character, error) {
	rows, err := repo.db.QueryContext(ctx,
		`SELECT id, name, class_levels as ClassLevels, preferred_mission_types as PreferredMissions, roles as PartyRoles
           FROM characters
          WHERE is_pc = true
          ORDER BY name`)
	if err != nil {
		return nil, fmt.Errorf("query characters: %w", err)
	}
	defer rows.Close()

	// fmt.Println(rows)

	out := []Character{} // non-nil so JSON is [] rather than null
	for rows.Next() {
		var c Character
		fmt.Println(c)
		if c.PartyRoles == "" {
			c.PartyRoles = "none selected"
		}
		if err := rows.Scan(&c.ID, &c.Name, &c.ClassLevels, &c.PreferredMissions, &c.PartyRoles); err != nil {
			return nil, fmt.Errorf("scan character: %w", err)
		}
		out = append(out, c)
	}
	if err := rows.Err(); err != nil { // catches errors that ended iteration early
		return nil, fmt.Errorf("iterate characters: %w", err)
	}
	return out, nil
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
