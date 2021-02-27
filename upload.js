const TRUNCATE_LENGTH = 15;

function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (!bytes) {
        return 'n/a';
    }
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`;
}

function truncate(input, length = TRUNCATE_LENGTH) {
    return input.length > length ? `${input.substring(0, length)}...` : input;
}

const element = (tag, classes = [], content) => {
    const node = document.createElement(tag);

    classes.length && node.classList.add(...classes);

    if (content) {
        node.textContent = content;
    }

    return node;
}


export function upload (selector, options = {}) {
    let files = [];
    const input = document.querySelector(selector);

    const preview = element('div', ['preview']);
    const select = element('button', ['btn'], 'Select');
    const upload = element('button', ['btn', 'primary'], 'Upload');
    upload.style.display = 'none';

    if (options.multiple) {
        input.setAttribute('multiple', options.multiple);
    }

    if (options.accept && Array.isArray(options.accept)) {
        input.setAttribute('accept', options.accept.join(','));
    }

    input.insertAdjacentElement('afterend', select);
    input.insertAdjacentElement('afterend', upload);
    input.insertAdjacentElement('afterend', preview);

    const triggerInput = () => input.click();

    const changeHandler = event => {
        if (!event.target.files.length) {
            return;
        }

        files = Array.from(event.target.files);
        preview.innerHTML = '';
        upload.style.display = 'inline';


        files.forEach(file => {
            if (!file.type.match('image')) {
                return;
            }

            const reader = new FileReader();

            reader.onload = event => {
                const src = event.target.result;
                preview.insertAdjacentHTML('afterbegin', `
                    <div class="preview-image">
                        <div class="preview-remove" data-name="${file.name}">&times;</div>
                        <img src="${src}" alt="${file.name}" />
                        <div class="preview-info">
                            <span>${truncate(file.name)}</span>
                            ${bytesToSize(file.size)}
                        </div>
                    </div> 
                `)
            }

            reader.readAsDataURL(file);
        });
    }

    const removeHandler = event => {
        if (!event.target.dataset.name) {
            return;
        }

        const { name } = event.target.dataset;
        files = files.filter(file => file.name !== name);

        if (!files.length) {
            upload.style.display = 'none';
        }

        const block = preview
            .querySelector(`[data-name="${name}"]`)
            .closest('.preview-image');
        block.classList.add('removing');

        setTimeout(() => block.remove(), 300);
    }

    const uploadHandler = event => {
        // TODO: create upload handler
    }

    select.addEventListener('click', triggerInput);
    input.addEventListener('change', changeHandler);
    preview.addEventListener('click', removeHandler);
    upload.addEventListener('click', uploadHandler);
}