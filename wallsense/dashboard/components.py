"""Reusable Streamlit/Plotly widgets for the WallSense dashboard."""

import pandas as pd
import plotly.graph_objects as go
import streamlit as st

STATUS_COLORS = {
    "green": "#2ecc71",
    "amber": "#f39c12",
    "red": "#e74c3c",
}

DARK_PLOT_TEMPLATE = "plotly_dark"
DARK_BG = "#0e1117"
CARD_BG = "#161b22"
GRID_COLOR = "#30363d"


def status_badge(status: str) -> str:
    """Return an HTML badge span colored by status, for embedding via ``st.markdown``.

    Args:
        status: One of "green", "amber", "red".

    Returns:
        HTML string for a small colored pill badge.
    """
    color = STATUS_COLORS.get(status, "#7f8c8d")
    label = {"green": "Healthy", "amber": "Warning", "red": "Critical"}.get(status, status.title())
    return (
        f'<span style="background-color:{color}22;color:{color};border:1px solid {color};'
        f'padding:2px 10px;border-radius:12px;font-size:0.8rem;font-weight:600;">{label}</span>'
    )


def render_unit_card(unit: pd.Series) -> None:
    """Render a single unit as a colored card inside the building overview grid.

    Args:
        unit: A row from the building metadata DataFrame (unit_id, status, health_score, ...).
    """
    color = STATUS_COLORS.get(unit["status"], "#7f8c8d")
    issue = unit["issue_type"] if pd.notna(unit.get("issue_type")) else "No active issues"
    st.markdown(
        f"""
        <div style="border:1px solid {color};border-radius:10px;padding:14px;
                    background-color:{CARD_BG};margin-bottom:10px;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
                <span style="font-size:1.1rem;font-weight:700;color:#e6edf3;">Unit {unit['unit_id']}</span>
                {status_badge(unit['status'])}
            </div>
            <div style="color:#8b949e;font-size:0.85rem;margin-top:4px;">{unit['equipment_type']}</div>
            <div style="margin-top:10px;font-size:1.6rem;font-weight:700;color:{color};">
                {unit['health_score']:.0f}<span style="font-size:0.9rem;color:#8b949e;">/100</span>
            </div>
            <div style="color:#8b949e;font-size:0.8rem;margin-top:2px;">{issue}</div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def kpi_tile(label: str, value: str, delta: str | None = None, color: str = "#58a6ff") -> None:
    """Render a single KPI stat tile.

    Args:
        label: Small caption above the value.
        value: Large headline value (already formatted as a string).
        delta: Optional secondary line, e.g. a trend or count breakdown.
        color: Accent color for the value text.
    """
    delta_html = f'<div style="color:#8b949e;font-size:0.8rem;margin-top:4px;">{delta}</div>' if delta else ""
    st.markdown(
        f"""
        <div style="border:1px solid {GRID_COLOR};border-radius:10px;padding:16px;background-color:{CARD_BG};">
            <div style="color:#8b949e;font-size:0.8rem;text-transform:uppercase;letter-spacing:0.05em;">{label}</div>
            <div style="font-size:1.8rem;font-weight:700;color:{color};margin-top:4px;">{value}</div>
            {delta_html}
        </div>
        """,
        unsafe_allow_html=True,
    )


def sensor_line_chart(df: pd.DataFrame, column: str, title: str, color: str = "#58a6ff") -> go.Figure:
    """Build a dark-themed Plotly line chart for one sensor column over time.

    Args:
        df: Sensor time-series DataFrame with a ``timestamp`` column.
        column: Sensor column to plot.
        title: Chart title.
        color: Line color.

    Returns:
        A configured Plotly ``Figure``.
    """
    fig = go.Figure()
    fig.add_trace(
        go.Scatter(
            x=df["timestamp"],
            y=df[column],
            mode="lines",
            line=dict(color=color, width=2),
            fill="tozeroy",
            fillcolor=color + "1a",
            name=column,
        )
    )
    fig.update_layout(
        template=DARK_PLOT_TEMPLATE,
        title=title,
        height=280,
        margin=dict(l=40, r=20, t=40, b=30),
        paper_bgcolor=CARD_BG,
        plot_bgcolor=CARD_BG,
        xaxis=dict(gridcolor=GRID_COLOR),
        yaxis=dict(gridcolor=GRID_COLOR),
        showlegend=False,
    )
    return fig


def health_gauge(score: float, title: str = "Equipment Health") -> go.Figure:
    """Build a gauge chart for an equipment/unit health score.

    Args:
        score: Health score in [0, 100].
        title: Gauge title.

    Returns:
        A configured Plotly ``Figure``.
    """
    if score >= 70:
        bar_color = STATUS_COLORS["green"]
    elif score >= 40:
        bar_color = STATUS_COLORS["amber"]
    else:
        bar_color = STATUS_COLORS["red"]

    fig = go.Figure(
        go.Indicator(
            mode="gauge+number",
            value=score,
            title={"text": title, "font": {"size": 14, "color": "#8b949e"}},
            number={"font": {"color": bar_color, "size": 36}},
            gauge={
                "axis": {"range": [0, 100], "tickcolor": "#8b949e"},
                "bar": {"color": bar_color},
                "bgcolor": CARD_BG,
                "borderwidth": 0,
                "steps": [
                    {"range": [0, 40], "color": STATUS_COLORS["red"] + "33"},
                    {"range": [40, 70], "color": STATUS_COLORS["amber"] + "33"},
                    {"range": [70, 100], "color": STATUS_COLORS["green"] + "33"},
                ],
            },
        )
    )
    fig.update_layout(
        template=DARK_PLOT_TEMPLATE,
        height=220,
        margin=dict(l=20, r=20, t=40, b=10),
        paper_bgcolor=CARD_BG,
    )
    return fig


def alert_severity_badge(severity: str) -> str:
    """Return an HTML badge for an alert's severity level (alias of ``status_badge``).

    Args:
        severity: One of "green", "amber", "red".

    Returns:
        HTML string for a small colored pill badge.
    """
    return status_badge(severity)


def apply_dark_theme() -> None:
    """Inject page-wide CSS for a professional dark theme."""
    st.markdown(
        f"""
        <style>
        .stApp {{ background-color: {DARK_BG}; }}
        section[data-testid="stSidebar"] {{ background-color: {CARD_BG}; }}
        div[data-testid="stMetric"] {{
            background-color: {CARD_BG};
            border: 1px solid {GRID_COLOR};
            border-radius: 10px;
            padding: 12px;
        }}
        h1, h2, h3 {{ color: #e6edf3; }}
        </style>
        """,
        unsafe_allow_html=True,
    )
