import { model, Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcrypt';

const SALT_WORK_FACTOR = 10;
const DriverSchema = new Schema({
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
    },
    car: {
        type: String,
        required: true,
        enum: ["car", "small_truck", "big_truck"]
    },
    deliveries: [{
        type: Schema.Types.ObjectId,
        ref: 'Command'
    }],
    bonus: [{
        total: {
            type: Number,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        }
    }],

}, { timestamps: true });



DriverSchema.pre('save', function (next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

DriverSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};



DriverSchema.plugin(uniqueValidator);
export const DriverModel = model('Driver', DriverSchema);