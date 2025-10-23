* improve detailed analysis content styling

* [ ] hovering on tab in light mode is inconsitent
* [X] bar charts look very weird and fat especially when you hgihglight over it
* [X] about page it too simplistic and the color green font is not fitting at all--look into being more professional and sleek by going for a 2 column about
* [X] icons for the tech stack used

visual comparison analysis

* [ ] aspects visual comparison graphs are not scaled prope
* [X] legends are undreadable
* [X] imrpove bullet chart look and feel
* [X] fix spacing and a little life to the card without changing any color
* [ ] highlight too bright for diverged
* [ ]

**DIFFERENT TABS**

* [X] Main Summary Dashboard
* [X] word cloud

* Overall performance analyis

  * Maybe with Gemini insights
  * 
* Average of all scores

  * Per aspect
  * Overall recommendation score (NPS)
  * Overall satisfaciton score
* Recommendation vs satisfaction charts
* Pacing chart
* one word description Word cloud
* **"Headline" Insights:** **Add two more KPI cards:**

  * **Top-Rated Aspect:** **(e.g., "Speakers: 4.8/5") - Instantly shows what to double down on.**
  * **Lowest-Rated Aspect:** **(e.g., "Venue: 3.2/5") - Instantly shows the biggest problem area.**
    This provides immediate, actionable headlines without needing to dig into another tab.

* [ ] Open ended Tab

Compiled insights of (perhaps a table compilation with search filter)

* What did you like most about the tab?
* What could be improved
* Any other comments

Gemini api summary

* Thematic Sentiment Analysis: either using gemini or my own using VADER and BERT

  * if gemini, Prompt: "AnaAlyze these comments. For each comment, provide a sentiment (Positive, Neutral, Negative) and tag it with one or more themes (e.g., Speaker, Content, Networking, Venue, Food)."
  * 
* Result: You can then create a chart titled "Sentiment by Theme," which is incredibly powerful. It might show that while "Speaker" comments were 90% positive, "Venue" comments were 70% negative.

* [ ] Aspects comparison tab

* per aspect overall average
* events stregths and weaknesses analysis summary ✅
* satisfaction and aspects radar ✅
* aspect performance comparison
* * **Visualization:** **A simple** **Bar Chart** **showing the correlation coefficient of each aspect with the overall score. ✅**

* [X] Session-related tab

* per session type attendance count
* per session type satisfaction score
* event discovery channel info
* preferred time chart
* prefferd venue/modality chart

 **Combine your two main metrics (**Attendance Count **and** **Satisfaction Score per Session**) into one chart.

* **Visualization:** **A** **Bubble Chart**.✅

  * **X-Axis:** **Average Satisfaction Score**
* **Y-Axis:** **Attendance Count**
* **Each Bubble:** **A session (e.g., "Keynote," "Workshop A").**
* **The Story it Tells:** **This creates a** **Session Performance Matrix** **that reveals four strategic categories:**

  * **High Attendance / High Satisfaction (Stars):** **Your winning content. Repeat and promote it.**
  * **Low Attendance / High Satisfaction (Hidden Gems):** **People who went loved it. Market this better next time!**
  * **High Attendance / Low Satisfaction (Overhyped & Underwhelming):** **A popular session that needs a content overhaul. This is a critical problem to fix.**
  * **Low Attendance / Low Satisfaction (Underperformers):** **Content that didn't resonate. Consider replacing it.**

* [ ] **Attendee Segmentation Tab** 

* **Insight 1: Does Pacing Affect Satisfaction?**

  * **Visualization:** **A** **Grouped Bar Chart** **showing the average satisfaction score for people who found the pacing "Too Slow," "Just Right," and "Too Fast."**
* **Insight 2:	 Which Channels Bring in the Happiest Attendees?**

  * **Visualization:** **Another** **Grouped Bar Chart** **showing the average satisfaction score for each** **Event Discovery Channel**. Maybe you'll find that attendees from "LinkedIn" are consistently happier than those from "Facebook."
* **Insight 3: How Does Venue/Modality Impact the Experience?**

  * **Visualization:** **A** **Grouped Bar Chart** **comparing the average satisfaction scores for different** **Preferred Venue** **types (e.g., "Online," "Lecture Room," "Conference Room"). This is crucial for hybrid events.**
