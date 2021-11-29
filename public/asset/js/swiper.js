const swiperWrapper = document.querySelector('#knowledge .wrapper')

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
});