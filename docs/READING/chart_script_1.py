import plotly.graph_objects as go
import numpy as np

# Parse the data
data = {
    "states": [
        {"name": "Draft", "description": "Initial state, visible only to admins", "color": "#1FB8CD"},
        {"name": "Scheduled", "description": "Set for future release", "color": "#DB4545"},
        {"name": "Published", "description": "Live and visible to users", "color": "#2E8B57"},
        {"name": "Archived", "description": "Hidden from library, preserved", "color": "#5D878F"}
    ],
    "transitions": [
        {"from": "Draft", "to": "Scheduled", "condition": "Set future release_date", "type": "user_action"},
        {"from": "Draft", "to": "Published", "condition": "Manual publish (immediate)", "type": "user_action"},
        {"from": "Scheduled", "to": "Published", "condition": "time >= release_date OR manual publish", "type": "auto_or_manual"},
        {"from": "Published", "to": "Archived", "condition": "Manual archive action", "type": "user_action"},
        {"from": "Scheduled", "to": "Draft", "condition": "Manual revert (optional)", "type": "user_action"}
    ]
}

# Define positions for better flow layout
positions = {
    "Draft": (0, 1),
    "Scheduled": (2, 2),
    "Published": (4, 1),
    "Archived": (6, 1)
}

# Abbreviated conditions for 15 char limit
condition_labels = {
    "Set future release_date": "Set future date",
    "Manual publish (immediate)": "Manual publish", 
    "time >= release_date OR manual publish": "Auto/manual pub",
    "Manual archive action": "Manual archive",
    "Manual revert (optional)": "Manual revert"
}

fig = go.Figure()

# Add transition arrows with labels
for i, transition in enumerate(data["transitions"]):
    from_pos = positions[transition["from"]]
    to_pos = positions[transition["to"]]
    
    # Offset for curved arrows to avoid overlap
    if transition["from"] == "Draft" and transition["to"] == "Published":
        # Direct path, curve downward
        mid_x = (from_pos[0] + to_pos[0]) / 2
        mid_y = from_pos[1] - 0.5
        x_points = [from_pos[0], mid_x, to_pos[0]]
        y_points = [from_pos[1], mid_y, to_pos[1]]
    elif transition["from"] == "Scheduled" and transition["to"] == "Draft":
        # Reverse path, curve upward
        mid_x = (from_pos[0] + to_pos[0]) / 2
        mid_y = from_pos[1] + 0.5
        x_points = [from_pos[0], mid_x, to_pos[0]]
        y_points = [from_pos[1], mid_y, to_pos[1]]
    else:
        # Straight line
        x_points = [from_pos[0], to_pos[0]]
        y_points = [from_pos[1], to_pos[1]]
    
    # Determine line style based on transition type
    line_style = 'solid' if transition["type"] == "user_action" else 'dash'
    line_color = '#333333' if transition["type"] == "user_action" else '#666666'
    
    # Add transition line
    fig.add_trace(go.Scatter(
        x=x_points,
        y=y_points,
        mode='lines',
        line=dict(color=line_color, width=3, dash=line_style),
        showlegend=False,
        hoverinfo='skip'
    ))
    
    # Add arrowhead
    if len(x_points) == 2:  # Straight line
        dx = to_pos[0] - from_pos[0]
        dy = to_pos[1] - from_pos[1]
        arrow_x = to_pos[0] - 0.15
        arrow_y = to_pos[1]
    else:  # Curved line
        dx = x_points[-1] - x_points[-2]
        dy = y_points[-1] - y_points[-2]
        arrow_x = to_pos[0] - 0.15
        arrow_y = to_pos[1]
    
    # Arrow head
    fig.add_trace(go.Scatter(
        x=[arrow_x - 0.1, arrow_x, arrow_x - 0.1],
        y=[arrow_y - 0.1, arrow_y, arrow_y + 0.1],
        mode='lines',
        line=dict(color=line_color, width=3),
        fill='toself',
        fillcolor=line_color,
        showlegend=False,
        hoverinfo='skip'
    ))
    
    # Add condition label
    if len(x_points) == 2:
        label_x = (from_pos[0] + to_pos[0]) / 2
        label_y = (from_pos[1] + to_pos[1]) / 2 + 0.2
    else:
        label_x = x_points[1]
        label_y = y_points[1]
    
    fig.add_trace(go.Scatter(
        x=[label_x],
        y=[label_y],
        mode='text',
        text=[condition_labels[transition["condition"]]],
        textfont=dict(size=10, color='black'),
        showlegend=False,
        hoverinfo='skip'
    ))

# Add state nodes
for state in data["states"]:
    pos = positions[state["name"]]
    
    fig.add_trace(go.Scatter(
        x=[pos[0]],
        y=[pos[1]],
        mode='markers+text',
        marker=dict(
            size=120,
            color=state["color"],
            line=dict(color='black', width=3)
        ),
        text=[state["name"]],
        textposition="middle center",
        textfont=dict(size=14, color='white', family="Arial Black"),
        name=state["name"],
        hovertemplate=f"<b>{state['name']}</b><br>{state['description']}<extra></extra>",
        showlegend=True
    ))

# Add legend for line types
fig.add_trace(go.Scatter(
    x=[None], y=[None],
    mode='lines',
    line=dict(color='#333333', width=3, dash='solid'),
    name='User Action',
    showlegend=True
))

fig.add_trace(go.Scatter(
    x=[None], y=[None],
    mode='lines',
    line=dict(color='#666666', width=3, dash='dash'),
    name='Auto/Manual',
    showlegend=True
))

# Update layout
fig.update_layout(
    title="Content Lifecycle Flow",
    xaxis=dict(
        showgrid=False,
        zeroline=False,
        showticklabels=False,
        range=[-0.5, 6.5]
    ),
    yaxis=dict(
        showgrid=False,
        zeroline=False,
        showticklabels=False,
        range=[0, 3]
    ),
    plot_bgcolor='white',
    legend=dict(
        orientation='h',
        yanchor='bottom',
        y=1.05,
        xanchor='center',
        x=0.5
    )
)

fig.update_traces(cliponaxis=False)

# Save the chart
fig.write_image("chart.png")
fig.write_image("chart.svg", format="svg")

fig.show()