const Mongoose = require("mongoose");
const RandomWords = require("random-words");
const Schema = Mongoose.Schema;

const Authenticator = require("../Authenticator.js");
const Configuration = require("../../Configuration.js");
const Log = require("../Log.js");
const User = require("./User.js");
const Validator = require("../Validator.js");

/**
* Used to define the database schema for storing unverified users.
* @author Cameron Burkholder
* @date   10/29/2021
*/
const UnverifiedUserSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  verificationToken: {
    type: String,
    required: true
  }
});
UnverifiedUserSchema.set("toObject", {
  versionKey: false,
  transform: (document, object) => {
    delete object.__v;
    return object;
  }
});

//STATICS
/**
* Creates an unverified user.
* @param {String} email The unverified user's email.
* @param {String} password The unverified user's password.
* @return {UnverifiedUser} The unverified user created.
*
*/
 UnverifiedUserSchema.statics.createUnverifiedUser = async (email, password) =>{
  // GENERATE THE USER'S HASHED PASSWORD.
  const hashedPassword = Authenticator.hashPassword(password);

  // GENERATE THE VERIFICATION TOKEN.
  // Generate a random token.
  let tokenIsNotUnique = true;
  let verificationToken = undefined;
  while (tokenIsNotUnique) {
    // GENERATE A RANDOM TOKEN.
    verificationToken = RandomWords({ exactly: 3, join: "-" });

    // CHECK THE UNVERIFIED USERS LIST TO SEE IF THE TOKEN IS ALREADY IN USE.
    let existingUnverifiedUser = undefined;
    try {
      existingUnverifiedUser = await UnverifiedUser.getByVerificationToken(verificationToken);
    } catch (error) {
      Log.writeError(error);
    }
    tokenIsNotUnique = Validator.isDefined(existingUnverifiedUser);
  }

  // CREATE THE UNVERIFIED USER ACCOUNT.
  const newUnverifiedUser = new UnverifiedUser({
    email: email,
    passwordHash: hashedPassword,
    verificationToken: verificationToken
  });

  // SAVE THE USER ACCOUNT.
  try {
    await newUnverifiedUser.save();
  } catch(error) {
    Log.writeError(error);
  }

  // RETURN THE MODEL.
  return newUnverifiedUser;
}



/**
  * Gets the user record from the database using the user's email.
  * @param  {String} verificationToken The verification token used to search for an unverified user.
  * @return {UnverifiedUser} The user instance, if found; otherwise undefined.
  * @async
  * @author Cameron Burkholder
  * @date   10/22/2021
  */
 UnverifiedUserSchema.statics.getByEmail = async (email) => {
  // GET THE USER BASED ON THE GIVEN EMAIL.
  let unverifiedUserRecord = false;
  console.log(email)
  try {
    unverifiedUserRecord = await UnverifiedUser.findOne({ email }).exec();
  } catch(error) {
    Log.write("An error occurred while attempting to get an unverified user by email.");
    Log.writeError(error);
    // If an error occurs, it should be returned.
    return error;
  } finally {
    // If the user wasn't able to be found in the database, this routine should return undefined.
    let unverifiedUser = undefined;
    let unverifiedUserWasFound = Validator.isDefined(unverifiedUserRecord);
    if (unverifiedUserWasFound) {
      // Since the userRecord is an instance of the UserSchema, it needs to be converted to an object.
      unverifiedUser = new UnverifiedUser(unverifiedUserRecord);
      return unverifiedUser;
    }
    return unverifiedUser;
  }
}


/**
  * Gets the user record from the database using the user's email.
  * @param  {String} verificationToken The verification token used to search for an unverified user.
  * @return {UnverifiedUser} The user instance, if found; otherwise undefined.
  * @async
  * @author Cameron Burkholder
  * @date   10/22/2021
  */
 UnverifiedUserSchema.statics.getByVerificationToken = async (verificationToken) =>{
  // GET THE USER BASED ON THE GIVEN VERIFICATION TOKEN.
  let unverifiedUserRecord = false;
  try {
    unverifiedUserRecord = await UnverifiedUser.findOne({ verificationToken: verificationToken }).exec();
  } catch(error) {
    Log.write("An error occurred while attempting to get an unverified user by verification token.");
    Log.writeError(error);
    // If an error occurs, it should be returned.
    return error;
  } finally {
    // If the user wasn't able to be found in the database, this routine should return undefined.
    let unverifiedUser = undefined;
    let userWasFound = Validator.isDefined(unverifiedUserRecord);
    if (userWasFound) {
      // Since the userRecord is an instance of the UserSchema, it needs to be converted to an object.
      unverifiedUser = new UnverifiedUser(unverifiedUserRecord);
      console.log("USER WAS FOUND")
      return unverifiedUser;
    }

  }
}


//METHODS:
/**
  * Deletes an unverified user.
  * @return {Boolean} True if the unverified user was deleted, false otherwise.
  */
UnverifiedUserSchema.methods.delete = async function() {
  // DELETE THE UNVERIFIED USER.
  let userWasDeleted = false;
  let recordsDeleted = undefined;
  try {
    recordsDeleted = await UnverifiedUser.deleteOne({ _id: this._id });
  } catch (error) {
    Log.writeError(error);
  } finally {
    userWasDeleted = (recordsDeleted.ok);
    return userWasDeleted;
  }
}

UnverifiedUserSchema.methods.toJSON = function () {
  const unverifiedUser = this
  const unverifiedUserObject = unverifiedUser.toObject()

  delete unverifiedUserObject.passwordHash

  return unverifiedUserObject
}


/**
  * Verifies a user's account. This process involves creating a normal user document and deleting
  * the unverified user document.
  * @param {String} verificationToken The verification token to identify the user being verified.
  * @return {User} The verified user.
  * @author Cameron Burkholder
  * @date   11/15/2021
  */
 UnverifiedUserSchema.methods.setupAccount = async function (name, areaCode, profilePicture) {
  // CREATE THE VERIFIED USER.
  const newUser = await User.createUser(this); 
  newUser.profilePicuture = (profilePicture)
  newUser.areaCode = (areaCode)
  newUser.name = (name)
  console.log("LOOOOOOK HERE!" + newUser)

  // DELETE THE UNVERIFIED USER.
  const userWasPassed = Validator.isDefined(newUser);
  if (userWasPassed) {
    newUser.save()
    await this.delete();
    return newUser;
  } else{
    return this
  }
}

const unverifiedUserCollectionName = Configuration.getUnverifiedUserCollectionName();


const UnverifiedUser = Mongoose.model(unverifiedUserCollectionName, UnverifiedUserSchema);

module.exports = UnverifiedUser;


// /**
// * Provides an interface for working with unverified users in the database.
// * @property {String} email The user's email.
// * @property {String} passwordHash The user's hashed password.
// * @property {String} verificationToken The token used to verify a user's account.
// * @author Cameron Burkholder
// * @date   10/29/2021
// */
// class UnverifiedUser {
//   /**
//   * Initializes the unverified user to the account passed in from the database.
//   * @param  {Mongoose.Schema} unverifiedUserSchema The database record for a given user.
//   * @author Cameron Burkholder
//   * @date   07/29/2021
//   */
//   constructor(unverifiedUserSchema) {
//     // COPY THE DATABASE INSTANCE TO THE MODEL INSTANCE.
//     // In order to maximize the usability of this class, the attributes stored in the database
//     // record are copied to the instance of this class so they can be properly editied.
//     // The unverified user schema is converted to a regular object to sanitize it of wrapper methods and properties.
//     Object.assign(this, unverifiedUserSchema.toObject());
//   }

  

  



//   /**
//   * Gets the unverified user's email.
//   * @return {String} The unverified user's email.
//   * @author Cameron Burkholder
//   * @date 11/15/2021
//   */
//   getEmail() {
//     // GET THE EMAIL.
//     return this.email;
//   }

//   /**
//   * Gets the unverified user's hashed password.
//   * @return {String} The unverified user's hashed password.
//   * @author Cameron Burkholder
//   * @date   11/15/2021
//   */
//   getPasswordHash() {
//     // GET THE PASSWORD HASH.
//     return this.passwordHash;
//   }

//   /**
//   * Gets the unverified user's verificaion token.
//   * @return {String} The unverified user's verificaion token.
//   * @author Cameron Burkholder
//   * @date   11/15/2021
//   */
//   getVerificationToken() {
//     // GET THE VERIFICATION TOKEN.
//     return this.verificationToken;
//   }

//   /**
//   * Removes any sensitive attributes from the user.
//   * @return {UnverifiedUser} The unverified user with sensitive attributes removed.
//   * @author Cameron Burkholder
//   * @date   11/12/2021
//   */
//   removeSensitiveAttributes() {
//     delete this.passwordHash;
//     return this;
//   }

//   /**
//   * Saves the unverified user to the database.
//   * @return {Boolean} True if the unverified user was saved, false otherwise.
//   * @author Cameron Burkholder
//   * @date   11/12/2021
//   */
//   async save() {
//     let unverifiedUserWasSaved = false;
//     try {
//       // GET THE DATABASE INSTANCE OF THE USER.
//       let unverifiedUserModel = await UnverifiedUserModel.findOne({ _id: this._id }).exec();

//       // UPDATE THE DATABASE INSTANCE WITH THE CURRENT USER PROPERTIES.
//       Object.assign(unverifiedUserModel, this);

//       // SAVE THE UPDATED DATABASE INSTANCE.
//       await unverifiedUserModel.save();
//       unverifiedUserWasSaved = true;
//     } catch(error) {
//       Log.write("An error occurred while attempting to retrieve the unverified user to save.");
//       Log.writeError(error);
//     } finally {
//       return unverifiedUserWasSaved;
//     }
//   }

  
// }

