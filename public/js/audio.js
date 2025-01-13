const audio = document.getElementById('backgroundMusic');
const buttonMute = document.getElementById('volume-mute');
const barAudio = document.getElementById('volumeControl');
const svgs = buttonMute.querySelectorAll('svg');

function togglePlayPause() {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

function changeVolume(volume) {
  audio.volume = volume;
  const localStorageSom = localStorage.getItem('som');
  if(!localStorageSom){
    localStorage.setItem('som', volume);
  } 

  if(localStorageSom && JSON.parse(localStorageSom) !== volume){
    localStorage.removeItem('som');
    localStorage.setItem('som', volume);
  }
}

function toggleVolumeSvg(){
  svgs[0].classList.toggle('disable');
  svgs[1].classList.toggle('active');
}

function muteVolumeSvg(){
  svgs[0].classList.add('disable');
  svgs[0].classList.remove('active');
  svgs[1].classList.add('active');
  svgs[1].classList.remove('disable');
}

function unmuteVolumeSvg(){
  svgs[0].classList.add('active');
  svgs[0].classList.remove('disable');
  svgs[1].classList.add('disable');
  svgs[1].classList.remove('active');
}

function muteAudio(){
  audio.pause();
  muteVolumeSvg();
}

function unmuteAudio(){
  audio.play();
  unmuteVolumeSvg();
}

barAudio.addEventListener('change', function() {
  changeVolume(this.value);
  if(this.value == 0){
    muteAudio();
  }

  if(this.value > 0){
    unmuteAudio();
  }
});

document.addEventListener('DOMContentLoaded', function(){
  if(localStorage.getItem('som')){
    const value = JSON.parse(localStorage.getItem('som'));
    barAudio.value = value;
    audio.volume = value;
    if(value == 0){
      muteVolumeSvg();
    } 
  };
});

// buttonMute.addEventListener('click', function() {
//   togglePlayPause();
//   toggleVolumeSvg();
// });