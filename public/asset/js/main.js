// DEFINTIONS

const leftDefinition = document.querySelector('#definition .wrapper .left-wrapper')
const middleDefinition = document.querySelector('#definition .wrapper .middle-wrapper')
const rightDefinition = document.querySelector('#definition .wrapper .right-wrapper')


const invisibleContainerLeft = document.querySelector('.invisible-container-left')
const invisibleContainerMiddle = document.querySelector('.invisible-container-middle')
const invisibleContainerRight = document.querySelector('.invisible-container-right')

const rotateCard = (item) => {
    item.classList.toggle("isHover")

}



invisibleContainerLeft.addEventListener("mouseover", (e) => {
    rotateCard(leftDefinition)
})
invisibleContainerMiddle.addEventListener("mouseover", (e) => {
    rotateCard(middleDefinition)

})
invisibleContainerRight.addEventListener("mouseover", (e) => {
    rotateCard(rightDefinition)
})




invisibleContainerLeft.addEventListener("mouseout", (e) => {
    rotateCard(leftDefinition)
})
invisibleContainerMiddle.addEventListener("mouseout", (e) => {
    rotateCard(middleDefinition)

})
invisibleContainerRight.addEventListener("mouseout", (e) => {
    rotateCard(rightDefinition)
})

// AOS

AOS.init({
    // Global settings:
    disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
    startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on
    initClassName: 'aos-init', // class applied after initialization
    animatedClassName: 'aos-animate', // class applied on animation
    useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
    disableMutationObserver: false, // disables automatic mutations' detections (advanced)
    debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
    throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)


    // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
    offset: 120, // offset (in px) from the original trigger point
    delay: 0, // values from 0 to 3000, with step 50ms
    duration: 800, // values from 0 to 3000, with step 50ms
    easing: 'ease-in-out', // default easing for AOS animations
    once: true, // whether animation should happen only once - while scrolling down
    mirror: false, // whether elements should animate out while scrolling past them
    anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation

});