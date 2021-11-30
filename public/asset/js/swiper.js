const swiperWrapper = document.querySelector('#knowledge .wrapper')
const previousSlide = document.querySelector('#knowledge .arrowWrapper .previousSlide')
const nextSlide = document.querySelector('#knowledge .arrowWrapper .nextSlide')


const swiper = new Swiper(swiperWrapper, {
    // Optional parameters
    direction: 'horizontal',
    effect: 'cards',
    loop: true,
    slideShadows: false,
    speed: 300,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false
    },
    navigation: {
        nextEl: nextSlide,
        prevEl: previousSlide,
    },
});