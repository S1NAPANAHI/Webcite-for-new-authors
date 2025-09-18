import plotly.graph_objects as go
import json

# Parse the data
data = {
    "entities": [
        {"name": "BOOKS", "fields": ["id (PK)", "title", "description", "slug", "cover_image", "state", "created_at", "updated_at"], "level": 1},
        {"name": "VOLUMES", "fields": ["id (PK)", "book_id (FK)", "title", "slug", "order_index", "state", "created_at"], "level": 2},
        {"name": "SAGAS", "fields": ["id (PK)", "volume_id (FK)", "title", "slug", "order_index", "state", "created_at"], "level": 3},
        {"name": "ARCS", "fields": ["id (PK)", "saga_id (FK)", "title", "slug", "order_index", "state", "created_at"], "level": 4},
        {"name": "ISSUES", "fields": ["id (PK)", "arc_id (FK)", "title", "slug", "subscription_required", "release_date", "state", "order_index"], "level": 5},
        {"name": "CHAPTERS", "fields": ["id (PK)", "issue_id (FK)", "title", "slug", "content", "file_url", "release_date", "order_index", "state"], "level": 6},
        {"name": "USERS", "fields": ["id (PK)", "email", "subscription_status", "created_at"], "level": 0},
        {"name": "SUBSCRIPTIONS", "fields": ["id (PK)", "user_id (FK)", "plan_type", "start_date", "end_date", "active"], "level": 0},
        {"name": "USER_LIBRARY", "fields": ["id (PK)", "user_id (FK)", "work_type", "work_id", "added_at"], "level": 0}
    ],
    "relationships": [
        {"from": "BOOKS", "to": "VOLUMES", "type": "1:M"},
        {"from": "VOLUMES", "to": "SAGAS", "type": "1:M"},
        {"from": "SAGAS", "to": "ARCS", "type": "1:M"},
        {"from": "ARCS", "to": "ISSUES", "type": "1:M"},
        {"from": "ISSUES", "to": "CHAPTERS", "type": "1:M"},
        {"from": "USERS", "to": "SUBSCRIPTIONS", "type": "1:M"},
        {"from": "USERS", "to": "USER_LIBRARY", "type": "1:M"}
    ]
}

# Create better positions for entities
positions = {}

# Main hierarchy (vertical center)
main_entities = ["BOOKS", "VOLUMES", "SAGAS", "ARCS", "ISSUES", "CHAPTERS"]
for i, entity_name in enumerate(main_entities):
    positions[entity_name] = (0, 5-i)  # Vertical line down the center

# Supporting tables (to the right side, well spaced)
positions["USERS"] = (3, 4)
positions["SUBSCRIPTIONS"] = (3, 3)
positions["USER_LIBRARY"] = (3, 2)

# Colors for different entity types
main_colors = ['#1FB8CD', '#DB4545', '#2E8B57', '#5D878F', '#D2BA4C', '#B4413C']
support_color = '#964325'

fig = go.Figure()

# Add relationship lines with better styling
for rel in data["relationships"]:
    from_pos = positions[rel["from"]]
    to_pos = positions[rel["to"]]
    
    # Different line styles for main hierarchy vs supporting relationships
    if rel["from"] in main_entities and rel["to"] in main_entities:
        line_color = '#666666'
        line_width = 3
    else:
        line_color = '#999999'
        line_width = 2
    
    fig.add_trace(go.Scatter(
        x=[from_pos[0], to_pos[0]],
        y=[from_pos[1], to_pos[1]],
        mode='lines',
        line=dict(color=line_color, width=line_width),
        showlegend=False,
        hoverinfo='skip'
    ))

# Add main hierarchy entities
for i, entity_name in enumerate(main_entities):
    entity = next(e for e in data["entities"] if e["name"] == entity_name)
    pos = positions[entity_name]
    
    # Create hover text with key fields
    key_fields = []
    for field in entity["fields"][:4]:  # Show first 4 fields
        if len(field) > 15:
            key_fields.append(field[:12] + "...")
        else:
            key_fields.append(field)
    
    hover_text = f"<b>{entity_name}</b><br>" + "<br>".join(key_fields)
    if len(entity["fields"]) > 4:
        hover_text += f"<br>+{len(entity['fields'])-4} more"
    
    fig.add_trace(go.Scatter(
        x=[pos[0]],
        y=[pos[1]],
        mode='markers+text',
        marker=dict(
            size=80,
            color=main_colors[i % len(main_colors)],
            line=dict(width=3, color='white')
        ),
        text=[entity_name],
        textposition='middle center',
        textfont=dict(size=12, color='white', family='Arial Black'),
        name="Main Hierarchy",
        showlegend=(i == 0),  # Only show legend once
        hovertemplate=hover_text + "<extra></extra>"
    ))

# Add supporting entities
support_entities = ["USERS", "SUBSCRIPTIONS", "USER_LIBRARY"]
for i, entity_name in enumerate(support_entities):
    entity = next(e for e in data["entities"] if e["name"] == entity_name)
    pos = positions[entity_name]
    
    # Create hover text
    key_fields = []
    for field in entity["fields"][:4]:
        if len(field) > 15:
            key_fields.append(field[:12] + "...")
        else:
            key_fields.append(field)
    
    hover_text = f"<b>{entity_name}</b><br>" + "<br>".join(key_fields)
    
    fig.add_trace(go.Scatter(
        x=[pos[0]],
        y=[pos[1]],
        mode='markers+text',
        marker=dict(
            size=70,
            color=support_color,
            line=dict(width=3, color='white')
        ),
        text=[entity_name[:10]],  # Truncate long names
        textposition='middle center',
        textfont=dict(size=11, color='white', family='Arial Black'),
        name="Support Tables",
        showlegend=(i == 0),  # Only show legend once
        hovertemplate=hover_text + "<extra></extra>"
    ))

fig.update_layout(
    title="Novel Platform Database Schema",
    xaxis=dict(
        showgrid=False, 
        zeroline=False, 
        showticklabels=False,
        range=[-1.5, 4.5]
    ),
    yaxis=dict(
        showgrid=False, 
        zeroline=False, 
        showticklabels=False,
        range=[-0.5, 5.5]
    ),
    plot_bgcolor='rgba(0,0,0,0)',
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5)
)

fig.update_traces(cliponaxis=False)

fig.write_image("erd_chart.png")
fig.write_image("erd_chart.svg", format="svg")