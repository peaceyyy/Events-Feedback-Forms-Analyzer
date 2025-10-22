"""
Text analysis and NLP for feedback comments.

Functions:
- generate_one_word_descriptions: Analyzes one-word descriptions for WordCloud visualization
- generate_text_insights: Analyzes text feedback for common themes and sentiment
- extract_common_words: Extract common words from text feedback (helper)
"""

import pandas as pd
import numpy as np
from typing import Dict, Any, List
from collections import Counter
import re


def generate_one_word_descriptions(data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Analyzes one-word descriptions from feedback data.
    Prepares data for WordCloud visualization.
    """
    df = pd.DataFrame(data)
    
    if 'one_word_desc' not in df.columns:
        return {"error": "No one-word description data found"}
    
    # Extract and clean one-word descriptions
    descriptions = df['one_word_desc'].dropna()
    descriptions = descriptions[descriptions != '']
    descriptions = descriptions[descriptions != 'No comment']
    
    if descriptions.empty:
        return {"error": "No valid one-word descriptions found"}
    
    # Count occurrences and prepare for WordCloud
    description_counts = Counter(descriptions.str.strip().str.title())
    
    # Format for WordCloud component (Carbon Charts format)
    word_cloud_data = [
        {"word": word, "count": count}
        for word, count in description_counts.most_common()
    ]
    
    # Calculate statistics
    total_descriptions = len(descriptions)
    unique_descriptions = len(description_counts)
    
    return {
        "chart_type": "one_word_descriptions",
        "data": {
            "word_cloud": word_cloud_data,
            "top_descriptions": description_counts.most_common(10),
            "stats": {
                "total_responses": total_descriptions,
                "unique_words": unique_descriptions,
                "most_common": description_counts.most_common(1)[0] if description_counts else None,
                "response_rate": round((total_descriptions / len(df)) * 100, 1)
            }
        }
    }


def generate_text_insights(data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Analyzes text feedback for common themes and sentiment.
    Prepares word frequency and theme data.
    """
    df = pd.DataFrame(data)
    
    text_columns = ['positive_feedback', 'improvement_feedback', 'additional_comments']
    available_text = [col for col in text_columns if col in df.columns]
    
    if not available_text:
        return {"error": "No text feedback found"}
    
    # Combine all text feedback
    all_feedback = []
    feedback_by_type = {}
    
    for col in available_text:
        texts = df[col].dropna()
        # Filter out placeholder text
        texts = texts[texts != 'No comment provided']
        texts = texts[texts != 'No comment']
        
        feedback_by_type[col] = texts.tolist()
        all_feedback.extend(texts.tolist())
    
    # Simple word frequency analysis (you might want to add more sophisticated NLP)
    common_words = extract_common_words(all_feedback)
    
    return {
        "chart_type": "text_insights",
        "data": {
            "feedback_counts": {
                col.replace('_', ' ').title(): len(texts) 
                for col, texts in feedback_by_type.items()
            },
            
            # Word cloud data
            "word_frequency": common_words[:20],  # Top 20 words
            
            # Sample comments for display
            "sample_feedback": {
                col: texts[:3] if len(texts) > 0 else []
                for col, texts in feedback_by_type.items()
            },
            
            "stats": {
                "total_text_responses": len(all_feedback),
                "avg_response_length": np.mean([len(text.split()) for text in all_feedback]) if all_feedback else 0
            }
        }
    }


def extract_common_words(texts: List[str], min_length: int = 3) -> List[Dict[str, Any]]:
    """Extract common words from text feedback (simple implementation)"""
    # Simple word extraction - you might want to use NLTK or spaCy for production
    
    # Common stop words to exclude
    stop_words = {
        'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 
        'by', 'a', 'an', 'is', 'was', 'are', 'were', 'be', 'been', 'have', 
        'has', 'had', 'do', 'did', 'will', 'would', 'could', 'should', 'it',
        'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'we', 'they'
    }
    
    all_words = []
    for text in texts:
        if isinstance(text, str):
            # Extract words (letters only, minimum length)
            words = re.findall(r'\b[a-zA-Z]{' + str(min_length) + r',}\b', text.lower())
            all_words.extend([word for word in words if word not in stop_words])
    
    word_counts = Counter(all_words)
    return [
        {"word": word, "count": count}
        for word, count in word_counts.most_common()
    ]
