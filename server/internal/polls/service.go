package polls

import (
	"context"
	"errors"
	"sync"
)

var ErrInvalid = errors.New("interest must be 1-5 and mission/player are required")

type Repository interface {
	List(ctx context.Context, poll string) ([]Response, error)
	Add(ctx context.Context, poll string, r Response) (Response, error)
}

type Service struct{ repo Repository }

func NewService(r Repository) *Service { return &Service{repo: r} }

func (s *Service) List(ctx context.Context, poll string) ([]Response, error) {
	return s.repo.List(ctx, poll)
}

func (s *Service) Add(ctx context.Context, poll string, r Response) (Response, error) {
	if r.Mission == "" || r.Player == "" || r.Interest < 1 || r.Interest > 5 {
		return Response{}, ErrInvalid
	}
	return s.repo.Add(ctx, poll, r)
}

type MemoryRepo struct {
	mu     sync.Mutex
	nextID int
	items  map[string][]Response
}

func NewMemoryRepo() *MemoryRepo {
	return &MemoryRepo{nextID: 3, items: map[string][]Response{
		MissionInterest: {
			{ID: 1, Mission: "The Salt Road Ambush", Player: "Sam", Interest: 5},
			{ID: 2, Mission: "Ledger of Ash", Player: "Priya", Interest: 3},
		},
	}}
}

func (m *MemoryRepo) List(_ context.Context, poll string) ([]Response, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	return append([]Response{}, m.items[poll]...), nil
}

func (m *MemoryRepo) Add(_ context.Context, poll string, r Response) (Response, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	r.ID = m.nextID
	m.nextID++
	m.items[poll] = append(m.items[poll], r)
	return r, nil
}
