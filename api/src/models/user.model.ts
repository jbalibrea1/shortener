/* eslint-disable */
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    passwordHash: String,
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    shortURLs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShortURL'
      }
    ]
  },
  { timestamps: true }
);

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  }
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
