/* eslint-disable */
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
      unique: true,
    },
    name: String,
    passwordHash: String,
    shortURLs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShortURL',
      },
    ],
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
  },
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
