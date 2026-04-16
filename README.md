# SignMate: An AI Driven Multimodal Communication System for the Speech and Hearing Impaired

An AI-powered web application for real-time Indian Sign Language (ISL) gesture recognition and translation.

## Features

- 🤟 **Real-time ISL Detection**: Recognizes 40+ ISL gestures including letters, digits, and common words 
- 🔄 **Auto Mode**: Automatically switches between letter and word detection based on hand distance
- 🌐 **Multi-language Translation**: Translates detected signs to Hindi, Tamil, Telugu, Kannada, and more
- 🔊 **Text-to-Speech**: Converts recognized signs into audio output
- 🎯 **Distance-based Detection**: Uses hand proximity to determine detection mode
- 📊 **Live Statistics**: Tracks detection accuracy and session metrics

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Socket.io Client

### Backend
- Flask (Python)
- Socket.io Server
- MediaPipe (Hand tracking)

### AI/ML Models
- Support Vector Machine (SVM) for letters/digits
- CNN-BiLSTM for word recognition
- TensorFlow/Keras

## Installation

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8+
- Webcam

### Backend Setup
```bash
pip install -r requirements.txt
python signmate_server.py
```
### Frontend Setup
```bash
npm install
npm start
```
