# from flask import Flask, request, jsonify
# from flask_socketio import SocketIO, emit
# from flask_cors import CORS
# import cv2
# import mediapipe as mp
# import numpy as np
# import tensorflow as tf
# import joblib
# from collections import deque, Counter
# import time
# import os
# import threading
# import base64

# app = Flask(__name__)
# app.config['SECRET_KEY'] = 'signmate_secret_key_2025'
# socketio = SocketIO(app, cors_allowed_origins="*")
# CORS(app)

# # ========================================================================================
# # CONFIGURATION
# # ========================================================================================

# WORD_MODEL_PATH = r"./models/saved_model"
# SVM_MODEL_PATH = r"./models/ISL_Model_working/isl_svm_model.pkl"
# LABEL_ENCODER_PATH = r"./models/ISL_Model_working/label_encoder.pkl"

# WORD_CLASSES = ["Hello", "Good Morning", "Thank you", "Close", "Exam"]
# WORD_FEATURES = 126
# LETTER_FEATURES = 63
# SEQUENCE_LENGTH = 20

# WORD_CONFIDENCE = 0.65
# LETTER_CONFIDENCE = 0.50

# CLOSE_DISTANCE_THRESHOLD = 0.10
# FAR_DISTANCE_THRESHOLD = 0.5

# # Global detection state
# detection_state = {
#     'mode': 'auto',
#     'is_running': False,
#     'current_prediction': '',
#     'confidence': 0,
#     'sentence': [],
#     'hands_detected': False,
#     'landmarks_image': None,
#     'distance': 'unknown',
#     'current_detection_mode': 'unknown',  # For auto mode: shows if it's detecting letter or word
#     'hand_size': 0.0,
#     'statistics': {
#         'detection_mode': 'unknown',
#         'distance_status': 'unknown',
#         'hand_size': 0.0,
#         'hands_count': 0,
#         'confidence_level': 'low'
#     }
# }

# # ========================================================================================
# # FEATURE EXTRACTION
# # ========================================================================================

# def normalize_landmarks_126(keypoints):
#     if len(keypoints) == 0 or np.all(keypoints == 0):
#         return keypoints
    
#     keypoints = np.array(keypoints)
#     normalized = []
    
#     for hand_idx in range(2):
#         start_idx = hand_idx * 63
#         end_idx = start_idx + 63
#         hand_data = keypoints[start_idx:end_idx]
        
#         if np.any(hand_data != 0):
#             landmarks = hand_data.reshape(21, 3)
#             wrist = landmarks[0].copy()
#             landmarks = landmarks - wrist
            
#             middle_finger_tip = landmarks[12]
#             hand_scale = np.linalg.norm(middle_finger_tip) + 1e-6
#             landmarks = landmarks / hand_scale
            
#             normalized.extend(landmarks.flatten())
#         else:
#             normalized.extend([0.0] * 63)
    
#     return np.array(normalized, dtype=np.float32)

# def extract_features_both_hands(results):
#     keypoints = []
    
#     if results.multi_hand_landmarks:
#         hand_data = []
#         for i, hand_landmarks in enumerate(results.multi_hand_landmarks):
#             hand_label = results.multi_handedness[i].classification[0].label
#             landmarks = []
#             for lm in hand_landmarks.landmark:
#                 landmarks.extend([lm.x, lm.y, lm.z])
#             hand_data.append((hand_label, landmarks))
        
#         hand_data.sort(key=lambda x: x[0])
        
#         for _, landmarks in hand_data:
#             keypoints.extend(landmarks)
    
#     while len(keypoints) < WORD_FEATURES:
#         keypoints.append(0.0)
    
#     keypoints = normalize_landmarks_126(keypoints[:WORD_FEATURES])
#     return np.array(keypoints, dtype=np.float32)

# def extract_features_single_hand(results):
#     features = []
    
#     if results.multi_hand_landmarks:
#         hand_landmarks = results.multi_hand_landmarks[0]
#         for lm in hand_landmarks.landmark:
#             features.extend([lm.x, lm.y, lm.z])
    
#     while len(features) < LETTER_FEATURES:
#         features.append(0.0)
    
#     return np.array(features[:LETTER_FEATURES], dtype=np.float32)

# # ========================================================================================
# # REAL TIME DETECTION
# # ========================================================================================

# class RealTimeDetection:
#     def __init__(self):
#         self.cap = None
#         self.detection_thread = None
#         self.is_running = False
        
#         # Initialize MediaPipe
#         self.mp_hands = mp.solutions.hands
#         self.mp_drawing = mp.solutions.drawing_utils
#         self.mp_drawing_styles = mp.solutions.drawing_styles
        
#         # Initialize models
#         self.word_model = None
#         self.svm_model = None
#         self.label_encoder = None
#         self.load_models()
        
#         # Detection buffers
#         self.word_sequence = []
#         self.word_predictions = deque(maxlen=5)
#         self.letter_predictions = deque(maxlen=5)
#         self.hand_size_history = deque(maxlen=10)
#         self.last_prediction_time = 0
        
#     def load_models(self):
#         try:
#             print("Loading models...")
            
#             # Load word model
#             if os.path.exists(WORD_MODEL_PATH):
#                 imported = tf.saved_model.load(WORD_MODEL_PATH)
#                 self.word_model = imported.signatures["serving_default"]
#                 print("✅ Word model loaded")
#             else:
#                 print(f"⚠️ Word model not found: {WORD_MODEL_PATH}")
            
#             # Load SVM model
#             if os.path.exists(SVM_MODEL_PATH):
#                 self.svm_model = joblib.load(SVM_MODEL_PATH)
#                 print("✅ SVM model loaded")
#             else:
#                 print(f"⚠️ SVM model not found: {SVM_MODEL_PATH}")
            
#             # Load label encoder
#             if os.path.exists(LABEL_ENCODER_PATH):
#                 self.label_encoder = joblib.load(LABEL_ENCODER_PATH)
#                 print(f"✅ Label encoder loaded ({len(self.label_encoder.classes_)} classes)")
#             else:
#                 print(f"⚠️ Label encoder not found: {LABEL_ENCODER_PATH}")
                
#         except Exception as e:
#             print(f"Error loading models: {e}")
    
#     def calculate_hand_size(self, hand_landmarks):
#         if hand_landmarks is None:
#             return 0.0
        
#         x_coords = [lm.x for lm in hand_landmarks.landmark]
#         y_coords = [lm.y for lm in hand_landmarks.landmark]
        
#         x_min, x_max = min(x_coords), max(x_coords)
#         y_min, y_max = min(y_coords), max(y_coords)
        
#         width = x_max - x_min
#         height = y_max - y_min
#         area = width * height
        
#         return area
    
#     def update_distance(self, hand_landmarks):
#         if hand_landmarks is None:
#             return "unknown", 0.0
        
#         hand_size = self.calculate_hand_size(hand_landmarks)
#         self.hand_size_history.append(hand_size)
        
#         if len(self.hand_size_history) < 3:
#             return "unknown", hand_size
        
#         avg_size = np.mean(list(self.hand_size_history))
        
#         if avg_size > CLOSE_DISTANCE_THRESHOLD:
#             return "close", avg_size
#         elif avg_size < FAR_DISTANCE_THRESHOLD:
#             return "far", avg_size
        
#         return "medium", avg_size
    
#     def get_confidence_level(self, confidence):
#         if confidence > 0.8:
#             return "very high"
#         elif confidence > 0.7:
#             return "high"
#         elif confidence > 0.6:
#             return "medium"
#         else:
#             return "low"
    
#     def update_statistics(self, detection_mode, distance, hand_size, hands_count, confidence):
#         detection_state['statistics'] = {
#             'detection_mode': detection_mode,
#             'distance_status': distance,
#             'hand_size': round(hand_size, 4),
#             'hands_count': hands_count,
#             'confidence_level': self.get_confidence_level(confidence),
#             'distance_thresholds': {
#                 'close_threshold': CLOSE_DISTANCE_THRESHOLD,
#                 'far_threshold': FAR_DISTANCE_THRESHOLD
#             }
#         }
    
#     def draw_landmarks_based_on_mode(self, frame, results, detection_mode, distance):
#         annotated_frame = frame.copy()
#         hands_count = len(results.multi_hand_landmarks) if results.multi_hand_landmarks else 0
        
#         # Determine landmark color and which hands to draw on
#         if detection_mode == 'letter' or (detection_mode == 'auto' and distance == 'close'):
#             # Draw only on dominant hand (first hand) for letters - YELLOW
#             landmark_color = (0, 255, 255)  # Yellow
#             if results.multi_hand_landmarks:
#                 hand_landmarks = results.multi_hand_landmarks[0]
#                 self.mp_drawing.draw_landmarks(
#                     annotated_frame,
#                     hand_landmarks,
#                     self.mp_hands.HAND_CONNECTIONS,
#                     self.mp_drawing.DrawingSpec(color=landmark_color, thickness=3, circle_radius=3),
#                     self.mp_drawing.DrawingSpec(color=(255, 255, 255), thickness=2)
#                 )
        
#         elif detection_mode == 'word' or (detection_mode == 'auto' and distance == 'far'):
#             # Draw on all hands for words - ORANGE
#             landmark_color = (255, 165, 0)  # Orange
#             if results.multi_hand_landmarks:
#                 for hand_landmarks in results.multi_hand_landmarks:
#                     self.mp_drawing.draw_landmarks(
#                         annotated_frame,
#                         hand_landmarks,
#                         self.mp_hands.HAND_CONNECTIONS,
#                         self.mp_drawing.DrawingSpec(color=landmark_color, thickness=3, circle_radius=3),
#                         self.mp_drawing.DrawingSpec(color=(255, 255, 255), thickness=2)
#                     )
        
#         # Clean video feed - NO TEXT OVERLAYS
#         # Only show clean landmarks without any text
        
#         return annotated_frame, hands_count
    
#     def start_detection(self, mode):
#         if self.is_running:
#             self.stop_detection()
        
#         # Reset buffers
#         self.word_sequence = []
#         self.word_predictions = deque(maxlen=5)
#         self.letter_predictions = deque(maxlen=5)
#         self.hand_size_history = deque(maxlen=10)
#         self.last_prediction_time = 0
            
#         self.is_running = True
#         detection_state['mode'] = mode
#         detection_state['is_running'] = True
#         detection_state['current_prediction'] = ''
#         detection_state['confidence'] = 0
#         detection_state['current_detection_mode'] = 'unknown'
        
#         self.detection_thread = threading.Thread(target=self._detection_loop, daemon=True)
#         self.detection_thread.start()
        
#     def stop_detection(self):
#         self.is_running = False
#         detection_state['is_running'] = False
#         detection_state['landmarks_image'] = None
#         detection_state['current_detection_mode'] = 'unknown'
#         if self.cap:
#             self.cap.release()
#             self.cap = None
    
#     def _detection_loop(self):
#         try:
#             self.cap = cv2.VideoCapture(0)
#             if not self.cap.isOpened():
#                 socketio.emit('error', {'message': 'Cannot access camera'})
#                 return
                
#             # Set camera properties
#             self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
#             self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
#             self.cap.set(cv2.CAP_PROP_FPS, 30)
            
#             # Initialize MediaPipe
#             with self.mp_hands.Hands(
#                 static_image_mode=False,
#                 max_num_hands=2,
#                 min_detection_confidence=0.7,
#                 min_tracking_confidence=0.5
#             ) as hands:
                
#                 while self.is_running:
#                     ret, frame = self.cap.read()
#                     if not ret:
#                         break
                    
#                     frame = cv2.flip(frame, 1)
#                     rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
#                     results = hands.process(rgb_frame)
                    
#                     # Update distance and hand size
#                     current_distance = "unknown"
#                     current_hand_size = 0.0
#                     if results.multi_hand_landmarks:
#                         current_distance, current_hand_size = self.update_distance(results.multi_hand_landmarks[0])
                    
#                     detection_state['distance'] = current_distance
#                     detection_state['hand_size'] = current_hand_size
                    
#                     # Draw landmarks based on mode
#                     annotated_frame, hands_count = self.draw_landmarks_based_on_mode(
#                         frame, results, detection_state['mode'], current_distance
#                     )
                    
#                     detection_state['hands_detected'] = hands_count > 0
                    
#                     # Convert annotated frame to base64 for sending to frontend
#                     _, buffer = cv2.imencode('.jpg', annotated_frame, 
#                                            [cv2.IMWRITE_JPEG_QUALITY, 80])
#                     landmarks_image_base64 = base64.b64encode(buffer).decode('utf-8')
#                     detection_state['landmarks_image'] = landmarks_image_base64
                    
#                     # Perform detection based on mode
#                     current_time = time.time()
#                     if current_time - self.last_prediction_time > 0.2:  # Limit prediction rate
#                         prediction, confidence = self.process_frame(results, detection_state['mode'], current_distance)
                        
#                         if prediction and confidence > 0.6:
#                             detection_state['current_prediction'] = prediction
#                             detection_state['confidence'] = confidence
                            
#                             # Update statistics
#                             self.update_statistics(
#                                 detection_state['current_detection_mode'],
#                                 current_distance,
#                                 current_hand_size,
#                                 hands_count,
#                                 confidence
#                             )
                            
#                             # Emit real-time update via WebSocket
#                             socketio.emit('detection_update', {
#                                 'prediction': prediction,
#                                 'confidence': confidence,
#                                 'hands_detected': hands_count > 0,
#                                 'landmarks_image': landmarks_image_base64,
#                                 'mode': detection_state['mode'],
#                                 'current_detection_mode': detection_state['current_detection_mode'],
#                                 'statistics': detection_state['statistics']
#                             })
#                         else:
#                             # Still send frame updates even without new prediction
#                             self.update_statistics(
#                                 detection_state['current_detection_mode'],
#                                 current_distance,
#                                 current_hand_size,
#                                 hands_count,
#                                 confidence if prediction else 0.0
#                             )
                            
#                             socketio.emit('frame_update', {
#                                 'landmarks_image': landmarks_image_base64,
#                                 'hands_detected': hands_count > 0,
#                                 'mode': detection_state['mode'],
#                                 'current_detection_mode': detection_state['current_detection_mode'],
#                                 'statistics': detection_state['statistics']
#                             })
                        
#                         self.last_prediction_time = current_time
#                     else:
#                         # Send frame updates more frequently
#                         self.update_statistics(
#                             detection_state['current_detection_mode'],
#                             current_distance,
#                             current_hand_size,
#                             hands_count,
#                             detection_state['confidence']
#                         )
                        
#                         socketio.emit('frame_update', {
#                             'landmarks_image': landmarks_image_base64,
#                             'hands_detected': hands_count > 0,
#                             'mode': detection_state['mode'],
#                             'current_detection_mode': detection_state['current_detection_mode'],
#                             'statistics': detection_state['statistics']
#                         })
                    
#                     time.sleep(0.033)  # ~30 FPS
                    
#         except Exception as e:
#             print(f"Detection error: {e}")
#             socketio.emit('error', {'message': str(e)})
#         finally:
#             if self.cap:
#                 self.cap.release()
#                 self.cap = None
    
#     def process_frame(self, results, mode, distance):
#         if not results.multi_hand_landmarks:
#             detection_state['current_detection_mode'] = 'unknown'
#             return None, 0.0
        
#         try:
#             # Determine actual detection mode
#             detection_mode = mode
#             if mode == 'auto':
#                 detection_mode = 'letter' if distance == 'close' else 'word'
            
#             detection_state['current_detection_mode'] = detection_mode
            
#             # LETTER DETECTION
#             if detection_mode == 'letter' and self.svm_model:
#                 features = extract_features_single_hand(results)
#                 prediction = self.svm_model.predict([features])[0]
                
#                 if self.label_encoder:
#                     letter = self.label_encoder.inverse_transform([prediction])[0]
#                 else:
#                     letter = str(prediction)
                
#                 if hasattr(self.svm_model, 'predict_proba'):
#                     proba = self.svm_model.predict_proba([features])[0]
#                     confidence = float(np.max(proba))
#                 else:
#                     confidence = 0.75
                
#                 if confidence > LETTER_CONFIDENCE:
#                     self.letter_predictions.append(letter)
                    
#                     if len(self.letter_predictions) >= 3:
#                         pred_counts = Counter(self.letter_predictions)
#                         most_common, count = pred_counts.most_common(1)[0]
                        
#                         if count >= 2:  # At least 2 out of 3 predictions match
#                             return most_common, confidence
                
#                 return None, 0.0
            
#             # WORD DETECTION
#             elif detection_mode == 'word' and self.word_model:
#                 features = extract_features_both_hands(results)
#                 self.word_sequence.append(features)
                
#                 if len(self.word_sequence) >= SEQUENCE_LENGTH:
#                     try:
#                         sequence_array = tf.constant(
#                             np.array([self.word_sequence[-SEQUENCE_LENGTH:]], dtype=np.float32)
#                         )
#                         result = self.word_model(input_layer_1=sequence_array)
#                         prediction = result['output_0'].numpy()[0]
                        
#                         pred_class = np.argmax(prediction)
#                         confidence = float(np.max(prediction))
                        
#                         if confidence > WORD_CONFIDENCE:
#                             self.word_predictions.append(pred_class)
                            
#                             if len(self.word_predictions) >= 3:
#                                 pred_counts = Counter(self.word_predictions)
#                                 most_common, count = pred_counts.most_common(1)[0]
                                
#                                 if count >= 2:  # At least 2 out of 3 predictions match
#                                     return WORD_CLASSES[most_common], confidence
                    
#                     except Exception as e:
#                         print(f"Word detection error: {e}")
                
#                 if len(self.word_sequence) > SEQUENCE_LENGTH + 10:
#                     self.word_sequence = self.word_sequence[-SEQUENCE_LENGTH:]
                
#                 return None, 0.0
            
#             return None, 0.0
            
#         except Exception as e:
#             print(f"Processing error: {e}")
#             return None, 0.0
    
#     def add_to_sentence(self):
#         if detection_state['current_prediction']:
#             detection_state['sentence'].append(detection_state['current_prediction'])
#             socketio.emit('sentence_update', {
#                 'sentence': detection_state['sentence']
#             })
#             return True
#         return False
    
#     def clear_sentence(self):
#         detection_state['sentence'] = []
#         socketio.emit('sentence_update', {
#             'sentence': detection_state['sentence']
#         })

# detection_manager = RealTimeDetection()

# # ========================================================================================
# # WEBSOCKET EVENTS
# # ========================================================================================

# @socketio.on('connect')
# def handle_connect():
#     print('Client connected')
#     emit('connection_response', {'status': 'connected'})

# @socketio.on('disconnect')
# def handle_disconnect():
#     print('Client disconnected')

# @socketio.on('start_detection')
# def handle_start_detection(data):
#     mode = data.get('mode', 'auto')
#     detection_manager.start_detection(mode)
#     emit('detection_started', {'mode': mode})

# @socketio.on('stop_detection')
# def handle_stop_detection():
#     detection_manager.stop_detection()
#     emit('detection_stopped')

# @socketio.on('add_to_sentence')
# def handle_add_to_sentence():
#     success = detection_manager.add_to_sentence()
#     emit('add_result', {'success': success})

# @socketio.on('clear_sentence')
# def handle_clear_sentence():
#     detection_manager.clear_sentence()

# @socketio.on('speak_sentence')
# def handle_speak_sentence():
#     if detection_state['sentence']:
#         sentence = " ".join(detection_state['sentence'])
#         emit('speech', {'text': sentence})

# @app.route('/api/status')
# def get_status():
#     return jsonify(detection_state)

# if __name__ == '__main__':
#     print("Starting SignMate Flask-SocketIO Server...")
#     socketio.run(app, debug=False, port=5000, host='127.0.0.1')









from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import cv2
import mediapipe as mp
import numpy as np
import tensorflow as tf
import joblib
from collections import deque, Counter
import time
import os
import threading
import base64

app = Flask(__name__)
app.config['SECRET_KEY'] = 'signmate_secret_key_2025'
socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app)

# ========================================================================================
# CONFIGURATION
# ========================================================================================

WORD_MODEL_PATH = r"./models/saved_model"
SVM_MODEL_PATH = r"./models/ISL_Model_working/isl_svm_model.pkl"
LABEL_ENCODER_PATH = r"./models/ISL_Model_working/label_encoder.pkl"

WORD_CLASSES = ["Hello", "Good Morning", "Thank you", "Close", "Exam"]
WORD_FEATURES = 126
LETTER_FEATURES = 63
SEQUENCE_LENGTH = 20

WORD_CONFIDENCE = 0.65
LETTER_CONFIDENCE = 0.50

CLOSE_DISTANCE_THRESHOLD = 0.10
FAR_DISTANCE_THRESHOLD = 0.5

# Global detection state
detection_state = {
    'mode': 'auto',
    'is_running': False,
    'current_prediction': '',
    'confidence': 0,
    'sentence': [],
    'hands_detected': False,
    'landmarks_image': None,
    'distance': 'unknown',
    'current_detection_mode': 'unknown',  # For auto mode: shows if it's detecting letter or word
    'hand_size': 0.0,
    'statistics': {
        'detection_mode': 'unknown',
        'distance_status': 'unknown',
        'hand_size': 0.0,
        'hands_count': 0,
        'confidence_level': 'low'
    }
}

# ========================================================================================
# FEATURE EXTRACTION
# ========================================================================================

def normalize_landmarks_126(keypoints):
    if len(keypoints) == 0 or np.all(keypoints == 0):
        return keypoints
    
    keypoints = np.array(keypoints)
    normalized = []
    
    for hand_idx in range(2):
        start_idx = hand_idx * 63
        end_idx = start_idx + 63
        hand_data = keypoints[start_idx:end_idx]
        
        if np.any(hand_data != 0):
            landmarks = hand_data.reshape(21, 3)
            wrist = landmarks[0].copy()
            landmarks = landmarks - wrist
            
            middle_finger_tip = landmarks[12]
            hand_scale = np.linalg.norm(middle_finger_tip) + 1e-6
            landmarks = landmarks / hand_scale
            
            normalized.extend(landmarks.flatten())
        else:
            normalized.extend([0.0] * 63)
    
    return np.array(normalized, dtype=np.float32)

def extract_features_both_hands(results):
    keypoints = []
    
    if results.multi_hand_landmarks:
        hand_data = []
        for i, hand_landmarks in enumerate(results.multi_hand_landmarks):
            hand_label = results.multi_handedness[i].classification[0].label
            landmarks = []
            for lm in hand_landmarks.landmark:
                landmarks.extend([lm.x, lm.y, lm.z])
            hand_data.append((hand_label, landmarks))
        
        hand_data.sort(key=lambda x: x[0])
        
        for _, landmarks in hand_data:
            keypoints.extend(landmarks)
    
    while len(keypoints) < WORD_FEATURES:
        keypoints.append(0.0)
    
    keypoints = normalize_landmarks_126(keypoints[:WORD_FEATURES])
    return np.array(keypoints, dtype=np.float32)

def extract_features_single_hand(results):
    features = []
    
    if results.multi_hand_landmarks:
        hand_landmarks = results.multi_hand_landmarks[0]
        for lm in hand_landmarks.landmark:
            features.extend([lm.x, lm.y, lm.z])
    
    while len(features) < LETTER_FEATURES:
        features.append(0.0)
    
    return np.array(features[:LETTER_FEATURES], dtype=np.float32)

# ========================================================================================
# REAL TIME DETECTION
# ========================================================================================

class RealTimeDetection:
    def __init__(self):
        self.cap = None
        self.detection_thread = None
        self.is_running = False
        
        # Initialize MediaPipe
        self.mp_hands = mp.solutions.hands
        self.mp_drawing = mp.solutions.drawing_utils
        self.mp_drawing_styles = mp.solutions.drawing_styles
        
        # Initialize models
        self.word_model = None
        self.svm_model = None
        self.label_encoder = None
        self.load_models()
        
        # Detection buffers
        self.word_sequence = []
        self.word_predictions = deque(maxlen=5)
        self.letter_predictions = deque(maxlen=5)
        self.hand_size_history = deque(maxlen=10)
        self.last_prediction_time = 0
        
    def load_models(self):
        try:
            print("Loading models...")
            
            # Load word model
            if os.path.exists(WORD_MODEL_PATH):
                imported = tf.saved_model.load(WORD_MODEL_PATH)
                self.word_model = imported.signatures["serving_default"]
                print("✅ Word model loaded")
            else:
                print(f"⚠️ Word model not found: {WORD_MODEL_PATH}")
            
            # Load SVM model
            if os.path.exists(SVM_MODEL_PATH):
                self.svm_model = joblib.load(SVM_MODEL_PATH)
                print("✅ SVM model loaded")
            else:
                print(f"⚠️ SVM model not found: {SVM_MODEL_PATH}")
            
            # Load label encoder
            if os.path.exists(LABEL_ENCODER_PATH):
                self.label_encoder = joblib.load(LABEL_ENCODER_PATH)
                print(f"✅ Label encoder loaded ({len(self.label_encoder.classes_)} classes)")
            else:
                print(f"⚠️ Label encoder not found: {LABEL_ENCODER_PATH}")
                
        except Exception as e:
            print(f"Error loading models: {e}")
    
    def calculate_hand_size(self, hand_landmarks):
        if hand_landmarks is None:
            return 0.0
        
        x_coords = [lm.x for lm in hand_landmarks.landmark]
        y_coords = [lm.y for lm in hand_landmarks.landmark]
        
        x_min, x_max = min(x_coords), max(x_coords)
        y_min, y_max = min(y_coords), max(y_coords)
        
        width = x_max - x_min
        height = y_max - y_min
        area = width * height
        
        return area
    
    def update_distance(self, hand_landmarks):
        if hand_landmarks is None:
            return "unknown", 0.0
        
        hand_size = self.calculate_hand_size(hand_landmarks)
        self.hand_size_history.append(hand_size)
        
        if len(self.hand_size_history) < 3:
            return "unknown", hand_size
        
        avg_size = np.mean(list(self.hand_size_history))
        
        if avg_size > CLOSE_DISTANCE_THRESHOLD:
            return "close", avg_size
        elif avg_size < FAR_DISTANCE_THRESHOLD:
            return "far", avg_size
        
        return "medium", avg_size
    
    def get_confidence_level(self, confidence):
        if confidence > 0.8:
            return "very high"
        elif confidence > 0.7:
            return "high"
        elif confidence > 0.6:
            return "medium"
        else:
            return "low"
    
    def update_statistics(self, detection_mode, distance, hand_size, hands_count, confidence):
        detection_state['statistics'] = {
            'detection_mode': detection_mode,
            'distance_status': distance,
            'hand_size': round(hand_size, 4),
            'hands_count': hands_count,
            'confidence_level': self.get_confidence_level(confidence),
            'distance_thresholds': {
                'close_threshold': CLOSE_DISTANCE_THRESHOLD,
                'far_threshold': FAR_DISTANCE_THRESHOLD
            }
        }
    
    def draw_landmarks_based_on_mode(self, frame, results, detection_mode, distance):
        annotated_frame = frame.copy()
        hands_count = len(results.multi_hand_landmarks) if results.multi_hand_landmarks else 0
        
        # Determine landmark color and which hands to draw on
        if detection_mode == 'letter' or (detection_mode == 'auto' and distance == 'close'):
            # Draw only on dominant hand (first hand) for letters - YELLOW
            landmark_color = (0, 255, 255)  # Yellow
            if results.multi_hand_landmarks:
                hand_landmarks = results.multi_hand_landmarks[0]
                self.mp_drawing.draw_landmarks(
                    annotated_frame,
                    hand_landmarks,
                    self.mp_hands.HAND_CONNECTIONS,
                    self.mp_drawing.DrawingSpec(color=landmark_color, thickness=3, circle_radius=3),
                    self.mp_drawing.DrawingSpec(color=(255, 255, 255), thickness=2)
                )
        
        elif detection_mode == 'word' or (detection_mode == 'auto' and distance == 'far'):
            # Draw on all hands for words - ORANGE
            landmark_color = (255, 165, 0)  # Orange
            if results.multi_hand_landmarks:
                for hand_landmarks in results.multi_hand_landmarks:
                    self.mp_drawing.draw_landmarks(
                        annotated_frame,
                        hand_landmarks,
                        self.mp_hands.HAND_CONNECTIONS,
                        self.mp_drawing.DrawingSpec(color=landmark_color, thickness=3, circle_radius=3),
                        self.mp_drawing.DrawingSpec(color=(255, 255, 255), thickness=2)
                    )
        
        # Clean video feed - NO TEXT OVERLAYS
        # Only show clean landmarks without any text
        
        return annotated_frame, hands_count
    
    def start_detection(self, mode):
        if self.is_running:
            self.stop_detection()
        
        # Reset buffers
        self.word_sequence = []
        self.word_predictions = deque(maxlen=5)
        self.letter_predictions = deque(maxlen=5)
        self.hand_size_history = deque(maxlen=10)
        self.last_prediction_time = 0
            
        self.is_running = True
        detection_state['mode'] = mode
        detection_state['is_running'] = True
        detection_state['current_prediction'] = ''
        detection_state['confidence'] = 0
        detection_state['current_detection_mode'] = 'unknown'
        
        self.detection_thread = threading.Thread(target=self._detection_loop, daemon=True)
        self.detection_thread.start()
        
    def stop_detection(self):
        self.is_running = False
        detection_state['is_running'] = False
        detection_state['landmarks_image'] = None
        detection_state['current_detection_mode'] = 'unknown'
        if self.cap:
            self.cap.release()
            self.cap = None
    
    def _detection_loop(self):
        try:
            self.cap = cv2.VideoCapture(0)
            if not self.cap.isOpened():
                socketio.emit('error', {'message': 'Cannot access camera'})
                return
                
            # Set camera properties
            self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
            self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
            self.cap.set(cv2.CAP_PROP_FPS, 30)
            
            # Initialize MediaPipe
            with self.mp_hands.Hands(
                static_image_mode=False,
                max_num_hands=2,
                min_detection_confidence=0.7,
                min_tracking_confidence=0.5
            ) as hands:
                
                while self.is_running:
                    ret, frame = self.cap.read()
                    if not ret:
                        break
                    
                    frame = cv2.flip(frame, 1)
                    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                    results = hands.process(rgb_frame)
                    
                    # Update distance and hand size
                    current_distance = "unknown"
                    current_hand_size = 0.0
                    if results.multi_hand_landmarks:
                        current_distance, current_hand_size = self.update_distance(results.multi_hand_landmarks[0])
                    
                    detection_state['distance'] = current_distance
                    detection_state['hand_size'] = current_hand_size
                    
                    # Draw landmarks based on mode
                    annotated_frame, hands_count = self.draw_landmarks_based_on_mode(
                        frame, results, detection_state['mode'], current_distance
                    )
                    
                    detection_state['hands_detected'] = hands_count > 0
                    
                    # Convert annotated frame to base64 for sending to frontend
                    _, buffer = cv2.imencode('.jpg', annotated_frame, 
                                           [cv2.IMWRITE_JPEG_QUALITY, 80])
                    landmarks_image_base64 = base64.b64encode(buffer).decode('utf-8')
                    detection_state['landmarks_image'] = landmarks_image_base64
                    
                    # Perform detection based on mode
                    current_time = time.time()
                    if current_time - self.last_prediction_time > 0.2:  # Limit prediction rate
                        prediction, confidence = self.process_frame(results, detection_state['mode'], current_distance)
                        
                        if prediction and confidence > 0.6:
                            detection_state['current_prediction'] = prediction
                            detection_state['confidence'] = confidence
                            
                            # Update statistics
                            self.update_statistics(
                                detection_state['current_detection_mode'],
                                current_distance,
                                current_hand_size,
                                hands_count,
                                confidence
                            )
                            
                            # Emit real-time update via WebSocket
                            socketio.emit('detection_update', {
                                'prediction': prediction,
                                'confidence': confidence,
                                'hands_detected': hands_count > 0,
                                'landmarks_image': landmarks_image_base64,
                                'mode': detection_state['mode'],
                                'current_detection_mode': detection_state['current_detection_mode'],
                                'statistics': detection_state['statistics']
                            })
                        else:
                            # Still send frame updates even without new prediction
                            self.update_statistics(
                                detection_state['current_detection_mode'],
                                current_distance,
                                current_hand_size,
                                hands_count,
                                confidence if prediction else 0.0
                            )
                            
                            socketio.emit('frame_update', {
                                'landmarks_image': landmarks_image_base64,
                                'hands_detected': hands_count > 0,
                                'mode': detection_state['mode'],
                                'current_detection_mode': detection_state['current_detection_mode'],
                                'statistics': detection_state['statistics']
                            })
                        
                        self.last_prediction_time = current_time
                    else:
                        # Send frame updates more frequently
                        self.update_statistics(
                            detection_state['current_detection_mode'],
                            current_distance,
                            current_hand_size,
                            hands_count,
                            detection_state['confidence']
                        )
                        
                        socketio.emit('frame_update', {
                            'landmarks_image': landmarks_image_base64,
                            'hands_detected': hands_count > 0,
                            'mode': detection_state['mode'],
                            'current_detection_mode': detection_state['current_detection_mode'],
                            'statistics': detection_state['statistics']
                        })
                    
                    time.sleep(0.033)  # ~30 FPS
                    
        except Exception as e:
            print(f"Detection error: {e}")
            socketio.emit('error', {'message': str(e)})
        finally:
            if self.cap:
                self.cap.release()
                self.cap = None
    
    def process_frame(self, results, mode, distance):
        if not results.multi_hand_landmarks:
            detection_state['current_detection_mode'] = 'unknown'
            return None, 0.0
        
        try:
            # Determine actual detection mode
            detection_mode = mode
            if mode == 'auto':
                detection_mode = 'letter' if distance == 'close' else 'word'
            
            detection_state['current_detection_mode'] = detection_mode
            
            # LETTER DETECTION
            if detection_mode == 'letter' and self.svm_model:
                features = extract_features_single_hand(results)
                prediction = self.svm_model.predict([features])[0]
                
                if self.label_encoder:
                    letter = self.label_encoder.inverse_transform([prediction])[0]
                else:
                    letter = str(prediction)
                
                if hasattr(self.svm_model, 'predict_proba'):
                    proba = self.svm_model.predict_proba([features])[0]
                    confidence = float(np.max(proba))
                else:
                    confidence = 0.75
                
                if confidence > LETTER_CONFIDENCE:
                    self.letter_predictions.append(letter)
                    
                    if len(self.letter_predictions) >= 3:
                        pred_counts = Counter(self.letter_predictions)
                        most_common, count = pred_counts.most_common(1)[0]
                        
                        if count >= 2:  # At least 2 out of 3 predictions match
                            return most_common, confidence
                
                return None, 0.0
            
            # WORD DETECTION
            elif detection_mode == 'word' and self.word_model:
                features = extract_features_both_hands(results)
                self.word_sequence.append(features)
                
                if len(self.word_sequence) >= SEQUENCE_LENGTH:
                    try:
                        sequence_array = tf.constant(
                            np.array([self.word_sequence[-SEQUENCE_LENGTH:]], dtype=np.float32)
                        )
                        result = self.word_model(input_layer_1=sequence_array)
                        prediction = result['output_0'].numpy()[0]
                        
                        pred_class = np.argmax(prediction)
                        confidence = float(np.max(prediction))
                        
                        if confidence > WORD_CONFIDENCE:
                            self.word_predictions.append(pred_class)
                            
                            if len(self.word_predictions) >= 3:
                                pred_counts = Counter(self.word_predictions)
                                most_common, count = pred_counts.most_common(1)[0]
                                
                                if count >= 2:  # At least 2 out of 3 predictions match
                                    return WORD_CLASSES[most_common], confidence
                    
                    except Exception as e:
                        print(f"Word detection error: {e}")
                
                if len(self.word_sequence) > SEQUENCE_LENGTH + 10:
                    self.word_sequence = self.word_sequence[-SEQUENCE_LENGTH:]
                
                return None, 0.0
            
            return None, 0.0
            
        except Exception as e:
            print(f"Processing error: {e}")
            return None, 0.0
    
    def add_to_sentence(self, data=None):
        if detection_state['current_prediction']:
            # Check if it's a letter or word to determine spacing
            is_letter = len(detection_state['current_prediction']) == 1
            
            if is_letter:
                # For letters, add directly without space
                detection_state['sentence'].append(detection_state['current_prediction'])
            else:
                # For words, add space before the word (except for first word)
                if detection_state['sentence']:
                    detection_state['sentence'].append(' ')
                detection_state['sentence'].append(detection_state['current_prediction'])
            
            socketio.emit('sentence_update', {
                'sentence': detection_state['sentence']
            })
            return True
        return False
    
    def add_space(self):
        """Add a space to the sentence"""
        detection_state['sentence'].append(' ')
        socketio.emit('sentence_update', {
            'sentence': detection_state['sentence']
        })
        return True
    
    def remove_last_character(self):
        """Remove the last character from the sentence"""
        if detection_state['sentence']:
            detection_state['sentence'].pop()
            socketio.emit('sentence_update', {
                'sentence': detection_state['sentence']
            })
            return True
        return False
    
    def clear_sentence(self):
        detection_state['sentence'] = []
        socketio.emit('sentence_update', {
            'sentence': detection_state['sentence']
        })

detection_manager = RealTimeDetection()

# ========================================================================================
# WEBSOCKET EVENTS
# ========================================================================================

@socketio.on('connect')
def handle_connect():
    print('Client connected')
    emit('connection_response', {'status': 'connected'})

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('start_detection')
def handle_start_detection(data):
    mode = data.get('mode', 'auto')
    detection_manager.start_detection(mode)
    emit('detection_started', {'mode': mode})

@socketio.on('stop_detection')
def handle_stop_detection():
    detection_manager.stop_detection()
    emit('detection_stopped')

@socketio.on('add_to_sentence')
def handle_add_to_sentence(data=None):
    success = detection_manager.add_to_sentence(data)
    emit('add_result', {'success': success})

@socketio.on('add_space')
def handle_add_space():
    success = detection_manager.add_space()
    emit('space_added', {'success': success})

@socketio.on('remove_last_character')
def handle_remove_last_character():
    success = detection_manager.remove_last_character()
    emit('character_removed', {'success': success})

@socketio.on('clear_sentence')
def handle_clear_sentence():
    detection_manager.clear_sentence()

@socketio.on('speak_sentence')
def handle_speak_sentence():
    if detection_state['sentence']:
        # Join without spaces for letters, with spaces for words
        sentence_text = ''.join(detection_state['sentence'])
        emit('speech', {'text': sentence_text})

@app.route('/api/status')
def get_status():
    return jsonify(detection_state)

if __name__ == '__main__':
    print("Starting SignMate Flask-SocketIO Server...")
    socketio.run(app, debug=False, port=5000, host='127.0.0.1')