import { model, Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const CommandSchema = new Schema({
    area: {
        type: String,
        required: true,
        default: ['national', 'international']
    },
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    status:{
        type: String,
        required: true,
    },
    weight: {
        type: String,
        required: true,
    },
    Driver: {
        type: Schema.Types.ObjectId,
        ref: 'Driver'
    }

}, { timestamps: true });


CommandSchema.plugin(uniqueValidator);
export const CommandModel = model('Command', CommandSchema);