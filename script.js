'use strict';
const createWorker = Tesseract.createWorker;
(async () => {
  // Load Tesseract
  try {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const result = document.getElementById('result');
    const worker = await createWorker('eng', 0, {
      // legacyCore: true,
      // legacyLang: true,
      logger: m => console.log(m), // Add logger here
    });
    await worker.setParameters({
      tessedit_pageseg_mode: Tesseract.PSM.AUTO, // Or Tesseract.PSM.AUTO_OSD
    });
    console.log('worker', worker);
    // Access webcam
    const stream = await navigator.mediaDevices
      .getUserMedia({
        video: { width: 2880, height: 1800 },
        audio: false,
      })
      .catch(error => {
        console.error('Error accessing the webcam:', error);
      });

    // OCR Processing Function
    const processImage = async () => {
      console.log('Processing image...');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      console.log('canvas.width', canvas.width, video.videoWidth);
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const {
        data: { text },
      } = await worker.recognize(canvas.toDataURL('image/png'));
      // const { data } = await worker.detect(canvas.toDataURL('image/png'));
      // console.log('Script Detection Result:', data);
      console.log('text', text);
      result.textContent += text;
    };
    // run processImage in loop and wait for to be resolved
    video.srcObject = stream;
    video.play();
    setTimeout(async () => {
      while (true) {
        await processImage();
      }
    }, 1500);
  } catch (error) {
    console.error('Error:', error);
  }
})();
