import mongoose from 'mongoose'
import { hash, compare } from 'bcryptjs'

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    validate: {
      validator: email => User.doesntExists({ email }),
      message: ({ value }) => `Email ${value} has already been taken`
    }
  },
  username: {
    type: String,
    validate: {
      validator: username => User.doesntExists({ username }),
      message: ({ value }) => `Username ${value} has already been taken`
    }
  },
  name: String,
  password: String,
  token: String
}, {
  timestamps: true
})

userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await hash(this.password, 10)
  }
})

userSchema.statics.doesntExists = async function (options) {
  return await this.where(options).countDocuments() === 0
}

userSchema.methods.matchesPassword = function (password) {
  return compare(password, this.password)
}

const User = mongoose.model('User', userSchema)

export default User
