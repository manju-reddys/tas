(() => {
    class SimpleQueue {
        constructor() {
            this.queue = [];
            this.active = false;
        }

        addToQueue(command) {
            this.queue.push(command);
            // If we're currently inactive, start processing
            if (!this.active) {
                this.nextTask();
            }
        }

        nextTask() {
            // If this is the end of the queue
            if (!this.queue.length) {
                // We're no longer active
                this.active = false;
                // Stop execution
                return;
            }
            // Grab the next command
            var command = this.queue.shift();
            // We're active
            this.active = true;
            // Call the command
            command.start();
        }

        clear() {
            this.queue.length = 0;
            this.active = false;
        }

    }

    class Progressbar {
        constructor(element, next) {
            this.$element = element;
            this.width = 1;
            this.done = next;
        }

        start() {
            requestAnimationFrame(() => {
                this.frame();
            });
        }

        frame() {
            if (this.width >= 100) {
                if (typeof this.done == 'function') {
                    this.done();
                }
            } else {
                this.width++;
                this.$element.firstElementChild.style.width = `${this.width}%`;
                requestAnimationFrame(() => {
                    this.frame();
                });
            }
        }
    }

    class QuedProgressBar {
        constructor() {
            this.queue = new SimpleQueue();
            this.template = document.getElementsByTagName('template')[0]; //cache the reusable template
            this.$container = document.querySelector('.progressbar-container');
            const button = document.querySelector('button');
            button.onclick = () => {
                this.addProgressBar();
            }
        }

        addProgressBar() {
            //const template = this.template.content.cloneNode(true);  
            const template = this.createProgressBar();
            const $element = this.$container.appendChild(template);
            this.queue.addToQueue(new Progressbar($element, () => {
                this.queue.nextTask();
            }));
        }

        createProgressBar() {
            const outerDiv = document.createElement('div');
            outerDiv.className = 'progressbar';
            outerDiv.innerHTML = '<div class="indicator"></div>';
            return outerDiv;
        }
    }

    new QuedProgressBar();
})();