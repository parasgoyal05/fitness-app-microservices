import { useState } from "react";
import { addActivity } from "../services/api";

const ACTIVITY_CONFIG = {
  RUNNING: {
    label: "Running 🏃",
    fields: [
      { key: "distance", label: "Distance (km)", type: "number" },
      { key: "pace", label: "Pace (min/km)", type: "text" },
      { key: "avgHeartRate", label: "Avg Heart Rate (bpm)", type: "number" },
    ],
  },
  WALKING: {
    label: "Walking 🚶",
    fields: [
      { key: "distance", label: "Distance (km)", type: "number" },
      { key: "steps", label: "Steps", type: "number" },
      { key: "avgHeartRate", label: "Avg Heart Rate (bpm)", type: "number" },
    ],
  },
  CYCLING: {
    label: "Cycling 🚴",
    fields: [
      { key: "distance", label: "Distance (km)", type: "number" },
      { key: "avgSpeed", label: "Avg Speed (km/h)", type: "number" },
      { key: "elevationGain", label: "Elevation Gain (m)", type: "number" },
    ],
  },
  SWIMMING: {
    label: "Swimming 🏊",
    fields: [
      { key: "laps", label: "Laps", type: "number" },
      { key: "poolLength", label: "Pool Length (m)", type: "number" },
      { key: "strokeType", label: "Stroke Type (e.g. freestyle)", type: "text" },
    ],
  },
  WEIGHT_TRAINING: {
    label: "Weight Training 🏋️",
    fields: [
      { key: "sets", label: "Sets", type: "number" },
      { key: "reps", label: "Reps per Set", type: "number" },
      { key: "weightKg", label: "Weight (kg)", type: "number" },
      { key: "muscleGroup", label: "Muscle Group (e.g. chest, back)", type: "text" },
    ],
  },
  YOGA: {
    label: "Yoga 🧘",
    fields: [
      { key: "style", label: "Style (e.g. hatha, vinyasa)", type: "text" },
      { key: "poseCount", label: "Number of Poses", type: "number" },
    ],
  },
  HIIT: {
    label: "HIIT ⚡",
    fields: [
      { key: "rounds", label: "Rounds", type: "number" },
      { key: "workSeconds", label: "Work Interval (seconds)", type: "number" },
      { key: "restSeconds", label: "Rest Interval (seconds)", type: "number" },
      { key: "avgHeartRate", label: "Avg Heart Rate (bpm)", type: "number" },
    ],
  },
  CARDIO: {
    label: "Cardio 🤸",
    fields: [
      { key: "machine", label: "Machine (e.g. treadmill, elliptical)", type: "text" },
      { key: "avgHeartRate", label: "Avg Heart Rate (bpm)", type: "number" },
      { key: "distance", label: "Distance (km)", type: "number" },
    ],
  },
  STRETCHING: {
    label: "Stretching 🤾",
    fields: [
      { key: "focusArea", label: "Focus Area (e.g. full body, legs)", type: "text" },
    ],
  },
  OTHER: {
    label: "Other 🏅",
    fields: [
      { key: "description", label: "Description", type: "text" },
    ],
  },
};

const INITIAL = {
  type: "RUNNING",
  duration: "",
  caloriesBurned: "",
  additionalMetrics: {},
};

export default function ActivityForm({ onActivityAdded }) {
  const [activity, setActivity] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const config = ACTIVITY_CONFIG[activity.type];

  const handleTypeChange = (e) => {
    setActivity({ ...INITIAL, type: e.target.value });
    setSuccess(false);
    setError("");
  };

  const handleMetric = (key, value) => {
    setActivity((prev) => ({
      ...prev,
      additionalMetrics: { ...prev.additionalMetrics, [key]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await addActivity(activity);
      setSuccess(true);
      setActivity(INITIAL);
      if (onActivityAdded) onActivityAdded();
    } catch (err) {
      setError("Failed to log activity. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card form-card">
      <h2 className="section-title">Log Activity</h2>
      <form onSubmit={handleSubmit}>

        {/* Activity Type */}
        <div className="form-group">
          <label className="form-label">Activity Type</label>
          <select
            className="form-select"
            value={activity.type}
            onChange={handleTypeChange}
          >
            {Object.entries(ACTIVITY_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.label}</option>
            ))}
          </select>
        </div>

        {/* Common fields */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Duration (minutes)</label>
            <input
              className="form-input"
              type="number"
              min="1"
              required
              placeholder="e.g. 30"
              value={activity.duration}
              onChange={(e) => setActivity({ ...activity, duration: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Calories Burned</label>
            <input
              className="form-input"
              type="number"
              min="0"
              required
              placeholder="e.g. 300"
              value={activity.caloriesBurned}
              onChange={(e) => setActivity({ ...activity, caloriesBurned: e.target.value })}
            />
          </div>
        </div>

        {/* Activity-specific fields */}
        {config.fields.length > 0 && (
          <div className="specific-fields">
            <p className="fields-label">{config.label} details</p>
            <div className="form-row">
              {config.fields.map((field) => (
                <div className="form-group" key={field.key}>
                  <label className="form-label">{field.label}</label>
                  <input
                    className="form-input"
                    type={field.type}
                    placeholder={field.label}
                    value={activity.additionalMetrics[field.key] || ""}
                    onChange={(e) => handleMetric(field.key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <button type="submit" className="btn-primary btn-full" disabled={loading}>
          {loading ? "Saving..." : "Add Activity"}
        </button>

        {success && (
          <p className="msg-success">
            ✓ Activity logged! AI recommendation will be ready in ~20 seconds.
          </p>
        )}
        {error && <p className="msg-error">{error}</p>}
      </form>
    </div>
  );
}
