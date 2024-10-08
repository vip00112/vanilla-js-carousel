# Origin
Forked from "https://github.com/benkimo6i/vanilla-js-carousel"


# Vanilla JS Carousel
A simple sliding 3D carousel gallery made with html, css & js


# Changes
1. Number of items shown : 5 -> 3
2. Delete add button and feature
3. Item size : Fiexed > Responsive
4. Change button icon
5. Change class name : carousel -> carousel3d
6. Add onChanged callback function


# Preview
![2024-08-22_14 01 59](https://github.com/user-attachments/assets/07bc4441-a717-4549-bc95-b5290015ef00)


# How to use
1. Initial
```javascript
document.addEventListener('DOMContentLoaded', function () {
    var el = document.querySelector('.carousel3d');
    var buttons = ['previous', 'play', 'next'];
    var datas = [
        { 'src': 'https://via.placeholder.com/500x250?text=1' },
        { 'src': 'https://via.placeholder.com/250x500?text=2' },
        { 'src': 'https://via.placeholder.com/250x500?text=3' },
        { 'src': 'https://via.placeholder.com/500x250?text=4' },
        { 'src': 'https://via.placeholder.com/500x250?text=5' },
        { 'src': 'https://via.placeholder.com/250x500?text=6' },
        { 'src': 'https://via.placeholder.com/500x250?text=7' },
        { 'src': 'https://via.placeholder.com/250x500?text=8' },
    ];
    var carousel = new Carousel(el, buttons, datas);
    carousel.on('changed', (data) => {
        console.log('onChanged, current data:', data);
        // Do Somethig...
    });
    carousel.on('imageClicked', (data) => {
        console.log('onImageClicked, current data:', data);
        // Do Somethig...
    });
    carousel.mounted();
});
```

2. Change button or data
```javascript
var buttons = ['previous', 'next'];
var datas = [
    { 'src': 'https://via.placeholder.com/500x250?text=1' },
    { 'src': 'https://via.placeholder.com/500x250?text=2' }
];
carousel.setButtons(buttons);
carousel.setDatas(datas);
carousel.mounted();
```
