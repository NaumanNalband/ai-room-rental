from ml_recommender import train_recommender, get_room_recommendations
from flask import Flask, request, jsonify
from flask_cors import CORS
import spacy

app = Flask(__name__)
CORS(app)

# Load spaCy model
nlp = spacy.load('en_core_web_sm')

# Keywords mapping
ROOM_TYPES = {
    '1bhk': '1BHK', 'one bhk': '1BHK', '1 bhk': '1BHK',
    '2bhk': '2BHK', 'two bhk': '2BHK', '2 bhk': '2BHK',
    '3bhk': '3BHK', 'three bhk': '3BHK', '3 bhk': '3BHK',
    'pg': 'PG', 'paying guest': 'PG',
    'studio': 'Studio'
}

PRICE_KEYWORDS = {
    'cheap': 5000, 'affordable': 7000, 'budget': 5000,
    'expensive': 15000, 'luxury': 20000, 'premium': 15000
}

AMENITY_KEYWORDS = [
    'wifi', 'ac', 'parking', 'gym', 'swimming pool',
    'furnished', 'semi-furnished', 'water', 'electricity'
]

CITIES = [
    'sangli', 'pune', 'mumbai', 'kolhapur', 'nashik',
    'nagpur', 'aurangabad', 'solapur', 'satara'
]

@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({'message': 'AI Service running!'})

@app.route('/nlp/search', methods=['POST'])
def nlp_search():
    data = request.get_json()
    query = data.get('query', '').lower()

    doc = nlp(query)

    result = {
        'original_query': query,
        'city': None,
        'type': None,
        'maxPrice': None,
        'minPrice': None,
        'amenities': []
    }

    # Extract city
    for city in CITIES:
        if city in query:
            result['city'] = city.capitalize()
            break

    # Extract room type
    for keyword, room_type in ROOM_TYPES.items():
        if keyword in query:
            result['type'] = room_type
            break

    # Extract price intent
    for keyword, price in PRICE_KEYWORDS.items():
        if keyword in query:
            if keyword in ['cheap', 'affordable', 'budget']:
                result['maxPrice'] = price
            else:
                result['minPrice'] = price
            break

    # Extract amenities
    for amenity in AMENITY_KEYWORDS:
        if amenity in query:
            result['amenities'].append(amenity)

    # Extract numbers (price range)
    for token in doc:
        if token.like_num:
            num = int(float(token.text))
            if 1000 <= num <= 100000:
                if 'under' in query or 'below' in query or 'less' in query:
                    result['maxPrice'] = num
                elif 'above' in query or 'more' in query or 'over' in query:
                    result['minPrice'] = num

    return jsonify(result)

@app.route('/ml/train', methods=['POST'])
def train_ml():
    """Train ML model with room data"""
    try:
        data = request.get_json()
        rooms = data.get('rooms', [])
        
        if not rooms:
            return jsonify({'message': 'No rooms provided'})
        
        success = train_recommender(rooms)
        
        if success:
            return jsonify({
                'message': 'Model trained successfully',
                'rooms_trained': len(rooms)
            })
        else:
            return jsonify({'message': 'Training failed'})
    except Exception as err:
        return jsonify({'message': str(err)}), 500

@app.route('/ml/recommend', methods=['POST'])
def recommend():
    """Get room recommendations based on user preferences"""
    try:
        data = request.get_json()
        query = data.get('query', '')
        top_n = data.get('top_n', 5)
        
        if not query:
            return jsonify({'message': 'Query required'})
        
        recommendations = get_room_recommendations(query, top_n)
        
        return jsonify({
            'query': query,
            'recommendations': recommendations,
            'count': len(recommendations)
        })
    except Exception as err:
        return jsonify({'message': str(err)}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)