package polls

const MissionInterest = "mission_interest"

// Response is one player's interest (1-5) in a mission.
type Response struct {
	ID       int    `json:"id"`
	Mission  string `json:"mission"`
	Player   string `json:"player"`
	Interest int    `json:"interest"`
}
