import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input, decode_predictions
import numpy as np
from PIL import Image
import io
import base64
import requests
from io import BytesIO

class RoomImageClassifier:
    def __init__(self):
        # Load pre-trained MobileNetV2 model
        self.model = MobileNetV2(weights='imagenet')
        self.img_size = (224, 224)
        self.is_loaded = True
    
    def classify_from_url(self, image_url, top_k=5):
        """
        Classify image from URL
        Returns top K predictions with confidence scores
        """
        try:
            # Download image from URL
            response = requests.get(image_url, timeout=10)
            response.raise_for_status()
            
            # Load and prepare image
            img = Image.open(BytesIO(response.content)).convert('RGB')
            img = img.resize(self.img_size)
            
            # Prepare for model
            img_array = image.img_to_array(img)
            img_array = np.expand_dims(img_array, axis=0)
            img_array = preprocess_input(img_array)
            
            # Get predictions
            predictions = self.model.predict(img_array, verbose=0)
            decoded = decode_predictions(predictions, top=top_k)[0]
            
            # Format results
            results = []
            for label, description, confidence in decoded:
                results.append({
                    'label': label,
                    'description': description,
                    'confidence': float(confidence),
                    'percentage': round(float(confidence) * 100, 2)
                })
            
            return {
                'success': True,
                'image_url': image_url,
                'predictions': results,
                'top_prediction': results[0]['description'] if results else 'Unknown'
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'image_url': image_url
            }
    
    def extract_room_features(self, image_url):
        """
        Extract room-related features from image
        Returns categorized features
        """
        try:
            predictions = self.classify_from_url(image_url, top_k=10)
            
            if not predictions['success']:
                return predictions
            
            # Room feature keywords
            furniture_keywords = ['bed', 'sofa', 'chair', 'table', 'desk', 'cabinet', 'couch']
            appliance_keywords = ['ac', 'air conditioner', 'fan', 'lamp', 'light', 'tv', 'television']
            feature_keywords = ['window', 'door', 'floor', 'wall', 'ceiling', 'bathroom', 'kitchen']
            
            room_features = {
                'furniture': [],
                'appliances': [],
                'features': [],
                'quality_score': 0,
                'room_type_prediction': None
            }
            
            # Categorize predictions
            for pred in predictions['predictions']:
                desc = pred['description'].lower()
                conf = pred['confidence']
                
                for keyword in furniture_keywords:
                    if keyword in desc:
                        room_features['furniture'].append({
                            'item': pred['description'],
                            'confidence': conf
                        })
                
                for keyword in appliance_keywords:
                    if keyword in desc:
                        room_features['appliances'].append({
                            'item': pred['description'],
                            'confidence': conf
                        })
                
                for keyword in feature_keywords:
                    if keyword in desc:
                        room_features['features'].append({
                            'item': pred['description'],
                            'confidence': conf
                        })
            
            # Calculate quality score (based on number of features detected)
            quality_score = min((len(room_features['furniture']) + 
                               len(room_features['appliances']) + 
                               len(room_features['features'])) / 10 * 100, 100)
            room_features['quality_score'] = round(quality_score, 2)
            
            # Predict room type
            if 'kitchen' in str(room_features['features']):
                room_features['room_type_prediction'] = 'Apartment/Full House'
            elif len(room_features['furniture']) > 2:
                room_features['room_type_prediction'] = 'Furnished Room'
            else:
                room_features['room_type_prediction'] = 'Basic/Shared Space'
            
            return {
                'success': True,
                'image_url': image_url,
                'features': room_features,
                'raw_predictions': predictions['predictions']
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'image_url': image_url
            }

# Global classifier instance
classifier = RoomImageClassifier()

def classify_room_image(image_url, top_k=5):
    """Classify room image"""
    return classifier.classify_from_url(image_url, top_k)

def extract_features(image_url):
    """Extract room features from image"""
    return classifier.extract_room_features(image_url)