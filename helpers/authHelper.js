import bcrypt from 'bcrypt';

// Function to hash passwords using bcrypt dependency
export const hashPassword = async (password) => {

    try {

        const saltRounds = 10; // check below what saltRounds mean
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        return hashedPassword;

    } catch (error) {
        console.log(error);
    }
}

export const comparePassword = async (password, hashedPassword) => {

    return bcrypt.compare(password, hashedPassword);
}


/*
With "salt round" they actually mean the cost factor. The cost factor controls how much time is needed to 
calculate a single BCrypt hash. The higher the cost factor, the more hashing rounds are done. Increasing
the cost factor by 1 doubles the necessary time. The more time is necessary, the more difficult is brute-forcing.
*/