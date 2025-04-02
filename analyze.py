from textblob import TextBlob
import sys

def analyze_sentiment(comment):
    analysis = TextBlob(comment)
    if analysis.sentiment.polarity > 0:
        return "Positive"
    elif analysis.sentiment.polarity < 0:
        return "Negative"
    else:
        return "Neutral"

if __name__ == "__main__":
    text = sys.argv[1]
    print(analyze_sentiment(text))
    