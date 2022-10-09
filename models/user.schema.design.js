module.exports = {
    email: {
        type: String,
        required: [true, 'please add an email'],
        unique: [true, 'email already exists'],
        match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        trim: true
    },
    name: {
        type: String,
        required: [true, 'please provide a name'],
        maxlength: [30, 'name can not exceed 30 characters'],
        trim: true
    },
    role: {
        type: String,
        enum: ['user', 'publisher'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'please enter the password'],
        select: false,
        minLength: [6, 'the password must be at least 6 characters long']
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
}