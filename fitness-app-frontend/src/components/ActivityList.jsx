import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getActivities } from "../services/api";

const TYPE_EMOJI = {
  RUNNING: "🏃",
  WALKING: "🚶",
  CYCLING: "🚴",
  SWIMMING: "🏊",
  WEIGHT_TRAINING: "🏋️",
  YOGA: "🧘",
  HIIT: "⚡",
  CARDIO: "🤸",
  STRETCHING: "🤾",
  OTHER: "🏅",
};

export default function ActivityList() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getActivities()
      .then((res) => setActivities(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="status-text">Loading activities...</p>;
  if (activities.length === 0)
    return <p className="status-text">No activities yet. Log your first workout above!</p>;

  return (
    <div>
      <h2 className="section-title">Your Activities</h2>
      <div className="activity-grid">
        {activities.map((a) => (
          <div
            key={a.id}
            className="activity-card"
            onClick={() => navigate(`/activities/${a.id}`)}
          >
            <div className="activity-emoji">{TYPE_EMOJI[a.type] || "🏅"}</div>
            <div className="activity-info">
              <div className="activity-type">{a.type.replace("_", " ")}</div>
              <div className="activity-meta">
                {a.duration} min &nbsp;·&nbsp; {a.caloriesBurned} kcal
              </div>
              <div className="activity-date">
                {new Date(a.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className="activity-arrow">›</div>
          </div>
        ))}
      </div>
    </div>
  );
}
