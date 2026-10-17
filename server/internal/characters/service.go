package characters

import (
	"context"
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

func NewMemoryRepo() *MemoryRepo {
	return &MemoryRepo{items: []Character{
		{ID: 1, Name: "Wren Halloway", Kind: PCs, Summary: "Disgraced cartographer."},
		{ID: 2, Name: "Brother Tuck", Kind: PCs, Summary: "Travelling surgeon."},
		{ID: 3, Name: "Captain Ilse Vorn", Kind: NPCs, Summary: "Harbor watch commander."},
		{ID: 4, Name: "The Ledger Guild", Kind: Factions, Summary: "Controls trade records along the coast."},
	}}
}

func (m *MemoryRepo) ListByKind(_ context.Context, k Kind) ([]Character, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	out := []Character{}
	for _, it := range m.items {
		if it.Kind == k {
			out = append(out, it)
		}
	}
	return out, nil
}
