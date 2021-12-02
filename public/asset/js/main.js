// DEFINTIONS

const leftDefinition = document.querySelector('#definition .wrapper .left-wrapper')
const middleDefinition = document.querySelector('#definition .wrapper .middle-wrapper')
const rightDefinition = document.querySelector('#definition .wrapper .middle-wrapper')

leftDefinition.addEventListener('mouseover', function () {
    leftDefinition.querySelector('h4').innerHTML = 'Produit intérieur brut'
})

leftDefinition.addEventListener('mouseleave', function () {
    leftDefinition.querySelector('h4').innerHTML = 'Le PIB, tu connais ?'
})

middleDefinition.addEventListener('mouseover', function () {
    middleDefinition.querySelector('h4').innerHTML = 'Un pays en développement, ça veut dire quoi ?'
})

middleDefinition.addEventListener('mouseleave', function () {
    middleDefinition.querySelector('h4').innerHTML = 'Pays en développement'
})

rightDefinition.addEventListener('mouseover', function () {
    rightDefinition.querySelector('h4').innerHTML = 'Pays développés'
})

rightDefinition.addEventListener('mouseleave', function () {
    rightDefinition.querySelector('h4').innerHTML = 'Comment considérer un pays comme développé ?'
})