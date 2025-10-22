# Analysis Module Documentation

This directory contains modularized analysis functions for processing feedback data.

## Module Structure

### **core_metrics.py**
**Purpose:** Basic satisfaction and NPS calculations

**Functions:**
- `generate_satisfaction_analysis()` - Analyzes satisfaction ratings and prepares chart data
- `generate_recommendation_analysis()` - Analyzes NPS (Net Promoter Score) data
- `generate_satisfaction_insights()` - Generate actionable insights from satisfaction data (helper)
- `categorize_nps()` - Categorize NPS score into standard ranges (helper)

---

### **session_analytics.py**
**Purpose:** Session-level attendance and performance analysis

**Functions:**
- `generate_session_popularity()` - Analyzes which sessions were most popular
- `generate_session_performance_matrix()` - Creates performance matrix based on attendance and satisfaction (quadrant analysis)

---

### **comparative_analysis.py**
**Purpose:** Cross-aspect comparisons, correlations, and pacing analysis

**Functions:**
- `generate_rating_comparison()` - Compares aspect ratings (venue, speakers, content) against overall satisfaction baseline
- `generate_correlation_analysis()` - Analyzes correlation between aspect ratings and overall satisfaction
- `generate_pacing_analysis()` - Analyzes pacing satisfaction correlation

---

### **textual_analytics.py**
**Purpose:** Text analysis and NLP for feedback comments

**Functions:**
- `generate_one_word_descriptions()` - Analyzes one-word descriptions for WordCloud visualization
- `generate_text_insights()` - Analyzes text feedback for common themes and sentiment
- `extract_common_words()` - Extract common words from text feedback (helper)

---

### **marketing_analytics.py**
**Purpose:** Marketing channel effectiveness analysis

**Functions:**
- `generate_discovery_channel_impact()` - Analyzes how event discovery channels correlate with satisfaction

---

### **summative_reports.py**
**Purpose:** High-level orchestrators that combine multiple analysis modules

**Functions:**
- `generate_comprehensive_report()` - Generates complete analysis report combining all insights (main dashboard function)
- `generate_initial_summary()` - Generates lightweight summary for immediate frontend display

---

### **utils.py**
**Purpose:** Shared helper functions used across modules

*(Currently empty - reserved for future shared utilities)*

---

### **gemini_service.py**
**Purpose:** AI-powered insights generation using Google Gemini API

**Functions:**
- `generate_sentiment_analysis()` - AI sentiment analysis of text feedback
- `generate_theme_extraction()` - AI theme extraction from feedback comments
- `generate_session_insights()` - AI strategic insights for session performance matrix
- `generate_marketing_insights()` - AI marketing channel recommendations
- `generate_aspect_insights()` - AI aspect performance improvement suggestions

---

## Usage Examples

### Import from top-level package:
```python
from backend.analysis import (
    generate_comprehensive_report,
    generate_satisfaction_analysis,
    generate_session_popularity
)

# Generate full dashboard data
analysis_results = generate_comprehensive_report(feedback_data)

# Generate specific analysis
satisfaction_data = generate_satisfaction_analysis(feedback_data)
```

### Import from specific modules:
```python
from backend.analysis.core_metrics import generate_satisfaction_analysis
from backend.analysis.session_analytics import generate_session_performance_matrix
from backend.analysis.textual_analytics import generate_text_insights
```

---

## Data Flow

1. **Frontend** uploads CSV → `backend/app/main.py`
2. **Processing** layer extracts data → `backend/processing/feedback_service.py`
3. **Analysis** modules process data → `backend/analysis/*`
4. **Summative reports** orchestrate results → `backend/analysis/summative_reports.py`
5. **Frontend** receives JSON → Renders charts

---

## Migration from `insights.py`

**Old import:**
```python
from backend.analysis.insights import generate_comprehensive_report
```

**New import:**
```python
from backend.analysis import generate_comprehensive_report
```

All functions previously in `insights.py` are now accessible via `backend.analysis` package imports.

---

## Adding New Analysis Functions

1. **Choose appropriate module** (or create new one following naming convention)
2. **Add function** with clear docstring describing inputs/outputs
3. **Export in `__init__.py`** to make it accessible from top-level package
4. **Add to summative_reports.py** if it should be included in comprehensive dashboard
5. **Update this README** with function description

---

## Testing

Run analysis functions individually:
```bash
cd backend
python -c "from analysis import generate_satisfaction_analysis; print(generate_satisfaction_analysis([{'satisfaction': 5}]))"
```

---

## Best Practices

- **Keep functions pure** - same input → same output (no side effects)
- **Handle errors gracefully** - return `{"error": "..."}` instead of raising exceptions
- **Document data contracts** - clearly specify expected input structure in docstrings
- **Modular design** - each module focuses on one domain (metrics, sessions, text, etc.)
- **Consistent return format** - all functions return `Dict[str, Any]` with `chart_type` and `data` keys
