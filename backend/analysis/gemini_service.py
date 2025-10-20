
"""
Gemini AI service for advanced text analysis and insights generation.
This service uses Google's Gemini API to analyze feedback text and generate actionable insights.
"""

import os
from typing import Dict, Any, List
import json
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class GeminiAnalysisService:
    """Service for generating AI-powered insights from feedback data using Gemini API"""
    
    def __init__(self, dev_mode: bool = True):
        """Initialize Gemini API client"""
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        genai.configure(api_key=api_key)
        # Use the latest stable Gemini model
        self.model = genai.GenerativeModel('gemini-2.5-flash')
        self.dev_mode = dev_mode  # 🚀 Enable development mode for faster testing
        
        if self.dev_mode:
            print("🚀 Gemini service running in DEVELOPMENT mode (smaller samples, faster responses)")
    
    def generate_sentiment_analysis(self, feedback_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Analyze sentiment across all feedback text fields.
        Returns overall sentiment trends and specific insights.
        """
        try:
            # Extract all text feedback
            text_fields = []
            for response in feedback_data:
                for field in ['positive_feedback', 'improvement_feedback', 'additional_comments']:
                    if field in response and response[field] and response[field] != 'No comment':
                        text_fields.append({
                            'type': field,
                            'text': response[field]
                        })
            
            if not text_fields:
                return {"error": "No text feedback available for analysis"}
            
            # 🚀 DEVELOPMENT MODE: Use sample size for faster testing
            if self.dev_mode:
                sample_size = min(10, len(text_fields))  # Limit to 10 for dev testing
                sample_fields = text_fields[:sample_size]
            else:
                sample_size = min(50, len(text_fields))  # Production: up to 50
                sample_fields = text_fields[:sample_size]
            
            # Prepare prompt for Gemini
            prompt = self._create_sentiment_prompt(sample_fields)
            
            # Generate analysis with Gemini
            response = self.model.generate_content(prompt)
            analysis = self._parse_gemini_response(response.text)
            
            return {
                "chart_type": "sentiment_analysis",
                "data": analysis,
                "total_analyzed": len(text_fields),
                "sample_analyzed": sample_size,
                "dev_mode": self.dev_mode
            }
            
        except Exception as e:
            return {"error": f"Sentiment analysis failed: {str(e)}"}
    
    def generate_theme_extraction(self, feedback_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Extract key themes and topics from feedback using AI analysis.
        Identifies recurring issues, praise points, and improvement opportunities.
        """
        try:
            # Separate feedback by type
            positive_feedback = []
            improvement_feedback = []
            
            for response in feedback_data:
                if response.get('positive_feedback') and response['positive_feedback'] != 'No comment':
                    positive_feedback.append(response['positive_feedback'])
                if response.get('improvement_feedback') and response['improvement_feedback'] != 'No comment':
                    improvement_feedback.append(response['improvement_feedback'])
            
            if not positive_feedback and not improvement_feedback:
                return {"error": "No feedback text available for theme analysis"}
            
            # 🚀 DEVELOPMENT MODE: Use smaller samples for faster testing
            if self.dev_mode:
                sample_positive = positive_feedback[:8]  # Limit to 8 for dev
                sample_improvement = improvement_feedback[:8]  # Limit to 8 for dev
            else:
                sample_positive = positive_feedback[:25]  # Production: up to 25
                sample_improvement = improvement_feedback[:25]
            
            # Generate theme analysis
            prompt = self._create_theme_prompt(sample_positive, sample_improvement)
            response = self.model.generate_content(prompt)
            themes = self._parse_theme_response(response.text)
            
            return {
                "chart_type": "theme_analysis",
                "data": themes,
                "analyzed_responses": {
                    "positive": len(positive_feedback),
                    "improvement": len(improvement_feedback)
                },
                "sample_analyzed": {
                    "positive": len(sample_positive),
                    "improvement": len(sample_improvement)
                },
                "dev_mode": self.dev_mode
            }
            
        except Exception as e:
            return {"error": f"Theme extraction failed: {str(e)}"}
    
    def generate_actionable_insights(self, feedback_data: List[Dict[str, Any]], 
                                   analysis_results: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate strategic recommendations based on all feedback data and analysis results.
        Combines quantitative data with qualitative insights for actionable recommendations.
        """
        try:
            # Extract key metrics from analysis
            metrics = self._extract_key_metrics(analysis_results)
            
            # 🚀 DEVELOPMENT MODE: Use smaller sample for faster testing
            limit = 5 if self.dev_mode else 15
            sample_feedback = self._get_representative_feedback(feedback_data, limit=limit)
            
            # Generate insights with Gemini
            prompt = self._create_insights_prompt(metrics, sample_feedback)
            response = self.model.generate_content(prompt)
            insights = self._parse_insights_response(response.text)
            
            return {
                "chart_type": "actionable_insights",
                "data": insights,
                "based_on": {
                    "total_responses": len(feedback_data),
                    "metrics_analyzed": len(metrics),
                    "sample_size": len(sample_feedback)
                },
                "dev_mode": self.dev_mode
            }
            
        except Exception as e:
            return {"error": f"Insights generation failed: {str(e)}"}
    
    def _create_sentiment_prompt(self, text_fields: List[Dict[str, str]]) -> str:
        """Create prompt for sentiment analysis"""
        texts = "\n".join([f"[{field['type']}]: {field['text']}" for field in text_fields[:50]])  # Limit to 50 for API limits
        
        return f"""
        Analyze the sentiment of the following event feedback responses. Return your analysis in JSON format with these fields:
        
        1. overall_sentiment: "positive", "neutral", or "negative"
        2. confidence_score: 0-100 indicating confidence in the analysis
        3. sentiment_distribution: object with counts for positive, neutral, negative
        4. key_emotions: array of top 5 emotions detected (e.g., "satisfied", "frustrated", "excited")
        5. sentiment_by_category: analysis broken down by feedback type
        6. notable_patterns: array of 3-5 key sentiment patterns observed
        
        Feedback to analyze:
        {texts}
        
        Respond ONLY with valid JSON, no additional text.
        """
    
    def _create_theme_prompt(self, positive_feedback: List[str], improvement_feedback: List[str]) -> str:
        """Create prompt for theme extraction"""
        positive_text = "\n".join(positive_feedback[:25])  # Limit for API
        improvement_text = "\n".join(improvement_feedback[:25])
        
        return f"""
        Extract key themes from this event feedback. Return JSON with these fields:
        
        1. positive_themes: array of objects with "theme" and "frequency" (top 5 praise themes)
        2. improvement_themes: array of objects with "theme" and "frequency" (top 5 improvement areas)
        3. recurring_topics: array of topics mentioned across both positive and improvement feedback
        4. priority_actions: array of 3-5 specific actionable recommendations based on the themes
        5. theme_categories: group themes into categories like "logistics", "content", "speakers", "venue"
        
        Positive Feedback:
        {positive_text}
        
        Improvement Feedback:
        {improvement_text}
        
        Respond ONLY with valid JSON, no additional text.
        """
    
    def _create_insights_prompt(self, metrics: Dict[str, Any], sample_feedback: List[str]) -> str:
        """Create prompt for actionable insights"""
        return f"""
        Generate strategic recommendations for improving future events based on this analysis data and feedback samples.
        
        Quantitative Metrics:
        {json.dumps(metrics, indent=2)}
        
        Sample Feedback:
        {chr(10).join(sample_feedback[:10])}
        
        Return JSON with these fields:
        1. executive_summary: 2-3 sentence overall assessment
        2. top_strengths: array of 3-5 areas where the event excelled
        3. critical_improvements: array of 3-5 urgent areas needing attention
        4. strategic_recommendations: array of 5-7 specific, actionable recommendations
        5. quick_wins: array of 3-4 easy improvements that could be implemented immediately
        6. long_term_goals: array of 2-3 strategic objectives for future events
        7. success_metrics: suggest 3-5 KPIs to track improvement
        
        Respond ONLY with valid JSON, no additional text.
        """
    
    def _extract_key_metrics(self, analysis_results: Dict[str, Any]) -> Dict[str, Any]:
        """Extract key metrics from existing analysis for Gemini context"""
        metrics = {}
        
        # Satisfaction metrics
        if 'satisfaction' in analysis_results and 'data' in analysis_results['satisfaction']:
            sat_data = analysis_results['satisfaction']['data']
            if 'stats' in sat_data:
                metrics['satisfaction'] = sat_data['stats']
        
        # NPS metrics
        if 'nps' in analysis_results and 'data' in analysis_results['nps']:
            nps_data = analysis_results['nps']['data']
            metrics['nps_score'] = nps_data.get('nps_score', 0)
            metrics['nps_category'] = nps_data.get('nps_category', 'Unknown')
        
        # Rating comparison
        if 'ratings' in analysis_results and 'data' in analysis_results['ratings']:
            ratings_data = analysis_results['ratings']['data']
            if 'insights' in ratings_data:
                metrics['ratings_insights'] = ratings_data['insights']
        
        return metrics
    
    def _get_representative_feedback(self, feedback_data: List[Dict[str, Any]], limit: int = 15) -> List[str]:
        """Get a representative sample of feedback for context"""
        feedback_samples = []
        
        for response in feedback_data[:limit]:  # Configurable limit
            for field in ['positive_feedback', 'improvement_feedback', 'additional_comments']:
                if field in response and response[field] and response[field] != 'No comment':
                    feedback_samples.append(f"[{field}]: {response[field]}")
        
        return feedback_samples
    
    def _parse_gemini_response(self, response_text: str) -> Dict[str, Any]:
        """Parse Gemini's JSON response with error handling"""
        try:
            # Clean the response text (remove markdown code blocks if present)
            cleaned_text = response_text.strip()
            if cleaned_text.startswith('```json'):
                cleaned_text = cleaned_text[7:-3]
            elif cleaned_text.startswith('```'):
                cleaned_text = cleaned_text[3:-3]
            
            return json.loads(cleaned_text)
        except json.JSONDecodeError as e:
            return {
                "error": "Failed to parse AI response",
                "raw_response": response_text[:200] + "..." if len(response_text) > 200 else response_text
            }
    
    def _parse_theme_response(self, response_text: str) -> Dict[str, Any]:
        """Parse theme analysis response"""
        return self._parse_gemini_response(response_text)
    
    def _parse_insights_response(self, response_text: str) -> Dict[str, Any]:
        """Parse insights response"""
        return self._parse_gemini_response(response_text)

    # ============================================================================
    # SESSION & MARKETING ANALYTICS AI INSIGHTS
    # ============================================================================
    
    def generate_session_insights(self, session_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate AI-powered insights for session performance matrix.
        Analyzes session categorization and provides strategic recommendations.
        """
        try:
            if not session_data or 'sessions' not in session_data:
                return {"error": "No session data available"}
            
            # Build context for AI
            sessions_summary = []
            for session in session_data['sessions'][:10]:  # Limit to top 10
                sessions_summary.append(
                    f"- {session['session']}: {session['attendance']} attendees, "
                    f"{session['avg_satisfaction']}/5 satisfaction ({session['category']})"
                )
            
            quadrants = session_data.get('quadrants', {})
            stats = session_data.get('stats', {})
            
            prompt = f"""Analyze this event's session performance data and provide strategic insights:

SESSION PERFORMANCE DATA:
{chr(10).join(sessions_summary)}

QUADRANT BREAKDOWN:
- Stars (High Attendance + High Satisfaction): {quadrants.get('stars', 0)} sessions
- Hidden Gems (Low Attendance + High Satisfaction): {quadrants.get('hidden_gems', 0)} sessions
- Crowd Favorites (High Attendance + Low Satisfaction): {quadrants.get('crowd_favorites', 0)} sessions
- Needs Improvement (Low Attendance + Low Satisfaction): {quadrants.get('needs_improvement', 0)} sessions

OVERALL STATS:
- Total sessions: {stats.get('total_sessions', 0)}
- Average attendance: {stats.get('avg_attendance', 0):.1f}
- Average satisfaction: {stats.get('avg_satisfaction', 0):.2f}/5

TASK: Provide concise, actionable strategic insights in JSON format.

CRITICAL RULES:
- Key insights must be ONE-LINE observations (max 15 words each)
- Strategic recommendations should be specific and action-oriented
- Reference actual session names when relevant
- No generic advice - be data-driven and tactical

JSON FORMAT:
{{
  "key_insights": [
    "One-line observation about performance pattern",
    "One-line observation about quadrant distribution",
    "One-line observation about satisfaction trends"
  ],
  "strategic_recommendations": [
    "Specific action: Double down on [Session X] format - proven Star performance",
    "Specific action: Promote [Session Y] via social media - Hidden Gem potential",
    "Specific action: Redesign [Session Z] content based on low satisfaction scores",
    "Specific action: Consolidate underperforming sessions to reduce resource waste"
  ],
  "growth_opportunities": [
    "Scale [specific session type] - high satisfaction with expansion potential",
    "Experiment with [specific format/topic] based on Hidden Gems performance"
  ],
  "risk_areas": [
    "Immediate attention: [Session Name] - low attendance AND satisfaction"
  ]
}}

RESPOND WITH ONLY VALID JSON, NO ADDITIONAL TEXT."""

            response = self.model.generate_content(prompt)
            return self._parse_gemini_response(response.text)
            
        except Exception as e:
            return {"error": f"Failed to generate session insights: {str(e)}"}
    
    def generate_marketing_insights(self, channel_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate AI-powered insights for discovery channel impact.
        Analyzes marketing attribution and provides campaign recommendations.
        """
        try:
            if not channel_data or 'channels' not in channel_data:
                return {"error": "No channel data available"}
            
            # Build context for AI
            channels_summary = []
            for channel in channel_data['channels'][:8]:  # Limit to top 8
                channels_summary.append(
                    f"- {channel['event_discovery']}: {channel['avg_satisfaction']:.2f}/5 satisfaction, "
                    f"{channel['count']} attendees, {channel['effectiveness_score']:.1f}% effectiveness"
                )
            
            stats = channel_data.get('stats', {})
            
            prompt = f"""Analyze this event's marketing channel performance and provide strategic insights:

CHANNEL PERFORMANCE DATA:
{chr(10).join(channels_summary)}

OVERALL STATS:
- Total channels used: {stats.get('total_channels', 0)}
- Total responses tracked: {stats.get('total_responses', 0)}
- Overall average satisfaction: {stats.get('overall_avg_satisfaction', 0):.2f}/5

EFFECTIVENESS FORMULA: 70% satisfaction quality + 30% reach volume

TASK: Provide concise, actionable marketing insights in JSON format.

CRITICAL RULES:
- Key insights must be ONE-LINE observations (max 15 words each)
- Marketing recommendations should be specific with budget/tactic details
- Budget allocation must include actual channel names and percentages
- No generic advice - be ROI-focused and tactical

JSON FORMAT:
{{
  "key_insights": [
    "One-line observation about top-performing channel",
    "One-line observation about quality vs quantity trade-offs",
    "One-line observation about underutilized channels"
  ],
  "marketing_recommendations": [
    "Specific tactic: Increase [Channel X] ad spend by 40% - highest ROI proven",
    "Specific tactic: A/B test messaging for [Channel Y] to improve 3.2/5 satisfaction",
    "Specific tactic: Cut budget from [Channel Z] - poor satisfaction and reach",
    "Specific tactic: Launch referral program to scale [high-satisfaction channel]"
  ],
  "growth_opportunities": [
    "Partner with [specific channel] - untapped audience with quality potential",
    "Experiment with [specific tactic] based on [Channel] success patterns"
  ],
  "budget_allocation": [
    "Reallocate 30% budget from [Low Channel] to [High Channel]",
    "Invest $X in [Channel] expansion - proven 4.5/5 satisfaction"
  ]
}}

RESPOND WITH ONLY VALID JSON, NO ADDITIONAL TEXT."""

            response = self.model.generate_content(prompt)
            return self._parse_gemini_response(response.text)
            
        except Exception as e:
            return {"error": f"Failed to generate marketing insights: {str(e)}"}


    def generate_aspect_insights(self, aspect_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate AI insights for event aspect performance analysis.
        Analyzes which aspects (food, venue, content, etc.) are strengths/weaknesses.
        """
        try:
            aspects = aspect_data.get('aspects', [])
            overall_satisfaction = aspect_data.get('overall_satisfaction', 4.0)
            
            if not aspects:
                return {"error": "No aspect data available for analysis"}
            
            # Categorize aspects
            strengths = [a for a in aspects if a.get('difference', 0) > 0.1]
            weaknesses = [a for a in aspects if a.get('difference', 0) < -0.1]
            adequate = [a for a in aspects if abs(a.get('difference', 0)) <= 0.1]
            
            prompt = f"""You are an event quality analyst specializing in attendee experience optimization.

ASPECT PERFORMANCE DATA:
Overall Event Satisfaction Baseline: {overall_satisfaction:.2f}/5

STRENGTHS (Above Baseline):
{chr(10).join([f"- {a['aspect']}: {a['value']:.2f}/5 (+{a['difference']:.2f} above baseline)" for a in strengths]) if strengths else '- None identified'}

WEAKNESSES (Below Baseline):
{chr(10).join([f"- {a['aspect']}: {a['value']:.2f}/5 ({a['difference']:.2f} below baseline)" for a in weaknesses]) if weaknesses else '- None identified'}

ADEQUATE (Meeting Baseline):
{chr(10).join([f"- {a['aspect']}: {a['value']:.2f}/5" for a in adequate]) if adequate else '- None identified'}

TASK: Provide concise, actionable event improvement insights in JSON format.

CRITICAL RULES:
- Key insights must be ONE-LINE observations (max 15 words each)
- Focus on the BIGGEST deltas (positive and negative)
- Improvement recommendations should be specific and tactical
- Quick wins should be realistic actions that require minimal resources
- Strategic priorities should address weaknesses or leverage strengths

JSON FORMAT:
{{
  "key_insights": [
    "One-line observation about strongest-performing aspect",
    "One-line observation about weakest-performing aspect",
    "One-line observation about consistency across aspects"
  ],
  "improvement_recommendations": [
    "Specific action to fix worst-performing aspect with concrete steps",
    "Specific tactic to bring adequate aspects up to strength level",
    "Specific method to maintain/amplify current strengths"
  ],
  "quick_wins": [
    "Immediate low-cost fix for [specific weakness aspect]",
    "Simple enhancement for [adequate aspect] using existing resources"
  ],
  "strategic_priorities": [
    "Long-term focus area based on largest performance gaps",
    "Investment recommendation for scaling strengths"
  ]
}}

RESPOND WITH ONLY VALID JSON, NO ADDITIONAL TEXT."""

            response = self.model.generate_content(prompt)
            return self._parse_gemini_response(response.text)
            
        except Exception as e:
            return {"error": f"Failed to generate aspect insights: {str(e)}"}


# Convenience function for easy import
def get_gemini_service() -> GeminiAnalysisService:
    """Get configured Gemini service instance"""
    return GeminiAnalysisService()