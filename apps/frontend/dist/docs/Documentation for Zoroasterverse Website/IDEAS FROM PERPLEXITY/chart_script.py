import plotly.graph_objects as go

# Data setup
stage_data = [
    {"name": "Stage 1: Basic Information", "label": "Basic Info\nChoice,Slide", "min_score": 15, "max_score": 30, "questions": ["Reading Frequency", "Genre Familiarity", "Time Commit"], "auto_disqualify": True, "interact": "🔘🔲"},
    {"name": "Stage 2: Experience Assessment", "label": "Experience\nChoice,Box", "min_score": 25, "max_score": 40, "questions": ["Beta Exp", "FB Str.", "Writing Bgd", "Read Speed"], "auto_disqualify": False, "interact": "🔘☑️"},
    {"name": "Stage 3: Sample Feedback", "label": "Sample FB\nTxt,Choice", "min_score": 30, "max_score": 50, "questions": ["Excerpt Anal.", "Problem ID", "Actions Sugg."], "auto_disqualify": False, "interact": "✏️🔘"},
    {"name": "Stage 4: Final Assess", "label": "Final Assess\nChoice,Txt", "min_score": 20, "max_score": 30, "questions": ["Comm Style", "Motivation"], "auto_disqualify": False, "interact": "🔘✏️"},
]

thresholds = {"Auto-Accept": 90, "Strong Cand.": 75, "Interview": 60, "Auto-Reject": 0}
labels = []
node_colors = ["#1FB8CD", "#DB4545", "#2E8B57", "#5D878F", "#D2BA4C"]

# Stage nodes (0-3)
labels = [
    f"{s['label']}\n[{s['min_score']}-{s['max_score']}]" for s in stage_data
]

# Disqualify at stage 1
labels.append("Disqualify") # node 4
node_colors.append("#DB4545")

# Final outcome nodes (5-8)
outcome_labels = [
    f"Auto-Accept\n90+",
    f"Strong Cand.\n75-89",
    f"Interview\n60-74",
    f"Reject\n<60"
]
labels += outcome_labels
node_colors += ["#2E8B57", "#D2BA4C", "#5D878F", "#DB4545"]

# Interactive symbols for hover text
interact_hover = [
    "Multiple Choice, Sliders",  # Stage 1
    "Multiple Choice, Checkbox", # 2
    "Text, Multiple Choice",     # 3
    "Multiple Choice, Text",     # 4
]

# Sankey links
src = []
tgt = []
val = []
link_colors = []

# Proceed to next stages
for i in range(len(stage_data)-1):
    src.append(i)
    tgt.append(i+1)
    val.append(30)
    link_colors.append(node_colors[i])

# Disqualify at stage 1 for low score
src.append(0)
tgt.append(4)
val.append(10)
link_colors.append("#DB4545")

# At the end, score based outcome
src.extend([3,3,3,3])
tgt.extend([5,6,7,8])
val.extend([20,20,20,20])
link_colors += ["#2E8B57", "#D2BA4C", "#5D878F", "#DB4545"]

# Hover text for each node
stage_ranges = [f"Stage {i+1}: {d['min_score']}-{d['max_score']}\nQuestions: {', '.join(d['questions'])}\nInput: {interact_hover[i]}" for i, d in enumerate(stage_data)]
note_hovers = stage_ranges + [
    "Auto-Disqualify: Incomplete Basic Info", # disqualify node
    "Score >=90: Auto-Accept",
    "75-89: Strong Candidate",
    "60-74: Interview Req.",
    "<60: Auto-Reject",
]


fig = go.Figure(go.Sankey(
    arrangement="snap",
    node=dict(
        pad=28,
        thickness=28,
        line=dict(color="#333", width=0.5),
        label=labels,
        color=node_colors,
        customdata=note_hovers,
        hovertemplate="%{customdata}<extra></extra>",
    ),
    link=dict(
        source=src,
        target=tgt,
        value=val,
        color=link_colors,
    )
))

fig.update_layout(
    title_text="Beta Reader Flow and Scoring Bands",
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5),
)

fig.write_image("beta_reader_flow_updated.png")
