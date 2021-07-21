//При перемещении ползунка меняется внешний вид фото
const inputs = document.querySelectorAll('.filters input');

document.documentElement.style.setProperty(`--blur`, '0px');
document.documentElement.style.setProperty(`--invert`, '0%');
document.documentElement.style.setProperty(`--sepia`, '0%');
document.documentElement.style.setProperty(`--saturate`, '100%');
document.documentElement.style.setProperty(`--hue`, '0deg');

function handleUpdate() {
   const suffix = this.dataset.sizing;
   document.documentElement.style.setProperty(`--${this.name}`, this.value + suffix);
   //Возле каждого ползунка отображается его актуальное значение
   let output = document.querySelector(`input[name="${this.name}"]~output`);
   output.value = this.value;
}

inputs.forEach(item => item.addEventListener('input', handleUpdate));

//Реализован сброс css-фильтров
const btnReset = document.querySelector('.btn-reset');
btnReset.addEventListener('click', resetInputs);

function resetInputs() {
   for (let i = 0; i < inputs.length; i++) {
      let input = inputs[i];
      let inputVal = input.getAttribute('value');
      const suffix = input.dataset.sizing;
      let output = document.querySelector(`input[name="${input.name}"]~output`);
      output.value = inputVal;
      input.value = inputVal;
      document.documentElement.style.setProperty(`--${input.name}`, inputVal + suffix);
   }
}

//Подключенная картинка соответствует текущему времени суток
const now = new Date();
const hours = now.getHours();
let timesOfDay = '';
if (hours >= 6 && hours < 12) {
   timesOfDay = 'morning';
} else if (hours >= 12 && hours < 18) {
   timesOfDay = 'day';
} else if (hours >= 18 && hours <= 23) {
   timesOfDay = 'evening';
} else {
   timesOfDay = 'night';
}

//Pеализована возможность смены картинок, подключенных по ссылке
const btnNext = document.querySelector('.btn-next');
const picture = document.querySelector('.picture');
const imgUrlBase = 'https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/';
const imgUrlEnds = ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg',
   '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'];
let i = -1;

function showImage(src) {
   const image = new Image();
   image.src = src;
   image.onload = () => {
      picture.setAttribute('src', `${src}`);
   }
}
function getImage() {
   i++;
   const indexImgEnd = i % imgUrlEnds.length;
   const imgSrc = imgUrlBase + timesOfDay + '/' + imgUrlEnds[indexImgEnd];
   showImage(imgSrc);
}
btnNext.addEventListener('click', getImage);
showImage('assets/img/img.jpg');

//Изображение можно загрузить с локального компьютера 
let fileInput = document.querySelector('#btnInput');

fileInput.addEventListener('change', function (e) {
   const file = fileInput.files[0];
   const reader = new FileReader();
   reader.onload = () => {
      const fileSrc = reader.result; //returns the file's contents
      const img = new Image();
      img.src = fileSrc;
      picture.setAttribute('src', `${fileSrc}`);
      fileInput.value = null;
   }
   reader.readAsDataURL(file);
});

//Изображение можно скачать на компьютер

const canvas = document.querySelector('canvas');
const btnSave = document.querySelector('.btn-save')
function downloadImage() {
   //Drow picture
   const picSrc = picture.getAttribute("src");
   const img = new Image();
   img.setAttribute('crossOrigin', 'anonymous');
   img.src = picSrc;
   img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      let ctx = canvas.getContext("2d"); //задали контекст рисования
      addFilter(ctx);
      ctx.drawImage(img, 0, 0);

      //Download picture
      const dataURL = canvas.toDataURL("image/png");
      let link = document.createElement('a');
      link.download = 'download.png';
      link.href = dataURL;
      link.click();
      link.delete;
   };
}

btnSave.addEventListener('click', downloadImage);

//Изображение скачивается на компьютер с применёнными фильтрами 
function addFilter(ctx) {
   let widthK = canvas.width / picture.width;
   let heightK = canvas.height / picture.height;
   let k = Math.max(widthK, heightK);
   let blur = document.documentElement.style.getPropertyValue(`--blur`);
   let blurResult = (blur.substring(0, blur.length - 2) * k) + 'px';
   let hue = document.documentElement.style.getPropertyValue(`--hue`);
   let invertPercent = document.documentElement.style.getPropertyValue(`--invert`);
   let invertDigit = invertPercent.substring(0, invertPercent.length - 1) / 100;
   let sepiaPercent = document.documentElement.style.getPropertyValue(`--sepia`);
   let sepiaDigit = sepiaPercent.substring(0, sepiaPercent.length - 1) / 100;
   let saturatePercent = document.documentElement.style.getPropertyValue(`--saturate`);
   let saturateDigit = saturatePercent.substring(0, saturatePercent.length - 1) / 100;
   ctx.filter = `blur(${blurResult}) invert(${invertDigit}) sepia(${sepiaDigit}) saturate(${saturateDigit}) hue-rotate(${hue})`;
}
//Реализована функциональность кнопки Fullscreen (взаимодействует с клавишей Esc)

const fullscreen = document.querySelector('.fullscreen');

fullscreen.addEventListener("click", toggleFullScreen, false);

document.addEventListener("keypress", function (e) {
   if (e.code === 'Escape') {
      toggleFullScreen();
   }
}, false);

function toggleFullScreen() {
   if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
   } else {
      if (document.exitFullscreen) {
         document.exitFullscreen();
      }
   }
}