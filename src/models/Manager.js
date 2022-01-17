import { model, Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const ManagerSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
    }

}, { timestamps: true });



ManagerSchema.plugin(uniqueValidator);
export const ManagerModel = model('Manager', ManagerSchema);