import sys
import os

# Suppress TF warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

try:
    import numpy as np
    from tensorflow.keras.models import load_model
    from tensorflow.keras.preprocessing.image import load_img, img_to_array
    from tensorflow.keras.applications.resnet50 import preprocess_input
except ImportError:
    print("ERROR: Faltan dependencias. Ejecuta 'pip install tensorflow numpy Pillow'")
    sys.exit(1)

def main():
    if len(sys.argv) < 4:
        print("Uso: python predict_ctg.py <ruta_imagen> <escala_x_norm> <ruta_modelo>")
        sys.exit(1)

    image_path = sys.argv[1]
    try:
        x_norm = float(sys.argv[2])
    except ValueError:
        print("ERROR: escala_x_norm debe ser numérico")
        sys.exit(1)
        
    model_path = sys.argv[3]
    
    # y_norm always 0.0 as per instructions
    y_norm = 0.0

    if not os.path.exists(image_path):
        print(f"ERROR: La imagen no existe en {image_path}")
        sys.exit(1)

    if not os.path.exists(model_path):
        print(f"ERROR: El modelo no existe en {model_path}")
        sys.exit(1)

    try:
        # 1. Load model
        model = load_model(model_path)

        # 2. Process image (resize to 224x800 as specified)
        img = load_img(image_path, target_size=(224, 800))
        img_arr = img_to_array(img)
        img_batch = np.expand_dims(img_arr, axis=0)

        # Preprocess using ResNet50 preprocessing (RGB to BGR and ImageNet mean subtraction)
        img_batch = preprocess_input(img_batch)

        # 3. Process tabular data
        tab_batch = np.array([[x_norm, y_norm]], dtype=np.float32)

        # 4. Predict
        predictions = model.predict([img_batch, tab_batch], verbose=0)
        
        prob = predictions[0][0]
        print(f"PROBABILITY:{prob:.4f}")

    except Exception as e:
        print(f"ERROR: {str(e)}")
        sys.exit(1)

if __name__ == '__main__':
    main()
