import bcrypt from "bcryptjs"

export default async function hashPassword(pwdData) {
      try {
        const salt = await bcrypt.genSalt(10);

        const hash = await bcrypt.hash(pwdData, salt);
        return hash;
      } catch (error) {
        res.json({
          error: error
        })
      }
}