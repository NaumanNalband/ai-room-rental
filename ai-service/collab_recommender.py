"""
Simple Collaborative Filtering Recommender
No external ML libraries needed - pure Python implementation
Uses user similarity and item-based recommendations
"""

class SimpleCollaborativeRecommender:
    def __init__(self):
        self.user_ratings = {}  # user_id -> {room_id: rating}
        self.room_ratings = {}  # room_id -> [ratings]
        self.is_trained = False
    
    def train(self, ratings_list):
        """
        Train on ratings data
        ratings_list: [{"user_id": "u1", "room_id": "r1", "rating": 5}, ...]
        """
        try:
            if not ratings_list or len(ratings_list) < 2:
                print("Not enough ratings to train")
                return False
            
            # Build user and room rating maps
            for rating in ratings_list:
                user_id = str(rating['user_id'])
                room_id = str(rating['room_id'])
                rating_val = float(rating.get('rating', 4))
                
                # User's ratings
                if user_id not in self.user_ratings:
                    self.user_ratings[user_id] = {}
                self.user_ratings[user_id][room_id] = rating_val
                
                # Room's ratings
                if room_id not in self.room_ratings:
                    self.room_ratings[room_id] = []
                self.room_ratings[room_id].append(rating_val)
            
            self.is_trained = True
            print(f"Model trained: {len(self.user_ratings)} users, {len(self.room_ratings)} rooms")
            return True
        except Exception as e:
            print(f"Error training: {e}")
            return False
    
    def _calculate_similarity(self, user1_ratings, user2_ratings):
        """Calculate cosine similarity between two users"""
        # Get common items
        common_items = set(user1_ratings.keys()) & set(user2_ratings.keys())
        
        if not common_items:
            return 0
        
        # Calculate dot product and magnitudes
        dot_product = sum(user1_ratings[item] * user2_ratings[item] for item in common_items)
        mag1 = sum(rating ** 2 for rating in user1_ratings.values()) ** 0.5
        mag2 = sum(rating ** 2 for rating in user2_ratings.values()) ** 0.5
        
        if mag1 == 0 or mag2 == 0:
            return 0
        
        return dot_product / (mag1 * mag2)
    
    def get_recommendations(self, user_id, rooms, top_n=5):
        """Get collaborative recommendations for a user"""
        if not self.is_trained:
            # No training data - return top rated rooms
            return self._get_popular_rooms(rooms, top_n)
        
        user_id_str = str(user_id)
        
        # If new user, return popular rooms
        if user_id_str not in self.user_ratings:
            return self._get_popular_rooms(rooms, top_n)
        
        user_ratings = self.user_ratings[user_id_str]
        room_scores = {}
        
        # Find similar users and their ratings
        for other_user_id, other_ratings in self.user_ratings.items():
            if other_user_id == user_id_str:
                continue
            
            # Calculate similarity
            similarity = self._calculate_similarity(user_ratings, other_ratings)
            
            if similarity <= 0:
                continue
            
            # Score unrated items by similar users
            for room_id, rating in other_ratings.items():
                if room_id not in user_ratings:  # Only unrated items
                    if room_id not in room_scores:
                        room_scores[room_id] = {'total': 0, 'count': 0}
                    room_scores[room_id]['total'] += rating * similarity
                    room_scores[room_id]['count'] += similarity
        
        # Calculate final scores
        final_scores = []
        for room in rooms:
            room_id = str(room.get('_id', ''))
            
            if room_id in room_scores:
                avg_score = room_scores[room_id]['total'] / room_scores[room_id]['count']
            else:
                avg_score = 3.0  # Default score for unknown rooms
            
            final_scores.append({
                'room_id': room_id,
                'title': room.get('title', ''),
                'predicted_rating': round(avg_score, 2),
                'city': room.get('city', ''),
                'price': room.get('price', 0),
                'broker': room.get('broker', {}).get('name', '') if isinstance(room.get('broker'), dict) else ''
            })
        
        # Sort by score and return top N
        final_scores.sort(key=lambda x: x['predicted_rating'], reverse=True)
        return final_scores[:top_n]
    
    def _get_popular_rooms(self, rooms, top_n=5):
        """Return most popular rooms (highest average rating)"""
        room_list = []
        
        for room in rooms:
            room_id = str(room.get('_id', ''))
            
            if room_id in self.room_ratings:
                avg_rating = sum(self.room_ratings[room_id]) / len(self.room_ratings[room_id])
            else:
                avg_rating = 3.0
            
            room_list.append({
                'room_id': room_id,
                'title': room.get('title', ''),
                'predicted_rating': round(avg_rating, 2),
                'city': room.get('city', ''),
                'price': room.get('price', 0),
                'broker': room.get('broker', {}).get('name', '') if isinstance(room.get('broker'), dict) else ''
            })
        
        room_list.sort(key=lambda x: x['predicted_rating'], reverse=True)
        return room_list[:top_n]

# Global instance
collab_model = SimpleCollaborativeRecommender()

def train_collab_model(ratings):
    """Train the model"""
    return collab_model.train(ratings)

def get_collab_recommendations(user_id, rooms, top_n=5):
    """Get recommendations"""
    return collab_model.get_recommendations(user_id, rooms, top_n)