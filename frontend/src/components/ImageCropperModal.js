import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css'; 
import { X } from 'lucide-react';

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

// aspect parametresini dışarıdan alıyoruz. Varsayılan olarak 1 (Kare) verdik.
const ImageCropperModal = ({ imgSrc, onCropComplete, onClose, aspect = 1 }) => {
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const imgRef = useRef(null);

  const onImageLoad = useCallback((e) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, aspect)); // Dışarıdan gelen orana göre kilitler
  }, [aspect]);

  const getCroppedImg = useCallback(() => {
    if (!completedCrop || !imgRef.current) return;

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const trueWidth = completedCrop.width * scaleX;
    const trueHeight = completedCrop.height * scaleY;

    // Esnemeyi önleyen kilit: Canvas boyutunu seçilen alanın tam piksel oranlarına eşitliyoruz!
    canvas.width = trueWidth;
    canvas.height = trueHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingQuality = 'high';
    ctx.imageSmoothingEnabled = true;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      trueWidth,
      trueHeight,
      0,
      0,
      trueWidth,
      trueHeight
    );

    const base64Image = canvas.toDataURL('image/jpeg', 0.85);
    onCropComplete(base64Image);
  }, [completedCrop, onCropComplete]);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-[35px] p-8 w-full max-w-md shadow-2xl relative space-y-6">
        <button type="button" onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-[#8e7eb5]">
          <X size={20} />
        </button>

        <div className="text-center">
          <h3 className="font-['Playfair_Display'] text-2xl font-bold text-[#8e7eb5]">Fotoğrafı Kırp</h3>
          <p className="text-xs text-gray-400 mt-1 font-bold uppercase tracking-wider">
            {aspect === 1 ? "Mükemmel Bir Kare Seç" : "Koleksiyon Kartı İçin Dikey Alan Seç"}
          </p>
        </div>

        <div className="border border-black/5 rounded-2xl p-2 bg-[#fdfaf3]/50 flex items-center justify-center max-h-[350px] overflow-auto">
          {imgSrc && (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect} // Dinamik oran kilidi devrede!
              keepSelection={true}
            >
              <img 
                ref={imgRef} 
                alt="Crop master" 
                src={imgSrc} 
                onLoad={onImageLoad} 
                className="max-h-[300px] w-auto max-w-none object-contain" 
                style={{ display: 'block' }}
              />
            </ReactCrop>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 bg-gray-100 text-gray-600 text-xs font-bold py-3.5 rounded-xl hover:bg-gray-200">
            Vazgeç
          </button>
          <button type="button" onClick={getCroppedImg} className="flex-1 bg-[#8e7eb5] text-white text-xs font-bold py-3.5 rounded-xl shadow-md hover:bg-[#7a6aa0]">
            Kırp ve Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropperModal;