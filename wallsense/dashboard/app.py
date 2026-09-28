"""WallSense Streamlit dashboard: building overview, unit detail, alert feed, and analytics."""

import sys
from pathlib import Path

import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import streamlit as st

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from wallsense.dashboard.components import (
    apply_dark_theme,
    health_gauge,
    kpi_tile,
    render_unit_card,
    sensor_line_chart,
    status_badge,
)
from wallsense.utils.config import SENSOR_FEATURE_COLUMNS
from wallsense.utils.data_loader import load_demo_data

st.set_page_config(page_title="WallSense", page_icon="\U0001f9f1", layout="wide", initial_sidebar_state="expanded")
apply_dark_theme()


@st.cache_data(show_spinner="Loading building data...")
def _load_data() -> tuple[pd.DataFrame, dict[str, pd.DataFrame], pd.DataFrame]:
    return load_demo_data()


building_metadata, sensor_series, alerts = _load_data()

st.sidebar.markdown("## \U0001f9f1 WallSense")
st.sidebar.caption("In-wall infrastructure inspection")
page = st.sidebar.radio(
    "Navigate",
    ["Building Overview", "Unit Detail", "Alert Feed", "Analytics"],
    label_visibility="collapsed",
)

st.sidebar.divider()
n_green = int((building_metadata["status"] == "green").sum())
n_amber = int((building_metadata["status"] == "amber").sum())
n_red = int((building_metadata["status"] == "red").sum())
st.sidebar.markdown(
    f"{status_badge('green')} &nbsp; {n_green} units<br>"
    f"{status_badge('amber')} &nbsp; {n_amber} units<br>"
    f"{status_badge('red')} &nbsp; {n_red} units",
    unsafe_allow_html=True,
)


# --- Page 1: Building Overview ----------------------------------------------

def render_building_overview() -> None:
    st.title("Building Overview")
    st.caption("Unit health map — click a unit below to drill into sensor detail")

    cols = st.columns(4)
    with cols[0]:
        kpi_tile("Total Units", str(len(building_metadata)))
    with cols[1]:
        kpi_tile("Healthy", str(n_green), color="#2ecc71")
    with cols[2]:
        kpi_tile("Warnings", str(n_amber), color="#f39c12")
    with cols[3]:
        kpi_tile("Critical", str(n_red), color="#e74c3c")

    st.markdown("### Unit Health Map")
    floors = sorted(building_metadata["floor"].unique(), reverse=True)
    for floor in floors:
        st.markdown(f"**Floor {floor}**")
        floor_units = building_metadata[building_metadata["floor"] == floor]
        grid_cols = st.columns(len(floor_units))
        for col, (_, unit) in zip(grid_cols, floor_units.iterrows()):
            with col:
                render_unit_card(unit)
                if st.button("View detail", key=f"select_{unit['unit_id']}", use_container_width=True):
                    st.session_state["selected_unit"] = unit["unit_id"]
                    st.session_state["nav_override"] = "Unit Detail"


# --- Page 2: Unit Detail -----------------------------------------------------

def render_unit_detail() -> None:
    st.title("Unit Detail")

    default_unit = st.session_state.get("selected_unit", building_metadata.iloc[0]["unit_id"])
    unit_options = sorted(building_metadata["unit_id"].tolist())
    unit_id = st.selectbox(
        "Select unit",
        options=unit_options,
        index=unit_options.index(str(default_unit)),
    )
    st.session_state["selected_unit"] = unit_id

    unit = building_metadata[building_metadata["unit_id"].astype(str) == str(unit_id)].iloc[0]
    df = sensor_series.get(str(unit_id))

    top = st.columns([1, 3])
    with top[0]:
        st.plotly_chart(health_gauge(unit["health_score"]), use_container_width=True)
        st.markdown(status_badge(unit["status"]), unsafe_allow_html=True)
        st.caption(f"Equipment: {unit['equipment_type']}")
        if pd.notna(unit.get("issue_type")):
            st.warning(f"Active issue: **{unit['issue_type'].replace('_', ' ').title()}**")
        else:
            st.success("No active issues detected")

    with top[1]:
        unit_alerts = alerts[alerts["unit_id"].astype(str) == str(unit_id)] if not alerts.empty else alerts
        if not unit_alerts.empty:
            st.markdown("**Active Alerts**")
            st.dataframe(unit_alerts, use_container_width=True, hide_index=True)
        else:
            st.info("No alerts for this unit.")

    st.markdown("### Sensor Readings (last 30 days)")
    if df is not None:
        chart_cols = st.columns(2)
        colors = ["#58a6ff", "#e74c3c", "#f39c12", "#2ecc71", "#a371f7", "#3fb950"]
        for i, sensor in enumerate(SENSOR_FEATURE_COLUMNS):
            with chart_cols[i % 2]:
                st.plotly_chart(
                    sensor_line_chart(df, sensor, sensor.replace("_", " ").title(), colors[i % len(colors)]),
                    use_container_width=True,
                )
    else:
        st.info("No sensor history available for this unit.")


# --- Page 3: Alert Feed ------------------------------------------------------

def render_alert_feed() -> None:
    st.title("Alert Feed")
    st.caption("Sorted by severity — predicted failure window and cost-to-fix projection")

    if alerts.empty:
        st.success("No active alerts across the building.")
        return

    severity_filter = st.multiselect(
        "Filter by severity", options=["red", "amber"], default=["red", "amber"]
    )
    filtered = alerts[alerts["severity"].isin(severity_filter)] if severity_filter else alerts

    for _, alert in filtered.iterrows():
        color = {"red": "#e74c3c", "amber": "#f39c12"}.get(alert["severity"], "#7f8c8d")
        with st.container():
            cols = st.columns([1, 2, 2, 2, 2])
            with cols[0]:
                st.markdown(status_badge(alert["severity"]), unsafe_allow_html=True)
            with cols[1]:
                st.markdown(f"**Unit {alert['unit_id']}**  \n{alert['sensor'].replace('_', ' ')}")
            with cols[2]:
                st.markdown(f"{alert['issue_type'].replace('_', ' ').title()}")
            with cols[3]:
                st.markdown(f"Predicted failure: **{alert['predicted_failure_days']}d**")
            with cols[4]:
                st.markdown(
                    f"<span style='color:#2ecc71'>Fix now: ${alert['fix_now_cost']:,.0f}</span><br>"
                    f"<span style='color:{color}'>Emergency: ${alert['emergency_cost']:,.0f}</span>",
                    unsafe_allow_html=True,
                )
            st.divider()


# --- Page 4: Analytics --------------------------------------------------------

def render_analytics() -> None:
    st.title("Analytics")
    st.caption("Trend analysis and 30-day failure predictions across the building")

    cols = st.columns(3)
    with cols[0]:
        status_counts = building_metadata["status"].value_counts().reindex(["green", "amber", "red"]).fillna(0)
        fig = px.pie(
            names=["Healthy", "Warning", "Critical"],
            values=status_counts.values,
            color=["Healthy", "Warning", "Critical"],
            color_discrete_map={"Healthy": "#2ecc71", "Warning": "#f39c12", "Critical": "#e74c3c"},
            hole=0.55,
        )
        fig.update_layout(
            template="plotly_dark", paper_bgcolor="#161b22", height=300, margin=dict(l=10, r=10, t=30, b=10),
            title="Fleet Health Distribution",
        )
        st.plotly_chart(fig, use_container_width=True)

    with cols[1]:
        issue_counts = building_metadata["issue_type"].dropna().value_counts()
        fig = px.bar(
            x=issue_counts.index.str.replace("_", " ").str.title(),
            y=issue_counts.values,
            labels={"x": "Issue Type", "y": "Count"},
            color=issue_counts.values,
            color_continuous_scale="Reds",
        )
        fig.update_layout(
            template="plotly_dark", paper_bgcolor="#161b22", height=300, margin=dict(l=10, r=10, t=30, b=10),
            title="Issues by Type", coloraxis_showscale=False,
        )
        st.plotly_chart(fig, use_container_width=True)

    with cols[2]:
        total_fix_now = alerts["fix_now_cost"].sum() if not alerts.empty else 0
        total_emergency = alerts["emergency_cost"].sum() if not alerts.empty else 0
        fig = go.Figure(
            data=[
                go.Bar(name="Fix Now", x=["Total Exposure"], y=[total_fix_now], marker_color="#2ecc71"),
                go.Bar(name="If Emergency", x=["Total Exposure"], y=[total_emergency], marker_color="#e74c3c"),
            ]
        )
        fig.update_layout(
            template="plotly_dark", paper_bgcolor="#161b22", height=300, margin=dict(l=10, r=10, t=30, b=10),
            title="Cost Exposure", barmode="group",
        )
        st.plotly_chart(fig, use_container_width=True)

    st.markdown("### 30-Day Failure Prediction Timeline")
    if not alerts.empty:
        timeline = alerts.copy()
        timeline["predicted_date"] = pd.Timestamp.now() + pd.to_timedelta(timeline["predicted_failure_days"], unit="D")
        fig = px.scatter(
            timeline,
            x="predicted_date",
            y="unit_id",
            color="severity",
            size=[18] * len(timeline),
            color_discrete_map={"red": "#e74c3c", "amber": "#f39c12"},
            hover_data=["issue_type", "emergency_cost"],
        )
        fig.update_layout(
            template="plotly_dark", paper_bgcolor="#161b22", plot_bgcolor="#161b22", height=max(300, 24 * len(timeline)),
            margin=dict(l=10, r=10, t=20, b=30), xaxis_title="Predicted failure date", yaxis_title="Unit",
        )
        fig.add_vline(x=pd.Timestamp.now(), line_dash="dash", line_color="#8b949e")
        st.plotly_chart(fig, use_container_width=True)
    else:
        st.info("No predicted failures in the next 30 days.")

    st.markdown("### Building-Wide Vibration Trend (7-day rolling average)")
    trend_frames = []
    for unit_id, df in sensor_series.items():
        resampled = df.set_index("timestamp")["vibration_rms"].resample("6h").mean()
        trend_frames.append(resampled.rename(unit_id))
    if trend_frames:
        combined = pd.concat(trend_frames, axis=1)
        fleet_avg = combined.mean(axis=1).rolling(window=28, min_periods=1).mean()
        fig = go.Figure(
            go.Scatter(x=fleet_avg.index, y=fleet_avg.values, mode="lines", line=dict(color="#58a6ff", width=2))
        )
        fig.update_layout(
            template="plotly_dark", paper_bgcolor="#161b22", plot_bgcolor="#161b22", height=280,
            margin=dict(l=40, r=20, t=10, b=30),
        )
        st.plotly_chart(fig, use_container_width=True)


# --- Router --------------------------------------------------------------

active_page = st.session_state.pop("nav_override", page)
{
    "Building Overview": render_building_overview,
    "Unit Detail": render_unit_detail,
    "Alert Feed": render_alert_feed,
    "Analytics": render_analytics,
}[active_page]()
