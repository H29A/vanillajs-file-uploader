import { upload } from './upload.js';

upload('#file', {
    multiple: true,
    accept: ['.jpg', '.png', '.jpeg', '.gif']
});