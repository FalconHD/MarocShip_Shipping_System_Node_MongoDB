import { model, Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const CommandSchema = new Schema({
    area: {
        type: String,
        required: true,
        enum: ['national', 'international']
    },
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    distance: {
        type: String,
    },
    price: {
        type: String,
    },
    weight: {
        type: String,
        required: true,
    },
    driver: {
        type: Schema.Types.ObjectId,
        ref: 'Driver'
    }

}, { timestamps: true });


CommandSchema.plugin(uniqueValidator);
export const CommandModel = model('Command', CommandSchema);