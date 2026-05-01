from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import json

class RoomRecommender:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(max_features=100, stop_words='english')
        self.room_vectors = None
        self.rooms = []
    
    def train(self, rooms):
        """
        Train on room data
        rooms: list of room dicts with title, description, amenities
        """
        self.rooms = rooms
        
        # Combine text fields for TF-IDF
        descriptions = []
        for room in rooms:
            text = f"{room.get('title', '')} {room.get('description', '')} {' '.join(room.get('amenities', []))}"
            descriptions.append(text)
        
        if descriptions:
            self.room_vectors = self.vectorizer.fit_transform(descriptions)
        return True
    
    def get_recommendations(self, query, top_n=5):
        """
        Get room recommendations based on query
        """
        if not self.rooms or self.room_vectors is None:
            return []
        
        try:
            # Transform query to same vector space
            query_vector = self.vectorizer.transform([query])
            
            # Calculate similarity scores
            similarities = cosine_similarity(query_vector, self.room_vectors)[0]
            
            # Get top N similar rooms
            top_indices = np.argsort(similarities)[::-1][:top_n]
            
            recommendations = []
            for idx in top_indices:
                if similarities[idx] > 0.1:  # Minimum similarity threshold
                    recommendations.append({
                        'room_id': str(self.rooms[idx].get('_id', '')),
                        'title': self.rooms[idx].get('title', ''),
                        'similarity_score': float(similarities[idx]),
                        'city': self.rooms[idx].get('city', ''),
                        'price': self.rooms[idx].get('price', 0)
                    })
            
            return recommendations
        except Exception as e:
            print(f"Error in recommendations: {e}")
            return []

# Global recommender instance
recommender = RoomRecommender()

def train_recommender(rooms):
    """Train the ML model"""
    return recommender.train(rooms)

def get_room_recommendations(query, top_n=5):
    """Get recommendations for a query"""
    return recommender.get_recommendations(query, top_n)