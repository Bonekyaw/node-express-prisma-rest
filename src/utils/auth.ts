export const checkPhoneExist = (admin: any) => {
  // // This is not middleware
  if (admin) {
    const err: any = new Error("This phone number has already registered!.");
    err.status = 409;
    throw err;
  }
};

export const checkPhoneIfNotExist = (admin: any) => {
  if (!admin) {
    const err: any = new Error("This phone number has not registered!.");
    err.status = 401;
    throw err;
  }
};

export const checkOtpPhone = (otpCheck: any) => {
  if (!otpCheck) {
    const err: any = new Error("Phone number is incorrect.");
    err.status = 400;
    throw err;
  }
};

export const checkOtpErrorIfSameDate = (isSameDate: boolean, otpCheck: any) => {
  if (isSameDate && otpCheck.error === 5) {
    const err: any = new Error("OTP is wrong 5 times today. Try again tomorrow.");
    err.status = 401;
    throw err;
  }
};

export const checkAdmin = (admin: any) => {
  if (!admin) {
    const err: any = new Error("This account has not registered!.");
    err.status = 401;
    throw err;
  }
};
