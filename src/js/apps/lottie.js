import { DotLottie } from '@lottiefiles/dotlottie-web';

document.querySelectorAll('canvas.lottie').forEach((canvas) => {
  const dotLottie = new DotLottie({
    autoplay: false,
    loop: false,
    canvas: canvas,
    src: canvas.dataset.src,
  });

  // 로드 완료 후 마지막 프레임으로 이동
  dotLottie.addEventListener('load', () => {
    dotLottie.setFrame(dotLottie.totalFrames - 1);
  });

  canvas.addEventListener('mouseenter', () => {
    if (dotLottie.isPlaying) {
      return; 
    }
    dotLottie.setFrame(0);
    dotLottie.play();
  });

});