'use strict';

class Carousel {
    constructor(el, buttons, datas) {
        this.el = el;
        this.carouselButtons = [];
        this.carouselData = [];
        this.carouselInView = [];
        this.carouselContainer = null;
        this.carouselPlayState = null;
        this.callbacks = {
            onChanged: null,
            onImageClicked: null,
        };

        if (buttons != null) {
            this.setButtons(buttons);
        }
        if (datas != null) {
            this.setDatas(datas);
        }
    }

    // Build carousel html
    setupCarousel() {
        if (!this.carouselData.length) return;

        const container = document.createElement('div');
        const controls = document.createElement('div');

        // Add container for carousel items and controls
        this.el.innerHTML = ''; // Clear previous content
        this.el.append(container, controls);
        container.className = 'carousel3d-container';
        controls.className = 'carousel3d-controls';

        // Take dataset array and append items to container
        this.carouselData.forEach((item, index) => {
            const img = document.createElement('img');
            const carouselItem = document.createElement('div');

            carouselItem.append(img);
            container.append(carouselItem);

            // Add item attributes
            img.src = item.src;
            img.setAttribute('loading', 'lazy');
            img.setAttribute('style', 'cursor: pointer;');
            carouselItem.className = `carousel3d-item carousel3d-item-${index + 1}`;
            // Used to keep track of carousel items, infinite items possible in carousel however min 3 items required
            carouselItem.setAttribute('data-index', `${index + 1}`);

            // Run callback function
            img.onclick = () => {
                if (typeof this.callbacks.onImageClicked === 'function') {
                    this.callbacks.onImageClicked(item);  // Pass the clicked image data
                }
            };
        });

        this.carouselButtons.forEach((option) => {
            const btn = document.createElement('button');
            const axSpan = document.createElement('span');

            // Add accessibilty spans to button
            axSpan.innerText = option;
            axSpan.className = 'ax-hidden';
            btn.append(axSpan);

            // Add button attributes
            btn.className = `carousel3d-control carousel3d-control-${option}`;
            btn.setAttribute('data-name', option);

            // Add carousel control options
            controls.append(btn);
        });

        // After rendering carousel to our DOM, setup carousel controls' event listeners
        this.setControls([...controls.children]);

        // Set container property
        this.carouselContainer = container;
    }

    setControls(controls) {
        controls.forEach(control => {
            control.onclick = (event) => {
                event.preventDefault();

                // Manage control actions, update our carousel data first then with a callback update our DOM
                this.controlManager(control.dataset.name);
            };
        });
    }

    controlManager(control) {
        if (control === 'previous') return this.previous();
        if (control === 'next') return this.next();
        if (control === 'play') return this.play();

        return;
    }

    // Add callback function
    on(event, callback) {
        if (event === 'changed') {
            this.callbacks.onChanged = callback;
        } else if (event === 'imageClicked') {
            this.callbacks.onImageClicked = callback;
        }
    }

    previous() {
        // Update order of items in data array to be shown in carousel
        this.carouselData.unshift(this.carouselData.pop());

        // Push the first item to the end of the array so that the previous item is front and center
        this.carouselInView.push(this.carouselInView.shift());

        // Update the css class for each carousel item in view
        this.carouselInView.forEach((item, index) => {
            this.carouselContainer.children[index].className = `carousel3d-item carousel3d-item-${item}`;
        });

        // Using the first 3 items in data array update content of carousel items in view
        this.carouselData.slice(0, 3).forEach((data, index) => {
            document.querySelector(`.carousel3d-item-${index + 1} img`).src = data.src;
        });

        // Run callback function
        if (typeof this.callbacks.onChanged === 'function') {
            const data = (this.carouselData.length && this.carouselData.length > 1) ? this.carouselData[1] : null;
            this.callbacks.onChanged(data);
        }
    }

    next() {
        // Update order of items in data array to be shown in carousel
        this.carouselData.push(this.carouselData.shift());

        // Take the last item and add it to the beginning of the array so that the next item is front and center
        this.carouselInView.unshift(this.carouselInView.pop());

        // Update the css class for each carousel item in view
        this.carouselInView.forEach((item, index) => {
            this.carouselContainer.children[index].className = `carousel3d-item carousel3d-item-${item}`;
        });

        // Using the first 3 items in data array update content of carousel items in view
        this.carouselData.slice(0, 3).forEach((data, index) => {
            document.querySelector(`.carousel3d-item-${index + 1} img`).src = data.src;
        });

        // Run callback function
        if (typeof this.callbacks.onChanged === 'function') {
            const data = (this.carouselData.length && this.carouselData.length > 1) ? this.carouselData[1] : null;
            this.callbacks.onChanged(data);
        }
    }

    play() {
        const playBtn = document.querySelector('.carousel3d-control-play');
        const startPlaying = () => this.next();

        if (playBtn.classList.contains('playing')) {
            // Remove class to return to play button state/appearance
            playBtn.classList.remove('playing');

            // Remove setInterval
            clearInterval(this.carouselPlayState);
            this.carouselPlayState = null;
        } else {
            // Add class to change to pause button state/appearance
            playBtn.classList.add('playing');

            // First run initial next method
            this.next();

            // Use play state prop to store interval ID and run next method on a 1.5 second interval
            this.carouselPlayState = setInterval(startPlaying, 1500);
        };
    }

    setButtons(buttons) {
        this.carouselButtons = buttons;
    }

    setDatas(datas) {
        datas.map((data, index) => data.id = index + 1);

        this.carouselData = datas;
        this.carouselInView = datas.map((data, index) => data.id);
    }

    addData(data) {
        const lastItem = this.carouselData.length;
        const lastIndex = this.carouselData.findIndex(item => item.id == lastItem);

        // Assign properties for new carousel item
        Object.assign(data, { id: `${lastItem + 1}` });

        // Then add it to the "last" item in our carouselData
        this.carouselData.splice(lastIndex + 1, 0, data);

        // Shift carousel to display new item
        this.next();
    }

    mounted() {
        this.setupCarousel();
    }
}

//	How to use
//	1. Initial
//	document.addEventListener('DOMContentLoaded', function () {
//	    var el = document.querySelector('.carousel3d');
//	    var buttons = ['previous', 'play', 'next'];
//	    var datas = [
//	        { 'src': 'https://via.placeholder.com/500x250?text=1' },
//	        { 'src': 'https://via.placeholder.com/250x500?text=2' },
//	        { 'src': 'https://via.placeholder.com/250x500?text=3' },
//	        { 'src': 'https://via.placeholder.com/500x250?text=4' },
//	        { 'src': 'https://via.placeholder.com/500x250?text=5' },
//	        { 'src': 'https://via.placeholder.com/250x500?text=6' },
//	        { 'src': 'https://via.placeholder.com/500x250?text=7' },
//	        { 'src': 'https://via.placeholder.com/250x500?text=8' },
//	    ];
//	    var carousel = new Carousel(el, buttons, datas);
//	    carousel.on('changed', (data) => {
//	        console.log('onChanged, current data:', data);
//	        // Do Somethig...
//	    });
//	    carousel.on('imageClicked', (data) => {
//	        console.log('onImageClicked, current data:', data);
//	        // Do Somethig...
//	    });
//	    carousel.mounted();
//	});
//
//	2. Change button or data
//	var buttons = ['previous', 'next'];
//	var datas = [
//	    { 'src': 'https://via.placeholder.com/500x250?text=1' },
//	    { 'src': 'https://via.placeholder.com/500x250?text=2' }
//	];
//	carousel.setButtons(buttons);
//	carousel.setDatas(datas);
//	carousel.mounted();
