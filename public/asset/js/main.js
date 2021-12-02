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



