package missions

import (
	"context"
	"sync"
)

// Repository is the seam for a real database later.
type Repository interface {
	ListByStatus(ctx context.Context, s Status) ([]Mission, error)
}

type Service struct{ repo Repository }

func NewService(r Repository) *Service { return &Service{repo: r} }

func (s *Service) List(ctx context.Context, st Status) ([]Mission, error) {
	return s.repo.ListByStatus(ctx, st)
}

// MemoryRepo is a seeded in-memory implementation for development.
type MemoryRepo struct {
	mu    sync.RWMutex
	items []Mission
}

func NewMemoryRepo() *MemoryRepo {
	return &MemoryRepo{items: []Mission{
		{ID: 1, Title: "The Salt Road Ambush", Summary: "Escort the caravan through the pass.", Status: Open},
		{ID: 2, Title: "Ledger of Ash", Summary: "Recover the stolen guild ledger.", Status: Open},
		{ID: 3, Title: "A Quiet Harbor", Summary: "Dock workers' strike resolved.", Status: Completed},
	}}
}

func (m *MemoryRepo) ListByStatus(_ context.Context, st Status) ([]Mission, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	out := []Mission{} // non-nil so JSON is [] rather than null
	for _, it := range m.items {
		if it.Status == st {
			out = append(out, it)
		}
	}
	return out, nil
}
