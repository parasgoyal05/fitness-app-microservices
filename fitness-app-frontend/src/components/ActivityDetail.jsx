import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getActivityDetail } from "../services/api";

export default function ActivityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActivityDetail(id)
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="status-text">Loading...</p>;

  if (!data) return <p className="status-text">Recommendation not found.</p>;

  return (
    <div className="detail-page">
      <button className="btn-back" onClick={() => navigate("/activities")}>
        ← Back
      </button>

      {/* Activity Summary */}
      <div className="card">
        <h2 className="section-title">Activity Details</h2>

        <div className="detail-chips">
          <span className="chip chip-blue">
            {data.activityType?.replace("_", " ")}
          </span>
        </div>

        <p className="detail-date">
          {new Date(data.createdAt).toLocaleString()}
        </p>
      </div>

      {/* Recommendation */}
      <div className="card rec-card">
        <h2 className="section-title">🤖 AI Recommendation</h2>

        <div className="rec-section">
          <h3 className="rec-heading">Analysis</h3>
          <p className="rec-text">{data.recommendation}</p>
        </div>

        {data.improvements?.length > 0 && (
          <div className="rec-section">
            <h3 className="rec-heading">💡 Improvements</h3>
            <ul className="rec-list">
              {data.improvements.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {data.suggestions?.length > 0 && (
          <div className="rec-section">
            <h3 className="rec-heading">📋 Suggestions</h3>
            <ul className="rec-list">
              {data.suggestions.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {data.safety?.length > 0 && (
          <div className="rec-section">
            <h3 className="rec-heading">🛡️ Safety Guidelines</h3>
            <ul className="rec-list">
              {data.safety.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}