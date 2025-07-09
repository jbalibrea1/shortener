/* eslint-disable */
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: false
    },
    email: {
      type: String,
      required: false,
      unique: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    }
  },
  { timestamps: true }
);

// shortURLs: [
//   {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'ShortURL'
//   }
// ]

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  }
});

export const UserModel = mongoose.model('User', userSchema);
