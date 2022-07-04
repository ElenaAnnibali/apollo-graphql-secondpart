import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import { createUser } from './graphql';

type RegisterResponseBody =
  | {
      errors: {
        message: string;
      }[];
    }
  | {
      user: { id: number };
    };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RegisterResponseBody>,
) {
  if (req.method === 'POST') {
    // get the username
    const username = req.body.username;

    // hash the password
    const password_hash = await bcrypt.hash(req.body.password, 12);

    console.log('plain', req.body.password);
    console.log('hash', password_hash);

    // create the user
    const newUser = await createUser(req.body.username, password_hash);

    res.status(200).json({ user: { id: 1 } });
  } else {
    res.status(405).json({ errors: [{ message: 'method not allowed' }] });
  }
}
